export default function Loader({className='w-full h-full'}){
  
  return (
    <div className={`flex justify-center items-center p-4 ${className}` } >
        <div className=" w-10 h-10 sm:h-20 sm:w-20 rounded-full border-gray-200 border-2 sm:border-2 border-t-sky-500 animate-spining">
        </div>
    </div>
  )
}