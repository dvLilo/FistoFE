import React from 'react'

import { Outlet } from 'react-router-dom'


import Box from '@mui/material/Box'

import Navbar from './Navbar'
import Sidebar from './Sidebar'

import FistoProvider from '../contexts/FistoContext'
import ConfirmProvider from '../contexts/ConfirmContext'

const Layouts = () => {
  return (
    <React.Fragment>
      <Sidebar />
      <Box className="fsto">
        <Navbar />
        <FistoProvider>
          <ConfirmProvider>
            <Outlet />
          </ConfirmProvider>
        </FistoProvider>
      </Box>
    </React.Fragment>
  )
}

export default Layouts