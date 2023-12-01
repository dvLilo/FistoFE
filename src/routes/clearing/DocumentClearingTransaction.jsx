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
    if (open && state === `pending-clear` && !Boolean(clearData.accounts.length)) {
      const accounts = transaction?.accounts.filter((item) => item.entry.toLowerCase() === `credit`).map((item) => ({
        entry: "Debit",
        account_title: item.account_title,
        company: item.company,
        business_unit: null,
        department: item.department,
        sub_unit: null,
        location: item.location,
        amount: item.amount,
        remarks: item.remarks,
        is_default: item.is_default
      }))

      setClearData(currentValue => ({
        ...currentValue,
        accounts: [
          ...accounts,
          {
            entry: "Credit",
            account_title: transaction?.cheques?.at(0)?.bank?.account_title_two,
            company: transaction?.cheques?.at(0)?.bank?.company_two,
            business_unit: null,
            department: transaction?.cheques?.at(0)?.bank?.department_two,
            sub_unit: null,
            location: transaction?.cheques?.at(0)?.bank?.location_two,
            amount: transaction?.cheques?.at(0)?.amount,
            remarks: null,
            is_default: true
          }
        ]
      }))
    }

    if (open && state === `clear-clear` && status === `success` && !Boolean(clearData.date) && !Boolean(clearData.accounts.length)) {
      setClearData(currentValue => ({
        ...currentValue,
        date: data.clear.date,
        accounts: data.clear.accounts
      }))
    }

    // eslint-disable-next-line
  }, [open, data, status])

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
          response = await axios.post(`/api/transactions/flow/clear-cheques/${transaction.cheque_id}`, clearData)

          const { message } = response.data

          refetchData()
          clearHandler()
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
      onBack: onBack,

      // accounts: transaction?.accounts,

      ...(Boolean(state.match(/clear$/)) && {
        state: "clear-receive"
      })
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

      accounts: transaction?.accounts
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

        </DialogContent>

        <DialogActions className="FstoDialogTransaction-actions">
          <Button
            variant="contained"
            onClick={
              state === `pending-clear`
                ? onAccountTitleManage
                : submitClearHandler
            }
            disabled={
              !Boolean(clearData.date)
            }
            disableElevation
          > {state === `pending-clear` ? "Clear" : "Save"}
          </Button>
        </DialogActions>
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
        accounts={clearData.accounts}
        cheques={data?.cheque?.cheques}
        onView={onAccountTitleView}
        onClear={clearHandler}
        {...viewCheque}
      />
    </React.Fragment>
  )
}

export default DocumentClearingTransaction