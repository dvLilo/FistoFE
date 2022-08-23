import React from 'react'

import { useSelector } from 'react-redux'

import {
  IconButton,
  Menu,
  MenuItem
} from '@mui/material'

import {
  MoreHoriz as MoreIcon,
  TaskOutlined as ReceiveIcon,
  VisibilityOutlined as ViewIcon,
  DescriptionOutlined as ManageIcon,
  ReplyOutlined as TransferIcon
} from '@mui/icons-material'

const DocumentTransmittingActions = ({ data, state, onReceive, onManage, onView, onTransfer }) => {

  const user = useSelector(state => state.user)

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
          state === `pending` &&
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
          state === `pending` && user.role === `AP Specialist` &&
          <MenuItem
            sx={{ fontWeight: 500 }}
            onClick={() => {
              onTransfer(data)
              actionCloseHandler()
            }}
            dense
          >
            <TransferIcon sx={{ fontSize: 21, marginRight: 1, opacity: 0.75, transform: `scaleX(-1)` }} /> Transfer
          </MenuItem>}

        {
          state === `transmit-receive` &&
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
          state === `transmit-transmit` &&
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

export default DocumentTransmittingActions