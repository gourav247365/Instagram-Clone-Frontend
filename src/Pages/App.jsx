import {
  useEffect,
  useState
} from 'react'
import Header from '../Components/Header'
import Navbar from '../Components/Navbar'
import Loader from '../Components/Loader'
import axios from 'axios'
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  updateCurrentUser,
  updateExplorePosts,
  updateCurrentUserPosts,
  updateFollowingPosts,
  updateChats,
  addCurrentUserPostsCount,
  addCurrentUserRelatedAccountsCount
} from '../store/Slice'
import Footer from '../Components/Footer'

function App() {
  
  const dispatch = useDispatch()
  const [Loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {

    axios.get('/api/v1/users/current-user')
      .then((res) => {
        dispatch(updateCurrentUser(res.data.data))
      })
      .catch((error) => {
        setError(error.message)
      })

    axios.get('/api/v1/users/current-user-related-accounts-count')
      .then((res) => {
        dispatch(addCurrentUserRelatedAccountsCount(res.data.data))
      })
      .catch((error) => {
        setError(error.message)
      })

    axios.get('/api/v1/posts/following').then((res) => {
      dispatch(updateFollowingPosts(res.data.data.docs))
      setLoading(false)
    })
      .catch((error) => {
        setError(error.message)
      })

    axios.get('/api/v1/chats/current-user')
      .then((res) => {
        dispatch(updateChats(res.data.data))
      })
      .catch((error) => {
        setError(error.message)
      })

    axios.get('/api/v1/posts/current')
      .then((res) => {
        dispatch(updateCurrentUserPosts(res.data.data.posts))
        dispatch(addCurrentUserPostsCount(res.data.data.postsCount))
      })
      .catch((error) => {
        setError(error.message)
      })

    axios.get('/api/v1/posts/explore')
      .then((res) => {
        dispatch(updateExplorePosts(res.data.data.docs))
      })
      .catch((error) => {
        setError(error.message)
      })

  }, [])

  if (error) {
    return (
      <>
        <Header />
        <div className=' w-full h-screen flex flex-col items-center justify-between'>
          <div>
            <h1 className='text-red-500'>Something Went Wrong</h1>
            <h1 className='text-red-500'>{error}</h1>
          </div>
          <Footer />
        </div>
      </>
    )
  }

  if (Loading) {
    return (
      <>
        <Header />
        <Loader />
      </>
    )
  }

  return (
    <div className=' h-screen md:flex '>
      <Header />
      <Navbar />
      <div className='flex w-full h-full justify-center items-center'>
        <div className='w-full h-full'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default App