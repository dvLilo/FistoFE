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
  Button,
  Divider
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

  const submitTagHandler = () => {
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

  const submitReturnHandler = () => {
    onClose()

    confirm({
      open: true,
      wait: true,
      onConfirm: () => console.log(`${data.transaction_id} has been return.`)
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
        Transaction Details
        <IconButton size="large" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="FstoDialogTransaction-content">
        <Transaction data={data} />

        {
          (state === `receive` || state === `tag`) &&
          <React.Fragment>
            <Divider className="FstoDividerTransaction-root" variant="middle" />

            <Box className="FstoBoxTransactionForm-root">
              <Box className="FstoBoxTransactionForm-content">
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
            </Box>
          </React.Fragment>
        }
      </DialogContent>

      {
        (state === `receive` || state === `tag` || state === `hold`) &&
        <DialogActions className="FstoDialogTransaction-actions">
          {
            (state === `receive` || state === `tag`) &&
            <Button
              variant="contained"
              onClick={submitTagHandler}
              disableElevation
            > {state === `receive` ? "Tag" : "Save"}
            </Button>
          }

          {
            state === `hold` &&
            <Button
              variant="contained"
              onClick={submitUnholdHandler}
              disableElevation
            > Unhold
            </Button>
          }

          {
            state !== `hold` &&
            <Button
              variant="outlined"
              color="error"
              onClick={submitHoldHandler}
              disableElevation
            > Hold
            </Button>
          }

          <Button
            variant="outlined"
            color="error"
            onClick={submitReturnHandler}
            disableElevation
          > Return
          </Button>

          <Button
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