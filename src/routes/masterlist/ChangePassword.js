import React from 'react'

import axios from 'axios'

import { useNavigate, useLocation } from 'react-router-dom'

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button
} from '@mui/material'

import { LoadingButton } from '@mui/lab'

import Toast from '../../components/Toast'
import Confirm from '../../components/Confirm'

const ChangePassword = () => {

  const navigate = useNavigate()
  const location = useLocation()

  const [isSaving, setIsSaving] = React.useState(false)
  const [isChange, setIsChange] = React.useState(false)

  const [error, setError] = React.useState({
    status: false,
    field: "",
    message: ""
  })

  const [toast, setToast] = React.useState({
    show: false,
    title: null,
    message: null
  })

  const [confirm, setConfirm] = React.useState({
    show: false,
    loading: false,
    onConfirm: () => { }
  })

  const [password, setPassword] = React.useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  })

  const formSubmitHandler = (e) => {
    e.preventDefault()

    setConfirm({
      show: true,
      loading: false,
      onConfirm: async () => {
        setConfirm({
          show: false,
          loading: false,
          onConfirm: () => { }
        })
        setIsSaving(true)

        let response
        try {
          response = await axios.put(`/api/users/change-password/`, {
            current: password.current_password,
            password: password.new_password,
            password_confirmation: password.confirm_password
          })
            .then(JSON => JSON.data)

          setIsChange(true)
          setToast({
            show: true,
            title: "Success",
            message: response.message
          })
          setPassword({
            current_password: String(),
            new_password: String(),
            confirm_password: String()
          })
        }
        catch (error) {
          const { status } = error.request

          if (status === 409) {
            const { data } = error.response

            setError({
              status: true,
              field: data.result.error_field,
              message: data.message
            })
          }
          else
            setToast({
              show: true,
              title: "Error",
              message: "Something went wrong whilst changing password.",
              severity: "error"
            })
        }
        setIsSaving(false)
      }
    })
  }

  const formClearHandler = () => {
    setError({
      status: false,
      field: "",
      message: ""
    })
    setPassword({
      current_password: String(),
      new_password: String(),
      confirm_password: String()
    })
  }

  const textBlurHandler = () => {
    if ((password.new_password.length && password.confirm_password.length) || password.confirm_password.length) {
      if (password.new_password !== password.confirm_password)
        setError({
          status: true,
          field: "confirm_password",
          message: "Password didn't match. Try again."
        })
      else
        if (error.field === "confirm_password")
          setError({
            status: false,
            field: "",
            message: ""
          })
    }
    else
      if (error.field === "confirm_password")
        setError({
          status: false,
          field: "",
          message: ""
        })
  }


  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperForm-root" elevation={1}>
        <Typography variant="heading" sx={{ display: 'block', marginBottom: 3 }}>Change Password</Typography>

        <form onSubmit={formSubmitHandler}>
          <TextField
            className="FstoTextfieldForm-root"
            label="Current Password"
            type="password"
            variant="outlined"
            autoComplete="off"
            size="small"
            value={password.current_password}
            error={error.status && error.field === "current_password"}
            helperText={error.status && error.field === "current_password" && error.message}
            onBlur={() => {
              if (error.field === "current_password")
                setError({
                  status: false,
                  field: "",
                  message: ""
                })
            }}
            onChange={(e) => setPassword({
              ...password,
              current_password: e.target.value
            })}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            fullWidth
          />

          <TextField
            className="FstoTextfieldForm-root"
            label="New Password"
            type="password"
            variant="outlined"
            autoComplete="off"
            size="small"
            value={password.new_password}
            onBlur={textBlurHandler}
            onChange={(e) => setPassword({
              ...password,
              new_password: e.target.value
            })}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            fullWidth
          />

          <TextField
            className="FstoTextfieldForm-root"
            label="Confirm Password"
            type="password"
            variant="outlined"
            autoComplete="off"
            size="small"
            value={password.confirm_password}
            error={error.status && error.field === "confirm_password"}
            helperText={error.status && error.field === "confirm_password" && error.message}
            onBlur={textBlurHandler}
            onChange={(e) => setPassword({
              ...password,
              confirm_password: e.target.value
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
              !Boolean(password.current_password) ||
              !Boolean(password.new_password) ||
              !Boolean(password.confirm_password) ||
              password.new_password !== password.confirm_password
            }
            disableElevation
          >
            Update
          </LoadingButton>

          {
            Boolean(password.current_password) || Boolean(password.new_password) || Boolean(password.confirm_password)
              ? <Button
                className="FstoButtonForm-root"
                variant="outlined"
                color="error"
                onClick={formClearHandler}
                disableElevation
              >
                Clear
              </Button>
              : <Button
                className="FstoButtonForm-root"
                variant="outlined"
                color="error"
                onClick={() => {
                  if (location.state) {
                    if (isChange) return navigate(location.state.previous_pathname)
                  }

                  navigate(-1)
                }}
                disableElevation
              >
                Back
              </Button>
          }
        </form>
      </Paper>

      <Toast
        open={toast.show}
        title={toast.title}
        message={toast.message}
        severity={toast.severity}
        onClose={(event, reason) => {
          if (reason === 'clickaway') return

          setToast({
            show: false,
            title: null,
            message: null
          })
        }}
      />

      <Confirm
        open={confirm.show}
        isLoading={confirm.loading}
        onConfirm={confirm.onConfirm}
        onClose={() => setConfirm({
          show: false,
          loading: false,
          onConfirm: () => { }
        })}
      />
    </Box>
  )
}

export default ChangePassword
