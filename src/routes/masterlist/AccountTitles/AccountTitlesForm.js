import React from 'react'

import axios from 'axios'

import {
  Paper,
  TextField,
  Button,
  Autocomplete
} from '@mui/material'

import { LoadingButton } from '@mui/lab'

const AccountTitlesForm = (props) => {

  const {
    data,
    refetchData,
    toast,
    confirm
  } = props

  const [isSaving, setIsSaving] = React.useState(false)

  const [isUpdating, setIsUpdating] = React.useState(false)

  const [error, setError] = React.useState({
    status: false,
    field: "",
    message: ""
  })

  // Account Title Categories *fixed
  const dropdown = {
    categories: [
      {
        label: "asset"
      },
      {
        label: "capital"
      },
      {
        label: "expense"
      },
      {
        label: "income"
      },
      {
        label: "payable"
      }
    ]
  }

  // Form Data State
  const [accountTitle, setAccountTitle] = React.useState({
    code: "",
    title: "",
    category: null
  })

  React.useEffect(() => {
    if (data) {
      setIsUpdating(true)
      setAccountTitle({
        code: data.code,
        title: data.title,
        category: data.category
      })
    }
  }, [data])

  const formClearHandler = () => {
    setIsUpdating(false)
    setError({
      status: false,
      field: "",
      message: ""
    })
    setAccountTitle({
      code: "",
      title: "",
      category: null
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
            response = await axios.put(`/api/admin/account-title/${data.id}/`, {
              code: accountTitle.code,
              title: accountTitle.title,
              category: accountTitle.category
            })
          else
            response = await axios.post(`/api/admin/account-title`, {
              code: accountTitle.code,
              title: accountTitle.title,
              category: accountTitle.category
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
                field: error.response.data.result.error_field,
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
                message: "Something went wrong whilst saving account title.",
                severity: "error"
              })
          }
        }

        setIsSaving(false)
      }
    })
  }


  return (
    <form onSubmit={formSubmitHandler}>
      <TextField
        className="FstoTextfieldForm-root"
        label="Account Code"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={accountTitle.code}
        helperText={error.status && error.field === "code" && error.message}
        error={error.status && error.field === "code"}
        onBlur={() => setError({
          status: false,
          field: "",
          message: ""
        })}
        onChange={(e) => setAccountTitle({
          ...accountTitle,
          code: e.target.value
        })}
        InputLabelProps={{
          className: "FstoLabelForm-root"
        }}
        fullWidth
      />

      <TextField
        className="FstoTextfieldForm-root"
        label="Account Title"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={accountTitle.title}
        helperText={error.status && error.field === "title" && error.message}
        error={error.status && error.field === "title"}
        onBlur={() => setError({
          status: false,
          field: "",
          message: ""
        })}
        onChange={(e) => setAccountTitle({
          ...accountTitle,
          title: e.target.value
        })}
        InputLabelProps={{
          className: "FstoLabelForm-root"
        }}
        fullWidth
      />

      <Autocomplete
        className="FstoSelectForm-root"
        size="small"
        options={dropdown.categories}
        value={accountTitle.category}
        renderInput={
          props =>
            <TextField
              {...props}
              variant="outlined"
              label="Category"
            />
        }
        PaperComponent={
          props =>
            <Paper
              {...props}
              sx={{ textTransform: 'capitalize' }}
            />
        }
        isOptionEqualToValue={
          (option, value) => option.label === value
        }
        onChange={
          (e, value) => {
            setAccountTitle({
              ...accountTitle,
              category: value.label
            })
          }
        }
        fullWidth
        disablePortal
        disableClearable
      />

      <LoadingButton
        className="FstoButtonForm-root"
        type="submit"
        variant="contained"
        loadingPosition="start"
        loading={isSaving}
        startIcon={<></>}
        disabled={
          !Boolean(accountTitle.code.trim()) ||
          !Boolean(accountTitle.title.trim()) ||
          !Boolean(accountTitle.category)
        }
        disableElevation
      >
        {
          isUpdating.status
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
          isUpdating.status
            ? "Cancel"
            : "Clear"
        }
      </Button>
    </form>
  )
}

export default AccountTitlesForm