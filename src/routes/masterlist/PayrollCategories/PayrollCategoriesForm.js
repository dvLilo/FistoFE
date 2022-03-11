import React from 'react'

import axios from 'axios'

import {
  TextField,
  Button
} from '@mui/material'

import { LoadingButton } from '@mui/lab'

const PayrollCategoriesForm = (props) => {

  const {
    data,
    refetchData,
    toast,
    confirm
  } = props

  const [isSaving, setIsSaving] = React.useState(false)
  const [isUpdating, setIsUpdating] = React.useState(false)

  // Form Data State
  const [payrollCategory, setPayrollCategory] = React.useState({
    category: ""
  })

  const [error, setError] = React.useState({
    status: false,
    message: ""
  })

  React.useEffect(() => {
    if (data) {
      setIsUpdating(true)
      setPayrollCategory({
        category: data.category
      })
    }
    console.log("Hello")
  }, [data])

  const formClearHandler = () => {
    setIsUpdating(false)
    setError({
      status: false,
      message: null
    })
    setPayrollCategory({
      category: ""
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
            response = await axios.put(`/api/admin/payroll-client/${data.id}/`, {
              category: payrollCategory.category
            })
          else
            response = await axios.post(`/api/admin/payroll-client/`, {
              category: payrollCategory.category
            })

          toast({
            show: true,
            title: "Success",
            message: response.data.message
          })
          setIsUpdating(false)
          setPayrollCategory({
            category: ""
          })

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
              message: "Something went wrong whilst saving payroll category.",
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
        label="Payroll Client"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={payrollCategory.category}
        helperText={error.status && error.message}
        error={error.status}
        onBlur={() => setError({
          status: false,
          message: ""
        })}
        onChange={(e) => setPayrollCategory({
          category: e.target.value
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
        disabled={!Boolean(payrollCategory.category.trim())}
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

export default PayrollCategoriesForm