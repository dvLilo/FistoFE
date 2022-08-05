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

import TransactionDialog from '../../components/TransactionDialog'
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
    onBack = () => { },
    onClose = () => { }
  } = props

  const [manageAccountTitle, setManageAccountTitle] = React.useState({
    data: null,
    open: false,
    onBack: undefined,
    onSubmit: undefined,
    onClose: () => setManageAccountTitle(currentValue => ({
      ...currentValue,
      open: false
    }))
  })

  const onSubmit = () => {
    confirm({
      open: true,
      wait: true,
      onConfirm: () => console.log(`${data.transaction_id} has been submitted.`)
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

  const onAccountTitleManage = () => {
    onClose()

    setManageAccountTitle(currentValue => ({
      ...currentValue,
      data: data,
      open: true,
      onBack: onBack,
      onSubmit: onSubmit
    }))
  }

  const onAccountTitleView = () => {
    onClose()

    setManageAccountTitle(currentValue => ({
      ...currentValue,
      data: data,
      open: true,
      onBack: onBack,
      onSubmit: onSubmit
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
          Transaction Details
          <IconButton size="large" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent className="FstoDialogTransaction-content">
          <TransactionDialog data={data} onView={onAccountTitleView} />

          {
            (state === `receive` || state === `approve`) &&
            <React.Fragment>
              <Divider className="FstoDividerTransaction-root" variant="middle" />

              <Box className="FstoBoxTransactionForm-root">
                <Box className="FstoBoxTransactionForm-content">
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
                    onChange={(e, value) => console.log(value)}
                    fullWidth
                    disablePortal
                    disableClearable
                  />

                  <TextField
                    className="FstoTextfieldForm-root"
                    label="Net of Amount"
                    variant="outlined"
                    autoComplete="off"
                    size="small"
                    onChange={(e) => console.log(e.target.value)}
                    fullWidth
                  />

                  <TextField
                    className="FstoTextfieldForm-root"
                    label="Withholding Tax"
                    variant="outlined"
                    autoComplete="off"
                    size="small"
                    onChange={(e) => console.log(e.target.value)}
                    fullWidth
                  />

                  <TextField
                    className="FstoTextfieldForm-root"
                    label="Percentage Tax"
                    variant="outlined"
                    autoComplete="off"
                    size="small"
                    onChange={(e) => console.log(e.target.value)}
                    fullWidth
                  />
                </Box>

                <Box className="FstoBoxTransactionForm-content">
                  <TextField
                    className="FstoTextfieldForm-root"
                    label="Voucher Month"
                    variant="outlined"
                    autoComplete="off"
                    size="small"
                    onChange={(e) => console.log(e.target.value)}
                    fullWidth
                  />

                  <TextField
                    className="FstoTextfieldForm-root"
                    label="Voucher Number"
                    variant="outlined"
                    autoComplete="off"
                    size="small"
                    onChange={(e) => console.log(e.target.value)}
                    fullWidth
                  />

                  <Divider variant="middle" sx={{ margin: "1.25em" }} />

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
                    onChange={(e, value) => console.log(value)}
                    fullWidth
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
                onClick={onAccountTitleManage}
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

      <AccountTitle {...manageAccountTitle} />
    </React.Fragment>
  )
}

export default DocumentVoucheringTransaction