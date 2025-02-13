import React, {
  useEffect,
  useRef,
  useState
} from "react";
import Footer from "../Components/Footer";
import axios from "axios";
import {
  useNavigate,
  useParams
} from "react-router-dom";
import {
  useDispatch,
  useSelector
} from 'react-redux'
import {
  updateCurrentUser,
  MessagePopUp,
  updateProfilePosts,
  updatePostIndex,
  updateUseDisplayFor,
  addMoreCurrentUserPosts,
  addNewChat,
  addMoreProfilePosts,
} from "../store/Slice";
import InfiniteSroll from 'react-infinite-scroll-component'
import Loader from "../Components/Loader"

export default function Profile() {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ref = useRef(null)
  const { username } = useParams()
  const currentUser = useSelector((state) => state.currentUser)
  const currentUserPosts = useSelector((state) => state.currentUserPosts)
  const profilePosts = useSelector((state) => state.profilePosts)
  const [isCurrentUser, setIsCurrentUser] = useState(true)
  const [relation, setRelation] = useState('')

  const fetchUserData = async () => {

    if (username === currentUser.username) {
      setUser(currentUser)
      dispatch(updateProfilePosts(currentUserPosts))
      setLoading(false)
    }
    else {
      try {
        setIsCurrentUser(false)
        setLoading(true)

        axios.get(`/api/v1/relations/user/${username}`)
        .then((res) => {
          setRelation(res.data.data.status)
        })

        axios.get(`/api/v1/users/user/${username}`)
        .then((res1) => {
          setUser(res1.data.data)

          axios.get(`/api/v1/posts/${res1.data.data._id}`)
          .then((res2) => {
            dispatch(updateProfilePosts(res2.data.data.docs))
          })
        })
        setLoading(false)

      } catch (error) {
      }
    }
  }

  const fetchPosts = async () => {
    try {
      setLoadingPosts(true)
      const lastSeen = profilePosts.length > 0 ? profilePosts[profilePosts.length - 1].createdAt : null;
      const response = await axios.get(`/api/v1/posts/${profilePosts[0].postedBy}?page=${page}&limit=9&lastSeen=${lastSeen}`)

      const { docs, hasNextPage } = response.data.data
      dispatch(addMoreProfilePosts(docs))
      if (docs[0]?.postedBy === currentUser._id)
        dispatch(addMoreCurrentUserPosts(docs))
      setPage(prevPage => prevPage + 1);
      setHasMore(hasNextPage);
      setLoadingPosts(false)
    }
    catch (error) {
      setLoadingPosts(false)
      console.error('Error fetching posts:', error);
    }
  }

  const logout = () => {
    axios.post('/api/v1/users/logout')
      .then(() => {
        dispatch(updateCurrentUser(null))
        setTimeout(()=> dispatch(MessagePopUp({message: '',visibility: false, type: ''})),3000)
        dispatch(MessagePopUp({message: 'User Logged Out',visibility: true, type: 'success'}))
        navigate('/')
      })
      .catch((error) => {
      })
  }

  useEffect(() => {
    fetchUserData()
  }, [username])

  if (loading) {
    return (
      <Loader />
    )
  }

  return (
    <div className=" w-auto h-screen flex flex-col items-center mt-14 md:ml-14 lg:ml-64">

      <div className=" h-fit w-full pt-2 ">
        <div className="flex items-center  gap-4 p-2 md:p-4">
          <div>
            <img
              className="aspect-square rounded-full md:w-28"
              src={user.displayPicture}
              alt="error"
              width='70'
            />
          </div>
          <div className="flex gap-2 flex-col">
            <div className="flex gap-2 ">
              <h1 className=" font-medium " >@{user.username}</h1>
              <div className={`${isCurrentUser ? '' : 'hidden'}`}>
                <button
                  className={` text-xl `}
                  onClick={() => {
                    ref.current?.showModal()
                  }} >
                  <img
                    src="https://res.cloudinary.com/dmxjulnzo/image/upload/v1725696377/imageedit_2_2502290922_uekael.png"
                    alt="settings"
                    width="25px"
                  />
                </button>
              </div>
            </div>
            <div className="flex gap-3">

              <button
                onClick={() => navigate("/app/accounts/edit")}
                className={` btn ${isCurrentUser ? '' : 'hidden'}`}
              >
                Edit Profile
              </button>

              <button
                className={` btn ${isCurrentUser ? '' : 'hidden'}`}
              >
                View Archive
              </button>

              <button
                className={` btn  ${relation !== 'none' ? '' : ' bg-[#4B60FF] text-white border-none'}  ${isCurrentUser ? 'hidden' : ''}`}

                onClick={() => {
                  axios.post(`/api/v1/relations/toggle/${username}`, { userId: user._id, isPrivate: user.isPrivate })
                    .then((res) => {
                      setRelation(res.data.data.status)
                      if (res.data.data.status !== 'none') {
                        axios.post('/api/v1/notifications/create', { content: user.isPrivate ? 'requested to follow you' : 'started following you', type: user.isPrivate ? 'request' : 'follow', to: user._id })
                      }
                      else {
                        //delete Notification if exists
                        axios.delete(`/api/v1/notifications/delete-request-notification?to=${user._id}`)
                          .then((res) =>{})
                      }
                    })
                }}
              >
                {relation === 'accepted' ? 'Following' : relation === 'pending' ? 'requested' : 'Follow'}
              </button>

              <button
                onClick={() => {
                  axios.post(`/api/v1/chats/${user._id}`)
                    .then((res) => {
                      dispatch(addNewChat({ ...res.data.data, username: user.username, displayPicture: user.displayPicture, messages: [] }))
                      navigate(`/app/direct/${res.data.data._id}`)
                    })
                }}
                className={`btn ${isCurrentUser ? 'hidden' : ''}`}
              >
                Message
              </button>
            </div>
          </div>
        </div>
        <div className="px-2 md:px-4">
          <h1 className=" text-lg font-medium ">{user.fullname}</h1>
          <pre className="text-sm font-sans">{user.bio}</pre>
        </div>
        <dialog className=" w-full h-full backdrop-blur-sm bg-transparent  " ref={ref} >
          <div className="h-fit w-60 md:w-96 rounded-md mt-[25vh] mx-auto bg-white  ">
            <button className="w-full py-2 border-b-[1px] border-gray-">Apps and Websites</button>
            <button className="w-full py-2 border-b-[1px] border-gray-">QR code</button>
            <button className="w-full py-2 border-b-[1px] border-gray-">Notifications</button>
            <button className="w-full py-2 border-b-[1px] border-gray-">Settings and Privacy</button>
            <button className="w-full py-2 border-b-[1px] border-gray-">Supervision</button>
            <button className="w-full py-2 border-b-[1px] border-gray-">Login Activity</button>
            <button className="w-full py-2 border-b-[1px] border-gray-" onClick={logout}>logout</button>
            <button className="w-full py-2" onClick={() => ref.current?.close()}>Cancel</button>
          </div>
        </dialog>
        <div className="py-2 px-5">
          <button>
            <img
              className="w-16 h-16 md:w-20 md:h-20"
              src="https://res.cloudinary.com/dmxjulnzo/image/upload/v1725696541/small_1x_2acee179-6fdc-4e33-9601-a380b16cd93c_afvp3j.png"
              alt="add"
              width=""
            />
          </button>
        </div>
        <div className="w-full flex justify-around py-2 px-5 border-y-[1px] border-gray-300">
          <h1>{user.postsCount} Posts </h1>
          <h1>{user.followersCount} followers </h1>
          <h1>{user.followingsCount} following </h1>
        </div>
      </div>

      {
        !profilePosts && <Loader className="w-full h-fit" />
      }
      {
        user.isPrivate && !isCurrentUser && relation != 'accepted' && (
          <div className=" w-full h-full flex flex-col items-center">
            <img
              src="https://i.pinimg.com/736x/df/68/c4/df68c47f81724c3ee262ec2ecd6dc5a3.jpg"
              alt=""
              className="h-44"
            />
            Account is Private
          </div>
        )
      }
      {
        profilePosts && profilePosts.length === 0 && !user.isPrivate && (
          <div className=" w-full h-full flex flex-col justify-center items-center pt-10 md:pt-24">
            <img
              className="w-44 sm:w-72"
              src="https://res.cloudinary.com/dmxjulnzo/image/upload/v1730327126/Screenshot_from_2024-10-31_03-45-14-removebg-preview_eml2kb.png"
              alt=""
            />
            <h1>No Posts Yet</h1>
          </div>
        )
      }
      <InfiniteSroll
        dataLength={profilePosts?.length || 9}
        next={fetchPosts}
        hasMore={hasMore}
        className=" h-fit w-full grid grid-cols-3 grid-rows-3 auto-cols-fr auto-rows-fr max-w-[72rem] p-[.5px] md:p-2  "
      >
        {
          profilePosts && profilePosts.length > 0 && (relation === 'accepted' || isCurrentUser || !user.isPrivate) && profilePosts.map((post, index) => (
            <div
              key={post._id}
              className=" w-[1/3fr] aspect-[3/4] max-w-96 overflow-hidden p-[.5px] sm:p-[1px] flex justify-center hover:scale-[102%] transition-all duration-300 hover:border-[#4B60FF] border-white border-[1px] box-content "
              onClick={() => {
                dispatch(updatePostIndex(index))
                dispatch(updateUseDisplayFor("profile"))
                navigate(`/app/p/${post._id}`)
              }}
            >
              <img
                className="object-cover min-w-full min-h-full"
                src={post.postFile}
                alt="post"
              />
            </div>
          ))
        }
      </InfiniteSroll>
      {loadingPosts && <Loader className='w-full' />}
      <Footer className="pb-14 md:pb-0" />
    </div >
  )
}