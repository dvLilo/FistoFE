import React from 'react'

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

import Transaction from '../../components/Transaction'

const DocumentRequestingTransaction = (props) => {

  const {
    data,
    open = false,
    onClose = () => { }
  } = props

  return (
    <Dialog
      className="FstoDialogTransaction-root"
      open={open}
      maxWidth="lg"
      scroll="body"
      PaperProps={{
        className: "FstoPaperTransaction-root"
      }}
      onClose={onClose}
      fullWidth
      disablePortal
    >
      <DialogTitle className="FstoDialogTransaction-title">
        Transaction Details
        <IconButton size="large" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="FstoDialogTransaction-content">
        <Transaction data={data} />
      </DialogContent>
    </Dialog>
  )
}

export default DocumentRequestingTransaction