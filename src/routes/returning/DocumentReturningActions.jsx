import React from 'react'

import {
  IconButton,
  Menu,
  MenuItem
} from '@mui/material'

import {
  MoreHoriz as MoreIcon,
  VisibilityOutlined as ViewIcon,
  DescriptionOutlined as ManageIcon,

  ModeEditOutlineOutlined as UpdateIcon,
  RemoveCircleOutlineOutlined as VoidIcon
} from '@mui/icons-material'

import { useSelector } from 'react-redux'

const DocumentReturningActions = (props) => {

  const {
    data,
    state = "return-return",
    onManage = () => { },
    onUpdate = () => { },
    onView = () => { },
    onVoid = () => { }
  } = props

  const user = useSelector(state => state.user)

  const [anchor, setAnchor] = React.useState(null)

  const actionOpenHandler = (e) => {
    setAnchor(e.currentTarget)
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
          state === `return-return` && user?.role !== 'Requestor' &&
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
          (state === `return-hold` || state === `return-void` || (state === `return-return` && user?.role === `Requestor`)) &&
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
          state === `return-return` && user?.role === `Requestor` &&
          <MenuItem
            sx={{ fontWeight: 500 }}
            onClick={() => {
              onUpdate(data)
              actionCloseHandler()
            }}
            disabled={user?.id !== data.users_id || (data.document_id === 4 && data.payment_type.toLowerCase() === `partial` && !data.is_latest_transaction)}
            dense
          >
            <UpdateIcon sx={{ fontSize: 21, marginRight: 1, opacity: 0.75 }} /> Edit
          </MenuItem>}

        {
          state === `return-return` && user?.role === `Requestor` &&
          <MenuItem
            sx={{ fontWeight: 500 }}
            onClick={() => {
              onVoid(data)
              actionCloseHandler()
            }}
            disabled={user?.id !== data.users_id || (data.document_id === 4 && data.payment_type.toLowerCase() === `partial` && !data.is_latest_transaction)}
            dense
          >
            <VoidIcon sx={{ fontSize: 21, marginRight: 1, opacity: 0.75 }} /> Void
          </MenuItem>}
      </Menu>
    </React.Fragment>
  )
}

export default DocumentReturningActions