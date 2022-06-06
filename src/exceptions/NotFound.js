import React from 'react'

import { useNavigate } from 'react-router-dom'

import {
  Box,
  Button,
  Typography
} from '@mui/material'

import Logo from '../assets/img/logo.png'

import '../assets/css/styles.notfound.scss'

const NotFound = () => {

  const navigate = useNavigate()

  return (
    <Box className="FstoNotFoundBox-root">
      <img className="FstoLogoImage-root" src={Logo} alt="Fistó App" />

      <Typography className="FstoNotFoundTypography-root" variant="h1">
        PAGE NOT FOUND
      </Typography>

      <Typography className="FstoNotFoundTypography-paragh" variant="body1">
        The page you are looking for might have been removed, <br />had it's name changed or its temporarily unavailble.
      </Typography>

      <Button
        className="FstoNotFoundButton-root"
        variant="contained"
        size="large"
        onClick={() => navigate(-1)}
      > GO BACK
      </Button>
    </Box>
  )
}

export default NotFound