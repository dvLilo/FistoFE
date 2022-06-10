import React from 'react'

import {
  IconButton,
  Popover,
  Typography
} from '@mui/material'

import {
  FilterList as FilterIcon
} from '@mui/icons-material'

const DocumentApprovingFilter = () => {

  const [anchor, setAnchor] = React.useState(null)

  const filterOpenHandler = (e) => {
    setAnchor(e.currentTarget)
  }

  const filterCloseHandler = () => {
    setAnchor(null)
  }

  return (
    <React.Fragment>
      <IconButton className="FstoIconButtonFilter-root" onClick={filterOpenHandler}>
        <FilterIcon />
      </IconButton>

      <Popover
        className="FstoPopoverFilter-root"
        open={Boolean(anchor)}
        anchorEl={anchor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          className: "FstoPaperFilter-root"
        }}
        elevation={3}
        onClose={filterCloseHandler}
        disablePortal
      >
        <Typography variant="h2">Hello, World.</Typography>
      </Popover>
    </React.Fragment>
  )
}

export default DocumentApprovingFilter