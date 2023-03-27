import React from 'react'

import { useSelector } from 'react-redux'

import {
  IconButton,
  Menu,
  MenuItem
} from '@mui/material'

import {
  MoreHoriz as MoreIcon,
  Visibility as ViewIcon,
  Edit as UpdateIcon,
  RemoveCircle as VoidIcon
} from '@mui/icons-material'

const DocumentRequestingActions = (props) => {

  const user = useSelector(state => state.user)

  const {
    state,
    data,
    onView = () => { },
    onUpdate = () => { },
    onVoid = () => { }
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
          (state === `pending-request-requestor` || state === `requestor-void`)
          &&
          <MenuItem dense
            sx={{ fontWeight: 500 }}
            onClick={() => {
              onView(data)
              actionCloseHandler()
            }}
          >
            <ViewIcon sx={{ fontSize: 21, marginRight: 1, opacity: 0.75 }} /> View
          </MenuItem>}

        {
          (state === `pending-request-requestor`)
          &&
          <MenuItem dense
            sx={{ fontWeight: 500 }}
            onClick={() => {
              onUpdate(data)
              actionCloseHandler()
            }}
            disabled={user?.id !== data.users_id || (data.document_id === 4 && data.payment_type.toLowerCase() === `partial` && !data.is_latest_transaction) || data.status.toLowerCase() !== `pending`}
          >
            <UpdateIcon sx={{ fontSize: 21, marginRight: 1, opacity: 0.75 }} /> Edit
          </MenuItem>}

        {
          (state === `pending-request-requestor`)
          &&
          <MenuItem dense
            sx={{ fontWeight: 500 }}
            onClick={() => {
              onVoid(data)
              actionCloseHandler()
            }}
            disabled={user?.id !== data.users_id || (data.document_id === 4 && data.payment_type.toLowerCase() === `partial` && !data.is_latest_transaction) || data.status.toLowerCase() !== `pending`}
          >
            <VoidIcon sx={{ fontSize: 21, marginRight: 1, opacity: 0.75 }} /> Void
          </MenuItem>}
      </Menu>
    </React.Fragment>
  )
}

export default DocumentRequestingActions