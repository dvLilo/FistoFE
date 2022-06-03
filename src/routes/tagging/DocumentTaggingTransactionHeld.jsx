import React from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

import useConfirm from '../../hooks/useConfirm'

import Transaction from '../../components/Transaction'

const DocumentTaggingTransactionHeld = (props) => {

  const confirm = useConfirm()

  const {
    data,
    open = false,
    onClose = () => { }
  } = props

  const submitUnholdHandler = () => {
    onClose()

    confirm({
      open: true,
      wait: true,
      onConfirm: () => console.log(`${data.transaction_id} has been unhold.`)
    })
  }

  const submitVoidHandler = () => {
    onClose()

    confirm({
      open: true,
      wait: true,
      onConfirm: () => console.log(`${data.transaction_id} has been voided.`)
    })
  }

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

      <DialogActions>
        <Button
          className="FstoButtonForm-root"
          variant="contained"
          onClick={submitUnholdHandler}
          disableElevation
        > Unhold
        </Button>

        <Button
          className="FstoButtonForm-root"
          variant="outlined"
          color="error"
          onClick={submitVoidHandler}
          disableElevation
        > Void
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DocumentTaggingTransactionHeld