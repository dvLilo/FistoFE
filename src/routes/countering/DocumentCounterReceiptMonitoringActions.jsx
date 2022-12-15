import React from 'react'

import {
  IconButton,
  Menu,
  MenuItem
} from '@mui/material'

import {
  MoreHoriz as MoreIcon,
  Task as ReceiveIcon,
  Visibility as ViewIcon,
  Reply as ReturnIcon,
  // Edit as UpdateIcon,
  // RemoveCircle as VoidIcon
} from '@mui/icons-material'

import '../../assets/css/styles.action.scss'

const DocumentCounterReceiptMonitoringActions = (props) => {

  const {
    data = null,
    state = null,
    onReceive = () => { },
    onView = () => { },
    onReturn = () => { },
    onCancel = () => { }
  } = props

  const [anchor, setAnchor] = React.useState(null)

  const actionOpenHandler = (e) => {
    setAnchor(e.currentTarget)
  }

  const actionCloseHandler = () => {
    setAnchor(null)
  }

  const actionReceiveHandler = () => {
    onReceive(data.id)
    actionCloseHandler()
  }

  const actionViewHandler = () => {
    onView(data.transaction)
    actionCloseHandler()
  }

  const actionReturnHandler = () => {
    onReturn(data)
    actionCloseHandler()
  }

  const actionCancelhandler = () => {
    onCancel(data.id)
    actionCloseHandler()
  }

  return (
    <React.Fragment>
      <IconButton size="small" onClick={actionOpenHandler}>
        <MoreIcon />
      </IconButton>

      <Menu
        className="FstoMenuAction-root"
        open={Boolean(anchor)}
        elevation={1}
        anchorEl={anchor}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        MenuListProps={{
          className: "FstoMenuListAction-root"
        }}
        onClose={actionCloseHandler}
        disablePortal
      >
        {
          state === 'pending' &&
          <MenuItem
            className="FstoMenuItemAction-root"
            onClick={actionReceiveHandler}
            dense
          >
            <ReceiveIcon className="FstoIconAction-root" />
            Receive
          </MenuItem>}

        {
          Boolean(/process|unprocess/i.test(state)) &&
          <MenuItem
            className="FstoMenuItemAction-root"
            onClick={actionViewHandler}
            disabled={
              state !== 'counter-process'
            }
            dense
          >
            <ViewIcon className="FstoIconAction-root" />
            View
          </MenuItem>}

        {
          state === 'monitoring-receive' &&
          <MenuItem
            className="FstoMenuItemAction-root"
            onClick={actionReturnHandler}
            dense
          >
            <ReturnIcon className="FstoIconAction-root" />
            Return
          </MenuItem>}

        {
          state === 'monitoring-return' &&
          <MenuItem
            className="FstoMenuItemAction-root"
            onClick={actionCancelhandler}
            dense
          >
            <ReturnIcon className="FstoIconAction-root" />
            Cancel
          </MenuItem>}
      </Menu>
    </React.Fragment>
  )
}

export default DocumentCounterReceiptMonitoringActions