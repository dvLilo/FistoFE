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
// import useTransaction from '../../hooks/useTransaction'

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
    onRelease = () => { },
    onHold = () => { },
    onUnhold = () => { },
    onReturn = () => { },
    onVoid = () => { },
    onBack = () => { },
    onClose = () => { }
  } = props

  const status = 'success'
  const data = {
    transaction: {
      id: 1,
      is_latest_transaction: 1,
      request_id: 1,
      no: "MISC001",
      date_requested: "2022-06-29 09:07:37",
      status: "approve-approve",
      state: "approve",
      ...(Boolean(state.match(/-hold.*/)) && {
        status: "cheque-hold",
        state: "hold"
      }),
      ...(Boolean(state.match(/-return.*/)) && {
        status: "cheque-return",
        state: "return"
      }),
      ...(Boolean(state.match(/-void.*/)) && {
        status: "cheque-void",
        state: "void"
      }),
    },
    reason: {
      id: null,
      description: null,
      remarks: null
    },
    ...(Boolean(state.match(/-hold.*/)) && {
      reason: {
        id: 2,
        description: "Incomplete Attachment",
        remarks: "Lorem ipsum dolor sit amet.."
      }
    }),
    ...(Boolean(state.match(/-return.*/)) && {
      reason: {
        id: 1,
        description: "Wrong Details",
        remarks: "Lorem ipsum dolor sit amet.."
      }
    }),
    ...(Boolean(state.match(/-void.*/)) && {
      reason: {
        id: 4,
        description: "Double Payment",
        remarks: "Lorem ipsum dolor sit amet.."
      }
    }),
    requestor: {
      id: 2,
      id_prefix: "RDFFLFI",
      id_no: 10185,
      role: "Requestor",
      position: "System Developer",
      first_name: "VINCENT LOUIE",
      middle_name: "LAYNES",
      last_name: "ABAD",
      suffix: null,
      department: "Management Information System Common"
    },
    document: {
      id: 1,
      name: "PAD",
      no: "pad#11001",
      date: "2022-06-29 00:00:00",
      payment_type: "Full",
      amount: 50000,
      remarks: "swfattener lara: growing performance form, weekly fattener inventory form",
      category: {
        id: 1,
        name: "general"
      },
      company: {
        id: 1,
        name: "RDF Corporate Services"
      },
      department: {
        id: 12,
        name: "Management Information System Common"
      },
      location: {
        id: 5,
        name: "Common"
      },
      supplier: {
        id: 30,
        name: "1st Advenue Advertising"
      }
    },
    po_group: [
      {
        id: 50,
        no: "PO#11002",
        amount: 25000,
        rr_no: [
          "123",
          "456",
          "789"
        ],
        request_id: 1,
        is_editable: 1,
        previous_balance: 25000
      },
      {
        id: 51,
        no: "PO#11001",
        amount: 25000,
        rr_no: [
          "123",
          "456",
          "789"
        ],
        request_id: 1,
        is_editable: 1,
        previous_balance: 25000
      }
    ],
    tag: {
      status: "tag-tag",
      no: 2,
      date: "2022-08-09",
      distributed_to: {
        id: 7,
        name: "Daisy Batas"
      },
      reason: null
    },
    voucher: {
      status: "voucher-voucher",
      date: "2022-08-11",
      no: "ABC123",
      month: "2022-08-01 00:00:00",
      tax: {
        receipt_type: "Official",
        percentage_tax: 12,
        witholding_tax: 6000,
        net_amount: 44000
      },
      account_title: [
        [
          {
            id: 10,
            entry: "Debit",
            account_title: {
              id: 34,
              name: "SE - Salaries Expense"
            },
            amount: 50000,
            remarks: "Lorem ipsum..."
          },
          {
            id: 10,
            entry: "Credit",
            account_title: {
              id: 33,
              name: "Accounts Payable"
            },
            amount: 50000,
            remarks: "Lorem emit.."
          }
        ]
      ],
      approver: {
        id: 8,
        name: "Reden Cunanan"
      },
      reason: null
    },
    approval: {
      status: "approve-approve",
      date: "2022-08-11",
      reason: null
    },
    ...(Boolean(state.match(/-receive.*/)) && {
      cheque: {
        status: "cheque-receive",
        date: "2022-08-11"
      }
    }),
    ...(Boolean(state.match(/-cheque|-release.*/)) && {
      cheque: {
        status: `cheque-cheque`,
        date: "2022-08-11",
        cheques: [
          {
            type: "Cheque",
            bank: {
              id: 1,
              name: "Asia United Bank"
            },
            no: "ABC123TEST",
            date: "2022-08-31",
            amount: 50000
          }
        ],
        account_title: [
          [
            {
              id: 10,
              entry: "Debit",
              account_title: {
                id: 33,
                name: "Accounts Payable"
              },
              amount: 50000,
              remarks: "Lorem dolor.."
            },
            {
              id: 29,
              entry: "Credit",
              account_title: {
                id: 29,
                name: "Clearing - AUB"
              },
              amount: 50000,
              remarks: "Lorem sit amet.."
            }
          ]
        ]
      }
    })
  }

  const toast = useToast()
  const confirm = useConfirm()

  // const {
  //   data,
  //   status,
  //   refetch: fetchTransaction
  // } = useTransaction(transaction?.id)

  // React.useEffect(() => {
  //   if (open) fetchTransaction()

  //   // eslint-disable-next-line
  // }, [open])

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

    if (open && state === `cheque-cheque` && status === `success` && !Boolean(chequeData.accounts.length) && !Boolean(chequeData.cheques.length)) {
      setChequeData(currentValue => ({
        ...currentValue,
        accounts: data.cheque.account_title[0],
        cheques: data.cheque.cheques
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
      state,
      transaction,
      open: true,
      onBack: onBack,

      ...(Boolean(state.match(/-receive|-hold|-return|-void.*/)) && {
        state: "transmit-",
        accounts: data.voucher.account_title[0]
      }),
      ...(Boolean(state.match(/-release.*/)) && {
        state: "transmit-",
        accounts: data.cheque.account_title[0]
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
    setManageCheque(currentValue => ({
      ...currentValue,
      state,
      transaction,
      open: true,
      onBack: onAccountTitleManage
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

      ...(Boolean(state.match(/-release.*/)) && {
        cheques: data.cheque.cheques
      })
    }))
  }

  const onChequeInsert = (data) => {
    setChequeData(currentValue => ({
      ...currentValue,
      cheques: [
        ...currentValue.cheques,
        data
      ]
    }))
  }

  const onChequeUpdate = (data, index) => {
    setChequeData(currentValue => ({
      ...currentValue,
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
      const accounts = data.cheque.account_title[0].filter((item) => item.entry.toLowerCase() === `debit`)
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
          (state === `cheque-receive` || state === `cheque-cheque` || state === `cheque-hold`) &&
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
              <React.Fragment>
                <Button
                  variant="contained"
                  onClick={submitReleaseHandler}
                  disableElevation
                > Release
                </Button>

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
          state.match(/-receive.*/)
            ? onChequeManage
            : submitChequeHandler
        }
        onInsert={onAccountTitleInsert}
        onUpdate={onAccountTitleUpdate}
        onRemove={onAccountTitleRemove}
        {...manageAccountTitle}
      />

      <ChequeEntryDialog
        cheques={chequeData.cheques}
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