import { createSlice } from '@reduxjs/toolkit'

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: false,
  reducers: {
    showSidebar: () => {
      return true
    },
    hideSidebar: () => {
      return false
    },
    toggleSidebar: (state) => {
      return !state
    }
  }
})

export const { showSidebar, hideSidebar, toggleSidebar } = sidebarSlice.actions

export default sidebarSlice.reducer