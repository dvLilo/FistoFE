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

const DocumentTransmittingTransaction = (props) => {

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
    onClose: () => setViewAccountTitle(currentValue => ({
      ...currentValue,
      open: false
    }))
  })

  const submitTransmitHandler = (e) => {
    e.preventDefault()
    onClose()

    confirm({
      open: true,
      wait: true,
      onConfirm: () => console.log(`${data.transaction_id} has been transmitted.`)
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
          state === `receive` &&
          <DialogActions className="FstoDialogTransaction-actions">
            <Button
              variant="contained"
              size="large"
              onClick={submitTransmitHandler}
              disableElevation
            > Transmit
            </Button>
          </DialogActions>
        }
      </Dialog>

      <AccountTitle {...viewAccountTitle} />
    </React.Fragment>
  )
}

export default DocumentTransmittingTransaction