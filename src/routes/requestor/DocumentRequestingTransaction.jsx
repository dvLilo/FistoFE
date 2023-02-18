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
import AccountTitleDialog from '../../components/AccountTitleDialog'
import ChequeEntryDialog from '../../components/ChequeEntryDialog'

const DocumentRequestingTransaction = (props) => {

  const {
    transaction = null,
    open = false,
    onBack = () => { },
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

  const [viewAccountTitle, setViewAccountTitle] = React.useState({
    open: false,
    state: "file-file",
    transaction: null,
    onBack: undefined,
    onClose: () => setViewAccountTitle(currentValue => ({
      ...currentValue,
      open: false,
    }))
  })

  const [viewCheque, setViewCheque] = React.useState({
    open: false,
    state: "file-file",
    transaction: null,
    onBack: undefined,
    onClose: () => setViewCheque(currentValue => ({
      ...currentValue,
      open: false,
    }))
  })

  const onAccountTitleView = () => {
    onClose()

    setViewAccountTitle(currentValue => ({
      ...currentValue,
      transaction,
      open: true,
      onBack: onBack
    }))
  }

  const onChequeView = () => {
    onClose()

    setViewCheque(currentValue => ({
      ...currentValue,
      transaction,
      open: true,
      onBack: onBack
    }))
  }

  return (
    <React.Fragment>
      <Dialog
        className="FstoDialogTransaction-root"
        open={open}
        maxWidth="lg"
        scroll="body"
        PaperProps={{
          className: "FstoPaperTransaction-root"
        }}
        // onClose={onClose}
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
          <TransactionDialog data={data} status={status} onAccountTitleView={onAccountTitleView} onChequeView={onChequeView} />
        </DialogContent>
      </Dialog>

      <AccountTitleDialog
        accounts={data?.cheque?.accounts || data?.voucher?.accounts}
        {...viewAccountTitle}
      />

      <ChequeEntryDialog
        accounts={data?.cheque?.accounts || data?.voucher?.accounts}
        cheques={data?.cheque?.cheques}
        onView={onAccountTitleView}
        {...viewCheque}
      />
    </React.Fragment>
  )
}

export default DocumentRequestingTransaction