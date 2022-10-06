import React from 'react'

import {
  Autocomplete,
  Button,
  Popover,
  Stack,
  TextField
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'

const DocumentCounterReceiptReceiver = (props) => {

  const {
    index,
    receiver = null,
    data = [],
    onSubmit = () => { },
    onClear = () => { }
  } = props

  const anchorEl = React.useRef(null)

  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")

  const receiverOpenHandler = () => {
    setOpen(true)
  }

  const receiverCloseHandler = () => {
    setOpen(false)
    setName("")
  }

  const receiverSaveHandler = () => {
    onSubmit(name, index)
    receiverCloseHandler()
  }

  const receiverClearHandler = () => {
    onClear(index)
    receiverCloseHandler()
  }

  return (
    <React.Fragment>
      {
        Boolean(receiver) &&
        <span ref={anchorEl} onDoubleClick={receiverOpenHandler}>
          {receiver}
        </span>}

      {
        !Boolean(receiver) &&
        <Button
          size="small"
          ref={anchorEl}
          startIcon={<AddIcon />}
          onClick={receiverOpenHandler}
        >
          Add Receiver
        </Button>}

      <Popover
        open={open}
        anchorEl={anchorEl.current}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          sx: {
            minWidth: 280,
            padding: 2
          }
        }}
        elevation={1}
        onClose={receiverCloseHandler}
        disablePortal
      >
        <Stack direction="column" gap={1}>
          <Autocomplete
            size="small"
            options={[
              ...new Set(data.filter((item) => item.receiver !== null).map((item) => item.receiver))
            ]}
            value={name}
            renderInput={
              (props) => <TextField {...props} label="Receiver Name" variant="outlined" />
            }
            onChange={(e, value) => setName(value)}
            autoSelect
            freeSolo
            fullWidth
            disableClearable
          />

          <Stack direction="row" alignItems="right" gap={1}>
            <Button
              variant="contained"
              size="small"
              onClick={receiverSaveHandler}
              disabled={
                !Boolean(name)
              }
              disableElevation
            >
              Save
            </Button>

            <Button variant="outlined" color="error" size="small" onClick={receiverClearHandler} disableElevation>Clear</Button>

          </Stack>
        </Stack>
      </Popover>
    </React.Fragment>
  )
}

export default DocumentCounterReceiptReceiver