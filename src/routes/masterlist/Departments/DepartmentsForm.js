import React from 'react'

import axios from 'axios'

import { useLocation } from 'react-router-dom'

import {
  Paper,
  TextField,
  Button,
  Autocomplete
} from '@mui/material'

import { LoadingButton } from '@mui/lab'

const DepartmentsForm = (props) => {

  const location = useLocation()

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
    vouchers: []
  })

  // Form Data State
  const [department, setDepartment] = React.useState({
    code: "",
    department: "",
    company: null,
    voucher: null
  })

  React.useEffect(() => {
    const { state } = location

    if (state) setDepartment(currentValue => ({
      ...currentValue,
      department: state.department
    }))
    // eslint-disable-next-line
  }, [])

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
            message: "Something went wrong whilst fetching departments dropdown list.",
            severity: "error"
          })
        }

        setDropdown(currentValue => ({
          ...currentValue,
          isFetching: false,
          companies: []
        }))

        console.log("Fisto Error Details: ", error.request)
      }
    })()
    // eslint-disable-next-line
  }, [])

  React.useEffect(() => {
    (async () => {
      setDropdown(currentValue => ({
        ...currentValue,
        isFetching: true
      }))

      let response
      try {
        response = await axios.get(`/api/admin/dropdown/voucher-code`)

        const {
          voucher_codes
        } = response.data.result

        setDropdown(currentValue => ({
          ...currentValue,
          isFetching: false,
          vouchers: voucher_codes
        }))
      }
      catch (error) {
        if (error.request.status !== 404) {
          toast({
            show: true,
            title: "Error",
            message: "Something went wrong whilst fetching voucher codes dropdown list.",
            severity: "error"
          })
        }

        setDropdown(currentValue => ({
          ...currentValue,
          isFetching: false,
          vouchers: []
        }))

        console.log("Fisto Error Details: ", error.request)
      }
    })()
    // eslint-disable-next-line
  }, [])

  React.useEffect(() => {
    if (data) {
      setIsUpdating(true)
      setDepartment({
        code: data.code,
        department: data.department,
        company: {
          id: data.company.id,
          company: data.company.name
        },
        voucher: data.voucher_code
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
    setDepartment({
      code: "",
      department: "",
      company: null,
      voucher: null,
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
            response = await axios.put(`/api/admin/departments/${data.id}`, {
              code: department.code,
              department: department.department,
              company: department.company.id,
              voucher_code_id: department.voucher.id
            })
          else
            response = await axios.post(`/api/admin/departments`, {
              code: department.code,
              department: department.department,
              company: department.company.id,
              voucher_code_id: department.voucher.id
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
                message: "Something went wrong whilst saving department.",
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
        label="Department Code"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={department.code}
        helperText={error.status && error.field === "code" && error.message}
        error={error.status && error.field === "code"}
        onBlur={() => setError({
          status: false,
          field: "",
          message: ""
        })}
        onChange={(e) => setDepartment({
          ...department,
          code: e.target.value
        })}
        InputLabelProps={{
          className: "FstoLabelForm-root"
        }}
        fullWidth
      />

      <TextField
        className="FstoTextfieldForm-root"
        label="Department Name"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={department.department}
        helperText={error.status && error.field === "department" && error.message}
        error={error.status && error.field === "department"}
        onBlur={() => setError({
          status: false,
          field: "",
          message: ""
        })}
        onChange={(e) => setDepartment({
          ...department,
          department: e.target.value
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
        value={department.company}
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
            setDepartment({
              ...department,
              company: value
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
        options={dropdown.vouchers}
        value={department.voucher}
        renderInput={
          props =>
            <TextField
              {...props}
              variant="outlined"
              label="Voucher Code"
              error={!Boolean(dropdown.vouchers.length) && !dropdown.isFetching}
              helperText={!Boolean(dropdown.vouchers.length) && !dropdown.isFetching && "No voucher codes found."}
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
          option => option.code
        }
        isOptionEqualToValue={
          (option, value) => option.id === value.id
        }
        onChange={
          (e, value) => {
            setDepartment({
              ...department,
              voucher: value
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
          !Boolean(department.code.trim()) ||
          !Boolean(department.department.trim()) ||
          !Boolean(department.company) ||
          !Boolean(department.voucher)
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

export default DepartmentsForm