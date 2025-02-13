import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './Pages/App'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import './index.css'
import Home from './Pages/Home'
import Explore from './Pages/Explore'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'
import Layout from './Pages/Layout'
import Direct from './Pages/Direct'
import Profile from './Pages/Profile'
import EditProfile from './Pages/EditProfile'
import DisplayPost from './Pages/DisplayPost'
import { Provider } from 'react-redux'
import { Store } from './store/Store'
import NotificationPage from './Pages/NotificationPage'

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<Layout />}>
    <Route path='' element={<LoginPage />} />
    <Route path='app/' element={<App />} >
      <Route path='explore' element={<Explore />} />
      <Route path='' element={<Home />} />
      <Route path='p/:postId' element={<DisplayPost />} />
      <Route path='direct/:chatId' element={<Direct />} />
      <Route path=':username' element={<Profile />} />
      <Route path='accounts/edit' element={<EditProfile />} />
      <Route path='notifications' element={<NotificationPage />} />
      <Route path='direct' element={<Direct />} />
    </Route>
    <Route path='register' element={<RegisterPage />} />
  </Route>
))

createRoot(document.getElementById('root')).render(
  <StrictMode >
    <Provider store={Store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
)
