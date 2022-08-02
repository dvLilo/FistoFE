import React from 'react'

import axios from 'axios'

import {
  Box,
  TextField,
  IconButton,
  Button,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'

import { LoadingButton } from '@mui/lab'

import CloseIcon from '@mui/icons-material/CloseRounded'
import WarningIcon from '@mui/icons-material/WarningAmberRounded'

export const ReasonContext = React.createContext()

import useToast from '../hooks/useToast'
import useReasons from '../hooks/useReasons'

const ReasonContextProvider = ({ children }) => {
  return (
    <ReasonContext.Provider value={null}>
      {/* App content here */}
      {children}
    </ReasonContext.Provider>
  )
}

export default ReasonContextProvider