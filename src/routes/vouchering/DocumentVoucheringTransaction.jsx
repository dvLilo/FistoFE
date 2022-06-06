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

const RECEIPT_TYPE_LIST = [
  {
    id: 1,
    name: "Official"
  },
  {
    id: 2,
    name: "Unofficial"
  }
]

const DocumentVoucheringTransaction = (props) => {

  const confirm = useConfirm()

  const {
    state,
    data,
    open = false,
    onClose = () => { }
  } = props

  const [manageAccountTitle, setManageAccountTitle] = React.useState({
    data: null,
    open: false,
    onClose: () => setManageAccountTitle(currentValue => ({
      ...currentValue,
      open: false
    }))
  })

  const submitApproveHandler = (e) => {
    e.preventDefault()
    onClose()

    setManageAccountTitle(currentValue => ({
      ...currentValue,
      open: true
    }))
  }

  const submitHoldHandler = () => {
    onClose()

    confirm({
      open: true,
      wait: true,
      onConfirm: () => console.log(`${data.transaction_id} has been held.`)
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

  const submitReturnHandler = () => {
    onClose()

    confirm({
      open: true,
      wait: true,
      onConfirm: () => console.log(`${data.transaction_id} has been returned.`)
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
    <React.Fragment>
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
            (state === `receive` || state === `approve`) &&
            <form id="FstoFormTransaction" onSubmit={submitApproveHandler}>
              <Box className="FstoBoxTransaction-root">
                <Autocomplete
                  className="FstoSelectForm-root"
                  size="small"
                  options={RECEIPT_TYPE_LIST}
                  value={null}
                  renderInput={
                    props =>
                      <TextField
                        {...props}
                        variant="outlined"
                        label="Type of Receipt"
                      />
                  }
                  PaperComponent={
                    props =>
                      <Paper
                        {...props}
                        sx={{ textTransform: 'capitalize' }}
                      />
                  }
                  getOptionLabel={
                    option => option.name
                  }
                  sx={{ marginX: `10px` }}
                  onChange={(e, value) => console.log(value)}
                  disablePortal
                  disableClearable
                />
              </Box>

              <Box className="FstoBoxTransaction-root">
                <TextField
                  className="FstoTextfieldForm-root"
                  label="Net of Amount"
                  variant="outlined"
                  autoComplete="off"
                  size="small"
                  onChange={(e) => console.log(e.target.value)}
                  sx={{ marginX: `10px` }}
                />

                <TextField
                  className="FstoTextfieldForm-root"
                  label="Withholding Tax"
                  variant="outlined"
                  autoComplete="off"
                  size="small"
                  onChange={(e) => console.log(e.target.value)}
                  sx={{ marginX: `10px` }}
                />

                <TextField
                  className="FstoTextfieldForm-root"
                  label="Percentage Tax"
                  variant="outlined"
                  autoComplete="off"
                  size="small"
                  onChange={(e) => console.log(e.target.value)}
                  sx={{ marginX: `10px` }}
                />
              </Box>

              <Divider variant="middle" sx={{ margin: "1.25em" }} />

              <Box className="FstoBoxTransaction-root">
                <TextField
                  className="FstoTextfieldForm-root"
                  label="Voucher Month"
                  variant="outlined"
                  autoComplete="off"
                  size="small"
                  onChange={(e) => console.log(e.target.value)}
                  sx={{ marginX: `10px` }}
                />

                <TextField
                  className="FstoTextfieldForm-root"
                  label="Voucher Number"
                  variant="outlined"
                  autoComplete="off"
                  size="small"
                  onChange={(e) => console.log(e.target.value)}
                  sx={{ marginX: `10px` }}
                />
              </Box>

              <Divider variant="middle" sx={{ margin: "1.25em" }} />

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
                        label="Approver"
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
          (state === `receive` || state === `approve` || state === `hold`) &&
          <DialogActions>
            {
              (state === `receive` || state === `approve`) &&
              <Button
                className="FstoButtonForm-root"
                type="submit"
                form="FstoFormTransaction"
                variant="contained"
                disableElevation
              > {state === `receive` ? "Approve" : "Save"}
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
              onClick={submitReturnHandler}
              disableElevation
            > Return
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
        }
      </Dialog>

      <AccountTitle {...manageAccountTitle} />
    </React.Fragment>
  )
}

export default DocumentVoucheringTransaction