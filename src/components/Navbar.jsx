import React from 'react'

import axios from 'axios'

import { useSelector, useDispatch } from 'react-redux'
import { TOGGLE_SIDEBAR } from '../actions'

import {
  useNavigate,
  Link as RouterLink
} from 'react-router-dom'

import {
  Link,
  Box,
  IconButton,
  Divider,
  Popover,
  Typography
} from '@mui/material'

import {
  Reorder,
  Person
} from '@mui/icons-material'

import '../assets/css/styles.navbar.scss'

const Navbar = () => {

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()

  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  const showMenuHandler = $event => {
    setAnchorEl($event.currentTarget)
  }
  const closeMenuHandler = () => {
    setAnchorEl(null)
  }
  const toggleSidebarHandler = () => {
    dispatch(TOGGLE_SIDEBAR())
  }
  const logoutHandler = async () => {
    try {
      await axios.post(`/api/logout`)
    }
    catch (error) {
      console.log(error.response)
    }

    window.localStorage.clear()
    navigate("/", { replace: true })
  }

  return (
    <nav className="FstoNavbar-root">
      <Box className="FstoNavbar-toggle">
        <IconButton onClick={toggleSidebarHandler}>
          <Reorder />
        </IconButton>
      </Box>

      <Box className="FstoNavbar-user">
        <h5>Hi, { user.first_name?.split(" ")[0] }</h5>

        <IconButton 
          sx={{ backgroundColor: "#E0E0E0", ml: 1 }} 
          onClick={showMenuHandler} 
        >
          <Person />
        </IconButton>
      </Box>

      <Popover
        className="Hello"
        open={open}
        elevation={2}
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: -285,
          vertical: 'bottom'
        }}
        PaperProps={{
          className: "FstoNavbar-menu"
        }}
        onClose={closeMenuHandler}
      >
        <Typography
          variant="h6"
          sx={{
            minWidth: 270,
            fontWeight: 700,
            textTransform: "uppercase",
            lineHeight: 1
          }}
        >
          { user.last_name }, { user.first_name } { user.middle_name?.charAt(0) }.
        </Typography>

        <Typography
          variant="caption"
          sx={{
            fontWeight: 500,
            textTransform: "uppercase",
            lineHeight: 1
          }}
        >
          { user.role }
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="subtitle2"
          sx={{
            mb: 1,
            fontWeight: 700
          }}
        >
          Profile Settings
        </Typography>

        <Typography variant="subtitle1">
          <Link
            to="change-password"
            component={RouterLink}
            onClick={closeMenuHandler}
            sx={{
              display: 'block',
              ml: 2,
              color: 'black',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            Change Password
          </Link>
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography
          variant="subtitle1"
          sx={{
            ml: 2,
            color: 'black',
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
          onClick={logoutHandler}
        >
          Log Out
        </Typography>
      </Popover>
    </nav>
  )
}

export default Navbar
