import React from 'react'

import axios from 'axios'

import { useSelector } from 'react-redux'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Autocomplete,
  TextField,
  Paper,
  Divider,
  Box
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

import useToast from '../../hooks/useToast'
import useDistribute from '../../hooks/useDistribute'
// import useTransaction from '../../hooks/useTransaction'

import TransactionDialog from '../../components/TransactionDialog'
import AccountTitleDialog from '../../components/AccountTitleDialog'
import ChequeEntryDialog from '../../components/ChequeEntryDialog'
import ReverseDialog from '../../components/ReverseDialog'

const DocumentReversingTransaction = (props) => {

  const user = useSelector(state => state.user)

  const {
    state,
    open = false,
    transaction = null,
    refetchData = () => { },
    onReturn = () => { },
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
      ...(Boolean(state.match(/-return-request.*/)) && {
        status: "reverse-return-request",
        state: "return"
      })
    },
    reason: {
      id: null,
      description: null,
      remarks: null
    },
    ...(Boolean(state.match(/-return-request.*/)) && {
      reason: {
        id: 7,
        description: "Cheque Reversal",
        remarks: "Supplier lost the cheque."
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
    }
  }

  const toast = useToast()

  // const {
  //   data,
  //   status,
  //   refetch: fetchTransaction
  // } = useTransaction(transaction?.id)

  const {
    refetch: fetchDistribute,
    data: DISTUBUTE_LIST,
    status: DISTRIBUTE_STATUS
  } = useDistribute(transaction?.company_id)

  React.useEffect(() => {
    if (open) {
      // fetchTransaction()
      fetchDistribute()
    }

    // eslint-disable-next-line
  }, [open])

  React.useEffect(() => {
    if (open && status === `success`) {
      setReverseRequestData(currentValue => ({
        ...currentValue,
        distributed_to: data.tag.distributed_to
      }))
    }

    // eslint-disable-next-line
  }, [open, status])

  const [reverseRequestData, setReverseRequestData] = React.useState({
    process: "reverse",
    subprocess: "return-request",
    distributed_to: null,
    reason: {
      id: null,
      description: "",
      remarks: ""
    }
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

  const [viewAccountTitle, setViewAccountTitle] = React.useState({
    open: false,
    state: null,
    transaction: null,
    onBack: undefined,
    onClose: () => setViewAccountTitle(currentValue => ({
      ...currentValue,
      open: false,
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

  const clearHandler = () => {
    setReverseRequestData(currentValue => ({
      ...currentValue,
      distributed_to: null
    }))
  }

  const closeHandler = () => {
    onClose()
    clearHandler()
  }

  const submitReverseRequestHandler = async () => {
    let response
    try {
      response = await axios.post(`/api/transactions/flow/update-transaction/${transaction.id}`, reverseRequestData)

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
        message: "Something went wrong whilst trying to save the reverse request details. Please try again."
      })
    }
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
      onBack: onBack,

      ...(state === `pending` && {
        state: "reverse-pending"
      }),
    }))
  }

  const onChequeView = () => {
    onClose()

    setViewCheque(currentValue => ({
      ...currentValue,
      state,
      transaction,
      open: true,
      onBack: onBack,

      ...(state === `pending` && {
        state: "reverse-pending"
      }),
    }))
  }

  const onReverseManage = () => {
    onClose()

    setManageReverse(currentValue => ({
      ...currentValue,
      state,
      transaction,
      open: true
    }))
  }

  const onReverseSelect = (data) => {
    setReverseRequestData(currentValue => ({
      ...currentValue,
      reason: {
        ...currentValue.reason,
        id: data.id,
        description: data.description
      }
    }))
  }

  const onReverseChange = (data) => {
    setReverseRequestData(currentValue => ({
      ...currentValue,
      reason: {
        ...currentValue.reason,
        remarks: data
      }
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
            state === `pending` && user?.role === `AP Tagging` &&
            <React.Fragment>
              <Divider className="FstoDividerTransaction-root" variant="middle" />

              <Box className="FstoBoxTransactionForm-root">
                <Box className="FstoBoxTransactionForm-content">
                  <Autocomplete
                    className="FstoSelectForm-root"
                    size="small"
                    options={DISTUBUTE_LIST || []}
                    value={reverseRequestData.distributed_to}
                    loading={
                      DISTRIBUTE_STATUS === 'loading'
                    }
                    renderInput={
                      (props) => <TextField {...props} label="Distribute To..." variant="outlined" />
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
                    onChange={(e, value) => setReverseRequestData(currentValue => ({
                      ...currentValue,
                      distributed_to: value
                    }))}
                    disablePortal
                    disableClearable
                  />
                </Box>
              </Box>
            </React.Fragment>
          }
        </DialogContent>

        <DialogActions className="FstoDialogTransaction-actions">
          {
            state === `pending` && user?.role === `AP Tagging` &&
            <Button
              variant="outlined"
              color="error"
              onClick={onReverseManage}
              disableElevation
            > Request
            </Button>
          }

          {
            state === `reverse-return-accept` && user?.role === `AP Tagging` &&
            <Button
              variant="outlined"
              color="error"
              onClick={submitReturnHandler}
              disableElevation
            > Return
            </Button>
          }
        </DialogActions>
      </Dialog>

      <AccountTitleDialog
        accounts={data.cheque.account_title[0]}
        {...viewAccountTitle}
      />

      <ChequeEntryDialog
        cheques={data.cheque.cheques}
        {...viewCheque}
      />

      <ReverseDialog
        reverse={reverseRequestData.reason}
        onClear={clearHandler}
        onSubmit={submitReverseRequestHandler}
        onSelect={onReverseSelect}
        onChange={onReverseChange}
        {...manageReverse}
      />
    </React.Fragment>
  )
}

export default DocumentReversingTransaction