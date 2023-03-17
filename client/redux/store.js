import {configureStore} from '@reduxjs/toolkit'
import userReducer from './feature/UserSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
})
