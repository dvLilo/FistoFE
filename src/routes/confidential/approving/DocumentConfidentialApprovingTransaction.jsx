import React from 'react'

import axios from 'axios'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

import useToast from '../../../hooks/useToast'
import useConfirm from '../../../hooks/useConfirm'
// import useTransaction from '../../../hooks/useTransaction'

import {
  APPROVAL,
  APPROVE
} from '../../../constants'

import TransactionDialog from '../../../components/TransactionDialog'
import AccountTitleDialog from '../../../components/AccountTitleDialog'

const DocumentConfidentialApprovingTransaction = (props) => {

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

  const status = 'success'
  const data = {
    transaction: {
      id: 1,
      is_latest_transaction: 1,
      request_id: 1,
      no: "MISC001",
      date_requested: "2022-06-29 09:07:37",
      status: "pending",
      state: "pending",
      ...(Boolean(state.match(/-receive.*/)) && {
        status: "approve-receive",
        state: "receive"
      }),
      ...(Boolean(state.match(/-hold.*/)) && {
        status: "approve-hold",
        state: "hold"
      }),
      ...(Boolean(state.match(/-return.*/)) && {
        status: "approve-return",
        state: "return"
      })
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
      date: "2022-08-09",
      no: 2,
      distributed_to: {
        id: 8,
        name: "Reden Cunanan"
      },
      reason: null
    },
    voucher: {
      status: "voucher-voucher",
      date: "2022-08-11",
      no: "ABC123-00",
      month: "2022-08-01 00:00:00",
      tax: {
        receipt_type: "Official",
        percentage_tax: 12,
        witholding_tax: 6000,
        net_amount: 44000
      },
      accounts: [
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
        id: 11,
        name: "Maribel Salonga"
      },
      reason: null
    },
    ...(Boolean(state.match(/-receive.*/)) && {
      approve: {
        status: "approve-receive",
        date: "2022-08-11",
        reason: null
      }
    }),
    ...(Boolean(state.match(/-approve.*/)) && {
      approve: {
        status: "approve-approve",
        date: "2022-08-11",
        reason: null
      }
    }),
    ...(Boolean(state.match(/-hold.*/)) && {
      approve: {
        status: "approve-hold",
        date: "2022-08-11",
        reason: null
      }
    }),
    ...(Boolean(state.match(/-return.*/)) && {
      approve: {
        status: "approve-return",
        date: "2022-08-11",
        reason: null
      }
    }),
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

  const [approvalData] = React.useState({
    process: APPROVAL,
    subprocess: APPROVE
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
          response = await axios.post(`/api/transactions/flow/update-transaction/DELETE-ME-LATER/${transaction.id}`, approvalData)

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
            message: "Something went wrong whilst trying to save the approval details. Please try again."
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
          <TransactionDialog data={data} status={status} onAccountTitleView={onAccountTitleView} />
        </DialogContent>

        {
          (state === `approve-receive` || state === `approve-approve` || state === `approve-hold`) &&
          <DialogActions className="FstoDialogTransaction-actions">
            {
              (state === `approve-receive`) &&
              <Button
                variant="contained"
                onClick={submitApproveHandler}
                disableElevation
              > Approve
              </Button>
            }

            {
              state === `approve-hold` &&
              <Button
                variant="contained"
                onClick={submitUnholdHandler}
                disableElevation
              > Unhold
              </Button>
            }

            {
              state !== `approve-hold` &&
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
        {...viewAccountTitle}
        accounts={data?.voucher?.accounts[0]}
      />
    </React.Fragment>
  )
}

export default DocumentConfidentialApprovingTransaction