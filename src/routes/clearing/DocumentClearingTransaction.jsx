import React from 'react'

import axios from 'axios'

import DateAdapter from '@mui/lab/AdapterDateFns'

import {
  Box,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Button
} from '@mui/material'

import {
  LocalizationProvider,
  DatePicker
} from '@mui/lab'

import CloseIcon from '@mui/icons-material/Close'

import useToast from '../../hooks/useToast'
import useConfirm from '../../hooks/useConfirm'
import useTransaction from '../../hooks/useTransaction'

import TransactionDialog from '../../components/TransactionDialog'
import AccountTitleDialog from '../../components/AccountTitleDialog'
import ChequeEntryDialog from '../../components/ChequeEntryDialog'

const DocumentClearingTransaction = (props) => {

  const {
    state,
    open = false,
    transaction = null,
    refetchData = () => { },
    onBack = () => { },
    onClose = () => { }
  } = props

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
    if (open && state === `clear-receive` && status === `success` && !Boolean(clearData.accounts.length)) {
      const accounts = data.cheque.account_title[0].filter((item) => item.entry.toLowerCase() === `credit`).map((item) => ({
        entry: "Debit",
        account_title: item.account_title,
        amount: item.amount,
        remarks: item.remarks
      }))

      setClearData(currentValue => ({
        ...currentValue,
        accounts
      }))
    }

    if (open && state === `clear-clear` && status === `success` && !Boolean(clearData.date) && !Boolean(clearData.accounts.length)) {
      setClearData(currentValue => ({
        ...currentValue,
        date: data.clear.date,
        accounts: data.clear.account_title[0]
      }))
    }

    // eslint-disable-next-line
  }, [open, status])

  const [clearData, setClearData] = React.useState({
    process: "clear",
    subprocess: "clear",
    date: null,
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

  const clearHandler = () => {
    setClearData(currentValue => ({
      ...currentValue,
      date: null,
      accounts: []
    }))
  }

  const closeHandler = () => {
    onClose()
    clearHandler()
  }

  const submitClearHandler = () => {
    onClose()
    confirm({
      open: true,
      wait: true,
      onConfirm: async () => {
        let response
        try {
          response = await axios.post(`/api/transactions/flow/update-transaction/${transaction.id}`, clearData)

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
            message: "Something went wrong whilst trying to save the clear details. Please try again."
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
        accounts: data.cheque.account_title[0]
      })
    }))
  }

  const onAccountTitleInsert = (data) => {
    setClearData(currentValue => ({
      ...currentValue,
      accounts: [
        ...currentValue.accounts,
        data
      ]
    }))
  }

  const onAccountTitleUpdate = (data, index) => {
    setClearData(currentValue => ({
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
    setClearData(currentValue => ({
      ...currentValue,
      accounts: [
        ...currentValue.accounts.filter((item, itemIndex) => {
          return itemIndex !== index
        })
      ]
    }))
  }


  const onChequeView = () => {
    onClose()

    setViewCheque(currentValue => ({
      ...currentValue,
      state,
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
          <TransactionDialog data={data} status={status} onAccountTitleView={onAccountTitleView} onChequeView={onChequeView} />

          {
            (state === `clear-receive` || state === `clear-clear`) &&
            <React.Fragment>
              <Divider className="FstoDividerTransaction-root" variant="middle" />

              <Box className="FstoBoxTransactionForm-root">
                <Box className="FstoBoxTransactionForm-content">
                  <LocalizationProvider dateAdapter={DateAdapter}>
                    <DatePicker
                      value={clearData.date}
                      renderInput={
                        (props) => <TextField {...props} className="FstoTextfieldForm-root" label="Date Clear" variant="outlined" size="small" onKeyPress={(e) => e.preventDefault()} fullWidth />
                      }
                      onChange={(value) => setClearData(currentValue => ({
                        ...currentValue,
                        date: new Date(value).toISOString()
                      }))}
                      showToolbar
                    />
                  </LocalizationProvider>
                </Box>
              </Box>
            </React.Fragment>
          }
        </DialogContent>

        {
          (state === `clear-receive` || state === `clear-clear`) &&
          <DialogActions className="FstoDialogTransaction-actions">
            <Button
              variant="contained"
              onClick={
                state === `clear-receive`
                  ? onAccountTitleManage
                  : submitClearHandler
              }
              disabled={
                !Boolean(clearData.date)
              }
              disableElevation
            > {state === `clear-receive` ? "Clear" : "Save"}
            </Button>
          </DialogActions>
        }
      </Dialog>

      <AccountTitleDialog
        accounts={clearData.accounts}
        onClear={clearHandler}
        onSubmit={submitClearHandler}
        onInsert={onAccountTitleInsert}
        onUpdate={onAccountTitleUpdate}
        onRemove={onAccountTitleRemove}
        {...manageAccountTitle}
      />

      <ChequeEntryDialog
        cheques={data.cheque.cheques}
        {...viewCheque}
      />
    </React.Fragment>
  )
}

export default DocumentClearingTransaction