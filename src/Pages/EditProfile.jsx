import { useDispatch, useSelector } from "react-redux"
import Input from "../Components/Input"
import { useRef, useState } from "react"
import Cropper from "react-easy-crop"
import axios from "axios"
import imageCompression from "browser-image-compression"
import { updateCurrentUser, togglePrivacy, updateUserField } from "../store/Slice"
import { useNavigate } from 'react-router-dom'

export default function EditProfile() {
  const currentUser = useSelector((state) => state.currentUser)
  const [img, setImg] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [newUsername, setNewUsername] = useState(currentUser.username)
  const [newFullname, setNewFullname] = useState(currentUser.fullname)
  const [newBio, setNewBio] = useState(currentUser.bio)
  const [availible, setAvailible] = useState(null)
  const dispatch = useDispatch()
  const modalRef = useRef(null)
  const navigate = useNavigate()

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const getCroppedImg = (imageSrc, pixelCrop) => {
    return new Promise((resolve) => {
      const image = new Image()
      image.src = imageSrc
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        )
        canvas.toBlob(async (blob) => {
          const croppedImageURL = URL.createObjectURL(blob)
          const file = new File([blob], "cropped_image.jpeg", {
            type: "image/jpeg",
            lastModified: Date.now()
          })
          const compressedFile = await imageCompression(file, {
            maxSizeMB: 2,          
            maxWidthOrHeight: 1080,
            useWebWorker: true     
          })
          resolve(compressedFile)
        })
      }
    })
  }

  return (
    <div className="w-auto h-dvh flex flex-col items-center pt-14 md:ml-14 lg:ml-64 gap-2  ">
      <dialog ref={modalRef} className={`w-full h-screen bg-black bg-opacity-50 }`}>
        <div className={` w-full h-full flex flex-col justify-center items-center `}>
          <div className=" flex flex-col justify-around border-[1px] border-black rounded-md overflow-hidden bg-white ">
            <div className={`flex justify-around items-center border-b-[1px] border-black ${img ? "" : "hidden"} `}>
              <button  
                onClick={() => {
                  setImg(null)
                  modalRef.current.close()
                }}
            >back</button>
              <h1 className=' text-center p-2  md:text-xl '>Change Display Picture</h1>
              <button  
                onClick={async () => {
                const formdata = new FormData()
                formdata.append("displayPicture", await getCroppedImg(img, croppedAreaPixels))
                axios.patch('/api/v1/users/update-dp', formdata)
                  .then((res) => {
                    dispatch(updateUserField({ field: 'displayPicture', value: res.data.data.displayPicture }))
                  })
                setImg(null)
                modalRef.current.close()
              }}
              >update</button>
            </div>
            {
              img && <div className=" flex justify-center items-center flex-col w-80 md:w-[500px]">
                <div className="w-80 h-96  md:w-[500px] md:h-[500px] relative " >
                  <Cropper
                    image={img}
                    crop={crop}
                    zoom={zoom}
                    aspect={1 / 1} // You can change the aspect ratio
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    zoomWithScroll={false}
                    onCropComplete={onCropComplete}
                  />
                </div>
                <div className="w-96 flex flex-col items-center">
                  <input
                    className="w-[80%] m-2"
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    maxLength={200}
                    onChange={(e) => setZoom(e.target.value)}
                  />
                </div>
              </div>
            }
          </div>
        </div>
      </dialog>

      <div className="w-11/12 max-w-[700px] ">
        <div className="w-full flex flex-col justify-center items-center gap-2 md:gap-3 pb-14 md:pb-0 ">
          <h1 className="w-full font-medium">Profile Picture</h1>
          <div className="w-full md:w- h-  bg-gray-100  rounded-lg flex items-center justify-between ">
            <div className="flex p-3 items-center">
              <img src={currentUser.displayPicture} alt="dp" width={70} className="rounded-full" />
              <div className="pl-3">
                <h1 className="font-medium">{currentUser.username}</h1>
                <h1>{currentUser.fullname}</h1>
              </div>
            </div>
            <details className="p-3 relative">
              <summary className="btn list-none">Change photo</summary>
              <div className="absolute right-3 flex flex-col">
                <input
                  id="dp"
                  type="file"
                  onClick={(e) => {
                    e.target.value = ""
                  }}
                  className="hidden"
                  onChange={(e) => {
                    try {
                      setImg(URL.createObjectURL(e.target.files[0]))
                      modalRef.current.showModal()
                    } catch (error) {
                      setImg(null)
                    }
                  }}
                />
                <label htmlFor="dp" >upload</label>
                <button
                  onClick={() => {
                    axios.patch('/api/v1/users/remove-dp')
                      .then((res) => {
                        dispatch(updateCurrentUser(res.data.data))
                      })
                  }}
                >remove</button>
                <button>cancel</button>
              </div>
            </details>
          </div>
          <h1 className="w-full font-medium text-sm md:text-base">Name</h1>
          <div className="w-full relative">
            <Input
              placeholder="Name"
              className="w-full sm:h-16 rounded-md text-sm md:text-base"
              value={newFullname}
              onChange={(e) => {
                setNewFullname(e.target.value)
              }}
            />
            <button onClick={() => {
              axios.patch('/api/v1/users/update-fullname', { fullname: newFullname })
                .then((res) => {
                  dispatch(updateUserField({ field: 'fullname', value: res.data.data.fullname }))
                })
            }} className={`${currentUser.fullname === newFullname ? 'hidden' : ''} absolute right-4 top-0 bottom-0 my-auto`}>✅</button>
          </div>
          <h1 className="w-full font-medium text-sm md:text-base">Username</h1>
          <div className="w-full relative">
            <Input
              placeholder="Username"
              className="w-full sm:h-16 rounded-md text-sm md:text-base"
              value={newUsername}
              onChange={(e) => {
                setNewUsername(e.target.value)
                // chech username existance
                axios.get(`/api/v1/users/username-availibility?value=${e.target.value}`)
                  .then((res) => {
                    setAvailible(res.data.data)
                  })
              }}
            />
            <div className={`flex   ${currentUser.username === newUsername ? 'hidden' : ''} absolute right-4 top-0 bottom-0 my-auto`}>
              <button title="username not availible" className={`text-red-500 text-sm sm:text-2xl sm:font-extrabold ${availible ? 'hidden' : ''}`}>❌</button>
              <button
                onClick={() => {
                  axios.patch('/api/v1/users/update-username', { username: newUsername })
                    .then((res) => {
                      dispatch(updateUserField({ field: 'username', value: res.data.data.username }))
                    })
                }}
                className={`${availible ? '' : 'hidden'}`}>✅</button>
            </div>
          </div>
          <h1 className="w-full font-medium text-sm md:text-base">Bio</h1>
          <div className="w-full relative">
            <Input
              placeholder="Bio"
              className="w-full sm:h-16 rounded-md text-sm md:text-base"
              value={newBio}
              onChange={(e) => {
                setNewBio(e.target.value)
              }}
            />
            <button
              title="update"
              className={`${currentUser.bio === newBio ? 'hidden' : ''} absolute right-4 top-0 bottom-0 my-auto `}
              onClick={() => {
                axios.patch('/api/v1/users/update-bio', { bio: newBio })
                  .then((res) => {
                    dispatch(updateUserField({ field: 'bio', value: res.data.data.bio }))
                  })
              }}
            >✅</button>
          </div>
          <h1 className="w-full font-medium text-sm md:text-base">Gender</h1>
          <select name="" id="" className=" w-full  sm:h-16  px-3 py-3 rounded-md bg-white text-black outline-none focus:bg-gray-50 focus:border-gray-400 duration-200 border border-gray-300 text-sm md:text-base"  >
            <option value="Select">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Prefer not to Say">Prefer not to Say</option>
            <option value="Custom">Other</option>
          </select>
          <h1 className="font-medium w-full text-sm md:text-base">Account Privacy</h1>
          <h1 className="text-[13px]">When your account is public, your profile and posts can be seen by anyone, on or off instagram, even if they don't have an Instagram account. When your account is private, only the followers you approve can see what you share, including your photos or videos on hashtag and location pages, and your followers and following lists. Certain info on your profile, like your profile picture and username, is visible to everyone on and off instagram.</h1>
          <div className="w-full flex h-16 border-[1px] px-3 items-center rounded-md border-gray-300 ">
            <h1 className="mr-3 text-sm md:text-base">{currentUser.isPrivate ? 'Switch to Public' : 'Switch to Private'}</h1>
            <div className="mt-2 sm:mt-0" >
              <input
                type="checkbox"
                id="check"
                checked={currentUser.isPrivate}
                onChange={() => {
                  axios.patch('/api/v1/users/update-privacy-status', { isPrivate: !currentUser.isPrivate })
                    .then((res) => {
                      dispatch(togglePrivacy())
                    })
                }}
                className="invisible"
              />
              <label
                htmlFor="check"
                className={` after:content-[''] after:h-4 after:w-9 sm:after:h-6 sm:after:w-14 after:absolute after:rounded-full before:content-[''] before:h-3 before:w-3 sm:before:h-5 sm:before:w-5 before:absolute before:z-10 before:bg-white before:rounded-full before:m-[2px] before:transition-all before:duration-500 after:transition-all after:duration-500 ${currentUser.isPrivate ? 'after:bg-[#4B60FF] before:translate-x-[160%]' : 'after:bg-slate-300'} `}
              />
            </div>
          </div>
          <button onClick={() => navigate(-1)} className="btn m-3">Back</button>
        </div>
      </div>
    </div>
  )
}