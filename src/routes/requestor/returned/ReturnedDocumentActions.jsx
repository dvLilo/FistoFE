import React from 'react'

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

import { useSelector } from 'react-redux'

const ReturnedDocumentActions = ({
  data,
  state = "return-request",
  onUpdate = () => { },
  onView = () => { },
  onVoid = () => { }
}) => {

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
        <MenuItem
          sx={{ fontWeight: 500 }}
          onClick={() => {
            onView(data)
            actionCloseHandler()
          }}
          dense
        >
          <ViewIcon sx={{ fontSize: 21, marginRight: 1, opacity: 0.75 }} /> View
        </MenuItem>

        <MenuItem
          sx={{ fontWeight: 500 }}
          onClick={() => {
            onUpdate(data)
            actionCloseHandler()
          }}
          disabled={user?.id !== data.users_id}
          dense
        >
          <UpdateIcon sx={{ fontSize: 21, marginRight: 1, opacity: 0.75 }} /> Edit
        </MenuItem>

        <MenuItem
          sx={{ fontWeight: 500 }}
          onClick={() => {
            onVoid(data)
            actionCloseHandler()
          }}
          disabled={user?.id !== data.users_id || ((data.document_id === 1 || data.document_id === 4) && data.payment_type.toLowerCase() === `partial` && !data.is_latest_transaction)}
          dense
        >
          <VoidIcon sx={{ fontSize: 21, marginRight: 1, opacity: 0.75 }} /> Void
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}

export default ReturnedDocumentActions