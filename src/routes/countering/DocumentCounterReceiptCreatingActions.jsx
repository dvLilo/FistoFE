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

import '../../assets/css/styles.action.scss'

const DocumentCounterReceiptCreatingActions = (props) => {

  const {
    data = null,
    state = "processed",
    onView = () => { },
    onUpdate = () => { },
    onVoid = () => { },
  } = props

  const [anchor, setAnchor] = React.useState(null)

  const actionOpenHandler = (e) => {
    setAnchor(e.currentTarget)
  }

  const actionCloseHandler = () => {
    setAnchor(null)
  }

  const actionViewHandler = () => {
    onView(data)
    actionCloseHandler()
  }

  const actionUpdateHandler = () => {
    onUpdate(data)
    actionCloseHandler()
  }

  const actionVoidHandler = () => {
    onVoid(data)
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
        <MenuItem
          className="FstoMenuItemAction-root"
          onClick={actionViewHandler}
          disabled={
            state !== 'monitoring-return' &&
            state !== 'counter-void'
          }
          dense
        >
          <ViewIcon className="FstoIconAction-root" />
          View
        </MenuItem>

        {
          state !== `counter-void` &&
          <MenuItem
            className="FstoMenuItemAction-root"
            onClick={actionUpdateHandler}
            dense
          >
            <UpdateIcon className="FstoIconAction-root" />
            Edit
          </MenuItem>
        }

        {
          state !== `counter-void` &&
          <MenuItem
            className="FstoMenuItemAction-root"
            onClick={actionVoidHandler}
            dense
          >
            <VoidIcon className="FstoIconAction-root" />
            Void
          </MenuItem>
        }
      </Menu>
    </React.Fragment>
  )
}

export default DocumentCounterReceiptCreatingActions