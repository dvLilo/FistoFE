import React from 'react'

import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'

import FistoProvider from './contexts/FistoContext'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'


const Dashboard = () => {
  return (
    <React.Fragment>
      <Sidebar />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: '100vh' }}>
        <Navbar />
        <FistoProvider>
          <Outlet />
        </FistoProvider>
      </Box>
    </React.Fragment>
  )
}

export default Dashboard
