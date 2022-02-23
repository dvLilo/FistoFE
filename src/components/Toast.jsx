import React from 'react'

import {
  Fade,
  Snackbar,
  Alert,
  AlertTitle
} from '@mui/material'

const Toast = ({ open, onClose, title, message, severity = "success" }) => {

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      transitionDuration={{
        enter: 300,
        exit: 0
      }}
      TransitionComponent={Fade}
    >
      <Alert
        severity={severity}
        onClose={onClose}
        sx={{
          maxWidth: 270
        }}
      >
        <AlertTitle>{ title }</AlertTitle>
        { message }
      </Alert>
    </Snackbar>
  )
}

export default Toast
