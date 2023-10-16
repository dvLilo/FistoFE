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

const BusinessUnitsForm = (props) => {

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
    companies: [],
    associates: []
  })

  // Form Data State
  const [businessUnit, setBusinessUnit] = React.useState({
    code: "",
    name: "",
    company: null,
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
          ...currentValue,
          isFetching: false,
          associates
        }))
      }
      catch (error) {
        if (error.request.status !== 404) {
          toast({
            show: true,
            title: "Error",
            message: "Something went wrong whilst fetching AP associate dropdown list.",
            severity: "error"
          })
        }

        setDropdown(currentValue => ({
          ...currentValue,
          isFetching: false,
          associates: []
        }))

        console.log("Fisto Error Details: ", error.request)
      }
    })()

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
            ...currentValue,
            isFetching: false,
            companies
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
            ...currentValue,
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
      setBusinessUnit({
        code: data.code,
        name: data.business_unit,
        company: {
          id: data.company.id,
          company: data.company.name
        },
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
    setBusinessUnit({
      code: "",
      name: "",
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
            response = await axios.put(`/api/admin/business-units/${data.id}`, {
              code: businessUnit.code,
              business_unit: businessUnit.name,
              company_id: businessUnit.company.id,
              associates: businessUnit.associates.map(assoc => assoc.id)
            })
          else
            response = await axios.post(`/api/admin/business-units`, {
              code: businessUnit.code,
              business_unit: businessUnit.name,
              company_id: businessUnit.company.id,
              associates: businessUnit.associates.map(assoc => assoc.id)
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
                message: "Something went wrong whilst saving business unit.",
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
        label="Business Unit Code"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={businessUnit.code}
        helperText={error.status && error.field === "code" && error.message}
        error={error.status && error.field === "code"}
        onBlur={() => setError({
          status: false,
          field: "",
          message: ""
        })}
        onChange={(e) => setBusinessUnit((currentValue) => ({
          ...currentValue,
          code: e.target.value
        }))}
        InputLabelProps={{
          className: "FstoLabelForm-root"
        }}
        fullWidth
      />

      <TextField
        className="FstoTextfieldForm-root"
        label="Business Unit Name"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={businessUnit.name}
        helperText={error.status && error.field === "name" && error.message}
        error={error.status && error.field === "name"}
        onBlur={() => setError({
          status: false,
          field: "",
          message: ""
        })}
        onChange={(e) => setBusinessUnit((currentValue) => ({
          ...currentValue,
          name: e.target.value
        }))}
        InputLabelProps={{
          className: "FstoLabelForm-root"
        }}
        fullWidth
      />

      <Autocomplete
        className="FstoSelectForm-root"
        size="small"
        options={dropdown.companies}
        value={businessUnit.company}
        filterOptions={filterOptions}
        renderInput={
          props =>
            <TextField
              {...props}
              variant="outlined"
              label="Company"
              error={!Boolean(dropdown.companies.length) && !dropdown.isFetching}
              helperText={!Boolean(dropdown.companies.length) && !dropdown.isFetching && "No company found."}
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
        onChange={(e, value) => setBusinessUnit((currentValue) => ({
          ...currentValue,
          company: value
        }))}
        fullWidth
        disablePortal
      />

      <Autocomplete
        className="FstoSelectForm-root"
        size="small"
        options={dropdown.associates}
        value={businessUnit.associates}
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
        onChange={(e, value) => setBusinessUnit((currentValue) => ({
          ...currentValue,
          associates: value
        }))}
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
          !Boolean(businessUnit.code.trim()) ||
          !Boolean(businessUnit.name.trim()) ||
          !Boolean(businessUnit.associates.length)
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

export default BusinessUnitsForm