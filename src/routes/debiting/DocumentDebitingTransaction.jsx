import React from 'react'

import axios from 'axios'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

import useToast from '../../hooks/useToast'
import useConfirm from '../../hooks/useConfirm'
import useTransaction from '../../hooks/useTransaction'

import {
  DEBIT,
  FILE
} from '../../constants'

import TransactionDialog from '../../components/TransactionDialog'
import AccountTitleDialog from '../../components/AccountTitleDialog'

const DocumentDebitingTransaction = ({
  state,
  open = false,
  transaction = null,
  refetchData = () => { },
  // onHold = () => { },
  // onUnhold = () => { },
  // onReturn = () => { },
  // onVoid = () => { },
  onBack = () => { },
  onClose = () => { }
}) => {

  const toast = useToast()
  const confirm = useConfirm()

  const {
    data,
    status,
    refetch: fetchTransaction
  } = useTransaction(transaction?.id)

  React.useEffect(() => {
    if (open) fetchTransaction()

    // eslint-disable-next-line
  }, [open])

  React.useEffect(() => {
    if (open && state === `debit-receive` && status === `success` && !Boolean(fileData.accounts.length)) {
      const accounts = data.voucher.accounts.filter((item) => item.entry.toLowerCase() === `credit`).map((item) => ({
        entry: "Debit",
        account_title: item.account_title,
        amount: item.amount,
        remarks: item.remarks
      }))

      setFileData(currentValue => ({
        ...currentValue,
        accounts
      }))
    }

    if (open && state === `debit-debit` && status === `success` && !Boolean(fileData.accounts.length)) {
      setFileData(currentValue => ({
        ...currentValue,
        accounts: data.debit.accounts
      }))
    }

    // eslint-disable-next-line
  }, [open, data, status])

  const [fileData, setFileData] = React.useState({
    process: DEBIT,
    subprocess: FILE,
    accounts: []
  })

  const [manageAccountTitle, setManageAccountTitle] = React.useState({
    open: false,
    state: null,
    transaction: null,
    onBack: undefined,
    onClose: () => setManageAccountTitle(currentValue => {
      const { accounts, ...remainingItems } = currentValue

      return ({
        ...remainingItems,
        open: false,
      })
    })
  })

  const clearHandler = () => {
    setFileData(currentValue => ({
      ...currentValue,
      accounts: []
    }))
  }

  const closeHandler = () => {
    onClose()
    clearHandler()
  }

  const submitDebitHandler = () => {
    onClose()
    confirm({
      open: true,
      wait: true,
      onConfirm: async () => {
        let response
        try {
          response = await axios.post(`/api/transactions/flow/update-transaction/${transaction.id}`, fileData)

          const { message } = response.data

          refetchData()
          toast({
            message,
            title: "Success!"
          })
        }
        catch (error) {
          console.log("Fisto Error Status", error.request)

          toast({
            severity: "error",
            title: "Error!",
            message: "Something went wrong whilst trying to save the transmittal details. Please try again."
          })
        }
      }
    })
  }

  const onAccountTitleManage = () => {
    onClose()

    setManageAccountTitle(currentValue => ({
      ...currentValue,
      state,
      transaction,
      open: true,
      onBack: onBack
    }))
  }

  const onAccountTitleView = () => {
    onClose()

    setManageAccountTitle(currentValue => ({
      ...currentValue,
      state,
      transaction,
      open: true,
      onBack: onBack,

      ...(Boolean(state.match(/-receive.*/)) && {
        state: "transmit-",
        accounts: data.voucher.accounts
      })
    }))
  }

  const onAccountTitleInsert = (data) => {
    setFileData(currentValue => ({
      ...currentValue,
      accounts: [
        ...currentValue.accounts,
        data
      ]
    }))
  }

  const onAccountTitleUpdate = (data, index) => {
    setFileData(currentValue => ({
      ...currentValue,
      accounts: [
        ...currentValue.accounts.map((item, itemIndex) => {
          if (itemIndex === index) return data
          return item
        })
      ]
    }))
  }

  const onAccountTitleRemove = (index) => {
    setFileData(currentValue => ({
      ...currentValue,
      accounts: [
        ...currentValue.accounts.filter((item, itemIndex) => {
          return itemIndex !== index
        })
      ]
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
          <IconButton size="large" onClick={closeHandler}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent className="FstoDialogTransaction-content">
          <TransactionDialog data={data} status={status} onAccountTitleView={onAccountTitleView} />
        </DialogContent>

        {
          state === `debit-receive` &&
          <DialogActions className="FstoDialogTransaction-actions">
            <Button
              variant="contained"
              onClick={
                state === `debit-receive`
                  ? onAccountTitleManage
                  : submitDebitHandler
              }
              disableElevation
            > {state === `debit-receive` ? "File" : "Save"}
            </Button>
          </DialogActions>
        }
      </Dialog>

      <AccountTitleDialog
        accounts={fileData.accounts}
        onClear={clearHandler}
        onSubmit={submitDebitHandler}
        onInsert={onAccountTitleInsert}
        onUpdate={onAccountTitleUpdate}
        onRemove={onAccountTitleRemove}
        {...manageAccountTitle}
      />
    </React.Fragment>
  )
}

export default DocumentDebitingTransaction