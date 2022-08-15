import React from 'react'

import axios from 'axios'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

import useToast from '../../hooks/useToast'
import useConfirm from '../../hooks/useConfirm'
import useTransaction from '../../hooks/useTransaction'

import TransactionDialog from '../../components/TransactionDialog'
import ChequeEntryDialog from '../../components/ChequeEntryDialog'
import AccountTitleDialog from '../../components/AccountTitleDialog'

const DocumentChequingTransaction = (props) => {

  const {
    state,
    open = false,
    transaction = null,
    refetchData = () => { },
    onRelease = () => { },
    onHold = () => { },
    onUnhold = () => { },
    onReturn = () => { },
    onVoid = () => { },
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

  React.useEffect(() => {
    if (open && state === `cheque-receive` && status === `success` && !Boolean(chequeData.accounts.length)) {
      const accounts = data.voucher.account_title[0].filter((item) => item.entry.toLowerCase() === `credit`).map((item) => ({
        entry: "Debit",
        account_title: item.account_title,
        amount: item.amount,
        remarks: item.remarks
      }))

      setChequeData(currentValue => ({
        ...currentValue,
        accounts
      }))
    }

    // eslint-disable-next-line
  }, [open, status])

  const [chequeData, setChequeData] = React.useState({
    process: "cheque",
    subprocess: "cheque",
    accounts: [],
    cheques: []
  })

  const [manageAccountTitle, setManageAccountTitle] = React.useState({
    open: false,
    state: null,
    transaction: null,
    onBack: undefined,
    onClose: () => setManageAccountTitle(currentValue => {
      const { accounts, ...remainingItems } = currentValue

      return ({
        ...remainingItems,
        open: false
      })
    })
  })

  const [manageCheque, setManageCheque] = React.useState({
    open: false,
    state: null,
    transaction: null,
    onBack: undefined,
    onClose: () => setManageCheque(currentValue => ({
      ...currentValue,
      open: false
    }))
  })

  const clearHandler = () => {
    setChequeData(currentValue => ({
      ...currentValue,
      accounts: [],
      cheques: []
    }))
  }

  const closeHandler = () => {
    onClose()
    clearHandler()
  }

  const submitChequeHandler = () => {
    onClose()
    confirm({
      open: true,
      wait: true,
      onConfirm: async () => {
        let response
        try {
          response = await axios.post(`/api/transactions/flow/update-transaction/${transaction.id}`, chequeData)

          const { message } = response.data

          refetchData()
          clearHandler()
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
            message: "Something went wrong whilst trying to save the cheque details. Please try again."
          })
        }
      }
    })
  }

  const submitReleaseHandler = () => {
    onClose()
    onRelease(transaction.id)
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

  const submitVoidHandler = () => {
    onClose()
    onVoid(transaction)
  }

  const onAccountTitleManage = () => {
    onClose()

    setManageAccountTitle(currentValue => ({
      ...currentValue,
      state,
      transaction,
      open: true,
      onBack: onBack
    }))
  }

  const onAccountTitleView = () => {
    onClose()

    setManageAccountTitle(currentValue => ({
      ...currentValue,
      transaction,
      open: true,
      onBack: onBack,

      state: "transmit-",
      accounts: data.voucher.account_title[0]
    }))
  }

  const onChequeManage = () => {
    setManageCheque(currentValue => ({
      ...currentValue,
      state,
      transaction,
      open: true,
      onBack: onAccountTitleManage
    }))
  }

  const onAccountTitleInsert = (data) => {
    setChequeData(currentValue => ({
      ...currentValue,
      accounts: [
        ...currentValue.accounts,
        data
      ]
    }))
  }

  const onAccountTitleUpdate = (data, index) => {
    setChequeData(currentValue => ({
      ...currentValue,
      accounts: [
        ...currentValue.accounts.map((item, itemIndex) => {
          if (itemIndex === index) return data
          return item
        })
      ]
    }))
  }

  const onAccountTitleRemove = (index) => {
    setChequeData(currentValue => ({
      ...currentValue,
      accounts: [
        ...currentValue.accounts.filter((item, itemIndex) => {
          return itemIndex !== index
        })
      ]
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
          <TransactionDialog data={data} status={status} onView={onAccountTitleView} />
        </DialogContent>

        {
          (state === `cheque-receive` || state === `cheque-cheque`) &&
          <DialogActions className="FstoDialogTransaction-actions">
            {
              state === `cheque-receive` &&
              <Button
                variant="contained"
                onClick={onAccountTitleManage}
                disableElevation
              > Create
              </Button>
            }

            {
              state === `cheque-cheque` &&
              <Button
                variant="contained"
                onClick={submitReleaseHandler}
                disableElevation
              > Release
              </Button>
            }

            {
              state === `cheque-hold` &&
              <Button
                variant="contained"
                onClick={submitUnholdHandler}
                disableElevation
              > Unhold
              </Button>
            }

            {
              state !== `cheque-hold` &&
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

      <AccountTitleDialog
        accounts={chequeData.accounts}
        onClear={clearHandler}
        onSubmit={onChequeManage}
        onInsert={onAccountTitleInsert}
        onUpdate={onAccountTitleUpdate}
        onRemove={onAccountTitleRemove}
        {...manageAccountTitle}
      />

      <ChequeEntryDialog
        onClear={clearHandler}
        onSubmit={submitChequeHandler}
        {...manageCheque}
      />
    </React.Fragment>
  )
}

export default DocumentChequingTransaction