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

const ActionMenu = ({ data, view, onEdit, onArchive, onRestore }) => {

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
          view
          ? (
              <Box>
                <MenuItem dense={true} onClick={() => onEdit(data)}>
                  <Edit sx={{ mr: 1 }} /> Edit
                </MenuItem>

                <MenuItem dense={true} onClick={() => onArchive(data)}>
                  <Archive sx={{ mr: 1 }} /> Archive
                </MenuItem>
              </Box>
            )
          : (
              <MenuItem dense={true}  onClick={() => onRestore(data)}>
                <Restore sx={{ mr: 1 }} /> Restore
              </MenuItem>
            )
        }
      </Menu>
    </React.Fragment>
  )
}

export default ActionMenu
