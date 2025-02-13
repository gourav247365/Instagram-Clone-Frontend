import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Loader from "../Components/Loader"

export default function () {

  const [notifications, setNotifications] = useState([])
  const navigate = useNavigate()
  const [loading,setLoading]= useState(true)

  useEffect(() => {
    axios.get('/api/v1/notifications/current-user')
      .then((res) => {
        setNotifications(res.data.data)
        setLoading(false)        
      })
  }, [])

  if(loading) {
    return (
      <div className="w-auto h-screen flex flex-col items-center mt-14 md:ml-14 lg:ml-64">
      <Loader />
      </div>
    )
  }

  return (
    <div className="w-auto h-screen flex flex-col items-center mt-14 md:ml-14 lg:ml-64">
      <div className="w-full max-w-[454px]">
        <h1 className="p-3">requests</h1>
      </div>
      {notifications.map((notification) => (
        <div className="w-full flex justify-between p-2 max-w-[454px] " key={notification._id}>
                  <div className="flex items-center gap-1 ">
          <div className=" aspect-square rounded-full overflow-hidden">
            <img
              src={notification.displayPicture}
              alt="user"
              className="cursor-pointer w-12 "
              onClick={() => navigate(`/app/${notification.username}`)}
            />
          </div>
          <h1 className="text-gray-600 ">
            <span className="font-medium text-black">{notification.username} </span>
            {notification.content}</h1>
        </div>

        {
          notification.type === 'request' ? (
            <div className="flex gap-1 items-center">
              <button
                className="text-sm font-bold bg-sky-500 text-white rounded-md px-3 py-[6px]"
                onClick={() => {
                  axios.patch('/api/v1/relations/accept', { user: notification.from })
                    .then((res) => {
                    
                    })
                  axios.patch('/api/v1/notifications/accept', { id: notification._id })
                    .then((res) => {
                      console.log(res)
                      setNotification((cur) => ({ ...res.data.data, username: cur.username, displayPicture: cur.displayPicture }))
                    })
                  axios.post('/api/v1/notifications/create', { from: notification.to, to: notification.from, content: 'accepted your follow request', type: 'follow' })
                    .then((res) => console.log(res))
                }}
              >Confirm</button>
              <button
                onClick={() => {
                  axios.delete(`/api/v1/notifications/delete/${notification._id}`)
                    .then((res) => {
                      setNotifications((cur)=> cur.filter((notification)=> notification._id != res.data.data._id))
                    })
                  axios.delete(`/api/v1/relations/delete}`, { follower: notification.from })
                    .then((res) => {

                    })
                }}
                className="text-sm font-bold bg-sky-500 text-white rounded-md px-3 py-[6px]"
              >Delete</button>
            </div>
          ) : (
            <div className='flex gap-2'>
              <div className={` aspect-square overflow-hidden ${(notification.type == 'like' || notification.type == 'comment') ? '' : 'hidden'}`}>
                <img src={notification.post} alt="PostImage" className="w-12" />
                {/* navigate to post */}
              </div>
              <button 
                title='delete'
                onClick={() => {
                axios.delete(`/api/v1/notifications/delete/${notification._id}`)
                  .then((res) => {
                    setNotifications((cur)=> cur.filter((notification)=> notification._id != res.data.data._id))
                  })
              }}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/5253/5253450.png"
                  alt="delete"
                  width=""
                  className="w-5 "
                />
              </button>
            </div>
          )
        }
        </div>
      ))}
    </div>
  )
}