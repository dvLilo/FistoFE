import React from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

import Transaction from '../../components/Transaction'

const DocumentTaggingTransactionVoided = (props) => {

  const {
    data,
    open = false,
    onClose = () => { }
  } = props

  return (
    <Dialog
      className="FstoDialogTransaction-root"
      open={open}
      scroll="body"
      maxWidth="lg"
      PaperProps={{
        className: "FstoPaperTransaction-root"
      }}
      onClose={onClose}
      fullWidth
      disablePortal
    >
      <DialogTitle className="FstoDialogTransaction-title">
        Transaction
        <IconButton size="large" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="FstoDialogTransaction-body">
        <Transaction data={data} />
      </DialogContent>
    </Dialog>
  )
}

export default DocumentTaggingTransactionVoided