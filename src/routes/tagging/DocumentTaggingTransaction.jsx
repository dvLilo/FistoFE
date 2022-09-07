import React from 'react'

import axios from 'axios'

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

import useToast from '../../hooks/useToast'
import useConfirm from '../../hooks/useConfirm'
import useDistribute from '../../hooks/useDistribute'
// import useTransaction from '../../hooks/useTransaction'

import TransactionDialog from '../../components/TransactionDialog'

const DocumentTaggingTransaction = (props) => {

  const {
    state,
    open = false,
    transaction = null,
    refetchData = () => { },
    onHold = () => { },
    onUnhold = () => { },
    onReturn = () => { },
    onVoid = () => { },
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
      status: "return-return",
      state: "return",
      ...(Boolean(state.match(/-hold.*/)) && {
        status: "return-hold",
        state: "hold"
      }),
      ...(Boolean(state.match(/-void.*/)) && {
        status: "return-void",
        state: "void"
      })
    },
    reason: {
      id: 1,
      description: "Wrong Details",
      remarks: "Lorem ipsum dolor sit amet.."
    },
    ...(Boolean(state.match(/-hold.*/)) && {
      reason: {
        id: 1,
        description: "Incomplete Attachment",
        remarks: "Lorem ipsum dolor sit amet.."
      }
    }),
    ...(Boolean(state.match(/-void.*/)) && {
      reason: {
        id: 1,
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
    }
  }

  const toast = useToast()
  const confirm = useConfirm()

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
    if (open && state === `tag-receive` && DISTRIBUTE_STATUS === `success`) {
      setTagData(currentValue => ({
        ...currentValue,
        distributed_to: DISTUBUTE_LIST[0]
      }))
    }

    // eslint-disable-next-line
  }, [open, DISTRIBUTE_STATUS])

  React.useEffect(() => {
    if (open && (state === `tag-tag` || state === `return-return`) && status === `success`) {
      setTagData(currentValue => ({
        ...currentValue,
        distributed_to: data.tag.distributed_to
      }))
    }

    // eslint-disable-next-line
  }, [open, status])

  const [tagData, setTagData] = React.useState({
    process: "tag",
    subprocess: "tag",
    distributed_to: null
  })

  const clearHandler = () => {
    setTagData(currentValue => ({
      ...currentValue,
      distributed_to: null
    }))
  }

  const closeHandler = () => {
    onClose()
    clearHandler()
  }

  const submitTagHandler = () => {
    onClose()

    confirm({
      open: true,
      wait: true,
      onConfirm: async () => {
        let response
        try {
          response = await axios.post(`/api/transactions/flow/update-transaction/${transaction.id}`, tagData)

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
            message: "Something went wrong whilst trying to save the tag details. Please try again."
          })
        }
      }
    })
  }

  const submitUnholdHandler = () => {
    onClose()
    onUnhold(transaction.id)
  }

  const submitHoldHandler = () => {
    onClose()
    onHold(transaction)
  }

  const submitReturnHandler = () => {
    onClose()
    onReturn(transaction)
  }

  const submitVoidHandler = () => {
    onClose()
    onVoid(transaction)
  }

  return (
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
        <TransactionDialog data={data} status={status} />

        {
          (state === `tag-receive` || state === `tag-tag` || state === `return-return`) &&
          <React.Fragment>
            <Divider className="FstoDividerTransaction-root" variant="middle" />

            <Box className="FstoBoxTransactionForm-root">
              <Box className="FstoBoxTransactionForm-content">
                <Autocomplete
                  className="FstoSelectForm-root"
                  size="small"
                  options={DISTUBUTE_LIST || []}
                  value={tagData.distributed_to}
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
                  onChange={(e, value) => setTagData(currentValue => ({
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

      {
        (state === `tag-receive` || state === `tag-tag` || state === `tag-hold` || state === `return-return`) &&
        <DialogActions className="FstoDialogTransaction-actions">
          {
            (state === `tag-receive` || state === `tag-tag` || state === `return-return`) &&
            <Button
              variant="contained"
              onClick={submitTagHandler}
              disabled={
                Boolean(!tagData.distributed_to)
              }
              disableElevation
            > {state === `tag-receive` ? "Tag" : "Save"}
            </Button>
          }

          {
            state === `tag-hold` &&
            <Button
              variant="contained"
              onClick={submitUnholdHandler}
              disableElevation
            > Unhold
            </Button>
          }

          {
            state !== `tag-hold` &&
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
  )
}

export default DocumentTaggingTransaction