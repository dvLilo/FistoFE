import React from 'react'

import axios from 'axios'

import {
  Paper,
  TextField,
  Button,
  Autocomplete
} from '@mui/material'

import { LoadingButton } from '@mui/lab'

const LocationsForm = (props) => {

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
    companies: []
  })

  // Form Data State
  const [location, setLocation] = React.useState({
    code: "",
    location: "",
    company: null
  })

  React.useEffect(() => {
    (async () => {
      setDropdown(currentValue => ({
        ...currentValue,
        isFetching: true
      }))

      let response
      try {
        response = await axios.get(`/api/admin/dropdown/company`)

        const {
          companies
        } = response.data.result

        setDropdown(currentValue => ({
          isFetching: false,
          companies
        }))
      }
      catch (error) {
        if (error.request.status !== 404) {
          toast({
            show: true,
            title: "Error",
            message: "Something went wrong whilst fetching locations dropdown list.",
            severity: "error"
          })
        }

        setDropdown(currentValue => ({
          isFetching: false,
          companies: []
        }))

        console.log("Fisto Error Details: ", error.request)
      }
    })()
    // eslint-disable-next-line
  }, [])

  React.useEffect(() => {
    if (data) {
      setIsUpdating(true)
      setLocation({
        code: data.code,
        location: data.location,
        company: {
          id: data.company.id,
          company: data.company.name
        }
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
    setLocation({
      code: "",
      location: "",
      company: null
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
            response = await axios.put(`/api/admin/locations/${data.id}/`, {
              code: location.code,
              location: location.location,
              company: location.company.id
            })
          else
            response = await axios.post(`/api/admin/locations/`, {
              code: location.code,
              location: location.location,
              company: location.company.id
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
          const { status } = error.request

          if (status === 409) {
            const { data } = error.response

            setError({
              status: true,
              field: data.result.error_field,
              message: data.message
            })
          }
          else
            toast({
              show: true,
              title: "Error",
              message: "Something went wrong whilst saving location.",
              severity: "error"
            })
        }

        setIsSaving(false)
      }
    })
  }

  return (
    <form onSubmit={formSubmitHandler}>
      <TextField
        className="FstoTextfieldForm-root"
        label="Location Code"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={location.code}
        helperText={error.status && error.field === "code" && error.message}
        error={error.status && error.field === "code"}
        onBlur={() => setError({
          status: false,
          field: "",
          message: ""
        })}
        onChange={(e) => setLocation({
          ...location,
          code: e.target.value
        })}
        InputLabelProps={{
          className: "FstoLabelForm-root"
        }}
        fullWidth
      />

      <TextField
        className="FstoTextfieldForm-root"
        label="Location Name"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={location.location}
        helperText={error.status && error.field === "location" && error.message}
        error={error.status && error.field === "location"}
        onBlur={() => setError({
          status: false,
          field: "",
          message: ""
        })}
        onChange={(e) => setLocation({
          ...location,
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
        options={dropdown.companies}
        value={location.company}
        renderInput={
          props =>
            <TextField
              {...props}
              variant="outlined"
              label="Company"
              error={!Boolean(dropdown.companies.length) && !dropdown.isFetching}
              helperText={!Boolean(dropdown.companies.length) && !dropdown.isFetching && "No companies found."}
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
          option => option.company
        }
        isOptionEqualToValue={
          (option, value) => option.id === value.id
        }
        onChange={
          (e, value) => {
            setLocation({
              ...location,
              company: value
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
          !Boolean(location.code.trim()) ||
          !Boolean(location.location.trim()) ||
          !Boolean(location.company)
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

export default LocationsForm