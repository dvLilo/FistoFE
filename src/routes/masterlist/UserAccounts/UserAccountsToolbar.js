import React from 'react'

import { Link } from 'react-router-dom'

import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'

const UserAccountsToolbar = (props) => {

  const {
    fetching,
    searchData, // Handler
    searchClear, // Handler
    statusChange // Handler
  } = props

  const searchRef = React.useRef()

  const [status, setStatus] = React.useState(true)

  return (
    <React.Fragment>
      <Box className="FstoBoxToolbar-left">
        <Typography variant="heading">User Accounts</Typography>

        <Button
          className="FstoButtonNew-root"
          variant="contained"
          component={Link}
          startIcon={<AddIcon />}
          to="/masterlist/new-user"
          disableElevation
        >
          New
        </Button>
      </Box>

      <Box className="FstoBoxToolbar-right">
        <Button
          className="FstoButtonMode-root"
          variant="text"
          size="small"
          onClick={() => {
            if (fetching) return

            setStatus(currentValue => (
              !currentValue
            ))
            statusChange()
          }}
          sx={{
            color:
              status
                ? "#ef5350"
                : "#4caf50"
          }}
        >
          {
            status
              ? "View Archived"
              : "View Active"
          }
        </Button>

        <TextField
          variant="outlined"
          size="small"
          autoComplete="off"
          placeholder="Search"
          InputProps={{
            className: "FstoTextfieldSearch-root",
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => {
                    if (fetching || !searchRef.current.value) return

                    searchRef.current.value = null
                    searchClear()
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
          inputRef={searchRef}
          onKeyPress={searchData}
        />
      </Box>
    </React.Fragment>
  )
}

export default UserAccountsToolbar