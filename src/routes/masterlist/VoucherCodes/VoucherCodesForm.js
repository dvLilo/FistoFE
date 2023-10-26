import React from 'react'

import axios from 'axios'

import {
  TextField,
  Button
} from '@mui/material'

import { LoadingButton } from '@mui/lab'

const VoucherCodesForm = (props) => {

  const {
    data,
    refetchData,
    toast,
    confirm
  } = props

  const [isSaving, setIsSaving] = React.useState(false)
  const [isUpdating, setIsUpdating] = React.useState(false)

  // Form Data State
  const [voucherCode, setVoucherCode] = React.useState({
    code: ""
  })

  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    if (data) {
      setIsUpdating(true)
      setVoucherCode({
        code: data.code
      })
    }
  }, [data])

  const formClearHandler = () => {
    setIsUpdating(false)
    setError(null)
    setVoucherCode({
      code: ""
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
            response = await axios.put(`/api/admin/voucher-codes/${data.id}`, {
              code: voucherCode.code
            })
          else
            response = await axios.post(`/api/admin/voucher-codes`, {
              code: voucherCode.code
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
            case 422:
              setError(error.response?.data?.errors)
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
                message: "Something went wrong whilst saving category.",
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
        label="Voucher Code"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={voucherCode.code}
        helperText={error?.code && error?.code?.at(0)}
        error={!!error?.code}
        onChange={(e) => setVoucherCode({
          code: e.target.value
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
        disabled={!Boolean(voucherCode.code.trim())}
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

export default VoucherCodesForm