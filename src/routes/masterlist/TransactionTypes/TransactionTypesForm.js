import React from 'react'

import axios from 'axios'

import {
  TextField,
  Button
} from '@mui/material'

import { LoadingButton } from '@mui/lab'

import { AccountBalanceWallet } from '@mui/icons-material'

import TransactionTypesDialog from './TransactionTypesDialog'

const TransactionTypesForm = (props) => {

  const {
    data,
    refetchData,
    toast,
    confirm
  } = props

  const [isSaving, setIsSaving] = React.useState(false)
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)

  // Form Data State
  const [transactionType, setTransactionType] = React.useState({
    name: "",
    accounts: []
  })

  const [error, setError] = React.useState({
    status: false,
    message: ""
  })

  React.useEffect(() => {
    if (data) {
      setIsUpdating(true)
      setTransactionType({
        name: data.transaction_type,
        accounts: data.accounts
      })
    }
  }, [data])

  const formClearHandler = () => {
    setIsUpdating(false)
    setError({
      status: false,
      message: null
    })
    setTransactionType({
      name: "",
      accounts: []
    })
  }

  const formSubmitHandler = (e) => {
    e.preventDefault()

    confirm({
      show: true,
      loading: false,
      onConfirm: async () => {
        confirm({
          show: false,
          loading: false,
          onConfirm: () => { }
        })
        setIsSaving(true)

        let response
        try {
          if (isUpdating)
            response = await axios.put(`/api/admin/transaction-types/${data.id}`, {
              transaction_type: transactionType.name,
              account: transactionType.accounts.map((item) => ({
                entry: item.entry,
                account_title_id: item.account_title.id,
                // company_id: item.company.id,
                // business_unit_id: null,
                // department_id: item.department.id,
                // sub_unit_id: null,
                // location_id: item.location.id
              })),
            })
          else
            response = await axios.post(`/api/admin/transaction-types`, {
              transaction_type: transactionType.name,
              account: transactionType.accounts.map((item) => ({
                entry: item.entry,
                account_title_id: item.account_title.id,
                // company_id: item.company.id,
                // business_unit_id: null,
                // department_id: item.department.id,
                // sub_unit_id: null,
                // location_id: item.location.id
              })),
            })

          toast({
            show: true,
            title: "Success",
            message: response.data.message
          })

          formClearHandler()
          refetchData() // refresh the table data
        }
        catch (error) {
          switch (error.request.status) {
            case 409:
              setError({
                status: true,
                message: error.response.data.message
              })
              break

            case 304:
              formClearHandler()
              toast({
                show: true,
                title: "Info",
                message: "Nothing has changed.",
                severity: "info"
              })
              break

            default:
              toast({
                show: true,
                title: "Error",
                message: "Something went wrong whilst saving transaction type.",
                severity: "error"
              })
          }
        }

        setIsSaving(false)
      }
    })
  }


  const accountCloseHandler = () => {
    setIsOpen(false)
  }

  const accountInsertHandler = (data) => {
    setTransactionType((currentValue) => ({
      ...currentValue,
      accounts: [
        ...currentValue.accounts,
        data
      ]
    }))
  }

  const accountUpdateHandler = (data, index) => {
    setTransactionType((currentValue) => ({
      ...currentValue,
      accounts: currentValue.accounts.map((item, i) => {
        if (i === index) return data

        return item
      })
    }))
  }

  const accountRemoveHandler = (index) => {
    setTransactionType((currentValue) => ({
      ...currentValue,
      accounts: currentValue.accounts.filter((_, i) => i !== index)
    }))
  }

  return (
    <form onSubmit={formSubmitHandler}>
      <TextField
        className="FstoTextfieldForm-root"
        label="Transaction Type"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={transactionType.name}
        helperText={error.status && error.message}
        error={error.status}
        onBlur={() => setError({
          status: false,
          message: ""
        })}
        onChange={(e) => setTransactionType((currentValue) => ({
          ...currentValue,
          name: e.target.value
        }))}
        InputLabelProps={{
          className: "FstoLabelForm-root"
        }}
        fullWidth
      />

      <Button
        variant="contained"
        color="info"
        startIcon={<AccountBalanceWallet />}
        disabled={!Boolean(transactionType.name.trim())}
        onClick={() => setIsOpen(true)}
        fullWidth
        disableElevation
      >
        Setup COA
      </Button>

      <LoadingButton
        className="FstoButtonForm-root"
        type="submit"
        variant="contained"
        loadingPosition="start"
        loading={isSaving}
        startIcon={<></>}
        disabled={
          !Boolean(transactionType.name.trim()) ||
          !Boolean(transactionType.accounts.length)
        }
        disableElevation
      >
        {
          isUpdating
            ? "Update"
            : "Save"
        }
      </LoadingButton>

      <Button
        className="FstoButtonForm-root"
        variant="outlined"
        color="error"
        onClick={formClearHandler}
        disableElevation
      >
        {
          isUpdating
            ? "Cancel"
            : "Clear"
        }
      </Button>


      <TransactionTypesDialog
        open={isOpen}
        accounts={transactionType.accounts}
        onInsert={accountInsertHandler}
        onUpdate={accountUpdateHandler}
        onRemove={accountRemoveHandler}
        onClose={accountCloseHandler}
      />
    </form>
  )
}

export default TransactionTypesForm