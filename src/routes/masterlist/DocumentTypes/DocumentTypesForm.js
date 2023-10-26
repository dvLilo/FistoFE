import React from 'react'

import axios from 'axios'

import {
  Paper,
  Autocomplete,
  TextField,
  Button
} from '@mui/material'

import { LoadingButton } from '@mui/lab'

import { AccountBalanceWallet } from '@mui/icons-material'

import DocumentTypesDialog from './DocumentTypesDialog'

const DocumentTypesForm = (props) => {

  const {
    data,
    refetchData,
    toast,
    confirm
  } = props

  const [isSaving, setIsSaving] = React.useState(false)

  const [isUpdating, setIsUpdating] = React.useState(false)

  const [isOpen, setIsOpen] = React.useState(false)

  const [error, setError] = React.useState({
    status: false,
    message: ""
  })

  // Dropdown Array
  const [dropdown, setDropdown] = React.useState({
    isFetching: false,
    categories: []
  })

  // Form Data State
  const [document, setDocument] = React.useState({
    type: "",
    description: "",
    categories: [],
    accounts: []
  })

  React.useEffect(() => {
    if (data) {
      setIsUpdating(true)
      setDocument({
        type: data.type,
        description: data.description,
        categories: data.categories,
        accounts: data.accounts
      })
    }
  }, [data])

  React.useEffect(() => {
    (async () => {
      setDropdown(currentValue => ({
        ...currentValue,
        isFetching: true
      }))

      let response
      try {
        response = await axios.get(`/api/admin/dropdown/category`)

        const {
          categories
        } = response.data.result

        setDropdown(currentValue => ({
          isFetching: false,
          categories
        }))
      }
      catch (error) {
        if (error.request.status !== 404) {
          toast({
            show: true,
            title: "Error",
            message: "Something went wrong whilst fetching document types dropdown list.",
            severity: "error"
          })
        }

        setDropdown(currentValue => ({
          isFetching: false,
          categories: []
        }))

        console.log("Fisto Error Details: ", error.request)
      }
    })()
    // eslint-disable-next-line
  }, [])

  const formClearHandler = () => {
    setIsUpdating(false)
    setError({
      status: false,
      message: null
    })
    setDocument({
      type: "",
      description: "",
      categories: []
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
            response = await axios.put(`/api/admin/documents/${data.id}`, {
              type: document.type,
              description: document.description,
              categories: document.categories.map(cat => cat.id),
              account: document.accounts.map(act => ({
                entry: act.entry,
                account_title_id: act.account_title.id,
                company_id: act.company.id,
                department_id: act.department.id,
                location_id: act.location.id,
              }))
            })
          else
            response = await axios.post(`/api/admin/documents`, {
              type: document.type,
              description: document.description,
              categories: document.categories.map(cat => cat.id),
              account: document.accounts.map(act => ({
                entry: act.entry,
                account_title_id: act.account_title.id,
                company_id: act.company.id,
                department_id: act.department.id,
                location_id: act.location.id,
              }))
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
                message: "Something went wrong whilst saving document type.",
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
    setDocument((currentValue) => ({
      ...currentValue,
      accounts: [
        ...currentValue.accounts,
        data
      ]
    }))
  }

  const accountUpdateHandler = (data, index) => {
    setDocument((currentValue) => ({
      ...currentValue,
      accounts: currentValue.accounts.map((item, i) => {
        if (i === index) return data

        return item
      })
    }))
  }

  const accountRemoveHandler = (index) => {
    setDocument((currentValue) => ({
      ...currentValue,
      accounts: currentValue.accounts.filter((_, i) => i !== index)
    }))
  }

  return (
    <form onSubmit={formSubmitHandler}>
      <TextField
        className="FstoTextfieldForm-root"
        label="Document Type"
        size="small"
        variant="outlined"
        autoComplete="off"
        value={document.type}
        error={error.status}
        helperText={error.status && error.message}
        InputLabelProps={{
          className: "FstoLabelForm-root"
        }}
        onBlur={() => setError({
          status: false,
          message: ""
        })}
        onChange={(e) => setDocument({
          ...document,
          type: e.target.value
        })}
        fullWidth
      />

      <TextField
        className="FstoTextfieldForm-root"
        label="Description"
        size="small"
        variant="outlined"
        autoComplete="off"
        value={document.description}
        InputLabelProps={{
          className: "FstoLabelForm-root"
        }}
        onChange={(e) => setDocument({
          ...document,
          description: e.target.value
        })}
        fullWidth
      />

      <Autocomplete
        className="FstoSelectForm-root"
        size="small"
        options={dropdown.categories}
        value={document.categories}
        renderInput={
          props =>
            <TextField
              {...props}
              variant="outlined"
              label="Category"
              error={!Boolean(dropdown.categories.length) && !dropdown.isFetching}
              helperText={!Boolean(dropdown.categories.length) && !dropdown.isFetching && "No categories found."}
            />
        }
        PaperComponent={
          props =>
            <Paper
              {...props}
              sx={{ textTransform: 'capitalize' }}
            />
        }
        getOptionLabel={
          option => option.name
        }
        isOptionEqualToValue={
          (option, value) => option.id === value.id
        }
        onChange={
          (e, value) => {
            setDocument({
              ...document,
              categories: value
            })
          }
        }
        fullWidth
        multiple
        disablePortal
        disableClearable
        disableCloseOnSelect
      />

      <Button
        variant="contained"
        color="info"
        startIcon={<AccountBalanceWallet />}
        disabled={
          !Boolean(document.type.trim()) ||
          !Boolean(document.description.trim()) ||
          !Boolean(document.categories.length)
        }
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
        disableElevation
        disabled={
          !Boolean(document.type.trim()) ||
          !Boolean(document.description.trim()) ||
          !Boolean(document.categories.length)
        }
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


      <DocumentTypesDialog
        open={isOpen}
        accounts={document.accounts}
        onInsert={accountInsertHandler}
        onUpdate={accountUpdateHandler}
        onRemove={accountRemoveHandler}
        onClose={accountCloseHandler}
      />
    </form>
  )
}

export default DocumentTypesForm