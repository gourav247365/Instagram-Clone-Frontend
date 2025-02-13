import axios from "axios"
import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setNewLastMessage } from "../store/Slice"
import { useParams } from "react-router-dom"
import io from 'socket.io-client'
import ChatList from "../Components/Chat"
import Loader from "../Components/Loader"
import direct from '../public/assets/icons/direct.png'

export default function Direct() {

  const emojis = ["😂", "😊", "😍", "🔥", "💯", "😮", "😀", "😃", "😀", "🤡", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "🥲", "🥹", "😇", "🙂", "🙃", "😉", "😌", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🥸", "🤩", "🥳", "🙂‍↕️", "😏", "😒", "🙂‍↔️", "😞", "😔", "😟", "😕", "🙁", "🙁", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😮‍💨", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🫣", "🤗", "🫡", "🤔", "🫢", "🤭", "🤫", "🤥", "😶", "😶‍🌫️", "😐", "😑", "😬", "🫨", "🫠", "🙄", "😯", "😦", "😲", "🥱", "😴", "🤤", "😪", "😵", "😵‍💫", "🫥", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "💩", "👻", "💀", "👽", "👾", "🤖", "🎃", "🖤", "💛", "💙", "💜", "💚", "🧡", "❤️ ", "💔", "💗", "💓", "💕", "💖", "💞", "💘", "💝", "❣️", "💌", "💋", "😺", "😸", "😻", "😽", "😼", "🙀", "😿", "😹", "😾", "🙈", "🙉", "🙊", "👹", "👺", "🥺️", "🥰️", "🥵️", "🥶️", "🥴️", "🥳️", "👋", "🤚", "🖐", "✋", "🖖", "👌", "🤌", "🤏", "✌️ ", "🤞", "🫰", "🤟", "🤘", "🤙", "🫵", "🫱", "🫲", "🫸", "🫷", "🫳", "🫴", "👈", "👉", "👆", "🖕", "👇", "☝️ ", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🫶", "🙌", "👐", "🤲", "🤝", "🙏", "✍️ ", "💅", "🤳", "💪", "🦾", "🦵", "🦿", "🦶", "👣", "👂", "🦻", "👃", "🫀", "🫁", "🧠", "🦷", "🦴", "👀", "👁", "👅", "👄", "🫦", "💋", "🩸"]

  const currentUser = useSelector((state) => state.currentUser)
  const { chatId } = useParams()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const chats = useSelector((state) => state.chats)
  const [typing, setTyping] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [participant, setParticipant] = useState({})
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [fetchMessageLoader, setFetchMessageLoader] = useState(false)
  const [error, setError] = useState(null)
  const dispatch = useDispatch()
  const messageDivRef = useRef(null)
  const [timeoutRef, setTimeoutRef] = useState(null)
  const fetchMoreMessages = () => {
    try {
      setFetchMessageLoader(true)
      axios.get(`/api/v1/messages/${chatId}?page=${page}&limit=20`)
        .then((res) => {
          setMessages((cur) => [...cur, ...res.data.data.docs])
          setPage(page + 1)
          setHasMore(res.data.data.hasNextPage)
          setFetchMessageLoader(false)
        })
    } catch (error) {
      setError(error)
    }
  }

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
    setIsMobile(mobileRegex.test(userAgent))
  }, [])

  const socket = io.connect(import.meta.env.VITE_SOCKET_URL)
  console.log(socket);
  
  useEffect(() => {

    socket.on('getMessage', (data) => {
      
      if (data.sender != currentUser._id) {
        setMessages((cur) => [data, ...cur])
        dispatch(setNewLastMessage(data))
      }
    })

    socket.on('getTyping', (data) => {
      if (timeoutRef)
        clearTimeout(timeoutRef)
      
      if (data.userId != currentUser._id) {
       
        setTyping(true)
        const timeout = setTimeout(() => {
          setTyping(false)
        }, 1500)
        setTimeoutRef(timeout)
      }
    })

    socket.on('getDeleteMessage', (data) => {
      
      if (data.sender != currentUser._id)
        setMessages((cur) => cur.filter((message) => message._id != data._id))
    })

    return () => {
      socket.off('getTyping')
      socket.off('getMessage')
      socket.off('getDeleteMessage')
    }
  }, [])

  useEffect(() => {

    if (chatId) {
      setFetchMessageLoader(true)
      setMessages([])
      axios.get(`/api/v1/messages/${chatId}?page=${page}&limit=15 `) //get messages by chatId
        .then((res) => {
          setMessages(res.data.data.docs)
          setPage(page + 1)
          setHasMore(res.data.data.hasNextPage)
          setFetchMessageLoader(false)
        })
        .catch((error) => setError(error.message))

      chats.map((chat) => {
        if (chat._id === chatId) {
          setParticipant({ _id: chat.otherUser, username: chat.username, displayPicture: chat.displayPicture })
        }
      })
    }
  }, [chatId])

  useEffect(()=> {
    if (chatId) {
      socket.emit('join', chatId)
    }
  },[chatId])

  return (
    <div className="w-auto h-dvh grid md:grid-cols-[400px,1fr] grid-cols-[135px,1fr] justify-center items-start pt-14 md:pt-0 md:ml-14 lg:ml-64 ">
      <div className={`w-full md:w-[400px] ${isMobile ? chatId ? 'hidden' : '' : ''}`}>
        <div className="w md:w-[400px] min-h-[100%] fixed overflow-y-scroll flex flex-col items-center md:items-start">
          <div className="p-4 w-full relative">
            <img
              className="rounded-full w-[70px] md:w-[90px]"
              src={currentUser.displayPicture}
              alt='user'
            />
            <h1 className="bg-gray-300 text-gray-500 text-sm px-1 py-2 rounded-md absolute top-2 left-20 ">Note...</h1>
          </div>
          <h1 className="px-4 ">Messages</h1>
          {
            chats.map((chat) => (
              <ChatList
                key={chat._id}
                chat={chat}
                setHasMore={setHasMore}
                setPage={setPage}
              />
            ))
          }
        </div>
      </div>

      <div className={` flex flex-col justify-end w-full h-full relative ${isMobile ? chatId ? '' : 'hidden' : ''}`}>
        {
          chatId && <div className={` bg-white text-center w-auto fixed ${isMobile ? 'left-0' : 'left-[135px] md:left-[454px] lg:left-[656px]'} border-b-gray-300 border-[1px] top-0 right-0 p-2 z-[2] flex items-center pt-14 md:pt-2 `}>
            <img
              className="w-[50px] rounded-full"
              src={participant?.displayPicture}
              alt="user"
            />
            <h1 className="px-2">{participant?.username}</h1>
          </div>
        }
        <div
          ref={messageDivRef}
          className={`${isMobile ? 'w-screen' : 'w-auto'} flex flex-col-reverse justify-end pb-[120px] pt-16 md:pb-16 `}
        >
          <div className={` ${typing ? '' : 'invisible'} self-start m-2 bg-green-200 rounded-xl px-3 py- max-w-96 `}>
            <span className=" animate-ping ">•</span>
            <span className=" px-[1px] animate-ping ">•</span>
            <span className=" animate-ping ">•</span>
          </div>
          {
            chatId && messages.map((message) =>
            (
              <div
                key={message._id}
                className={`flex ${message.sender === currentUser._id ? 'justify-end' : ''} w-full`}
              >
                <button
                  title="unsend"
                  className={`${message.sender === currentUser._id ? '' : 'hidden'}`}
                  onClick={() => {
                    axios.delete(`/api/v1/messages/unsend/${message._id}`)
                      .then((res) => {
                        setMessages((cur) => cur.filter((message) => message._id != res.data.data._id))
                        socket.emit('deleteMessage', res.data.data)
                      })
                      .catch((error) => setError(error.message))
                  }}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/5253/5253450.png"
                    alt=""
                    className="w-4 aspect-square saturate-200"
                  />
                </button>
                <h1 className={`m-2 text-sm ${message.sender === currentUser._id ? 'bg-sky-200' : 'bg-gray-200'}  rounded-xl px-3 py-1 max-w-96`} >{message.text}</h1>
              </div>
            ))
          }
          {
            !fetchMessageLoader && chatId && <div className={` h-20 flex items-center justify-center`}>
              <button
                className={`${hasMore ? '' : 'hidden'}`}
                onClick={fetchMoreMessages}
              >
                <img 
                  src="https://res.cloudinary.com/dmxjulnzo/image/upload/v1725696541/small_1x_2acee179-6fdc-4e33-9601-a380b16cd93c_afvp3j.png" 
                  alt="" 
                  className="w-10" 
                />
              </button>
            </div>
          }
          {
            fetchMessageLoader && <Loader className="w-full h-20" />
          }
          {
            !hasMore && chatId && <div className="flex flex-col items-center pt-20 ">
              <img src={participant.displayPicture} alt="" className="w-20 aspect-square rounded-full" />
              <h1>{participant.username}</h1>
            </div>
          }
          {

            !chatId && (
              <div className="flex flex-col h-96 items-center">
                <div className="rounded-full border-black border-[3px] aspect-square p-2">
                  <img src={direct} alt="" className="w-16 rounded-full " />
                </div>
                <h1 className="mt-4 text-lg">Your Messages</h1>
                <h1 className="text-sm text-gray-500">Send a Message to Start a Chat</h1>
              </div>
            )
          }
        </div>
        <div>
          <form
            className={`bg-blue-200 fixed  bottom-16 md:bottom-2 ${isMobile ? 'left-2' : 'left-[143px] md:left-[462px] lg:left-[664px]'}  right-2 flex justify-center h-10 sm:h-14 border-t-gray-300 border-[1px] rounded-full ${chatId ? '' : 'hidden'}`}
            onSubmit={(e) => {
              e.preventDefault()
              if (message) {
                axios.post('/api/v1/messages/send', { reciever: participant._id, text: message, chatId: chatId })
                  .then((res) => {
                    setMessages([res.data.data, ...messages])
                    socket.emit('message', res.data.data)
                    dispatch(setNewLastMessage(res.data.data))
                  })
                  .catch((error) => setError(error.message))
                setMessage('')
              }
            }}
          >
            <input
              type="text"
              placeholder="message..."
              className="pl-9 w-full rounded-full p-4 focus:bg-gray-50 focus:border-gray-400 focus:border-[1px] outline-none"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                socket.emit('typing', { userId: currentUser._id, chatId })
              }}
            />
            <details>
              <summary className={`absolute left-0 -top-[6px] sm:top-[2px] p-3 font-medium text-gray-500  list-none scale-[2] cursor-pointer focus:outline-none`}>☺</summary>
              <div className="bg-white absolute bottom-14 left-0 w-36 md:w-72 aspect-square overflow-y-scroll flex flex-wrap gap-4 p-2 md:p-4 ">
                {
                  emojis.map((emoji, index) => (
                    <div
                      key={index}
                      className="scale-150 md:scale-[1.8]"
                      onClick={() => setMessage((cur) => cur + emoji)}
                    > {emoji} </div>
                  ))
                }
              </div>
            </details>
            <button
              type="submit"
              className={`absolute right-4 top-0 bottom-0 my-auto ${message ? '' : 'hidden'}`}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/17114/17114599.png"
                alt=""
                className="w-6 rotate-[43deg]"
              />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}