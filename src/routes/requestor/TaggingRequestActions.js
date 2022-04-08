import React from 'react'

import {
  IconButton,
  Menu,
  MenuItem
} from '@mui/material'

import {
  MoreHoriz as MoreIcon,
  Visibility as ViewIcon,
  Edit as UpdateIcon
} from '@mui/icons-material'

const TaggingRequestActions = () => {

  const [anchor, setAnchor] = React.useState(null)

  const actionOpenHandler = (event) => {
    setAnchor(event.currentTarget)
  }

  const actionCloseHandler = () => {
    setAnchor(null)
  }

  return (
    <React.Fragment>
      <IconButton size="small" onClick={actionOpenHandler}>
        <MoreIcon />
      </IconButton>

      <Menu
        open={Boolean(anchor)}
        elevation={2}
        anchorEl={anchor}
        anchorOrigin={{
          horizontal: -60,
          vertical: 'bottom'
        }}
        MenuListProps={{
          sx: { py: 0.5 }
        }}
        onClose={actionCloseHandler}
        disablePortal
      >
        <MenuItem onClick={() => { }} sx={{ fontWeight: 500 }} dense>
          <ViewIcon sx={{ fontSize: 21, marginRight: 1, opacity: 0.75 }} /> View
        </MenuItem>

        <MenuItem onClick={() => { }} sx={{ fontWeight: 500 }} dense>
          <UpdateIcon sx={{ fontSize: 21, marginRight: 1, opacity: 0.75 }} /> Edit
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}

export default TaggingRequestActions