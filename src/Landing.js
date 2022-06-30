import React from 'react'

import CryptoJS from 'crypto-js'

import { useNavigate } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { SET_AUTH, SET_USER } from './actions'

import FistoLogo from './assets/img/logo_s.png'
import './assets/css/styles.login.scss'

import { LoadingButton } from '@mui/lab'
import {
  Box,
  Snackbar,
  Alert,
  AlertTitle,
  TextField,
  IconButton,
  InputAdornment
} from '@mui/material'

import {
  Person,
  Lock,
  VisibilityOutlined as VisibilityOn,
  VisibilityOffOutlined as VisibilityOff
} from '@mui/icons-material'

import axios from 'axios'

const Landing = () => {

  const [loading, setLoading] = React.useState(false)
  const [visibility, setVisibility] = React.useState(false)
  const [toast, setToast] = React.useState({
    show: false,
    message: ""
  })
  const [credential, setCredential] = React.useState({
    username: "",
    password: ""
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()

  React.useEffect(() => {
    const session = window.localStorage.getItem("token")

    if (session) navigate('/masterlist/users', { replace: true })

    // eslint-disable-next-line
  }, [])

  const handleVisibility = () => {
    setVisibility(!visibility)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    let response
    try {
      response = await axios.post(`/api/login`, credential)
      const { token, ...user } = response.data.result

      const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(user), process.env.REACT_APP_SECRET_KEY).toString()

      window.localStorage.setItem('token', JSON.stringify(token))
      window.localStorage.setItem('user', encryptedUser)

      dispatch(SET_AUTH())
      dispatch(SET_USER(user))

      let REDIRECT
      switch (user.role) {
        case 'Requestor':
          REDIRECT = '/request'
          break

        case 'AP Tagging':
          REDIRECT = '/document/tagging'
          break

        case 'AP Associate':
        case 'AP Specialist':
          REDIRECT = '/voucher/vouchering'
          break

        case 'Treasury Associate':
          REDIRECT = '/cheque/chequing'
          break

        case 'Approver':
          REDIRECT = '/approval'
          break

        default:
          REDIRECT = '/masterlist/users'
      }

      // Redirect to Dashboard
      navigate(REDIRECT, {
        state: {
          default_password: credential.username === credential.password ? true : false
        }
      })

    }
    catch (error) {
      if (error.request.status === 401) {
        setToast({
          show: true,
          message: "Invalid username or password. Please try again."
        })
      }
      else {
        setToast({
          show: true,
          message: "Something went wrong whilst trying to login. Please try again."
        })
      }

      setLoading(false)
    }
  }

  return (
    <main className="fsto-login">
      <div className="fsto-login-wrapper">
        <div className="fsto-logo">
          <img className="fsto-logo-img" src={FistoLogo} alt="Fistó App" />
        </div>
        <form className="fsto-login-form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 3 }}>
            <Person sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              autoComplete="off"
              variant="standard"
              size="small"
              label="Username"
              value={credential.username}
              onChange={$event => setCredential({ ...credential, username: $event.target.value })}
              InputProps={{
                sx: { paddingLeft: 1 }
              }}
              InputLabelProps={{
                sx: { fontSize: "0.8em", lineHeight: "1.43em" }
              }}
              fullWidth
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 3 }}>
            <Lock sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              autoComplete="off"
              variant="standard"
              size="small"
              label="Password"
              type={visibility ? "text" : "password"}
              value={credential.password}
              onChange={$event => setCredential({ ...credential, password: $event.target.value })}
              InputProps={{
                sx: { paddingLeft: 1 },
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      edge="end"
                      onClick={handleVisibility}
                      sx={{
                        '&:hover': {
                          background: 'none'
                        }
                      }}
                    >
                      {visibility ? <VisibilityOff /> : <VisibilityOn />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              InputLabelProps={{
                sx: { fontSize: "0.8em", lineHeight: "1.43em" }
              }}
              fullWidth
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 8 }}>
            <LoadingButton
              type="submit"
              loading={loading}
              loadingPosition="start"
              startIcon={<></>}
              variant="contained"
              color="secondary"
              sx={{
                textTransform: 'capitalize',
                px: 4
              }}
              disableElevation
            >
              Sign-In
            </LoadingButton>
          </Box>
        </form>
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        open={toast.show}
        autoHideDuration={5000}
      >
        <Alert
          severity="error"
          onClose={() => setToast({
            ...toast, show: false
          }
          )}
        >
          <AlertTitle>Error</AlertTitle>
          {toast.message}
        </Alert>
      </Snackbar>
    </main>
  )
}

export default Landing
