import React from 'react'


import {
  IconButton,
  Menu,
  MenuItem
} from '@mui/material'

import {
  MoreHoriz as MoreIcon,
  VisibilityOutlined as ViewIcon,
  EditOutlined as UpdateIcon,
  ArchiveOutlined as ArchiveIcon,
  RestoreOutlined as RestoreResetIcon
} from '@mui/icons-material'

const UserAccountsActions = (props) => {

  const {
    data,
    onView,
    onUpdate,
    onStatus,
    onReset
  } = props

  const [anchorEl, setAnchorEl] = React.useState(null)

  const actionOpenHandler = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const actionCloseHandler = () => {
    setAnchorEl(null)
  }

  return (
    <React.Fragment>
      <IconButton size="small" onClick={actionOpenHandler}>
        <MoreIcon />
      </IconButton>

      <Menu
        open={Boolean(anchorEl)}
        elevation={2}
        disablePortal={true}
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: -75,
          vertical: 'bottom'
        }}
        MenuListProps={{
          sx: { py: "6px" }
        }}
        onClose={actionCloseHandler}
      >
        {
          !Boolean(data.deleted_at)
            ? [
              <MenuItem
                dense
                key={0}
                onClick={() => {
                  onView(data)
                  actionCloseHandler()
                }}
              >
                <ViewIcon sx={{ marginRight: 1 }} />View
              </MenuItem>,
              <MenuItem
                dense
                key={1}
                onClick={() => {
                  onUpdate(data)
                  actionCloseHandler()
                }}
              >
                <UpdateIcon sx={{ marginRight: 1 }} />Edit
              </MenuItem>,
              <MenuItem
                dense
                key={2}
                onClick={() => {
                  onStatus(data)
                  actionCloseHandler()
                }}
              >
                <ArchiveIcon sx={{ marginRight: 1 }} />Archive
              </MenuItem>,
              <MenuItem
                dense
                key={3}
                onClick={() => {
                  onReset(data)
                  actionCloseHandler()
                }}
              >
                <RestoreResetIcon sx={{ marginRight: 1 }} />Reset
              </MenuItem>,
            ]
            : [
              <MenuItem
                dense
                key={0}
                onClick={() => {
                  onStatus(data)
                  actionCloseHandler()
                }}
              >
                <RestoreResetIcon sx={{ marginRight: 1 }} />Restore
              </MenuItem>
            ]
        }
      </Menu>
    </React.Fragment>
  )
}

export default UserAccountsActions