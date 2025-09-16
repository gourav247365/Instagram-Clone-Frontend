import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from 'react-router-dom'
import Loader from '../Components/Loader'
import Post from '../Components/Post'
import { updatePostIndex, updateUseDisplayFor } from "../store/Slice"
import Input from "../Components/Input"

export default function DisplayPost() {
  const dispatch = useDispatch()
  const profilePosts = useSelector((state) => state.profilePosts)
  const explorePosts = useSelector((state) => state.explorePosts)
  const postIndex = useSelector((state) => state.postIndex)
  const { postId } = useParams()
  const [post, setPost] = useState({})
  const [loading, setLoading] = useState(true)
  const [Error, setError] = useState("")
  const useDisplayFor = useSelector((state) => state.useDisplayFor)
  const editModalRef = useRef(null)
  const [caption, setCaption] = useState("")
  const [isMobile, setIsMobile] = useState(false);
  const [location, setLocation] = useState("")
  const update = () => {
    axios.patch(`/api/v1/posts/p/${post._id}`, { caption, location })
      .then((res) => {
        setPost((cur) => { return { ...cur, caption: res.data.data.caption, location: res.data.data.location } })
        editModalRef.current.close()
      })
  }
  const navigate = useNavigate()
  const divRef = useRef(null)
  const Close = () => {
    setTimeout(() => {
      dispatch(updateUseDisplayFor(null))
    })
    navigate(-1)
  }
  const goToPrevPost = () => {
    if (postIndex > 0) {
      dispatch(updatePostIndex(postIndex - 1))
      navigate(`/app/p/${useDisplayFor === 'profile' ? profilePosts[postIndex - 1]._id : explorePosts[postIndex - 1]._id}`, { replace: true })
    }
  }
  const goToNextPost = () => {
    if (postIndex < (useDisplayFor === 'profile' ? profilePosts.length - 1 : explorePosts.length - 1)) {
      dispatch(updatePostIndex(postIndex + 1))
      navigate(`/app/p/${useDisplayFor === 'profile' ? profilePosts[postIndex + 1]._id : explorePosts[postIndex + 1]._id}`, { replace: true })
    }
  }

  const keyPressHandler = (e) => {
    if (e.key === 'ArrowLeft' && postIndex > 0 && useDisplayFor) {
      setTimeout(() => dispatch(updatePostIndex(postIndex - 1)))
      navigate(`/app/p/${useDisplayFor === 'profile' ? profilePosts[postIndex - 1]._id : explorePosts[postIndex - 1]._id}`, { replace: true })
    }
    else if (e.key === 'ArrowRight' && postIndex < (useDisplayFor === 'profile' ? profilePosts.length - 1 : explorePosts.length - 1) && useDisplayFor) {
      setTimeout(() => dispatch(updatePostIndex(postIndex + 1)))

      navigate(`/app/p/${useDisplayFor === 'profile' ? profilePosts[postIndex + 1]._id : explorePosts[postIndex + 1]._id}`, { replace: true })
    }
  }

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
    setIsMobile(mobileRegex.test(userAgent))
  }, [])

  useEffect(() => {
    axios.get(`/api/v1/posts/p/${postId}`)
      .then((res) => {
        setPost(res.data.data)
        setLoading(false)
        setError("")
        setCaption(res.data.data.caption)
        setLocation(res.data.data.location)
      })
      .catch((error) => {
        setError(error.message)
      })
  }, [postIndex, postId])

  if (Error) {
    return (
      <div className="h-dvh w-full flex flex-col justify-center items-center bg-black bg-opacity-50 relative z-20">
        <button
          className="right-0 top-0 fixed z-10 scale-150 p-6 "
          onClick={Close}
        >
          <img
            src="https://res.cloudinary.com/dmxjulnzo/image/upload/v1729784531/mc4iqia2l0dl596k8f45rgjhru_rmzk5b.png"
            alt="close"
            width="12px"
            className="invert"
          />
        </button>
        <div className={` ${isMobile ? 'w-full' : 'w-[700px]'} bg-white border-b-[1px] border-gray-300 p-2`}>
          <img src="https://res.cloudinary.com/dmxjulnzo/image/upload/v1730717700/User_naarwo.png" alt="" className="w-10" />
        </div>
        <div className={` ${isMobile ? 'w-full aspect-square' : 'w-[700px] h-[700px]'}  flex justify-center items-center bg-white`}>
          <h1 className="text-red-500 ">{Error}</h1>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <Loader />
    )
  }

  return (
    <div
      ref={divRef}
      className={`w-full h-dvh flex ${isMobile ? 'flex-col justify-start bg-white ' : 'bg-black bg-opacity-50 justify-around items-center'} relative z-20 focus:outline-none overflow-x-hidden `}
      tabIndex='0'
      onLoad={() => divRef.current.focus()}
      onKeyUp={keyPressHandler}
    >
      {
        isMobile && <div className="bg-white h-fit">
          <button onClick={Close}>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc2Uv0OSa0-BwQzW585-SaNy68y7FOe4wUoQ&s" 
              alt=""
              className="w-6 mt-2 ml-1 mix-blend-multiply"
            />
          </button>
        </div>
      }
      <dialog
        ref={editModalRef}
        className="h-full w-full"
      >
        <div className={`flex w-full justify-center h-full items-center bg-[#727272] ${isMobile ? 'hidden' : ''}`} >
          <button
            className={`right-0 top-0 fixed z-10 scale-150 p-6 `}
            onClick={() => {
              editModalRef.current.close()
            }}
          >
            <img
              src="https://res.cloudinary.com/dmxjulnzo/image/upload/v1729784531/mc4iqia2l0dl596k8f45rgjhru_rmzk5b.png"
              alt="close"
              width="12px"
              className="invert"
            />
          </button>
          <div className="flex bg-white flex-col md:flex-row ">
            <div className=" justify-center items-center w-80 md:w-[500px] md:h-[500px] border-[1px] border-gray-300">
              <img
                className=" object-contain h-[100%] "
                src={post.postFile}
                alt="image"
              />
            </div>
            <div className=" h-48 flex flex-col justify-center gap-2 md:h-[500px] "  >
              <Input
                className=" h-14 m-1 text-gray-700"
                type="text"
                placeholder="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
              <Input
                className=" h-14 m-1 text-gray-700"
                type="text"
                placeholder="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <button
                onClick={update}
              >update</button>
            </div>
          </div>
        </div>
      </dialog>
      <button
        className={`right-0 top-0 fixed z-10 scale-150 p-6 ${isMobile ? 'hidden' : ''}`}
        onClick={Close}
      >
        <img
          src="https://res.cloudinary.com/dmxjulnzo/image/upload/v1729784531/mc4iqia2l0dl596k8f45rgjhru_rmzk5b.png"
          alt="close"
          width="12px"
          className="invert"
        />
      </button>
      <div>
        <button
          onClick={goToPrevPost}
          className={`text-white text-xl p-1 lg:absolute lg:left-10 ${useDisplayFor ? '' : 'hidden'}  ${isMobile ? 'hidden' : ''}`}
        >
          <img
            className={` ${isMobile ? 'w-5' : 'w-8 invert'}  -rotate-90`}
            src="https://cdn-icons-png.flaticon.com/512/44/44603.png"
            alt=""
          />
        </button>
      </div>
      <Post
        post={post}
        modalRef={editModalRef}
      />
      <div className={`${isMobile ? 'w-full flex justify-between fixed bottom-0' : ''} `} >
        <button
          onClick={goToPrevPost}
          className={`text-white text-xl p-1 lg:absolute lg:left-10 ${useDisplayFor ? '' : 'hidden'} ${isMobile ? '' : 'hidden'} `}
        >
          <img
            className={` ${isMobile ? 'w-5 opacity-40' : 'w-8 invert'}  -rotate-90`}
            src="https://cdn-icons-png.flaticon.com/512/44/44603.png"
            alt=""
          />
        </button>
        <button
          onClick={goToNextPost}
          className={` text-white text-xl p-1 lg:absolute lg:right-10 ${useDisplayFor ? '' : 'hidden'} `}
        >
          <img
            className={`${isMobile ? 'w-5 opacity-40' : 'w-8 invert'} rotate-90`}
            src="https://cdn-icons-png.flaticon.com/512/44/44603.png"
            alt=""
          />
        </button>
      </div>
    </div>
  )
}