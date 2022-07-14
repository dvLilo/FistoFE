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
import AccountTitle from '../../components/AccountTitle'

const DocumentApprovingTransaction = (props) => {

  const confirm = useConfirm()

  const {
    state,
    data,
    open = false,
    onBack = () => { },
    onClose = () => { }
  } = props

  const [viewAccountTitle, setViewAccountTitle] = React.useState({
    data: null,
    open: false,
    onBack: undefined,
    onSubmit: undefined,
    onClose: () => setViewAccountTitle(currentValue => ({
      ...currentValue,
      open: false
    }))
  })

  const submitApproveHandler = () => {
    onClose()

    confirm({
      open: true,
      wait: true,
      onConfirm: () => console.log(`${data.transaction_id} has been approved.`)
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
      onConfirm: () => console.log(`${data.transaction_id} has been returned.`)
    })
  }

  const onAccountTitleView = () => {
    onClose()

    setViewAccountTitle(currentValue => ({
      ...currentValue,
      data: data,
      open: true,
      onBack: onBack
    }))
  }

  return (
    <React.Fragment>
      <Dialog
        className="FstoDialogTransaction-root"
        open={open}
        scroll="body"
        maxWidth="lg"
        PaperProps={{
          className: "FstoPaperTransaction-root"
        }}
        fullWidth
        disablePortal
      >
        <DialogTitle className="FstoDialogTransaction-title">
          Transaction
          <IconButton size="large" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent className="FstoDialogTransaction-content">
          <Transaction data={data} onView={onAccountTitleView} />

          {
            (state === `receive` || state === `approve`) &&
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
          (state === `receive` || state === `approve` || state === `hold`) &&
          <DialogActions className="FstoDialogTransaction-actions">
            {
              (state === `receive` || state === `approve`) &&
              <Button
                variant="contained"
                onClick={submitApproveHandler}
                disableElevation
              > {state === `receive` ? "Approve" : "Save"}
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
          </DialogActions>
        }
      </Dialog>

      <AccountTitle {...viewAccountTitle} />
    </React.Fragment>
  )
}

export default DocumentApprovingTransaction