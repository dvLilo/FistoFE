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

import { WarningAmberRounded as WarningIcon } from '@mui/icons-material'

const UserAccountsPassword = () => {
  const { state } = useLocation()

  return (
    <Dialog
      open={Boolean(state) ? state.default_password : false}
      maxWidth="sm"
      fullWidth
      disablePortal
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        Password Change
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "row", alignItems: "center", paddingX: 4 }}>
        <WarningIcon sx={{ marginRight: 2, fontSize: "3.25em" }} />
        <Typography variant="body1">This acocunt is using the default password. It is required that you change your password.</Typography>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color="primary" to="/user/change-password" component={Link} sx={{ textTransform: "capitalize" }} disableElevation>Change Password</Button>
      </DialogActions>
    </Dialog>
  )
}

export default UserAccountsPassword