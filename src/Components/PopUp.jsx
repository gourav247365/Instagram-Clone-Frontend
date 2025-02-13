import React, { useEffect } from "react"
import { useSelector } from "react-redux"

const icons = {
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️",
}

const PopUp = () => {

  const message = useSelector((state) => state.popup.message)
  const type = useSelector((state) => state.popup.type)
  const visibility= useSelector((state) => state.popup.visibility)

  return (
    <div className={`mt-5 animate-fadeAway  rounded-sm  border-[1px] border-black ${type === 'success' ? 'bg-green-200' : type === 'error' ? 'bg-red-200' : type === 'warning' ? 'bg-yellow-200' : 'bg-slate-200'} w-96 min-h-8 sm:h-14 flex justify-center items-center fixed z-30  left-0 right-0 mx-auto ${visibility ? 'flex' : 'hidden'} `}>
      <h1 className={` text-center text-black`}>
        {message} {icons[type]}
      </h1>
    </div>
  )
}

export default PopUp