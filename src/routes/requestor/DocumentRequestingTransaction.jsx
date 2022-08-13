import React from 'react'

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

import useTransaction from '../../hooks/useTransaction'

import TransactionDialog from '../../components/TransactionDialog'

const DocumentRequestingTransaction = (props) => {

  const {
    transaction = null,
    open = false,
    onClose = () => { }
  } = props

  const {
    refetch,
    data,
    status
  } = useTransaction(transaction?.id)

  React.useEffect(() => {
    if (open) refetch()

    // eslint-disable-next-line
  }, [open])

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
        <TransactionDialog data={data} status={status} />
      </DialogContent>
    </Dialog>
  )
}

export default DocumentRequestingTransaction