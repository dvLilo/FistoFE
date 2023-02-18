import React from 'react'

import axios from 'axios'

import {
  Paper,
  Button,
  TextField,
  Autocomplete
} from '@mui/material'

import { LoadingButton } from '@mui/lab'

import { createFilterOptions } from '@mui/material/Autocomplete';

const BanksForm = (props) => {

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

  // Form Data State
  const [bank, setBank] = React.useState({
    code: "",
    name: "",
    branch: "",
    account_no: "",
    location: "",
    account_title_1: null,
    account_title_2: null
  })

  // Dropdown Array
  const [dropdown, setDropdown] = React.useState({
    isFetching: false,
    account_titles: []
  })

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    limit: 100
  });

  React.useEffect(() => {
    (async () => {
      setDropdown(currentValue => ({
        ...currentValue,
        isFetching: true
      }))

      let response
      try {
        response = await axios.get(`/api/admin/dropdown/account-title`)
        const { account_titles } = response.data.result

        setDropdown(() => ({
          isFetching: false,
          account_titles: account_titles
        }))
      }
      catch (error) {
        if (error.request.status !== 404) {
          toast({
            show: true,
            title: "Error!",
            message: "Something went wrong whilst fetching banks dropdown list.",
            severity: "error"
          })
        }

        setDropdown(() => ({
          isFetching: false,
          account_titles: []
        }))

        console.log("Fisto Error Details: ", error.request)
      }
    })()
    // eslint-disable-next-line
  }, [])

  React.useEffect(() => {
    if (data) {
      setIsUpdating(true)
      setBank({
        code: data.code,
        name: data.name,
        branch: data.branch,
        account_no: data.account_no,
        location: data.location,
        account_title_1: {
          id: data.account_title_1.id,
          title: data.account_title_1.name
        },
        account_title_2: {
          id: data.account_title_2.id,
          title: data.account_title_2.name
        }
      })
    }
  }, [data])

  const formClearHandler = () => {
    setIsUpdating(false)
    setError({
      status: false,
      message: ""
    })
    setBank({
      code: "",
      name: "",
      branch: "",
      account_no: "",
      location: "",
      account_title_1: null,
      account_title_2: null
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
            response = await axios.put(`/api/admin/banks/${data.id}/`, {
              code: bank.code,
              name: bank.name,
              branch: bank.branch,
              account_no: bank.account_no,
              location: bank.location,
              account_title_1: bank.account_title_1.id,
              account_title_2: bank.account_title_2.id
            })
          else
            response = await axios.post(`/api/admin/banks`, {
              code: bank.code,
              name: bank.name,
              branch: bank.branch,
              account_no: bank.account_no,
              location: bank.location,
              account_title_1: bank.account_title_1.id,
              account_title_2: bank.account_title_2.id
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
                message: "Something went wrong whilst saving bank.",
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
        label="Bank Code"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={bank.code}
        helperText={error.status && error.field === "code" && error.message}
        error={error.status && error.field === "code"}
        onBlur={() => setError({
          status: false,
          field: "",
          message: ""
        })}
        onChange={(e) => setBank({
          ...bank,
          code: e.target.value
        })}
        InputLabelProps={{
          className: "FstoLabelForm-root"
        }}
        fullWidth
      />

      <TextField
        className="FstoTextfieldForm-root"
        label="Bank Name"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={bank.name}
        onChange={(e) => setBank({
          ...bank,
          name: e.target.value
        })}
        InputLabelProps={{
          className: "FstoLabelForm-root"
        }}
        fullWidth
      />

      <TextField
        className="FstoTextfieldForm-root"
        label="Branch Code"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={bank.branch}
        helperText={error.status && error.field === "branch" && error.message}
        error={error.status && error.field === "branch"}
        onBlur={() => setError({
          status: false,
          field: "",
          message: ""
        })}
        onChange={(e) => setBank({
          ...bank,
          branch: e.target.value
        })}
        InputLabelProps={{
          className: "FstoLabelForm-root"
        }}
        fullWidth
      />

      <TextField
        className="FstoTextfieldForm-root"
        label="Account Number"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={bank.account_no}
        helperText={error.status && error.field === "account_no" && error.message}
        error={error.status && error.field === "account_no"}
        onBlur={() => setError({
          status: false,
          field: "",
          message: ""
        })}
        onChange={(e) => setBank({
          ...bank,
          account_no: e.target.value
        })}
        InputLabelProps={{
          className: "FstoLabelForm-root"
        }}
        fullWidth
      />

      <TextField
        className="FstoTextfieldForm-root"
        label="Location"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={bank.location}
        onChange={(e) => setBank({
          ...bank,
          location: e.target.value
        })}
        InputLabelProps={{
          className: "FstoLabelForm-root"
        }}
        fullWidth
      />

      <Autocomplete
        className="FstoSelectForm-root"
        size="small"
        options={dropdown.account_titles}
        value={bank.account_title_1}
        filterOptions={filterOptions}
        renderInput={
          props =>
            <TextField
              {...props}
              variant="outlined"
              label="Cheque Creation"
              error={!Boolean(dropdown.account_titles.length) && !dropdown.isFetching}
              helperText={!Boolean(dropdown.account_titles.length) && !dropdown.isFetching && "No account titles found."}
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
          option => option.title
        }
        isOptionEqualToValue={
          (option, value) => option.id === value.id
        }
        onChange={
          (e, value) => {
            setBank({
              ...bank,
              account_title_1: value
            })
          }
        }
        fullWidth
        disablePortal
        disableClearable
      />

      <Autocomplete
        className="FstoSelectForm-root"
        size="small"
        options={dropdown.account_titles}
        value={bank.account_title_2}
        filterOptions={filterOptions}
        renderInput={
          props =>
            <TextField
              {...props}
              variant="outlined"
              label="Cheque Clearing"
              error={!Boolean(dropdown.account_titles.length) && !dropdown.isFetching}
              helperText={!Boolean(dropdown.account_titles.length) && !dropdown.isFetching && "No account titles found."}
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
          option => option.title
        }
        isOptionEqualToValue={
          (option, value) => option.id === value.id
        }
        onChange={
          (e, value) => {
            setBank({
              ...bank,
              account_title_2: value
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
          !Boolean(bank.code.trim()) ||
          !Boolean(bank.name.trim()) ||
          !Boolean(bank.branch.trim()) ||
          !Boolean(bank.account_no.trim()) ||
          !Boolean(bank.location.trim()) ||
          !Boolean(bank.account_title_1) ||
          !Boolean(bank.account_title_2)
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
    </form>
  )
}

export default BanksForm