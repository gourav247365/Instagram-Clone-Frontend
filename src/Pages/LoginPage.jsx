import React, { useEffect, useState } from "react";
import Input from "../Components/Input";
import { useNavigate, Link } from 'react-router-dom'
import Footer from "../Components/Footer";
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useDispatch } from "react-redux";
import { MessagePopUp, updateCurrentUser } from "../store/Slice";

export default function LoginPage() {
  const dispatch = useDispatch()
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [eye, setEye] = useState(false)
  const [Error, setError] = useState("")
  
  const login = (data) => {
    axios.post('/api/v1/users/login', data)
      .then((res) => {
        dispatch(updateCurrentUser(res.data.data.user))
        setTimeout(()=> dispatch(MessagePopUp({visibility: false,message: '', type: ''})),3000)
        dispatch(MessagePopUp({visibility: true,message: 'User Logged In Successfully', type: 'success'}))
        setError("")
        navigate('/app')
      })
      .catch((error) => {        
        setError(error.response?.data?.message || 'Something Went Wrong')
      })
  }

  useEffect(()=>{
    axios.post("/api/v1/users/refresh-token")
    .then((res)=>{
      navigate("/app")
    })
  },[])

  return (
    <div className=" w-full min-h-full flex flex-col justify-between items-center">
      <div className=" flex justify-center items-center gap-6 mt-5 sm:mt-20">
        <div className="bg-center w-96 h-[600px] hidden  lg:flex flex-col  justify-evenly items-center  border-gray-200 border-2 bg-[url(https://img.freepik.com/premium-vector/instagram-home-page-interface-with-smartphone-vector-post-mockup_536326-779.jpg)]  "
        ></div>
        <div className="h-[600px] flex flex-col justify-between items-center">
          <div className="w-96 h-[500px] flex flex-col  justify-evenly items-center  border-gray-200 sm:border-2  ">
            <h1 className="font-lobster text-4xl sm:text-5xl font-thin  my-2">Instagram</h1>
            <form
              className=" w-full flex flex-col justify-center items-center gap-4"
              onSubmit={handleSubmit(login)}
            >
              <Input
                placeholder='Username'
                className="w-2/3 "
                {...register('username', { required: true })}
              />
              <div className="flex w-96 relative border-gray-300">
                <Input
                  placeholder='Password'
                  type={`${showPassword ? 'text' : 'password'}`}
                  className="w-2/3"
                  {...register('password', { required: true })}
                  onChange={(e) => {
                    if (e.target.value) {
                      setEye(true)
                    }
                    else {
                      setEye(false)
                    }
                  }}
                />
                <button
                  type="button"
                  className={`absolute right-[73px] inset-y-0 ${eye ? '' : 'hidden'}`}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setShowPassword((cur) => !cur)
                  }}
                >
                  <img
                    src={`${showPassword ? 'https://res.cloudinary.com/dmxjulnzo/image/upload/v1728640105/Screenshot_from_2024-10-11_15-15-37_nmt18l.png' : 'https://res.cloudinary.com/dmxjulnzo/image/upload/v1728640105/Screenshot_from_2024-10-11_15-16-15_tve073.png'}`}
                    width='20px'
                  />
                </button>
              </div>
              <button
                className="bg-sky-400 text-white font-bold w-2/3 rounded-md py-1 sm:py-2"
                type="submit"
              >Log In</button>
            </form>
            <h1 className="text-[#E71C23] md:font-medium text-sm">{Error}</h1>
            <h1 className="text-gray-500 text-sm">----------------------- OR -----------------------</h1>
            <div className="flex flex-col w-full items-center gap-3">
              <button className="bg-sky-500 text-white w-2/3 font-bold rounded-md py-1 sm:py-2">ⓕ Login with Facebook</button>
              <button className="hover:underline text-sky-500 font-medium ">forgot password?</button>
            </div>
          </div>
          <div className=" w-96 text-center text-gray-500  border-gray-200 sm:border-2 p-2  font-medium">
            Don't have an Account ? <Link to="/register" className=" hover:underline text-sky-500 font-medium"> Sign Up</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}