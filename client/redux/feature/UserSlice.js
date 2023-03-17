import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import userService from '../../api/request/userService'

export const fetchCurrentUser = createAsyncThunk('users/fetchCurrentUser', () =>
  userService.getCurrentUser().then((res) => res.data.data[0])
)

const initialState = {
  user: {},
  totalBookDonation: 0,
  isAuth: false,
  loading: true,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload
      state.totalBookDonation = action.payload?.donationHistory.length
      state.isAuth = true
      state.loading = false
    },
    clearUser: (state) => {
      state.user = initialState.user
      state.totalBookDonation = initialState.totalBookDonation
      state.isAuth = initialState.isAuth
      state.loading = false
    },
    incrementTotalDonationCount: (state) => {
      state.totalBookDonation += 1
      state.loading = false
    },
    decreaseTotalDonationCount: (state) => {
      state.totalBookDonation += 1
      state.loading = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.user = action.payload
      state.isAuth = true
      state.totalBookDonation = action.payload.donationHistory.length
      state.loading = false
    })
    builder.addCase(fetchCurrentUser.rejected, (state) => {
      state.user = initialState.user
      state.isAuth = initialState.isAuth
      state.totalBookDonation = initialState.totalBookDonation
      state.loading = false
    })
  },
})

export const {
  updateUser,
  clearUser,
  incrementTotalDonationCount,
  decreaseTotalDonationCount,
} = userSlice.actions
export default userSlice.reducer
