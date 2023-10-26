import { createSlice } from '@reduxjs/toolkit'

const defaultValue = !!localStorage.getItem("token")

export const authSlice = createSlice({
  name: "auth",
  initialState: defaultValue,
  reducers: {
    authenticate: () => {
      return true
    },
    unauthenticate: () => {
      return false
    }
  }
})

export const { authenticate, unauthenticate } = authSlice.actions

export default authSlice.reducer