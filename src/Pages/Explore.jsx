import React, { useState } from "react";
import Footer from '../Components/Footer'
import InfiniteScroll from 'react-infinite-scroll-component'
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useDispatch,useSelector} from "react-redux";
import {
  updatePostIndex,
  updateUseDisplayFor,
  addMoreExplorePosts
} from "../store/Slice";
import Loader from "../Components/Loader";

export default function Explore() {
  const posts = useSelector((state) => state.explorePosts)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [page, setPage] = useState(2)
  const [hasMore, setHasMore] = useState(true)
  const [searchResult, setSearchResult] = useState([])

  const fetchPosts = async () => {
    try {
      setLoadingPosts(true)
      const response = await axios.get(`/api/v1/posts/explore?page=${page}&limit=20`);
      const { docs, hasNextPage } = response.data.data;
      const existingIds = new Set(posts.map(post => post._id))
      const uniquePosts = docs.filter(post => !existingIds.has(post._id))
      dispatch(addMoreExplorePosts(uniquePosts))
      setPage(page + 1)
      setHasMore(hasNextPage)
      setLoadingPosts(false)
    } catch (error) {
      setLoadingPosts(false)
      setError('Error Fetching Posts')
    }
  }

  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <div className=" w-auto h-fit flex flex-col items-center mt-14 md:mt-4 md:ml-14 lg:ml-64 pb-14 md:pb-0 "> 
      <div className="w-full max-w-[71rem] bg-gray-50 flex justify-center p-4 md:p-6 rounded-md relative m-2" >
        <input type="text" placeholder="Search ⌕" className="w-full  rounded-md border-2 px-2 border-gray-300 focus:outline-none" onChange={(e) => {

          axios.get(`/api/v1/users/search?value=${e.target.value}`)
            .then((res) => {
              setSearchResult(res.data.data)
            })
        }} />

        <div className="absolute top-16 md:top-[94px] bg-white w-full flex flex-col items-center  ">
          {
            searchResult.length > 0 && searchResult.map((user) => (
              <div key={user._id} className="flex w-11/12 max-w-96 items-center border-[1px] border-gray-200 p-1 m-1" onClick={() => navigate(`/app/${user.username}`)}>
                <img src={user.displayPicture} alt="" className="rounded-full w-10 h-10  sm:w-12 sm:h-12" />
                <div className="p-1">
                  <h1 className="font-medium text-sm">{user.username}</h1>
                  <h1 className="text-sm">{user.fullname}</h1>
                </div>
              </div>
            ))
          }
        </div>
      </div>
      <InfiniteScroll
        dataLength={posts?.length || 0}
        next={fetchPosts}
        hasMore={hasMore}
        className=" h-fit w-full grid grid-cols-3 grid-rows-5 auto-cols-fr auto-rows-fr max-w-[72rem] md:p-2 " >
        {
          posts && posts.map((post, index) => (
            <div
              key={post._id}
              onClick={() => {
                dispatch(updatePostIndex(index))
                dispatch(updateUseDisplayFor("explore"))
                navigate(`/app/p/${post._id}`,)
              }}
              className={` w-[1/3fr] max-w-96 ${(index) % 10 === 2 || (index) % 10 === 5 ? "row-span-2" : "aspect-square max-h-96"} flex justify-center overflow-visible hover: transition-all  duration-300 hover:border-[#4B60FF] hover:scale-[102%] border-white border-[1px] p-[.5px] sm:p-[1px] `}>
              <img
                className="object-cover w-full "
                src={post.postFile}
                alt="post"
              />
            </div>
          ))

        }
      </InfiniteScroll>
      
      {
      (loadingPosts || !posts) && <Loader className='w-full h-fit ' />
      }

      <Footer />
    </div>
  )
}