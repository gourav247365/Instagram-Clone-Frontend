import React,{useId} from 'react'

const Input= React.forwardRef( function Input({
    label,
    type= "text",
    className="",
    ...props

},ref ){
  const id =useId()
  return (
    <div className='w-full flex justify-center items-center'>
        {label && <label 
        className='inline-block mb-1 pl-1' 
        htmlFor={id}>
            {label}
        </label>
        }
        <input
        type={type}
        className={`  px-3 py-2 bg-white text-black outline-none focus:bg-gray-50 focus:border-gray-400 duration-200 border border-gray-300  ${className}`}
        ref={ref}
        {...props}
        id={id}
        />
    </div>
  )
})

export default Input