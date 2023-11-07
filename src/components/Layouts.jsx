import React from 'react'

import { Outlet } from 'react-router-dom'


import Box from '@mui/material/Box'

import Navbar from './Navbar'
import Sidebar from './Sidebar'

import FistoProvider from '../contexts/FistoContext'
import ConfirmProvider from '../contexts/ConfirmContext'
import ReasonProvider from '../contexts/ReasonContext'

const Layouts = () => {
  return (
    <React.Fragment>
      <Sidebar />
      <Box className="fsto">
        <Navbar />
        <FistoProvider>
          <ConfirmProvider>
            <ReasonProvider>
              <Outlet />
            </ReasonProvider>
          </ConfirmProvider>
        </FistoProvider>
      </Box>
    </React.Fragment>
  )
}

export default Layouts