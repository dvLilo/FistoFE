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
    departments: []
  })

  // Form Data State
  const [location, setLocation] = React.useState({
    code: "",
    location: "",
    departments: []
  })

  React.useEffect(() => {
    (async () => {
      setDropdown(currentValue => ({
        ...currentValue,
        isFetching: true
      }))

      let response
      try {
        response = await axios.get(`/api/admin/dropdown/department`)

        const {
          departments
        } = response.data.result

        setDropdown(currentValue => ({
          isFetching: false,
          departments
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
          departments: []
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
        departments: data.departments
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
      departments: []
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
              departments: location.departments.map(department => department.id)
            })
          else
            response = await axios.post(`/api/admin/locations`, {
              code: location.code,
              location: location.location,
              departments: location.departments.map(department => department.id)
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
                message: "Something went wrong whilst saving location.",
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
        options={dropdown.departments}
        value={location.departments}
        renderInput={
          props =>
            <TextField
              {...props}
              variant="outlined"
              label="Department"
              error={!Boolean(dropdown.departments.length) && !dropdown.isFetching}
              helperText={!Boolean(dropdown.departments.length) && !dropdown.isFetching && "No departments found."}
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
            setLocation({
              ...location,
              departments: value
            })
          }
        }
        fullWidth
        multiple
        disablePortal
        disableClearable
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
          !Boolean(location.code.trim()) ||
          !Boolean(location.location.trim()) ||
          !Boolean(location.departments.length)
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