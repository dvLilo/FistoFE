import React from 'react'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,

  Fade,
  Snackbar,
  Alert,
  AlertTitle
} from '@mui/material'

import { LoadingButton } from '@mui/lab'

import CloseIcon from '@mui/icons-material/Close'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'

export const FistoContext = React.createContext()

const FistoProvider = ({ children }) => {
  const [dialog, setDialog] = React.useState({
    open: false,
    wait: false,
    loading: false,
    onConfirm: undefined
  })

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    duration: 5000,
    severity: "success",
    title: "",
    message: "",
  })

  const onCloseDialog = () => {
    setDialog(currentValue => ({
      ...currentValue,
      open: false,
      loading: false,
      await: false
    }))
  }

  const onCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return

    setSnackbar(currentValue => ({
      ...currentValue,
      open: false
    }))
  }

  const confirm = (params) => {
    const {
      open = true,
      wait = false,
      onConfirm = () => { }
    } = params

    setDialog(currentValue => ({
      ...currentValue,
      open,
      wait,
      onConfirm
    }))
  }

  const toast = (params) => {
    const {
      open = true,
      duration = 5000,
      severity = "success",
      title = "",
      message = ""
    } = params

    setSnackbar(currentValue => ({
      ...currentValue,
      open,
      duration,
      severity,
      title,
      message
    }))
  }

  return (
    <FistoContext.Provider value={{ confirm, toast }}>
      {/* App content here */}
      {children}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.duration}
        onClose={onCloseSnackbar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        transitionDuration={{
          enter: 300,
          exit: 300
        }}
        TransitionComponent={Fade}
      >
        <Alert
          severity={snackbar.severity}
          onClose={onCloseSnackbar}
          sx={{
            maxWidth: 270
          }}
        >
          <AlertTitle>{snackbar.title}</AlertTitle>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={dialog.open}
        disablePortal
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700 }}>
          Confirmation
          <IconButton size="small" onClick={onCloseDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: "flex", alignItems: "center", paddingLeft: 5, paddingRight: 5 }}>
          <WarningAmberRoundedIcon sx={{ marginRight: 2, fontSize: "3em" }} />
          Are you sure you want to proceed?
        </DialogContent>

        <DialogActions sx={{ marginRight: 2 }}>
          <Button
            variant="text"
            sx={{
              textTransform: "capitalize"
            }}
            onClick={onCloseDialog}
            disableElevation
          >No</Button>

          <LoadingButton
            variant="contained"
            loadingPosition="start"
            loading={dialog.loading}
            startIcon={<></>}
            sx={{
              marginLeft: 1,
              textTransform: "capitalize",

              "& .MuiLoadingButton-loadingIndicator": {
                left: 6
              }
            }}
            onClick={async () => {
              if (dialog.onConfirm) {
                setDialog(currentValue => ({
                  ...currentValue,
                  loading: true
                }))

                if (dialog.wait) await dialog.onConfirm()
                else dialog.onConfirm()
              }
              onCloseDialog()
            }}
            disableElevation
          >Yes</LoadingButton>
        </DialogActions>
      </Dialog>
    </FistoContext.Provider>
  )
}

export default FistoProvider