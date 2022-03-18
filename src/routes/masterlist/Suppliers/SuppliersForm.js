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

const SuppliersForm = (props) => {

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
    supplier_types: [],
    references: []
  })

  // Form Data State
  const [supplier, setSupplier] = React.useState({
    code: "",
    name: "",
    terms: "",
    type: null,
    references: []
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
        response = await axios.get(`/api/admin/dropdown/supplier-reference`)

        const {
          supplier_types,
          references
        } = response.data.result

        setDropdown(currentValue => ({
          isFetching: false,
          supplier_types,
          references
        }))
      }
      catch (error) {
        if (error.request.status !== 404) {
          toast({
            show: true,
            title: "Error",
            message: "Something went wrong whilst fetching suppliers dropdown list.",
            severity: "error"
          })
        }

        setDropdown(currentValue => ({
          isFetching: false,
          supplier_types: [],
          references: []
        }))

        console.log("Fisto Error Details: ", error.request)
      }
    })()
    // eslint-disable-next-line
  }, [])

  React.useEffect(() => {
    if (data) {
      setIsUpdating(true)
      setSupplier({
        code: data.code,
        name: data.name,
        terms: data.terms,
        type: data.supplier_type,
        references: data.referrences
      })
    }
  }, [data])

  const formClearHandler = () => {
    setIsUpdating(false)
    setError({
      status: false,
      message: null
    })
    setSupplier({
      code: "",
      name: "",
      terms: "",
      type: null,
      references: []
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
            response = await axios.put(`/api/admin/suppliers/${data.id}/`, {
              code: supplier.code,
              name: supplier.name,
              terms: supplier.terms,
              supplier_type_id: supplier.type.id,
              references: supplier.references.map(ref => ref.id)
            })
          else
            response = await axios.post(`/api/admin/suppliers/`, {
              code: supplier.code,
              name: supplier.name,
              terms: supplier.terms,
              supplier_type_id: supplier.type.id,
              references: supplier.references.map(ref => ref.id)
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
              message: data.message
            })
          }
          else
            toast({
              show: true,
              title: "Error",
              message: "Something went wrong whilst saving supplier.",
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
        label="Supplier Code"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={supplier.code}
        helperText={error.status && error.field === "code" && error.message}
        error={error.status && error.field === "code"}
        onBlur={() => setError({
          status: false,
          field: "",
          message: ""
        })}
        onChange={(e) => setSupplier({
          ...supplier,
          code: e.target.value
        })}
        InputLabelProps={{
          className: "FstoLabelForm-root"
        }}
        fullWidth
      />

      <TextField
        className="FstoTextfieldForm-root"
        label="Supplier Name"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={supplier.name}
        helperText={error.status && error.field === "name" && error.message}
        error={error.status && error.field === "name"}
        onBlur={() => setError({
          status: false,
          field: "",
          message: ""
        })}
        onChange={(e) => setSupplier({
          ...supplier,
          name: e.target.value
        })}
        InputLabelProps={{
          className: "FstoLabelForm-root"
        }}
        fullWidth
      />

      <TextField
        className="FstoTextfieldForm-root"
        label="Terms"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={supplier.terms}
        onChange={(e) => setSupplier({
          ...supplier,
          terms: e.target.value
        })}
        InputLabelProps={{
          className: "FstoLabelForm-root"
        }}
        fullWidth
      />

      <Autocomplete
        className="FstoSelectForm-root"
        size="small"
        options={dropdown.supplier_types}
        value={supplier.type}
        filterOptions={filterOptions}
        renderInput={
          props =>
            <TextField
              {...props}
              variant="outlined"
              label="Type"
              error={!Boolean(dropdown.supplier_types) && !dropdown.isFetching}
              helperText={!Boolean(dropdown.supplier_types) && !dropdown.isFetching && "No supplier types found."}
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
          option => option.type
        }
        isOptionEqualToValue={
          (option, value) => option.id === value.id
        }
        onChange={
          (e, value) => {
            setSupplier({
              ...supplier,
              type: value
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
        options={dropdown.references}
        value={supplier.references}
        filterOptions={filterOptions}
        renderInput={
          props =>
            <TextField
              {...props}
              variant="outlined"
              label="References"
              error={!Boolean(dropdown.references) && !dropdown.isFetching}
              helperText={!Boolean(dropdown.references) && !dropdown.isFetching && "No references found."}
            />
        }
        PaperComponent={
          props =>
            <Paper
              {...props}
              sx={{ textTransform: 'uppercase' }}
            />
        }
        ChipProps={{
          sx: { textTransform: 'uppercase' }
        }}
        getOptionLabel={
          option => option.type
        }
        isOptionEqualToValue={
          (option, value) => option.id === value.id
        }
        onChange={
          (e, value) => {
            setSupplier({
              ...supplier,
              references: value
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
          !Boolean(supplier.code.trim()) ||
          !Boolean(supplier.name.trim()) ||
          !Boolean(supplier.terms.trim()) ||
          !Boolean(supplier.type) ||
          !Boolean(supplier.references.length)
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

export default SuppliersForm