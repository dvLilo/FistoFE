import React from 'react'

import CryptoJS from 'crypto-js'

import { useNavigate } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'
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

  const user = useSelector((state) => state.user)
  const session = window.localStorage.getItem("token")

  React.useEffect(() => {
    if (session && user) {
      const REDIRECT = handleRedirect(user.role)
      navigate(REDIRECT, { replace: true })
    }
    // eslint-disable-next-line
  }, [])

  const handleRedirect = (role) => {
    switch (role.toLowerCase()) {
      case 'requestor':
        return `/request`

      case 'ap tagging':
        return `/document/tagging`

      case 'ap associate':
      case 'ap specialist':
        return `/voucher/vouchering`

      case 'treasury associate':
        return `/cheque/chequing`

      case 'approver':
        return `/approval`

      default:
        return `/masterlist/users`
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    let response
    try {
      response = await axios.post(`/api/login`, credential)
      const { token, ...user } = response.data.result

      dispatch(SET_AUTH())
      dispatch(SET_USER(user))

      const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(user), process.env.REACT_APP_SECRET_KEY).toString()

      window.localStorage.setItem('token', JSON.stringify(token))
      window.localStorage.setItem('user', encryptedUser)

      const REDIRECT = handleRedirect(user.role)
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
    <Box className="FstoLoginBox-root">
      <Box className="FstoLoginBox-wrap">
        <Box className="FstoLoginBox-logo">
          <img src={FistoLogo} alt="Fistó App" />
        </Box>

        <Box className="FstoLoginBox-form" component="form" onSubmit={handleSubmit}>
          <Box className="FstoLoginBox-group">
            <Person sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              label="Username"
              variant="standard"
              size="small"
              autoComplete="off"
              value={credential.username}
              onChange={(e) => setCredential(currentValue => ({
                ...currentValue,
                username: e.target.value
              }))}
              InputProps={{
                sx: { paddingLeft: 1 }
              }}
              InputLabelProps={{
                sx: { fontSize: "0.8em", lineHeight: "1.43em" }
              }}
              fullWidth
            />
          </Box>

          <Box className="FstoLoginBox-group">
            <Lock sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              label="Password"
              variant="standard"
              size="small"
              autoComplete="off"
              type={visibility ? "text" : "password"}
              value={credential.password}
              onChange={(e) => setCredential(currentValue => ({
                ...currentValue,
                password: e.target.value
              }))}
              InputProps={{
                sx: { paddingLeft: 1 },
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      edge="end"
                      onClick={() => setVisibility(!visibility)}
                      sx={{
                        '&:hover': { backgroundColor: 'transparent' }
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

          <Box className="FstoLoginBox-group" sx={{ justifyContent: 'flex-end', mt: 8 }}>
            <LoadingButton
              variant="contained"
              type="submit"
              color="secondary"
              startIcon={<></>}
              loading={loading}
              loadingPosition="start"
              sx={{ px: 4 }}
              disableElevation
            > Sign-In
            </LoadingButton>
          </Box>
        </Box>
      </Box>

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
          })}
        >
          <AlertTitle>Error!</AlertTitle>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Landing
