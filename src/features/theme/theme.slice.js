import { createSlice } from '@reduxjs/toolkit'

const color = localStorage.getItem("color")
const defaultValue = color || "light"

export const themeSlice = createSlice({
  name: "theme",
  initialState: defaultValue,
  reducers: {
    setTheme: (_, action) => {
      return action.payload
    }
  }
})

export const { setTheme } = themeSlice.actions

export default themeSlice.reducer