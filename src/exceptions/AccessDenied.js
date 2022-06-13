import React from 'react'

import { useNavigate } from 'react-router-dom'

import {
  Box,
  Button,
  Typography
} from '@mui/material'

import Logo from '../assets/img/logo.png'

import '../assets/css/styles.accessdenied.scss'

const AccessDenied = () => {

  const navigate = useNavigate()

  return (
    <Box className="FstoAccessDeniedBox-root">
      <img className="FstoLogoImage-root" src={Logo} alt="Fistó App" />

      <Typography className="FstoAccessDeniedTypography-root" variant="h1">
        ACCESS DENIED
      </Typography>

      <Typography className="FstoAccessDeniedTypography-paragh" variant="body1">
        The page you are trying to access has restricted access, <br />you are not authorized to access this page.
      </Typography>

      <Button
        className="FstoAccessDeniedButton-root"
        variant="contained"
        size="large"
        onClick={() => navigate(-1)}
      > GO BACK
      </Button>
    </Box>
  )
}

export default AccessDenied