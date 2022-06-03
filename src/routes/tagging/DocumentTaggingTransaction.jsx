import React from 'react'

import {
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  TextField,
  Box,
  Button
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

import useConfirm from '../../hooks/useConfirm'

import Transaction from '../../components/Transaction'

const DocumentTaggingTransaction = (props) => {

  const confirm = useConfirm()

  const {
    data,
    open = false,
    onClose = () => { }
  } = props

  const submitTagHandler = (e) => {
    e.preventDefault()
    onClose()

    confirm({
      open: true,
      wait: true,
      onConfirm: () => console.log(`${data.transaction_id} has been tagged.`)
    })
  }

  const submitHoldHandler = () => {
    onClose()

    confirm({
      open: true,
      wait: true,
      onConfirm: () => console.log(`${data.transaction_id} has been held.`)
    })
  }

  const submitVoidHandler = () => {
    onClose()

    confirm({
      open: true,
      wait: true,
      onConfirm: () => console.log(`${data.transaction_id} has been voided.`)
    })
  }

  return (
    <Dialog
      className="FstoDialogTransaction-root"
      open={open}
      scroll="body"
      maxWidth="lg"
      PaperProps={{
        className: "FstoPaperTransaction-root"
      }}
      onClose={onClose}
      fullWidth
      disablePortal
    >
      <DialogTitle className="FstoDialogTransaction-title">
        Transaction
        <IconButton size="large" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="FstoDialogTransaction-body">
        <Transaction data={data} />

        <form id="FstoFormTransaction" onSubmit={submitTagHandler}>
          <Box className="FstoBoxTransaction-root">
            <Autocomplete
              className="FstoSelectForm-root"
              size="small"
              options={[]}
              value={null}
              renderInput={
                props =>
                  <TextField
                    {...props}
                    variant="outlined"
                    label="Distribute To..."
                  />
              }
              PaperComponent={
                props =>
                  <Paper
                    {...props}
                    sx={{ textTransform: 'capitalize' }}
                  />
              }
              sx={{ width: `33.33%` }}
              onChange={(e, value) => console.log(value)}
              disablePortal
              disableClearable
            />
          </Box>
        </form>
      </DialogContent>

      <DialogActions>
        <Button
          className="FstoButtonForm-root"
          type="submit"
          form="FstoFormTransaction"
          variant="contained"
          disableElevation
        > Tag
        </Button>

        <Button
          className="FstoButtonForm-root"
          variant="outlined"
          color="error"
          onClick={submitHoldHandler}
          disableElevation
        > Hold
        </Button>

        <Button
          className="FstoButtonForm-root"
          variant="outlined"
          color="error"
          onClick={submitVoidHandler}
          disableElevation
        > Void
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DocumentTaggingTransaction