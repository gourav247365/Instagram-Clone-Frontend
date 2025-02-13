import { configureStore } from "@reduxjs/toolkit";
import Reducers from './Slice'

export const Store= configureStore({
  reducer: Reducers
})