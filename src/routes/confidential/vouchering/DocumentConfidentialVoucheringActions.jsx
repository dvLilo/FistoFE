import React from 'react'

import {
  IconButton,
  Menu,
  MenuItem
} from '@mui/material'

import {
  MoreHorizOutlined as MoreIcon,
  TaskOutlined as ReceiveIcon,
  VisibilityOutlined as ViewIcon,
  DescriptionOutlined as ManageIcon,
  ReplyOutlined as CancelIcon
} from '@mui/icons-material'

const DocumentConfidentialVoucheringActions = (props) => {

  const {
    data = null,
    state = null,
    onReceive = () => { },
    onManage = () => { },
    onView = () => { },
    onCancel = () => { }
  } = props

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
        open={!!anchor}
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
          state === `voucher-receive` &&
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
          (state === `voucher-voucher` || state === `voucher-hold` || state === `voucher-return` || state === `voucher-void`) &&
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

        {
          state === `voucher-return` &&
          <MenuItem
            sx={{ fontWeight: 500 }}
            onClick={() => {
              onCancel(data.id)
              actionCloseHandler()
            }}
            dense
          >
            <CancelIcon sx={{ fontSize: 21, marginRight: 1, opacity: 0.75 }} /> Cancel
          </MenuItem>}
      </Menu>
    </React.Fragment>
  )
}

export default DocumentConfidentialVoucheringActions