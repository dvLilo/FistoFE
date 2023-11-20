import React from 'react'

import {
  IconButton,
  Menu,
  MenuItem
} from '@mui/material'

import {
  MoreHoriz as MoreIcon,
  TaskOutlined as ReceiveIcon,
  VisibilityOutlined as ViewIcon,
  DescriptionOutlined as ManageIcon
} from '@mui/icons-material'

const DocumentDistributingActions = ({
  data,
  state,
  onReceive,
  onManage,
  onView
}) => {

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
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        MenuListProps={{
          sx: { py: 0.5 }
        }}
        onClose={actionCloseHandler}
        disablePortal
      >
        {
          state === `pending-discharge` &&
          <MenuItem
            sx={{ fontWeight: 500 }}
            onClick={() => {
              onReceive(data.id)
              actionCloseHandler()
            }}
            dense
          >
            <ReceiveIcon sx={{ fontSize: 21, marginRight: 1, opacity: 0.75 }} /> Receive
          </MenuItem>}

        {
          state === `discharge-receive` &&
          <MenuItem
            sx={{ fontWeight: 500 }}
            onClick={() => {
              onManage(data)
              actionCloseHandler()
            }}
            dense
          >
            <ManageIcon sx={{ fontSize: 21, marginRight: 1, opacity: 0.75 }} /> Manage
          </MenuItem>}

        {
          state === `discharge-discharge` &&
          <MenuItem
            sx={{ fontWeight: 500 }}
            onClick={() => {
              onView(data)
              actionCloseHandler()
            }}
            dense
          >
            <ViewIcon sx={{ fontSize: 21, marginRight: 1, opacity: 0.75 }} /> View
          </MenuItem>}
      </Menu>
    </React.Fragment>
  )
}

export default DocumentDistributingActions