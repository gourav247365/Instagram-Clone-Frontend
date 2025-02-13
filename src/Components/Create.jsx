import Cropper from "react-easy-crop";
import { useState } from "react";
import Input from './Input'
import axios from "axios";
import imageCompression from 'browser-image-compression'
import { useDispatch, useSelector } from "react-redux";
import { addNewPost, addNewFollowingPost } from '../store/Slice'

export default function Create({ modalRef }) {

  const [img, setImg] = useState(null) // to store the selected image
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [aspectratio, setAspectratio] = useState(1 / 1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)
  const [postFile, setPostFile] = useState(null)
  const [caption, setCaption] = useState("")
  const [location, setLocation] = useState("")
  const [uploading, setUploading] = useState(false)
  const dispatch = useDispatch()
  const username = useSelector((state) => state.currentUser.username)
  const displayPicture = useSelector((state) => state.currentUser.displayPicture)

  const post = () => {

    const form = new FormData()
    form.append('postFile', postFile)
    form.append('location', location)
    form.append('caption', caption)
    setUploading(true)
    setTimeout(() => modalRef(false), 2000)

    axios.post('/api/v1/posts/create', form)
      .then((res) => {
        setUploading(false)
        setImg(null)
        setCroppedImage(null)
        setPostFile(null)
        setLocation("")
        setCaption("")
        dispatch(addNewPost(res.data.data))
        dispatch(addNewFollowingPost({ ...res.data.data, username, displayPicture }))
      })
  }

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    // console.log(croppedArea, croppedAreaPixels)
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const getCroppedImg = (imageSrc, pixelCrop) => {
    return new Promise((resolve) => {
      const image = new Image()
      image.src = imageSrc
      image.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

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
          setCroppedImage(croppedImageURL)
          const file = new File([blob], "cropped_image.jpeg", {
            type: "image/jpeg",
            lastModified: Date.now()
          })
          const compressedFile = await imageCompression(file, {
            maxSizeMB: 2,          // Max file size in MB
            maxWidthOrHeight: 1080,// Resize the image to this width/height
            useWebWorker: true     // Enable web workers for faster processing
          })
          setPostFile(compressedFile)
          resolve(croppedImageURL)
        })
      }
    })
  }

  return (
    <div className={` backdrop-blur- w-screen h-dvh flex flex-col justify-center items-center  bg-black bg-opacity-50 fixed bottom-0 left-0 z-50 `}>
      <button
        className="absolute top-14 md:top-0 right-0 text-white px-6 py-3"
        onClick={() => modalRef(false)}
      >
        <img
          src="https://res.cloudinary.com/dmxjulnzo/image/upload/v1729784531/mc4iqia2l0dl596k8f45rgjhru_rmzk5b.png"
          alt="close"
          width="12px"
          className="invert"
        />
      </button>
      <div className=" flex flex-col justify-around border-[1px] border-black rounded-md overflow-hidden bg-white ">
        <div className="flex justify-around items-center border-b-[1px] border-black">
          <button
            className={`${img ? "" : "hidden"}`}
            onClick={() => {
              if (croppedImage) {
                setCroppedImage(null)
              }
              else if (img) {
                setImg(null)
              }
            }}
          >back</button>
          <h1 className=' text-center p-2  md:text-xl '>{img && !croppedImage ? "Crop" : "Create New Post"}</h1>
          <button
            className={`${img && !croppedImage ? "" : "hidden"}`}
            onClick={() => getCroppedImg(img, croppedAreaPixels)}
          >next</button>
          <button
            className={`${croppedImage ? "" : "hidden"} `}
            onClick={post}
          >share</button>
        </div>
        {
          !img && <div className=' overflow-hidden  '>
            <div className='w-80 h-96 md:w-[500px] md:h-[500px] flex flex-col justify-center items-center '>
              <input
                type="file"
                className='hidden ' id='image-input'
                onChange={(e) => {
                  setImg(URL.createObjectURL(e.target.files[0]))
                }}
              />
              <label
                htmlFor="image-input"
                className=' w-36 h-32 md:h-48 md:w-52 bg-blue-400 rounded-md text-center content-center md:text-xl'
              > Choose File </label>
            </div>
          </div>
        }
        {
          img && !croppedImage && <div className=" flex justify-center items-center flex-col w-80 md:w-[500px]">
            <div className="w-80 h-96  md:w-[500px] md:h-[500px] relative " >
              <Cropper
                image={img}
                crop={crop}
                zoom={zoom}
                aspect={aspectratio}
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
              <button
                onClick={() => {
                  if (aspectratio == 1 / 1) {
                    setAspectratio(5 / 4)
                  }
                  else if (aspectratio == 5 / 4) {
                    setAspectratio(4 / 5)
                  }
                  else if (aspectratio == 4 / 5) {
                    setAspectratio(1 / 1)
                  }
                }}
                className="w-16 border-[1px] border-black rounded-md m-2"
              >{aspectratio == 5 / 4 ? "5/4" : aspectratio == 4 / 5 ? "4/5" : "1/1"}</button>
            </div>
          </div>
        }

        {
          croppedImage && <div className="md:flex">
            <div className=" flex justify-center items-center w-80 md:w-[500px] md:h-[500px] border-[1px] border-gray-300">
              <img
                className=" object-contain h-[100%] "
                src={croppedImage} alt="image"
              />
            </div>
            <div className=" h-48 flex flex-col justify-center items-center gap-2 md:h-[500px]" >
              <Input
                className=" h-14 m-1"
                type="text"
                placeholder="caption"
                onChange={(e) => {
                  setCaption(e.target.value)
                }}
              />
              <Input
                className=" h-14 m-1"
                type="text"
                placeholder="location"
                onChange={(e) => {
                  setLocation(e.target.value)
                }}
              />
              {
                uploading && <h1 className="text-red-500 font-medium">uploading file and creating post...</h1>
              }
            </div>
          </div>
        }
      </div>
    </div>
  )
}