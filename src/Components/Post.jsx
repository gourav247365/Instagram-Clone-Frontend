import { useEffect, useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { NavLink, useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { removePost, updateUseDisplayFor } from "../store/Slice"
import like from '../assets/icons/like.png'

export default function ({ post, setWidth, modalRef }) {
  const displayPicture = useSelector((state) => state.currentUser.displayPicture)
  const username = useSelector((state) => state.currentUser.username)
  const [isMobile, setIsMobile] = useState(false)
  const emojis = [
    "😂", "😊", "😍", "🔥", "💯", "😮", "😀", "😃", "😀", "🤡", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "🥲", "🥹", "😇", "🙂", "🙃", "😉", "😌", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🥸", "🤩", "🥳", "🙂‍↕️", "😏", "😒", "🙂‍↔️", "😞", "😔", "😟", "😕", "🙁", "🙁", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😮‍💨", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🫣", "🤗", "🫡", "🤔", "🫢", "🤭", "🤫", "🤥", "😶", "😶‍🌫️", "😐", "😑", "😬", "🫨", "🫠", "🙄", "😯", "😦", "😲", "🥱", "😴", "🤤", "😪", "😵", "😵‍💫", "🫥", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "💩", "👻", "💀", "👽", "👾", "🤖", "🎃", "🖤", "💛", "💙", "💜", "💚", "🧡", "❤️ ", "💔", "💗", "💓", "💕", "💖", "💞", "💘", "💝", "❣️", "💌", "💋", "😺", "😸", "😻", "😽", "😼", "🙀", "😿", "😹", "😾", "🙈", "🙉", "🙊", "👹", "👺", "🥺️", "🥰️", "🥵️", "🥶️", "🥴️", "🥳️", "👋", "🤚", "🖐", "✋", "🖖", "👌", "🤌", "🤏", "✌️ ", "🤞", "🫰", "🤟", "🤘", "🤙", "🫵", "🫱", "🫲", "🫸", "🫷", "🫳", "🫴", "👈", "👉", "👆", "🖕", "👇", "☝️ ", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🫶", "🙌", "👐", "🤲", "🤝", "🙏", "✍️ ", "💅", "🤳", "💪", "🦾", "🦵", "🦿", "🦶", "👣", "👂", "🦻", "👃", "🫀", "🫁", "🧠", "🦷", "🦴", "👀", "👁", "👅", "👄", "🫦", "💋", "🩸"
  ]

  const { postId } = useParams()

  const [liked, setLiked] = useState(false)
  const [animateLike, setAnimateLike] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likes, setLikes] = useState([])
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [mobileCommentsDiv, setMobileCommentsDiv] = useState(false)
  const currentUser = useSelector((state) => state.currentUser)
  const navigate = useNavigate()
  const commentBoxRef = useRef(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
    setIsMobile(mobileRegex.test(userAgent))
  }, [])

  useEffect(() => {
    axios.get(`/api/v1/likes/is-liked/${post._id}`)
      .then((res) => {
        setLiked(res.data.data.isLiked)
      })

    axios.get(`/api/v1/comments/get-comments/${post._id}`)
      .then((res) => {
        setComments(res.data.data)
      })

    axios.get(`/api/v1/likes/${post._id}`)
      .then((res) => {
        setLikes(res.data.data)
      })

    setMobileCommentsDiv(false)

  }, [post])


  return (
    <div className={` bg-white rounded-sm relative flex`} >
      {
        !setWidth && !isMobile && <div className=" h-[600px] lg:h-[87vh] aspect-square flex justify-center border-[1px] border-gray-400 relative">
          <img
            onDoubleClick={() => {
              if (!liked) {
                axios.post(`/api/v1/likes/toggle-like/${post._id}`)
                  .then((res) => {
                    setLiked(true)
                    setLikes((cur) => [res.data.data, ...cur])
                  })
              }
              setAnimateLike(true)
              setTimeout(() => setAnimateLike(false), 1000)
            }}
            src={post.postFile}
            alt="post"
            className={`border-[1px] border-gray-300 object-contain h-full`}
          />
          <img
            className={`absolute top-[30%] left-[35%] w-[30%] contrast-75 ${animateLike ? "animate-like" : "hidden"} `}
            src="https://res.cloudinary.com/dmxjulnzo/image/upload/v1729320438/Heart_coraz%C3%B3n.svg_jupxq6.png"
            alt="Liked"
          />
        </div>
      }
      {/*comment div*/}
      <div className={`${setWidth ? '' : 'flex flex-col justify-between'} `}>
        <div className=" flex justify-between items-center border-gray-300 border-b-[1px] p-1 sm:p-2 gap-2 ">
          <div className="flex gap-2 items-center ">
            <img
              src={post.displayPicture}
              alt="user"
              width="40px"
              className="rounded-full"
            />
            <div>
              <NavLink
                className='text-sm sm:text-base'
                to={`/app/${post.username}`}
              >{post.username}</NavLink>
              <h1 className="text-xs sm:text-sm font-[150px] text-gray-500">{post.location}</h1>
            </div>
          </div>
          <details className="">
            <summary className="text-2xl rotate-90 list-none">...</summary>
            <div className=" w-24 absolute z-10 flex flex-col bg-white right-5 rounded-md border-t-[1px] border-x-[1px] border-gray-300 overflow-hidden">
              <button
                className={`${currentUser.username === post.username ? "" : "hidden"} text-red-500 border-b-[1px] border-gray-300`}
                onClick={() => {
                  axios.delete(`/api/v1/posts/p/${post._id}`)
                    .then((res) => {
                      dispatch(removePost(res.data.data))
                      navigate(-1)
                    })
                }}
              >delete</button>
              <button
                className={`${currentUser.username === post.username ? "" : "hidden"} border-b-[1px] border-gray-300 `}
                onClick={() => {
                  modalRef.current.showModal()
                }}
              >edit</button>
              <button className="border-b-[1px] border-gray-300">share</button>
              <button className="border-b-[1px] border-gray-300">copy link</button>
              <button className="border-b-[1px] border-gray-300">cancel</button>
            </div>
          </details>
        </div>

        <div className={` ${isMobile ? 'w-full' : setWidth ? "max-w-[500px]  xl:max-w-[700px]" : "w-[350px] h-full "} relative`}>
          {
            (setWidth || isMobile) && <div>
              <img
                className={` ${isMobile ? 'w-screen' : setWidth ? "w-[600px]" : "md:h[650px] max-h-[650px] "} border-[1px] border-gray-300 `}
                onDoubleClick={() => {
                  if (!liked) {
                    axios.post(`/api/v1/likes/toggle-like/${post._id}`)
                      .then((res) => {
                        setLiked(true)
                        setLikes((cur) => [res.data.data, ...cur])
                      })
                  }
                  setAnimateLike(true)
                  setTimeout(() => setAnimateLike(false), 1000)
                }}
                src={post.postFile}
                alt="post"
              />
              <img
                className={`absolute top-[30%] left-[35%] w-[30%] contrast-75
                ${animateLike ? "animate-like" : "hidden"} `}
                src="https://res.cloudinary.com/dmxjulnzo/image/upload/v1729320438/Heart_coraz%C3%B3n.svg_jupxq6.png"
                alt=""
              />
            </div>
          }
          {/*comments*/}
          {
            (!setWidth && !isMobile) && comments.map((comment) => (
              <div key={comment._id} className="p-2 flex w-full justify-between items-center gap-2">
                <img
                  src={comment.displayPicture}
                  alt="user"
                  className="w-8 aspect-square rounded-full cursor-pointer"
                  onClick={() => navigate(`/app/${comment.username}`)}
                />
                <div className="w-full">
                  <h1 className="text-sm font-medium">{comment.username}</h1>
                  <h1 className="text-sm text-gray-700">{comment.content}</h1>
                </div>
                <button
                  title="delete comment"
                  className={`${(comment.commentedBy == currentUser._id || post.postedBy === currentUser._id) ? '' : 'hidden'} rotate-90`}
                  onClick={() => {
                    if (comment.commentedBy == currentUser._id || post.postedBy === currentUser._id) {
                      axios.delete(`/api/v1/comments/delete/${comment._id}`)
                        .then((res) => setComments((cur) => cur.filter((comment) => comment._id != res.data.data._id)
                        ))
                    }
                  }}>..</button>
                <button>
                  <img
                    src={like}
                    alt=""
                    className="w-5 aspect-square"
                    onClick={(e) => e.target.src = "https://www.pngall.com/wp-content/uploads/13/Red-Heart-PNG-Image-File.png"
                    }
                  />
                </button>
              </div>
            ))
          }
        </div>
        <div className={`px-1`}  >
          <div className=" flex justify-between">
            <div className="flex items-center gap-3 my-1 ">
              <button
                onClick={() => {
                  axios.post(`/api/v1/likes/toggle-like/${post._id}`)
                    .then((res) => {
                      if (currentUser._id != post.postedBy) {
                        if (!liked) {
                          axios.post(`/api/v1/notifications/create`, { to: post.postedBy, content: 'liked your post', post: post.postFile, type: 'like' })
                        }
                        else {
                          // delete like notification if exits
                          axios.delete(`/api/v1/notifications/delete-by-fields`, { to: post.postedBy, content: 'liked your post', post: post.postFile, type: 'like' })
                        }
                      }
                      setLiked((cur) => !cur)
                      if (res.data.message === 'Like Created Successfully')
                        setLikes((cur) => [...cur, res.data.data])
                      else
                        setLikes((cur) => cur.filter((like) => like._id === res.data.data._id))
                    })
                }}
              >
                <img
                  className="h-6"
                  src={liked ? "https://res.cloudinary.com/dmxjulnzo/image/upload/v1729320438/Heart_coraz%C3%B3n.svg_jupxq6.png" : "https://res.cloudinary.com/dmxjulnzo/image/upload/v1729254532/Slide2-removebg-preview_2_ipjqn8.png"}
                  alt="like"
                />
              </button>
              <button
                className=""
                onClick={() => {
                  if (!postId) {
                    dispatch(updateUseDisplayFor(null))
                    navigate(`/app/p/${post._id}`)
                  }
                  else {
                    setMobileCommentsDiv(true)
                    commentBoxRef.current.focus()
                  }
                }}
              >
                <img
                  className="h-6"
                  src="https://res.cloudinary.com/dmxjulnzo/image/upload/v1729254331/Slide1-removebg-preview_1_ao5uix.png"
                  alt="comment"
                />
              </button>
              <button>
                <img
                  className="h-[24.22px]"
                  src="https://res.cloudinary.com/dmxjulnzo/image/upload/v1729254332/Slide9-removebg-preview_ehvzwv.png"
                  alt="share"
                />
              </button>
            </div>
            <div className="my-1">
              <button
                className={` ${saved ? "" : "active:scale-110"}`}
                onClick={() => {
                  setSaved((cur) => !cur)
                }}
              >
                <img
                  className="h-6"
                  src={saved ? "https://res.cloudinary.com/dmxjulnzo/image/upload/v1729254568/Slide7-removebg-preview_xpzemt.png" : "https://res.cloudinary.com/dmxjulnzo/image/upload/v1729254567/Slide6-removebg-preview_1_ql2mv7.png"}
                  alt="save"
                />
              </button>
            </div>
          </div>
          <h1 className="">{likes.length} likes</h1>
          <span className="font-medium text-sm sm:text-base">{post.username}</span> <span className="text-sm sm:text-base">{post.caption}</span>
          <h1 className="text-xs sm:text-base font-[150px] text-gray-500">{new Date(post.createdAt).toDateString().slice(3)}</h1>
        </div>
        <form
          action=""
          className={`relative ${isMobile ? 'pb-1' : ''}`}
          onSubmit={(e) => {
            e.preventDefault()
            axios.post(`/api/v1/comments/add`, { content: comment, post: post._id })
              .then((res) => {
                setComments((cur) => [...cur, { ...res.data.data, displayPicture, username }])
                if (res.data.data.commentedBy != currentUser._id) {
                  axios.post(`/api/v1/notifications/create`, { to: post.postedBy, content: `commented on your post`, type: 'comment', post: post.postFile })
                    .then((res) => {
                    })
                }
              })
            setComment('')
          }}>
          <input
            ref={commentBoxRef}
            type="text"
            placeholder="Comment..."
            className="w-full pl-9 py-1 sm:py-2  focus:bg-gray-50 focus:border-gray-400 border-gray-300 border-[1px] outline-none "
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <details title="Emojis">
            <summary className={`absolute left-1 top-0 p-1 sm:p-2 font-medium text-gray-500  list-none scale-[1.7] cursor-pointer focus:outline-none`}>☺</summary>
            <div className="bg-white absolute bottom-11 w-36 md:w-72 aspect-square overflow-y-scroll flex flex-wrap gap-4 p-2 md:p-4 ">
              {
                emojis.map((emoji, index) => (
                  <div
                    key={index}
                    className="scale-150 md:scale-[1.8]"
                    onClick={() => setComment((cur) => cur + emoji)}>{emoji}
                  </div>
                ))
              }
            </div>
          </details>
          <button
            type="submit"
            className={`absolute right-0 top-0 p-1 sm:p-2 ${comment ? 'text-[#4B60FF]' : ' text-gray-400'} font-medium `}
          >post</button>
        </form>
        {/* Mobile Comments */}
        {
          mobileCommentsDiv && (
            <div className={` border-t-2 border-gray-300 flex flex-col items-center rounded-t-2xl ${isMobile ? 'pb-7' : ''}`}>
              <div className="w-10 p-[2.5px] mt-2 bg-gray-300 rounded-full"></div>
              <h1 className="text-sm pt-1 pb-2">Comments</h1>
              {
                (!setWidth && isMobile) && comments.map((comment) => (
                  <div key={comment._id} className="p-2 flex w-full justify-between items-center gap-2">
                    <img
                      src={comment.displayPicture}
                      alt="user"
                      className="w-8 aspect-square rounded-full cursor-pointer"
                      onClick={() => navigate(`/app/${comment.username}`)}
                    />
                    <div className="w-full">
                      <h1 className="text-xs font-medium">{comment.username}</h1>
                      <h1 className="text-xs text-gray-700">{comment.content}</h1>
                    </div>

                    <button
                      title="delete comment"
                      className={`${(comment.commentedBy == currentUser._id || post.postedBy === currentUser._id) ? '' : 'hidden '} rotate-90`}
                      onClick={() => {
                        if (comment.commentedBy == currentUser._id || post.postedBy === currentUser._id) {
                          axios.delete(`/api/v1/comments/delete/${comment._id}`)
                            .then((res) => setComments((cur) => cur.filter((comment) => comment._id != res.data.data._id)
                            ))
                        }
                      }}>..</button>
                    <button>
                      <img
                        src={like}
                        alt=""
                        className="w-5 aspect-square"
                        onClick={(e) => e.target.src = "https://www.pngall.com/wp-content/uploads/13/Red-Heart-PNG-Image-File.png"
                        }
                      />
                    </button>
                  </div>
                ))
              }
            </div>
          )
        }
      </div>
    </div>
  )
}