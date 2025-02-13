import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  popup: {
    message: '',
    visibility: false,
    type: ''
  },
  currentUser: {},
  currentUserPosts: [],
  explorePosts: null,
  profilePosts: null,
  postIndex: 0,
  useDisplayFor: "explore",
  followingPosts: null,
  chats: []
}
export const Slice = createSlice({
  name: 'Instagram',
  initialState,
  reducers: {
    MessagePopUp: (state, action) => {
      state.popup.visibility = action.payload.visibility
      state.popup.message = action.payload.message
      state.popup.type = action.payload.type
    },
    updateCurrentUser: (state, action) => {
      state.currentUser = action.payload
    },
    addCurrentUserRelatedAccountsCount: (state,action)=> {
      state.currentUser.followersCount= action.payload.followersCount
      state.currentUser.followingsCount= action.payload.followingsCount
    },
    updateExplorePosts: (state, action) => {
      state.explorePosts = action.payload
    },
    updateCurrentUserPosts: (state, action) => {
      state.currentUserPosts = action.payload
    },
    updateCurrentUserFollowings: (state, action) => {
      state.currentUserFollowings = action.payload
    },
    updateCurrentUserFollowers: (state, action) => {
      state.currentUserFollowers = action.payload
    },
    updateProfilePosts: (state, action) => {
      state.profilePosts = action.payload
    },
    updatePostIndex: (state, action) => {
      state.postIndex = action.payload
    },
    updateUseDisplayFor: (state, action) => {
      state.useDisplayFor = action.payload
    },
    updateFollowingPosts: (state, action) => {
      state.followingPosts = action.payload
    },
    addMoreFollowingPosts: (state, action) => {
      state.followingPosts.push(...action.payload)
    },
    addMoreExplorePosts: (state, action) => {
      state.explorePosts.push(...action.payload)
    },
    addMoreCurrentUserPosts: (state, action) => {
      state.currentUserPosts.push(...action.payload)
    },
    addMoreProfilePosts: (state,action)=> {
      state.profilePosts.push(...action.payload)
    },
    addNewPost: (state, action) => {
      state.currentUserPosts.unshift(action.payload)
      state.followingPosts.unshift(action.payload)
    },
    addNewFollowingPost: (state, action) => {
      state.followingPosts.unshift(action.payload)
    },
    removePost: (state, action) => {
      const index = state.currentUserPosts.indexOf(action.payload)
      const x = state.currentUserPosts.splice(index, 1)
    },
    updateChats: (state,action)=> {
      state.chats= action.payload
    },
    addNewChat: (state,action)=> {
      let flag=0
      state.chats.map((chat)=> {
        if(chat._id === action.payload._id)
          flag=1
      })
      if(flag === 0)
        state.chats.unshift(action.payload)
    },
    addCurrentUserPostsCount: (state,action)=> {
      state.currentUser.postsCount= action.payload
    },
    setNewLastMessage: (state,action)=> {
      state.chats.forEach((chat)=> {
        if(chat._id === action.payload.chatId) {
          chat.lastMessage= action.payload
        }
      })
    },
    togglePrivacy: (state)=> {
      state.currentUser.isPrivate= !state.currentUser.isPrivate
    },
    updateUserField: (state,action)=> {
      state.currentUser[action.payload.field]= action.payload.value
    },
  },
  
})

export const { 
  MessagePopUp,
  updateCurrentUser, 
  updateExplorePosts, 
  updateCurrentUserPosts, 
  updateCurrentUserFollowings, 
  updateCurrentUserFollowers, 
  updateProfilePosts, 
  updatePostIndex, 
  updateUseDisplayFor, 
  updateFollowingPosts, 
  addMoreExplorePosts, 
  addMoreFollowingPosts, 
  addMoreCurrentUserPosts, 
  addNewPost, 
  addNewFollowingPost,
  removePost ,
  updateChats,
  addNewChat,
  addCurrentUserPostsCount,
  addCurrentUserRelatedAccountsCount,
  setNewLastMessage,
  togglePrivacy,
  updateUserField,
  addMoreProfilePosts
} = Slice.actions

export default Slice.reducer