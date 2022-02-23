import React from 'react'

import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

const Dashboard = () => {
  return (
    <>
      <Sidebar />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: '100vh' }}>
        <Navbar />
        <Outlet />
      </Box>
    </>
  )
}

export default Dashboard
