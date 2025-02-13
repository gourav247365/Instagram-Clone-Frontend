export default function Footer({ className }) {
  
  return (
    <div className={`text-[12px] lg:text-base w-full h-fit flex flex-wrap flex-col justify-evenly items-center p-2 lg:p-4 ${className} `}>
      <div className=" flex gap-x-1 flex-wrap ">
        <button className="hover:underline font-medium text-gray-500">Meta</button>
        <button className="hover:underline font-medium text-gray-500">About</button>
        <button className="hover:underline font-medium text-gray-500">Blog</button>
        <button className="hover:underline font-medium text-gray-500">Jobs</button>
        <button className="hover:underline font-medium text-gray-500">Help</button>
        <button className="hover:underline font-medium text-gray-500">API</button>
        <button className="hover:underline font-medium text-gray-500">Terms</button>
        <button className="hover:underline font-medium text-gray-500">Privacy</button>
        <button className="hover:underline font-medium text-gray-500">Location</button>
        <button className="hover:underline font-medium text-gray-500">Threads</button>
        <button className="hover:underline font-medium text-gray-500">Contact Uploading & Non-Users</button>
        <button className="hover:underline font-medium text-gray-500">Instagram Lite</button>
        <button className="hover:underline font-medium text-gray-500">Meta Verified</button>
      </div>
      <div className="font-medium">© 2024 Gourav Nagar</div>
    </div>
  )
}