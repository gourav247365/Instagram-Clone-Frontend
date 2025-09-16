import React, { useState } from "react"
import {
  useDispatch,
  useSelector
} from "react-redux"
import { addMoreFollowingPosts, MessagePopUp } from '../store/Slice'
import InfiniteScroll from "react-infinite-scroll-component"
import axios from "axios"
import Map from "../Components/Post"
import Loader from "../Components/Loader"

export default function Home() {
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.currentUser)
  const [page, setPage] = useState(1)
  const [more, setMore] = useState(true)
  const [error, setError] = useState('')
  const followingPosts = useSelector((state) => state.followingPosts)

  const fetchPosts = async () => {
    try {
      const lastSeen = followingPosts.length > 0 ? followingPosts[followingPosts.length - 1].createdAt : null

      const response = await axios.get(`/api/v1/posts/following?page=${page}&limit=10&lastSeen=${lastSeen}`)

      const { docs, hasMore } = response.data.data
      dispatch(addMoreFollowingPosts(docs))
      setPage(prevPage => prevPage + 1)
      setMore(hasMore);
    } catch (error) {
      setError('Error Fetching Posts')
    }
  }

  return (
    <InfiniteScroll
      style={{ overflow: 'hidden' }}
      dataLength={followingPosts?.length || 0}
      next={fetchPosts}
      hasMore={more}
      loader={<Loader className='w-full ' />}
      endMessage={<p className="text-center">No more posts to show</p>}
      className="  w-auto min-h-full  flex flex-col  justify- items-center mt-14 md:ml-14 pb-14 md:pb-0 lg:ml-64 "
    >
      <div className="min-w-full flex">
        {
          currentUser?.displayPicture && <div className="rounded-full flex flex-col items-center p-2 over">
            <img
              className="rounded-full"
              src={currentUser.displayPicture}
              alt="user"
              width="70px" />
            <h1 className="text-sm sm:text-base">Your Story</h1>
            
          </div>
        }
      </div>

      {
        !followingPosts && <Loader className="w-full h-fit" />
      }

      {
        followingPosts && followingPosts.map((post) => (
          <Map key={post._id} post={post} setWidth={true} />
        ))
      }

    </InfiniteScroll>
  )
}