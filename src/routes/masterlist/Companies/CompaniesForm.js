import React from 'react'

import axios from 'axios'

import {
  Paper,
  TextField,
  Button,
  Autocomplete
} from '@mui/material'

import { LoadingButton } from '@mui/lab'

import { createFilterOptions } from '@mui/material/Autocomplete'

const CompaniesForm = (props) => {

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

  // Dropdown Array
  const [dropdown, setDropdown] = React.useState({
    isFetching: false,
    associates: []
  })

  // Form Data State
  const [company, setCompany] = React.useState({
    code: "",
    company: "",
    associates: []
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
        response = await axios.get(`/api/admin/dropdown/associate`)

        const {
          associates
        } = response.data.result

        setDropdown(currentValue => ({
          isFetching: false,
          associates
        }))
      }
      catch (error) {
        if (error.request.status !== 404) {
          toast({
            show: true,
            title: "Error",
            message: "Something went wrong whilst fetching companies dropdown list.",
            severity: "error"
          })
        }

        setDropdown(currentValue => ({
          isFetching: false,
          associates: []
        }))

        console.log("Fisto Error Details: ", error.request)
      }
    })()
    // eslint-disable-next-line
  }, [])

  React.useEffect(() => {
    if (data) {
      setIsUpdating(true)
      setCompany({
        code: data.code,
        company: data.company,
        associates: data.associates
      })
    }
  }, [data])

  const formClearHandler = () => {
    setIsUpdating(false)
    setError({
      status: false,
      field: null,
      message: null
    })
    setCompany({
      code: "",
      company: "",
      associates: []
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
            response = await axios.put(`/api/admin/companies/${data.id}`, {
              code: company.code,
              company: company.company,
              associates: company.associates.map(assoc => assoc.id)
            })
          else
            response = await axios.post(`/api/admin/companies`, {
              code: company.code,
              company: company.company,
              associates: company.associates.map(assoc => assoc.id)
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
                message: "Something went wrong whilst saving company.",
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
        label="Company Code"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={company.code}
        helperText={error.status && error.field === "code" && error.message}
        error={error.status && error.field === "code"}
        onBlur={() => setError({
          status: false,
          field: "",
          message: ""
        })}
        onChange={(e) => setCompany({
          ...company,
          code: e.target.value
        })}
        InputLabelProps={{
          className: "FstoLabelForm-root"
        }}
        fullWidth
      />

      <TextField
        className="FstoTextfieldForm-root"
        label="Company Name"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={company.company}
        helperText={error.status && error.field === "company" && error.message}
        error={error.status && error.field === "company"}
        onBlur={() => setError({
          status: false,
          field: "",
          message: ""
        })}
        onChange={(e) => setCompany({
          ...company,
          company: e.target.value
        })}
        InputLabelProps={{
          className: "FstoLabelForm-root"
        }}
        fullWidth
      />

      <Autocomplete
        className="FstoSelectForm-root"
        size="small"
        options={dropdown.associates}
        value={company.associates}
        filterOptions={filterOptions}
        renderInput={
          props =>
            <TextField
              {...props}
              variant="outlined"
              label="Assign AP Associate"
              error={!Boolean(dropdown.associates.length) && !dropdown.isFetching}
              helperText={!Boolean(dropdown.associates.length) && !dropdown.isFetching && "No AP associate found."}
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
            setCompany({
              ...company,
              associates: value
            })
          }
        }
        fullWidth
        multiple
        disablePortal
        disableCloseOnSelect
      />

      <LoadingButton
        className="FstoButtonForm-root"
        type="submit"
        variant="contained"
        loadingPosition="start"
        loading={isSaving}
        startIcon={<></>}
        disabled={
          !Boolean(company.code.trim()) ||
          !Boolean(company.company.trim()) ||
          !Boolean(company.associates.length)
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

export default CompaniesForm