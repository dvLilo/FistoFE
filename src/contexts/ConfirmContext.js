import React from 'react'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close';

export const ConfirmContext = React.createContext()

const ConfirmProvider = ({ children }) => {
  const [confirm, setConfirm] = React.useState({
    open: false,
    onConfirm: undefined
  })

  const onClose = () => setConfirm({
    open: false,
    onConfirm: undefined
  })

  return (
    <ConfirmContext.Provider value={{ setConfirm }}>
      {children}

      <Dialog
        open={confirm.open}
        maxWidth="xs"
        fullWidth
        disablePortal
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", }}>
          Confirmation
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          Are you sure you want to proceed?
        </DialogContent>

        <DialogActions disableSpacing>
          <Button
            variant="text"
            sx={{
              textTransform: "capitalize"
            }}
            onClick={onClose}
            disableElevation
          >No</Button>

          <Button
            variant="contained"
            sx={{
              marginLeft: 1,
              textTransform: "capitalize"
            }}
            onClick={() => {
              if (confirm.onConfirm) confirm.onConfirm()
              onClose()
            }}
            disableElevation
          >Yes</Button>
        </DialogActions>
      </Dialog>
    </ConfirmContext.Provider>
  )
}

export default ConfirmProvider