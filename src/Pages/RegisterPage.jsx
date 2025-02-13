import React, { useState } from "react";
import Input from "../Components/Input";
import Footer from '../Components/Footer'
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { MessagePopUp } from "../store/Slice";

export default function RegisterPage() {
  const navigate= useNavigate()
  const {register,handleSubmit}= useForm()
  const dispatch= useDispatch()
  const [Error,setError]= useState("")

  const signup= (data)=>{
    axios.post('/api/v1/users/register',data)
    .then((res)=> {
      setTimeout(()=> dispatch(MessagePopUp({message: '',type: '',visibility: false})),2000)
      setError("")
      dispatch(MessagePopUp({message: 'User Registered Successfully continue to Login',type: '',visibility: false}))
      navigate('/')
    })
    .catch((error)=> setError(error.response.data.message))
  }

  return (
    <div className="  w-full min-h-full  flex flex-col flex-wrap  justify-between items-center gap-6  ">
      <div className="w-96 h-[600px] flex flex-col  justify-evenly items-center  border-gray-200 sm:border-2 mt-2 sm:mt-20">
        <h1 className="font-lobster text-4xl sm:text-5xl font-thin  ">Instagram</h1>
        <div className="w-3/5 text-center text-gray-400 font-bold">Sign up to see photos and videos from your friends.</div>
        <button className="bg-sky-500 text-white w-2/3 font-bold rounded-md py-1 sm:py-2 ">ⓕ Login with Facebook</button>
        <h1 className="text-gray-500 text-sm">----------------------- OR -----------------------</h1>
        <form 
          onSubmit={handleSubmit(signup)} 
          className=" w-full flex flex-col justify-center items-center gap-4"
        >
          <Input 
            placeholder='Email Id' 
            className="w-2/3" 
            {...register('email',{required: true})} 
          />
          <Input 
            placeholder='Full Name' 
            className="w-2/3" 
            {...register('fullname',{required: true})} 
          />
          <Input 
            placeholder='Username' 
            className="w-2/3 " 
            {...register('username',{required: true})} 
          />
          <Input 
            placeholder='Password' 
            type='password' 
            className="w-2/3" 
            {...register('password',{required: true})} 
          />
          <h1 className="text-[#E71C23] md:font-medium text-sm">{Error}</h1>
          <button 
            className="bg-sky-400 text-white w-2/3 font-bold rounded-md py-1 sm:py-2" 
            type="submit"
          >Sign Up</button>
        </form>
      </div>
      <div className=" w-96 text-center text-gray-500 font-medium border-gray-200 sm:border-2 p-2 ">
        Already have an Account ? <Link to="/" className=" hover:underline text-sky-500 font-medium"> Log in</Link>
      </div>
      <Footer />
    </div>
  )
}