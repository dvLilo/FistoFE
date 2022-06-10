import React from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

import useConfirm from '../../hooks/useConfirm'

import Transaction from '../../components/Transaction'
import AccountTitle from '../../components/AccountTitle'
import ChequeEntry from '../../components/ChequeEntry'

const DocumentChequingTransaction = (props) => {

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

  const [manageCheque, setManageCheque] = React.useState({
    data: null,
    open: false,
    onBack: undefined,
    onSubmit: undefined,
    onClose: () => setManageCheque(currentValue => ({
      ...currentValue,
      open: false
    }))
  })

  const onSubmit = () => {
    confirm({
      open: true,
      wait: true,
      onConfirm: () => console.log(`${data.transaction_id} has been created.`)
    })
  }

  const submitReleaseHandler = () => {
    onClose()

    confirm({
      open: true,
      wait: true,
      onConfirm: () => console.log(`${data.transaction_id} has been released.`)
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
      onSubmit: onChequeManage
    }))
  }

  const onAccountTitleView = () => {
    onClose()

    setManageAccountTitle(currentValue => ({
      ...currentValue,
      data: data,
      open: true,
      onBack: onBack
    }))
  }

  const onChequeManage = () => {
    setManageCheque(currentValue => ({
      ...currentValue,
      data: data,
      open: true,
      onBack: onAccountTitleManage,
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

        <DialogContent className="FstoDialogTransaction-content">
          <Transaction data={data} onView={onAccountTitleView} />
        </DialogContent>

        {
          (state === `receive` || state === `create`) &&
          <DialogActions className="FstoDialogTransaction-actions">
            {
              state === `receive` &&
              <Button
                variant="contained"
                size="large"
                onClick={onAccountTitleManage}
                disableElevation
              > Create
              </Button>
            }

            {
              state === `create` &&
              <Button
                variant="contained"
                size="large"
                onClick={submitReleaseHandler}
                disableElevation
              > Release
              </Button>
            }

            {
              state === `hold` &&
              <Button
                variant="contained"
                size="large"
                onClick={submitUnholdHandler}
                disableElevation
              > Unhold
              </Button>
            }

            {
              state !== `hold` &&
              <Button
                variant="outlined"
                size="large"
                color="error"
                onClick={submitHoldHandler}
                disableElevation
              > Hold
              </Button>
            }

            <Button
              variant="outlined"
              size="large"
              color="error"
              onClick={submitReturnHandler}
              disableElevation
            > Return
            </Button>

            <Button
              variant="outlined"
              size="large"
              color="error"
              onClick={submitVoidHandler}
              disableElevation
            > Void
            </Button>
          </DialogActions>
        }
      </Dialog>

      <AccountTitle {...manageAccountTitle} />

      <ChequeEntry {...manageCheque} />
    </React.Fragment>
  )
}

export default DocumentChequingTransaction