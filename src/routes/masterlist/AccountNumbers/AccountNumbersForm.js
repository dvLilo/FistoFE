import React from 'react'

import axios from 'axios'

import {
  Paper,
  Autocomplete,
  TextField,
  Button
} from '@mui/material'

import { LoadingButton } from '@mui/lab'

import { createFilterOptions } from '@mui/material/Autocomplete'

const AccountNumbersForm = (props) => {

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
    message: ""
  })

  // Dropdown Array
  const [dropdown, setDropdown] = React.useState({
    isFetching: false,
    locations: [],
    categories: [],
    suppliers: []
  })

  // Form Data State
  const [accountNumber, setAccountNumber] = React.useState({
    number: "",
    location: null,
    category: null,
    supplier: null
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
        response = await axios.get(`/api/admin/dropdown/location-category-supplier`)

        const {
          locations,
          categories,
          suppliers
        } = response.data.result

        setDropdown(currentValue => ({
          isFetching: false,
          locations,
          categories,
          suppliers
        }))
      }
      catch (error) {
        if (error.request.status !== 404) {
          toast({
            show: true,
            title: "Error",
            message: "Something went wrong whilst fetching account numbers dropdown list.",
            severity: "error"
          })
        }

        setDropdown(currentValue => ({
          isFetching: false,
          locations: [],
          categories: [],
          suppliers: []
        }))

        console.log("Fisto Error Details: ", error.request)
      }
    })()
    // eslint-disable-next-line
  }, [])

  React.useEffect(() => {
    if (data) {
      setIsUpdating(true)
      setAccountNumber({
        number: data.account_no,
        location: data.location,
        category: data.category,
        supplier: data.supplier
      })
    }
  }, [data])

  const formClearHandler = () => {
    setIsUpdating(false)
    setError({
      status: false,
      message: null
    })
    setAccountNumber({
      number: "",
      location: null,
      category: null,
      supplier: null
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
            response = await axios.put(`/api/admin/account-number/${data.id}`, {
              account_no: accountNumber.number,
              location_id: accountNumber.location.id,
              category_id: accountNumber.category.id,
              supplier_id: accountNumber.supplier.id
            })
          else
            response = await axios.post(`/api/admin/account-number`, {
              account_no: accountNumber.number,
              location_id: accountNumber.location.id,
              category_id: accountNumber.category.id,
              supplier_id: accountNumber.supplier.id
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
                message: "Something went wrong whilst saving account number.",
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
        label="Account Number"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={accountNumber.number}
        helperText={error.status && error.message}
        error={error.status}
        onBlur={() => setError({
          status: false,
          message: ""
        })}
        onChange={(e) => setAccountNumber({
          ...accountNumber,
          number: e.target.value
        })}
        InputLabelProps={{
          className: "FstoLabelForm-root"
        }}
        fullWidth
      />

      <Autocomplete
        className="FstoSelectForm-root"
        size="small"
        options={dropdown.locations}
        value={accountNumber.location}
        filterOptions={filterOptions}
        renderInput={
          props =>
            <TextField
              {...props}
              variant="outlined"
              label="Utility Location"
              error={!Boolean(dropdown.locations.length) && !dropdown.isFetching}
              helperText={!Boolean(dropdown.locations.length) && !dropdown.isFetching && "No locations found."}
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
          option => option.location
        }
        isOptionEqualToValue={
          (option, value) => option.id === value.id
        }
        onChange={
          (e, value) => {
            setAccountNumber({
              ...accountNumber,
              location: value
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
        options={dropdown.categories}
        value={accountNumber.category}
        filterOptions={filterOptions}
        renderInput={
          props =>
            <TextField
              {...props}
              variant="outlined"
              label="Utility Type"
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
          option => option.category
        }
        isOptionEqualToValue={
          (option, value) => option.id === value.id
        }
        onChange={
          (e, value) => {
            setAccountNumber({
              ...accountNumber,
              category: value
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
        options={dropdown.suppliers}
        value={accountNumber.supplier}
        filterOptions={filterOptions}
        renderInput={
          props =>
            <TextField
              {...props}
              // className="FstoTextfieldForm-root"
              variant="outlined"
              label="Supplier"
              error={!Boolean(dropdown.suppliers.length) && !dropdown.isFetching}
              helperText={!Boolean(dropdown.suppliers.length) && !dropdown.isFetching && "No suppliers found."}
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
            setAccountNumber({
              ...accountNumber,
              supplier: value
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
          !Boolean(accountNumber.number.trim()) ||
          !Boolean(accountNumber.location) ||
          !Boolean(accountNumber.category) ||
          !Boolean(accountNumber.supplier)
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

export default AccountNumbersForm