import { NavLink, useNavigate } from "react-router-dom";
import direct from '../public/assets/icons/direct.png';
import like from '../public/assets/icons/like.png'

export default function Header(){

  return( 
    <div className="w-full h-fit bg-white flex flex-wrap md:w-14 lg:w-64 justify-between items-center  border-gray-300 md:border-r-[1px] p-2  fixed z-[10] ">
      <div className="flex items-center gap-2">
        <img 
          src="https://static.vecteezy.com/system/resources/previews/014/414/683/non_2x/instagram-black-logo-on-transparent-background-free-vector.jpg" 
          alt="IG" 
          className="w-8 md:w-10" 
        />
        <h1 className="font-lobster text-xl md:text-3xl font-thin  md:hidden lg:block" >Instagram</h1>
        <button className="scale-150 px-3 pb-1 md:hidden lg:block"> ⌄ </button>
      </div>
      <div className="flex gap-2 md:hidden ">
      <NavLink
        to={'/app/notifications'}
        className=" px-2 rounded-md"
      >
        <img 
          src={like} 
          alt="notifications" 
          className="w-9" 
        />
      </NavLink>
      <NavLink
        className={`flex items-center gap-2 lg:w-11/12`}
        to={"/app/direct"}
        >
        <img
          src={direct}
          alt="messages"
          className="w-9 mix-blend-multiply"
        />
      </NavLink >
      </div>
    </div>
  )
}