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
    state,
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
      onConfirm: () => console.log(`${data.transaction_id} has been tagged/saved.`)
    })
  }

  const submitUnholdHandler = () => {
    onClose()

    confirm({
      open: true,
      wait: true,
      onConfirm: () => console.log(`${data.transaction_id} has been unhold.`)
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

        {
          (state === `receive` || state === `tag`) &&
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
                sx={{ marginX: `10px` }}
                onChange={(e, value) => console.log(value)}
                disablePortal
                disableClearable
              />
            </Box>
          </form>
        }
      </DialogContent>

      {
        (state === `receive` || state === `tag` || state === `hold`) &&
        <DialogActions>
          {
            (state === `receive` || state === `tag`) &&
            <Button
              className="FstoButtonForm-root"
              type="submit"
              form="FstoFormTransaction"
              variant="contained"
              disableElevation
            > {state === `receive` ? "Tag" : "Save"}
            </Button>
          }

          {
            state === `hold` &&
            <Button
              className="FstoButtonForm-root"
              variant="contained"
              onClick={submitUnholdHandler}
              disableElevation
            > Unhold
            </Button>
          }

          {
            state !== `hold` &&
            <Button
              className="FstoButtonForm-root"
              variant="outlined"
              color="error"
              onClick={submitHoldHandler}
              disableElevation
            > Hold
            </Button>
          }

          <Button
            className="FstoButtonForm-root"
            variant="outlined"
            color="error"
            onClick={submitVoidHandler}
            disableElevation
          > Void
          </Button>
        </DialogActions>
      }
    </Dialog>
  )
}

export default DocumentTaggingTransaction