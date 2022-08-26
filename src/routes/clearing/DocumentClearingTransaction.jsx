import React from 'react'

import axios from 'axios'

import DateAdapter from '@mui/lab/AdapterDateFns'

import {
  Box,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Button
} from '@mui/material'

import {
  LocalizationProvider,
  DatePicker
} from '@mui/lab'

import CloseIcon from '@mui/icons-material/Close'

import useToast from '../../hooks/useToast'
import useConfirm from '../../hooks/useConfirm'
// import useTransaction from '../../hooks/useTransaction'

import TransactionDialog from '../../components/TransactionDialog'
import AccountTitleDialog from '../../components/AccountTitleDialog'
import ChequeEntryDialog from '../../components/ChequeEntryDialog'

const DocumentClearingTransaction = (props) => {

  const {
    state,
    open = false,
    transaction = null,
    refetchData = () => { },
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
      status: "release-release",
      state: "pending",
      ...(Boolean(state.match(/-receive.*/)) && {
        status: "clear-receive",
        state: "receive"
      }),
      ...(Boolean(state.match(/-clear.*/)) && {
        status: "clear-clear",
        state: "clear"
      })
    },
    reason: {
      id: null,
      description: null,
      remarks: null
    },
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
    cheque: {
      status: `cheque-release`,
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
    },
    release: {
      status: "release-release",
      date: "2022-08-23"
    },
    file: {
      status: "file-file",
      date: "2022-08-23"
    },
    ...(Boolean(state.match(/-receive.*/)) && {
      clear: {
        status: "clear-receive",
        date: "2022-08-23"
      }
    }),
    ...(Boolean(state.match(/-clear.*/)) && {
      clear: {
        status: "clear-clear",
        date: "2022-08-23",
        account_title: [
          [
            {
              id: 29,
              entry: "Credit",
              account_title: {
                id: 29,
                name: "Clearing - AUB"
              },
              amount: 50000,
              remarks: "Lorem sit amet.."
            },
            {
              id: 16,
              entry: "Debit",
              account_title: {
                id: 16,
                name: "CIB - AUB"
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
    if (open && state === `clear-receive` && status === `success` && !Boolean(clearData.accounts.length)) {
      const accounts = data.cheque.account_title[0].filter((item) => item.entry.toLowerCase() === `credit`).map((item) => ({
        entry: "Debit",
        account_title: item.account_title,
        amount: item.amount,
        remarks: item.remarks
      }))

      setClearData(currentValue => ({
        ...currentValue,
        accounts
      }))
    }

    if (open && state === `clear-clear` && status === `success` && !Boolean(clearData.date) && !Boolean(clearData.accounts.length)) {
      setClearData(currentValue => ({
        ...currentValue,
        date: data.clear.date,
        accounts: data.clear.account_title[0]
      }))
    }

    // eslint-disable-next-line
  }, [open, status])

  const [clearData, setClearData] = React.useState({
    process: "clear",
    subprocess: "clear",
    date: null,
    accounts: []
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
        open: false,
      })
    })
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

  const clearHandler = () => {
    setClearData(currentValue => ({
      ...currentValue,
      date: null,
      accounts: []
    }))
  }

  const closeHandler = () => {
    onClose()
    clearHandler()
  }

  const submitClearHandler = () => {
    onClose()
    confirm({
      open: true,
      wait: true,
      onConfirm: async () => {
        let response
        try {
          response = await axios.post(`/api/transactions/flow/update-transaction/${transaction.id}`, clearData)

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
            message: "Something went wrong whilst trying to save the clear details. Please try again."
          })
        }
      }
    })
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

      ...(Boolean(state.match(/-receive.*/)) && {
        state: "transmit-",
        accounts: data.cheque.account_title[0]
      })
    }))
  }

  const onAccountTitleInsert = (data) => {
    setClearData(currentValue => ({
      ...currentValue,
      accounts: [
        ...currentValue.accounts,
        data
      ]
    }))
  }

  const onAccountTitleUpdate = (data, index) => {
    setClearData(currentValue => ({
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
    setClearData(currentValue => ({
      ...currentValue,
      accounts: [
        ...currentValue.accounts.filter((item, itemIndex) => {
          return itemIndex !== index
        })
      ]
    }))
  }


  const onChequeView = () => {
    onClose()

    setViewCheque(currentValue => ({
      ...currentValue,
      state,
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

          {
            (state === `clear-receive` || state === `clear-clear`) &&
            <React.Fragment>
              <Divider className="FstoDividerTransaction-root" variant="middle" />

              <Box className="FstoBoxTransactionForm-root">
                <Box className="FstoBoxTransactionForm-content">
                  <LocalizationProvider dateAdapter={DateAdapter}>
                    <DatePicker
                      value={clearData.date}
                      renderInput={
                        (props) => <TextField {...props} className="FstoTextfieldForm-root" label="Date Clear" variant="outlined" size="small" onKeyPress={(e) => e.preventDefault()} fullWidth />
                      }
                      onChange={(value) => setClearData(currentValue => ({
                        ...currentValue,
                        date: new Date(value).toISOString()
                      }))}
                      showToolbar
                    />
                  </LocalizationProvider>
                </Box>
              </Box>
            </React.Fragment>
          }
        </DialogContent>

        {
          (state === `clear-receive` || state === `clear-clear`) &&
          <DialogActions className="FstoDialogTransaction-actions">
            <Button
              variant="contained"
              onClick={
                state === `clear-receive`
                  ? onAccountTitleManage
                  : submitClearHandler
              }
              disabled={
                !Boolean(clearData.date)
              }
              disableElevation
            > {state === `clear-receive` ? "Clear" : "Save"}
            </Button>
          </DialogActions>
        }
      </Dialog>

      <AccountTitleDialog
        accounts={clearData.accounts}
        onClear={clearHandler}
        onSubmit={submitClearHandler}
        onInsert={onAccountTitleInsert}
        onUpdate={onAccountTitleUpdate}
        onRemove={onAccountTitleRemove}
        {...manageAccountTitle}
      />

      <ChequeEntryDialog
        cheques={data.cheque.cheques}
        {...viewCheque}
      />
    </React.Fragment>
  )
}

export default DocumentClearingTransaction