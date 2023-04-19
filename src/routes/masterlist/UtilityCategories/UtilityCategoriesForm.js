import React from 'react'

import axios from 'axios'

import {
  TextField,
  Button
} from '@mui/material'

import { LoadingButton } from '@mui/lab'

const UtilityCategoriesForm = (props) => {

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
  const [utilityCategory, setUtilityCategory] = React.useState({
    name: ""
  })

  React.useEffect(() => {
    if (data) {
      setIsUpdating(true)
      setUtilityCategory({
        name: data.category
      })
    }
  }, [data])

  const formClearHandler = () => {
    setIsUpdating(false)
    setError({
      status: false,
      message: null
    })
    setUtilityCategory({
      name: ""
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
            response = await axios.put(`/api/admin/utility-category/${data.id}`, {
              category: utilityCategory.name
            })
          else
            response = await axios.post(`/api/admin/utility-category`, {
              category: utilityCategory.name
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
                message: "Something went wrong whilst saving utility category.",
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
        label="Category Name"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={utilityCategory.name}
        helperText={error.status && error.message}
        error={error.status}
        onBlur={() => setError({
          status: false,
          message: ""
        })}
        onChange={(e) => setUtilityCategory({
          name: e.target.value
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
        disabled={!Boolean(utilityCategory.name.trim())}
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

export default UtilityCategoriesForm