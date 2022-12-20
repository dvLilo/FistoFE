import React from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

import useCounterReceipt from '../../hooks/useCounterReceipt'

import TransactionDialog from '../../components/TransactionDialog'
import AccountTitleDialog from '../../components/AccountTitleDialog'
import ChequeEntryDialog from '../../components/ChequeEntryDialog'

const DocumentCounterReceiptTransaction = (props) => {

  const {
    state,
    open = false,
    transaction = null,
    onBack = () => { },
    onClose = () => { }
  } = props

  const {
    data,
    status,
    refetch: fetchTransaction
  } = useCounterReceipt(transaction?.id)

  React.useEffect(() => {
    if (open) fetchTransaction()

    // eslint-disable-next-line
  }, [open])

  const [viewAccountTitle, setViewAccountTitle] = React.useState({
    open: false,
    state: null,
    transaction: null,
    onBack: undefined,
    onClose: () => setViewAccountTitle(currentValue => ({
      ...currentValue,
      open: false,
    }))
  })

  const [viewCheque, setViewCheque] = React.useState({
    open: false,
    state: null,
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
      open: true,
      state,
      transaction,
      onBack
    }))
  }

  const onChequeView = () => {
    onClose()

    setViewCheque(currentValue => ({
      ...currentValue,
      open: true,
      state,
      transaction,
      onBack
    }))
  }

  return (
    <React.Fragment>
      <Dialog
        className="FstoDialogTransaction-root"
        open={open}
        scroll="body"
        maxWidth="lg"
        PaperProps={{
          className: "FstoPaperTransaction-root"
        }}
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
          <TransactionDialog
            data={data}
            status={status}
            onAccountTitleView={onAccountTitleView}
            onChequeView={onChequeView}
          />
        </DialogContent>
      </Dialog>

      <AccountTitleDialog
        {...viewAccountTitle}
        accounts={
          Boolean(data?.cheque)
            ? data?.cheque?.accounts
            : data?.voucher?.accounts
        }
      />

      <ChequeEntryDialog
        {...viewCheque}
        cheques={data?.cheque?.cheques}
      />
    </React.Fragment>
  )
}

export default DocumentCounterReceiptTransaction