import React from 'react'

import {
  Box,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material'
import {
  MoreHoriz as Action,
  EditOutlined as Edit,
  ArchiveOutlined as Archive,
  RestoreOutlined as Restore
} from '@mui/icons-material'

const ActionMenu = ({
  data,
  onUpdateChange,
  onStatusChange
}) => {

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
        <Action />
      </IconButton>

      <Menu
        open={Boolean(anchorEl)}
        elevation={2}
        anchorEl={anchorEl}
        disablePortal={true}
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
            ? (
              <Box>
                <MenuItem dense={true} onClick={() => {
                  onUpdateChange(data)
                  actionCloseHandler()
                }}>
                  <Edit sx={{ mr: 1 }} /> Edit
                </MenuItem>

                <MenuItem dense={true} onClick={() => {
                  onStatusChange(data)
                  actionCloseHandler()
                }}>
                  <Archive sx={{ mr: 1 }} /> Archive
                </MenuItem>
              </Box>
            )
            : (
              <MenuItem dense={true} onClick={() => {
                onStatusChange(data)
                actionCloseHandler()
              }}>
                <Restore sx={{ mr: 1 }} /> Restore
              </MenuItem>
            )
        }
      </Menu>
    </React.Fragment>
  )
}

export default ActionMenu
