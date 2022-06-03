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

const CreditCardsForm = (props) => {

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
    categories: []
  })

  // Form Data State
  const [creditCard, setCreditCard] = React.useState({
    name: "",
    account_no: "",
    locations: [],
    categories: []
  })

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    limit: 100
  });

  React.useEffect(() => {
    if (data) {
      setIsUpdating(true)
      setCreditCard({
        name: data.name,
        account_no: data.account_no,
        locations: data.utility_locations,
        categories: data.utility_categories
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
        response = await axios.get(`/api/admin/dropdown/location-category`)

        const {
          categories,
          locations
        } = response.data.result

        setDropdown(() => ({
          isFetching: false,
          locations,
          categories
        }))
      }
      catch (error) {
        if (error.request.status !== 404) {
          toast({
            show: true,
            title: "Error",
            message: "Something went wrong whilst fetching credit cards dropdown list.",
            severity: "error"
          })
        }

        setDropdown(() => ({
          isFetching: false,
          locations: [],
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
    setCreditCard({
      name: "",
      account_no: "",
      locations: [],
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
            response = await axios.put(`/api/admin/credit-card/${data.id}/`, {
              name: creditCard.name,
              account_no: creditCard.account_no,
              locations: creditCard.locations.map(loc => loc.id),
              categories: creditCard.categories.map(cat => cat.id)
            })
          else
            response = await axios.post(`/api/admin/credit-card`, {
              name: creditCard.name,
              account_no: creditCard.account_no,
              locations: creditCard.locations.map(loc => loc.id),
              categories: creditCard.categories.map(cat => cat.id)
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
                message: "Something went wrong whilst saving credit card.",
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
        label="Bank Name"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={creditCard.name}
        onChange={(e) => setCreditCard({
          ...creditCard,
          name: e.target.value
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
        value={creditCard.account_no}
        helperText={error.status && error.message}
        error={error.status}
        onBlur={() => setError({
          status: false,
          message: ""
        })}
        onChange={(e) => setCreditCard({
          ...creditCard,
          account_no: e.target.value
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
        value={creditCard.categories}
        filterOptions={filterOptions}
        renderInput={
          props =>
            <TextField
              {...props}
              variant="outlined"
              label="Utility Category"
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
            setCreditCard({
              ...creditCard,
              categories: value
            })
          }
        }
        fullWidth
        multiple
        disablePortal
        disableCloseOnSelect
      />

      <Autocomplete
        className="FstoSelectForm-root"
        size="small"
        options={dropdown.locations}
        value={creditCard.locations}
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
            setCreditCard({
              ...creditCard,
              locations: value
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
          !Boolean(creditCard.name) ||
          !Boolean(creditCard.account_no) ||
          !Boolean(creditCard.categories.length) ||
          !Boolean(creditCard.locations.length)
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

export default CreditCardsForm