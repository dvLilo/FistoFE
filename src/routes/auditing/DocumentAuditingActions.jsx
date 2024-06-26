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
  DescriptionOutlined as ManageIcon,
  ReplyOutlined as CancelIcon
} from '@mui/icons-material'

const DocumentAuditingActions = ({
  data,
  state,
  onReceive,
  onManage,
  onView,
  onCancel
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
          state === `pending-audit` &&
          <MenuItem
            sx={{ fontWeight: 500 }}
            onClick={() => {
              onReceive({
                bank_id: data.bank.id,
                cheque_no: data.no
              })
              actionCloseHandler()
            }}
            dense
          >
            <ReceiveIcon sx={{ fontSize: 21, marginRight: 1, opacity: 0.75 }} /> Receive
          </MenuItem>}

        {
          state === `audit-receive` &&
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
          (state === `audit-audit` || state === `audit-hold` || state === `audit-return` || state === `audit-void`) &&
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
          state === `audit-return` &&
          <MenuItem
            sx={{ fontWeight: 500 }}
            onClick={() => {
              onCancel({
                bank_id: data.bank.id,
                cheque_no: data.no
              })
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

export default DocumentAuditingActions