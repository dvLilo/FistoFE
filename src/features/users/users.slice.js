import CryptoJS from 'crypto-js'

import { createSlice } from '@reduxjs/toolkit'

const user = localStorage.getItem("user")
const defaultValue = !!user && JSON.parse(CryptoJS.AES.decrypt(user, process.env.REACT_APP_SECRET_KEY).toString(CryptoJS.enc.Utf8))

export const userSlice = createSlice({
  name: "user",
  initialState: defaultValue,
  reducers: {
    setUserDetails: (_, action) => {
      return action.payload
    },
    clearUserDetails: () => {
      return null
    }
  }
})

export const { setUserDetails, clearUserDetails } = userSlice.actions

export default userSlice.reducer