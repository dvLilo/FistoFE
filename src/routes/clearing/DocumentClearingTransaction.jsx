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

import { CLEAR } from '../../constants'

import ChequeDialog from '../../components/ChequeDialog'
import AccountTitleDialog from '../../components/AccountTitleDialog'

const DocumentClearingTransaction = ({
  state,
  open = false,
  transaction = null,
  refetchData = () => { },
  onBack = () => { },
  onClose = () => { }
}) => {

  const toast = useToast()
  const confirm = useConfirm()

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
        bank_id: transaction?.bank.id,
        cheque_no: transaction?.no,
        accounts: [
          ...accounts,
          {
            entry: "Credit",
            account_title: transaction?.cheque?.bank?.account_title_two,
            company: transaction?.cheque?.bank?.company_two,
            business_unit: null,
            department: transaction?.cheque?.bank?.department_two,
            sub_unit: null,
            location: transaction?.cheque?.bank?.location_two,
            amount: transaction?.cheque?.amount,
            remarks: null,
            is_default: true
          }
        ]
      }))
    }

    if (open && state === `clear-clear` && !Boolean(clearData.date) && !Boolean(clearData.accounts.length)) {
      setClearData(currentValue => ({
        ...currentValue,
        bank_id: transaction?.bank.id,
        cheque_no: transaction?.no,
        date: transaction?.cheque.date_cleared,
        accounts: transaction?.accounts
      }))
    }

    // eslint-disable-next-line
  }, [open, transaction])

  const [clearData, setClearData] = React.useState({
    process: CLEAR,
    subprocess: CLEAR,
    bank_id: null,
    cheque_no: null,
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

  const clearHandler = () => {
    setClearData(currentValue => ({
      ...currentValue,
      bank_id: null,
      cheque_no: null,
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
          response = await axios.post(`/api/cheque/flow`, clearData)

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

      ...(Boolean(state.match(/clear$/)) && {
        state: "clear-receive"
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
          <ChequeDialog data={transaction} />

          <Divider className="FstoDividerTransaction-root" variant="middle" />

          <Box className="FstoBoxTransactionForm-root">
            <Box className="FstoBoxTransactionForm-content">
              <LocalizationProvider dateAdapter={DateAdapter}>
                <DatePicker
                  value={clearData.date}
                  maxDate={new Date()}
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
            onClick={onAccountTitleManage}
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
    </React.Fragment>
  )
}

export default DocumentClearingTransaction