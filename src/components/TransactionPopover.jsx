import React from 'react'

import {
  Fade,
  IconButton, Paper, Popper
} from '@mui/material'

import InfoIcon from '@mui/icons-material/InfoOutlined'

const TransactionPopover = ({ children }) => {

  const anchorEl = React.useRef(null)

  const [open, setOpen] = React.useState(false)

  return (
    <>
      <IconButton
        ref={anchorEl}
        onClick={() => setOpen((currentValue) => !currentValue)}
      >
        <InfoIcon />
      </IconButton>

      <Popper
        open={open}
        anchorEl={anchorEl.current}
        placement="right-start"
        modifiers={[
          {
            name: 'flip',
            enabled: true,
            options: {
              altBoundary: true,
              rootBoundary: 'viewport',
              padding: 8,
            },
          },
          {
            name: 'preventOverflow',
            enabled: true,
            options: {
              altAxis: true,
              altBoundary: true,
              tether: true,
              rootBoundary: 'viewport',
              padding: 8,
            },
          }
        ]}
        sx={{
          zIndex: 1500
        }}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              {children}
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default TransactionPopover