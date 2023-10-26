import { createSlice } from '@reduxjs/toolkit'

export const themeSlice = createSlice({
  name: "theme",
  initialState: "light",
  reducers: {
    setTheme: (_, action) => {
      return action.payload
    }
  }
})

export const { setTheme } = themeSlice.actions

export default themeSlice.reducer