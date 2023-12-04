import React from 'react'

import axios from 'axios'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Divider,
  Autocomplete,
  Box,
  TextField,
  Paper
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

import useToast from '../../hooks/useToast'
import useConfirm from '../../hooks/useConfirm'
import useTransaction from '../../hooks/useTransaction'

import { GAS } from '../../constants'

import TransactionDialog from '../../components/TransactionDialog'
import AccountTitleDialog from '../../components/AccountTitleDialog'
import ChequeEntryDialog from '../../components/ChequeEntryDialog'

const DocumentTransferringTransaction = (props) => {

  const {
    state,
    open = false,
    transaction = null,
    refetchData = () => { },
    onHold = () => { },
    onUnhold = () => { },
    onReturn = () => { },
    onBack = () => { },
    onClose = () => { }
  } = props

  const toast = useToast()
  const confirm = useConfirm()

  const {
    data,
    status,
    refetch: fetchTransaction
  } = useTransaction(transaction?.id)

  React.useEffect(() => {
    if (open) fetchTransaction()

    // eslint-disable-next-line
  }, [open])

  const [transferData] = React.useState({
    process: GAS,
    subprocess: GAS
  })

  const [viewAccountTitle, setViewAccountTitle] = React.useState({
    open: false,
    state: null,
    transaction: null,
    onBack: undefined,
    onClose: () => setViewAccountTitle(currentValue => ({
      ...currentValue,
      open: false
    }))
  })

  const [viewCheque, setViewCheque] = React.useState({
    open: false,
    state: null,
    transaction: null,
    onBack: undefined,
    onClose: () => setViewCheque(currentValue => ({
      ...currentValue,
      open: false,
    }))
  })

  const closeHandler = () => {
    onClose()
  }

  const submitApproveHandler = () => {
    onClose()
    confirm({
      open: true,
      wait: true,
      onConfirm: async () => {
        let response
        try {
          response = await axios.post(`/api/transactions/flow/update-transaction/${transaction.id}`, transferData)

          const { message } = response.data

          refetchData()
          toast({
            message,
            title: "Success!"
          })
        }
        catch (error) {
          console.log("Fisto Error Status", error.request)

          toast({
            severity: "error",
            title: "Error!",
            message: "Something went wrong whilst trying to save the transmittal details. Please try again."
          })
        }
      }
    })
  }

  const submitHoldHandler = () => {
    onClose()
    onHold(transaction)
  }

  const submitUnholdHandler = () => {
    onClose()
    onUnhold(transaction.id)
  }

  const submitReturnHandler = () => {
    onClose()
    onReturn(transaction)
  }


  const onAccountTitleView = () => {
    onClose()

    setViewAccountTitle(currentValue => ({
      ...currentValue,
      state,
      transaction,
      open: true,
      onBack: onBack
    }))
  }


  const onChequeView = () => {
    onClose()

    setViewCheque(currentValue => ({
      ...currentValue,
      state: "-release",
      transaction,
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
          Transaction Details
          <IconButton size="large" onClick={closeHandler}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent className="FstoDialogTransaction-content">
          <TransactionDialog data={data} status={status} onAccountTitleView={onAccountTitleView} onChequeView={onChequeView} />

          <Divider className="FstoDividerTransaction-root" variant="middle" />

          <Box className="FstoBoxTransactionForm-root">
            <Box className="FstoBoxTransactionForm-content">
              <Autocomplete
                className="FstoSelectForm-root"
                size="small"
                options={[]}
                value={data?.tag?.distributed_to || null}
                renderInput={
                  (props) => <TextField {...props} label="Distribute To" variant="outlined" />
                }
                PaperComponent={
                  (props) => <Paper {...props} sx={{ textTransform: 'capitalize' }} />
                }
                getOptionLabel={
                  (option) => option.name
                }
                isOptionEqualToValue={
                  (option, value) => option.id === value.id
                }
                readOnly
                disablePortal
                disableClearable
              />
            </Box>
          </Box>
        </DialogContent>

        {
          (state === `gas-receive` || state === `gas-gas` || state === `gas-hold`) &&
          <DialogActions className="FstoDialogTransaction-actions">
            {
              state === `gas-receive` &&
              <Button
                variant="contained"
                onClick={submitApproveHandler}
                disableElevation
              > Transmit
              </Button>
            }

            {
              state === `gas-hold` &&
              <Button
                variant="contained"
                onClick={submitUnholdHandler}
                disableElevation
              > Unhold
              </Button>
            }

            {
              state !== `gas-hold` &&
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

      <AccountTitleDialog
        accounts={data?.cheque?.accounts || data?.voucher?.accounts}
        {...viewAccountTitle}
      />

      <ChequeEntryDialog
        accounts={data?.cheque?.accounts || data?.voucher?.accounts}
        cheques={data?.cheque?.cheques}
        onView={onAccountTitleView}
        {...viewCheque}
      />
    </React.Fragment>
  )
}

export default DocumentTransferringTransaction