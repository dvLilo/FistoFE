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
import ReverseDialog from '../../components/ReverseDialog'

const DocumentChequingTransaction = (props) => {

  const {
    state,
    open = false,
    transaction = null,
    refetchData = () => { },
    // onRelease = () => { },
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
      const accounts = Boolean(data.cheque?.accounts?.length) ? data.cheque?.accounts : data.voucher?.accounts?.filter((item) => item.entry.toLowerCase() === `credit`).map((item) => ({
        entry: "Debit",
        account_title: item.account_title,
        amount: item.amount,
        remarks: item.remarks
      }))

      const cheques = data.cheque?.cheques || []

      setChequeData(currentValue => ({
        ...currentValue,
        accounts,
        cheques
      }))
    }

    if (open && (state === `cheque-cheque` || state === `cheque-hold` || state === `cheque-return` || state === `cheque-void` || state === `return-cheque`) && status === `success`) {
      setChequeData(currentValue => ({
        ...currentValue,
        accounts: data.cheque.accounts || data.voucher.accounts,
        cheques: data.cheque.cheques
      }))
    }

    // eslint-disable-next-line
  }, [open, data, status])

  const [chequeData, setChequeData] = React.useState({
    process: "cheque",
    subprocess: "cheque",
    accounts: [],
    cheques: []
  })

  const [reversalData, setReversalData] = React.useState({
    process: "cheque",
    subprocess: "reverse",
    reason: {
      id: null,
      description: "",
      remarks: ""
    }
  })

  const [manageAccountTitle, setManageAccountTitle] = React.useState({
    open: false,
    state: null,
    transaction: null,
    onBack: undefined,
    onClose: () => setManageAccountTitle(currentValue => {
      const { accounts, onSubmit, ...remainingItems } = currentValue

      return ({
        ...remainingItems,
        open: false,
      })
    })
  })

  const [manageCheque, setManageCheque] = React.useState({
    open: false,
    state: null,
    transaction: null,
    onBack: undefined,
    onClose: () => setManageCheque(currentValue => {
      const { cheques, ...remainingItems } = currentValue

      return ({
        ...remainingItems,
        open: false,
      })
    })
  })

  const [manageReverse, setManageReverse] = React.useState({
    open: false,
    state: null,
    transaction: null,
    onClose: () => setManageReverse(currentValue => ({
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

    setReversalData(currentValue => ({
      ...currentValue,
      reason: {
        id: null,
        description: "",
        remarks: ""
      }
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

  const submitReverseHandler = () => {
    onClose()
    confirm({
      open: true,
      wait: true,
      onConfirm: async () => {
        const { accounts, cheques } = chequeData

        let response
        try {
          response = await axios.post(`/api/transactions/flow/update-transaction/${transaction.id}`, { ...reversalData, accounts, cheques })

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

  // const submitReleaseHandler = () => {
  //   onClose()
  //   onRelease(transaction.id)
  // }

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
      onBack: onChequeManage
    }))
  }

  const onAccountTitleView = () => {
    onClose()

    setManageAccountTitle(currentValue => ({
      ...currentValue,
      state,
      transaction,
      open: true,
      onBack: onBack,

      ...(Boolean(state.match(/-receive|-hold|cheque-return|-void.*/)) && {
        state: "transmit-",
        accounts: Boolean(data.cheque.accounts.length)
          ? data.cheque.accounts
          : data.voucher.accounts
      }),
      ...(Boolean(state.match(/-release|return-.*/)) && {
        state: "transmit-",
        accounts: data.cheque.accounts
      })
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



  const onChequeManage = () => {
    onClose()

    setManageCheque(currentValue => ({
      ...currentValue,
      state,
      transaction,
      open: true,
      onBack: onBack
    }))
  }

  const onChequeView = () => {
    onClose()

    setManageCheque(currentValue => ({
      ...currentValue,
      state,
      transaction,
      open: true,
      onBack: onBack,

      ...(Boolean(state.match(/-receive|-hold|cheque-return|-void.*/)) && {
        state: "release-"
      }),
      ...(Boolean(state.match(/-release.*/)) && {
        cheques: data.cheque.cheques
      })
    }))
  }

  const onChequeInsert = (data) => {
    setChequeData(currentValue => ({
      ...currentValue,
      accounts: [
        ...currentValue.accounts, {
          entry: "Credit",
          account_title: data.bank.account_title_one,
          amount: data.amount,
          remarks: null
        }
      ],
      cheques: [
        ...currentValue.cheques,
        data
      ]
    }))
  }

  const onChequeUpdate = (data, index) => {
    setChequeData(currentValue => ({
      ...currentValue,
      accounts: [
        ...currentValue.accounts.filter((item) => item.entry.toLowerCase() === "debit"),
        ...currentValue.accounts.filter((item) => item.entry.toLowerCase() === "credit").map((item, itemIndex) => {
          if (itemIndex === index)
            return {
              ...item,
              account_title: data.bank.account_title_one,
              amount: data.amount
            }
          return item
        })
      ],
      cheques: [
        ...currentValue.cheques.map((item, itemIndex) => {
          if (itemIndex === index) return data
          return item
        })
      ]
    }))
  }

  const onChequeRemove = (index) => {
    setChequeData(currentValue => ({
      ...currentValue,
      accounts: [
        ...currentValue.accounts.filter((item) => item.entry.toLowerCase() === "debit"),
        ...currentValue.accounts.filter((item) => item.entry.toLowerCase() === "credit").filter((item, itemIndex) => {
          return itemIndex !== index
        })
      ],
      cheques: [
        ...currentValue.cheques.filter((item, itemIndex) => {
          return itemIndex !== index
        })
      ]
    }))
  }



  const onReversalManage = () => {
    onClose()

    setManageReverse(currentValue => ({
      ...currentValue,
      state,
      transaction,
      open: true
    }))

    if (!reversalData.reason.id && !reversalData.reason.description) {
      const accounts = data?.cheque?.accounts.filter((item) => item.entry.toLowerCase() === `debit`)
      setChequeData(currentValue => ({
        ...currentValue,
        accounts,
        cheques: []
      }))
    }
  }

  const onReversalSelect = (data) => {
    setReversalData(currentValue => ({
      ...currentValue,
      reason: {
        ...currentValue.reason,
        id: data.id,
        description: data.description
      }
    }))
  }

  const onReversalChange = (data) => {
    setReversalData(currentValue => ({
      ...currentValue,
      reason: {
        ...currentValue.reason,
        remarks: data
      }
    }))
  }

  const onReversalSubmit = () => {
    setManageAccountTitle(currentValue => ({
      ...currentValue,
      transaction,
      open: true,
      state: "cheque-receive",

      onBack: onReversalManage,
      onSubmit: () => setManageCheque(currentValue => ({
        ...currentValue,
        transaction,
        open: true,
        state: "cheque-receive",
        onBack: onReversalSubmit
      }))
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
        </DialogContent>

        {
          (state === `cheque-receive` || state === `cheque-cheque` || state === `return-cheque` || state === `cheque-hold`) &&
          <DialogActions className="FstoDialogTransaction-actions">
            {
              state === `cheque-receive` &&
              <Button
                variant="contained"
                onClick={onChequeManage}
                disableElevation
              > Create
              </Button>
            }

            {
              (state === `cheque-cheque` || state === `return-cheque`) &&
              <React.Fragment>
                {/*
                <Button
                  variant="contained"
                  onClick={submitReleaseHandler}
                  disableElevation
                > Release
                </Button>
                */}

                <Button
                  variant="outlined"
                  color="error"
                  onClick={onReversalManage}
                  disableElevation
                > Reverse
                </Button>
              </React.Fragment>
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
        onSubmit={
          !!state.match(/-receive.*/)
            ? onChequeManage
            : submitChequeHandler
        }
        onInsert={onAccountTitleInsert}
        onUpdate={onAccountTitleUpdate}
        onRemove={onAccountTitleRemove}
        {...manageAccountTitle}
      />

      <ChequeEntryDialog
        accounts={chequeData.accounts}
        cheques={chequeData.cheques}
        onView={onAccountTitleManage}
        onClear={clearHandler}
        onSubmit={
          reversalData.reason.id && reversalData.reason.description
            ? submitReverseHandler
            : submitChequeHandler
        }
        onInsert={onChequeInsert}
        onUpdate={onChequeUpdate}
        onRemove={onChequeRemove}
        {...manageCheque}
      />

      <ReverseDialog
        reverse={reversalData.reason}
        onClear={clearHandler}
        onSubmit={onReversalSubmit}
        onSelect={onReversalSelect}
        onChange={onReversalChange}
        {...manageReverse}
      />
    </React.Fragment>
  )
}

export default DocumentChequingTransaction