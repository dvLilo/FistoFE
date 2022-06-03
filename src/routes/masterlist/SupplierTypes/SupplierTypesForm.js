import React from 'react'

import axios from 'axios'

import {
  TextField,
  Button
} from '@mui/material'

import { LoadingButton } from '@mui/lab'

const SupplierTypesForm = (props) => {

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

  // Form Data State
  const [supplierType, setSupplierType] = React.useState({
    type: "",
    transaction: ""
  })

  React.useEffect(() => {
    if (data) {
      setIsUpdating(true)
      setSupplierType({
        type: data.type,
        transaction: data.transaction
      })
    }
  }, [data])

  const formClearHandler = () => {
    setIsUpdating(false)
    setError({
      status: false,
      message: null
    })
    setSupplierType({
      type: "",
      transaction: ""
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
            response = await axios.put(`/api/admin/supplier-types/${data.id}/`, {
              type: supplierType.type,
              transaction_days: supplierType.transaction
            })
          else
            response = await axios.post(`/api/admin/supplier-types`, {
              type: supplierType.type,
              transaction_days: supplierType.transaction
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
                message: "Something went wrong whilst saving supplier type.",
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
        label="Urgency Type"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={supplierType.type}
        helperText={error.status && error.message}
        error={error.status}
        onBlur={() => setError({
          status: false,
          message: ""
        })}
        onChange={(e) => setSupplierType({
          ...supplierType,
          type: e.target.value
        })}
        InputLabelProps={{
          className: "FstoLabelForm-root"
        }}
        fullWidth
      />

      <TextField
        className="FstoTextfieldForm-root"
        label="Transaction Days"
        variant="outlined"
        autoComplete="off"
        size="small"
        type="number"
        value={supplierType.transaction}
        onKeyDown={(e) => ["E", "e", ".", "+", "-"].includes(e.key) && e.preventDefault()}
        onChange={(e) => setSupplierType({
          ...supplierType,
          transaction: e.target.value
        })}
        InputLabelProps={{
          className: "FstoLabelForm-root"
        }}
        fullWidth
      />

      <LoadingButton
        className="FstoButtonForm-root"
        type="submit"
        variant="contained"
        loadingPosition="start"
        loading={isSaving}
        startIcon={<></>}
        disabled={
          !Boolean(supplierType.type.trim()) ||
          !Boolean(supplierType.transaction)
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

export default SupplierTypesForm