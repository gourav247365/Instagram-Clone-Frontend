import { useEffect, useState } from "react"
import { NavLink, useParams } from "react-router-dom"

export default function ChatList({ chat, setHasMore, setPage }) {

  const { chatId } = useParams()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
    setIsMobile(mobileRegex.test(userAgent))
  }, [])

  return (
    <NavLink
      key={chat._id}
      to={`/app/direct/${chat._id}`}
      replace={chatId ? true : false}
      className={({ isActive }) => ` ${isMobile ? 'w-screen' : 'w-auto'} p-2 flex justify-between items-center md:w-full ${isActive ? 'bg-gray-300 bg-opacity-50' : ''} ${!isActive && !chat.lastMessage ? 'hidden' : ''}`}
      onClick={() => {
        if (chat._id != chatId) {
          setPage(1)
          setHasMore(true)
        }
      }}
    >
      <div className="flex items-center">
        <img
          src={chat.displayPicture}
          alt="user"
          className="w-12 md:w-16 rounded-full"
        />
        <div className={`px-2 ${isMobile ? '' : 'hidden '} md:block`}>
          <h1 className="text-sm">{chat.username}</h1>
          <h1 className="text-sm text-gray-500">{chat.lastMessage && chat.lastMessage?.text}</h1>
        </div>
      </div>
      <div className="hidden md:block">
        <img 
          src="https://e7.pngegg.com/pngimages/982/97/png-clipart-computer-icons-camera-iphone-graphy-camera-photography-camera-icon-thumbnail.png" alt="" className="w-6" />
      </div>
    </NavLink>
  )
}