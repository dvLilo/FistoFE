import React from 'react'

import { Link, useLocation } from 'react-router-dom'

import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent
} from '@mui/material'

import WarningIcon from '@mui/icons-material/WarningAmberRounded'

export const PasswordContext = React.createContext()

const PasswordContextProvider = ({ children }) => {

  const { state, pathname } = useLocation()

  return (
    <PasswordContext.Provider value={null}>
      {/* App content here */}
      {children}

      <Dialog
        className="FstoDialogPassword-root"
        open={Boolean(state) ? state.default_password : false}
        maxWidth="sm"
        PaperProps={{
          className: "FstoPaperPassword-root"
        }}
        fullWidth
        disablePortal
      >
        <DialogTitle>
          Password Change
        </DialogTitle>

        <DialogContent className="FstoDialogPassword-content">
          <WarningIcon className="FstoDialogPassword-icon" />
          <Typography variant="body1">
            This acocunt is using the default password. It is required that you change your password.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/user/change-password"
            state={{
              previous_pathname: pathname
            }}
            disableElevation
          > Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </PasswordContext.Provider>
  )
}

export default PasswordContextProvider