import { Button, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'





import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { object, string } from 'yup'

import { LoadingButton } from '@mui/lab'
import axios from 'axios'



const schema = object({
  name: string().required("Category name is required.")
})


const Form = (props) => {
  const { update, setConfirm, setToast, setUpdate } = props

  const [isSaving, setIsSaving] = useState(false)

  const { handleSubmit, control, formState: { errors }, setError, setValue, reset, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: ""
    }
  })

  useEffect(() => {
    if (Boolean(update.length)) {
      setValue("name", update.data.name)
    }
  }, [update])

  const onSubmit = (data) => {
    setConfirm({
      show: true,
      loading: false,
      onConfirm: async () => {
        setIsSaving(true)
        setConfirm({
          show: false,
          loading: false,
          onConfirm: () => { }
        })

        let result
        try {
          if (update.status) result = await axios.put(`/api/categories/${update.data.id}`, data)
          else result = await axios.post(`/api/categories/`, data)

          setToast({
            show: true,
            title: "Success",
            message: result.data.message
          })
          setUpdate({
            status: false,
            data: []
          })
          reset()
        }
        catch (error) {
          const { status } = error.request
          if (status === 409) {
            const { data } = error.response

            setError("name", {
              type: "namual",
              message: data.message
            })
          }
          else {
            setToast({
              show: true,
              title: "Error",
              message: "Something went wrong whilst creating Category.",
              severity: "error"
            })
          }
        }
        setIsSaving(false)
      }
    })
  }

  const onClear = () => {
    setUpdate({
      status: false,
      data: []
    })
    reset()
  }

  return (

    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            error={errors?.category ? true : false}
            helperText={errors?.category?.message}
            className="FstoTextfieldForm-root"
            label="Category Name"
            variant="outlined"
            autoComplete="off"
            size="small"
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            fullWidth
            onChange={field.onChange}
            value={field.value}
          />
        )}
      />

      <LoadingButton
        className="FstoButtonForm-root"
        type="submit"
        variant="contained"
        loadingPosition="start"
        loading={isSaving}
        startIcon={<></>}
        disableElevation
      >
        {
          update.status
            ? "Update"
            : "Save"
        }
      </LoadingButton>

      <Button
        className="FstoButtonForm-root"
        variant="outlined"
        color="error"
        onClick={onClear}
        disableElevation
      >
        {
          update.status
            ? "Cancel"
            : "Clear"
        }
      </Button>
    </form>
  )
}

export default Form