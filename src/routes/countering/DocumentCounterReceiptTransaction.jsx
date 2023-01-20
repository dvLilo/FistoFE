import React from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

import useCounterReceipt from '../../hooks/useCounterReceipt'
import useTransaction from '../../hooks/useTransaction'

import TransactionDialog from '../../components/TransactionDialog'
import AccountTitleDialog from '../../components/AccountTitleDialog'
import ChequeEntryDialog from '../../components/ChequeEntryDialog'
import CounterReceiptDialog from '../../components/CounterReceiptDialog'

const DocumentCounterReceiptTransaction = (props) => {

  const {
    state,
    open = false,
    transaction = null,
    onBack = () => { },
    onClose = () => { }
  } = props

  const {
    data: COUNTER_DATA,
    status: COUNTER_STATUS,
    refetch: fetchCounterReceipt
  } = useCounterReceipt(transaction?.id)

  const {
    data: TRANSACTION_DATA,
    status: TRANSACTION_STATUS,
    refetch: fetchTransaction
  } = useTransaction(transaction?.transaction_id)

  React.useEffect(() => {
    if (open) {
      if (transaction.transaction_id) fetchTransaction()
      else fetchCounterReceipt()
    }

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
          {
            transaction?.transaction_id !== null
            &&
            <TransactionDialog
              data={TRANSACTION_DATA}
              status={TRANSACTION_STATUS}
              onAccountTitleView={onAccountTitleView}
              onChequeView={onChequeView}
            />}

          {
            transaction?.transaction_id === null
            &&
            <CounterReceiptDialog
              data={COUNTER_DATA}
              status={COUNTER_STATUS}
            />}

        </DialogContent>
      </Dialog>

      <AccountTitleDialog
        {...viewAccountTitle}
        accounts={
          Boolean(TRANSACTION_DATA?.cheque)
            ? TRANSACTION_DATA?.cheque?.accounts
            : TRANSACTION_DATA?.voucher?.accounts
        }
      />

      <ChequeEntryDialog
        {...viewCheque}
        cheques={TRANSACTION_DATA?.cheque?.cheques}
      />
    </React.Fragment>
  )
}

export default DocumentCounterReceiptTransaction