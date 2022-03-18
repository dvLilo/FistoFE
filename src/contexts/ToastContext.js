import React, { createContext, useState } from 'react'

import {
  Fade,
  Snackbar,
  Alert,
  AlertTitle
} from '@mui/material'

export const ToastContext = createContext()

const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    open: false,
    severity: "success",
    title: "",
    message: ""
  })

  const onClose = () => setToast({
    ...toast,
    open: false
  })

  return (
    <ToastContext.Provider value={{ setToast }}>
      {children}
      <Snackbar
        open={toast.open}
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
          severity={toast.severity}
          onClose={onClose}
          sx={{
            maxWidth: 270
          }}
        >
          <AlertTitle>{toast.title}</AlertTitle>
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  )
}

export default ToastProvider