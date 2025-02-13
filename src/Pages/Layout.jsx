import { Outlet, useNavigate } from 'react-router-dom'
import PopUp from '../Components/PopUp'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

function Layout() {

  return (
    <div className=' h-screen'>
      <PopUp />
      <Outlet />
    </div>
  )
}

export default Layout
