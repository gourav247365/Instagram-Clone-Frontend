import React, {  useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import Create from '../Components/Create'
import home from '../assets/icons/home.png'
import create from '../assets/icons/create.png'
import direct from '../assets/icons/direct.png'
import like from '../assets/icons/like.png'

export default function Navbar() {

  const username = useSelector((state) => state.currentUser?.username)
  const displayPicture = useSelector((state) => state.currentUser?.displayPicture)
  const [modal, setModal] = useState(false)

  return (
    <>
      <div className="bg-white h-14 w-full flex justify-around items-center md:flex-col md:justify-normal md:h-full md:gap-12 md:w-14 lg:w-64 border-gray-300 border-r-[1px] fixed bottom-0 z-[7] mt-12 md:mt-0 lg:items-start lg:pl-4">
        <NavLink
          className={`md:mt-28 flex items-center gap-2 lg:w-11/12 `}
          to="/app"
        >
          <img
            src={home}
            alt="home"
            className="w-[34px] mix-blend-multiply"
          />
          <h1 className="hidden lg:block">Home</h1>
        </NavLink >
        <NavLink
          className={({ isActive }) => ` flex items-center gap-2 lg:w-11/12 ${isActive ? 'border-[1px] border-gray-300 rounded-md' : ''}`}
          to="/app/explore"
        >
          <img
            src="https://www.svgrepo.com/show/315097/explore.svg"
            alt="explore"
            className="w-9 mix-blend-multiply rotate-12 "
          />
          <h1 className="hidden lg:block ">Explore</h1>
        </NavLink >

        <NavLink
          className={({ isActive }) => ` flex items-center gap-2 lg:w-11/12 ${isActive ? 'border-[1px] border-gray-300 rounded-md' : ''}`}
          to="/app/direct"
        >
          <img
            src={direct}
            alt="messages"
            className="w-9 mix-blend-multiply"
          />
          <h1 className="hidden lg:block">Direct</h1>
        </NavLink >

        <NavLink
          className={({ isActive }) => ` items-center gap-2 hidden md:flex lg:w-11/12 ${isActive ? 'border-[1px] border-gray-300 rounded-md' : ''}`}
          to="/app/notifications"
        >
          <img
            src={like}
            alt="notifications"
            className="w-9 mix-blend-multiply"
          />
          <h1 className="hidden lg:block">Notifications</h1>

        </NavLink>

        <span
          className={`p-[2px] flex items-center gap-2`}
          onClick={() => {
            setModal(true)
          }}
        >
          <img
            src={create}
            alt="create"
            className="w-[33px]  mix-blend-multiply"
          />
          <h1 className="hidden lg:block">Create</h1>
        </span >

        <NavLink
          className={({ isActive }) => ` p-1 flex items-center gap-2 lg:w-11/12 ${isActive ? 'border-[1px] border-gray-300 rounded-md' : ''}`}
          to={`/app/${username}`}
        >
          <div className="rounded-full border-2 border-black">
            <img
              src={displayPicture}
              alt="user"
              className="w-6 aspect-square rounded-full border-white border-[1px] "
            />
          </div>
          <h1 className="hidden lg:block">Profile</h1>
        </NavLink >

        <div className=" w-14 lg:w-52 hidden md:flex flex-col gap-4 items- py-4  absolute bottom-0" >
          <span>Threads</span>
          <span>More</span>
        </div>

      </div>
      {
        modal && <Create modalRef={setModal} />
      }
    </>
  )
}