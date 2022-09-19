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
import useConfirm from '../../hooks/useConfirm'
import useDistribute from '../../hooks/useDistribute'
import useTransaction from '../../hooks/useTransaction'

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

  const toast = useToast()
  const confirm = useConfirm()

  const {
    data,
    status,
    refetch: fetchTransaction
  } = useTransaction(transaction?.id)

  const {
    refetch: fetchDistribute,
    data: DISTUBUTE_LIST,
    status: DISTRIBUTE_STATUS
  } = useDistribute(transaction?.company_id)

  React.useEffect(() => {
    if (open) {
      fetchTransaction()
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
      distributed_to: null,
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

  const submitReverseRequestHandler = async () => {
    let response
    try {
      response = await axios.post(`/api/transactions/flow/update-transaction/DELETE-ME-LATER/${transaction.id}`, reverseRequestData)

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

  const submitReverseApproveHandler = async () => {
    onClose()
    confirm({
      open: true,
      wait: true,
      onConfirm: async () => {
        let response
        try {
          response = await axios.post(`/api/transactions/flow/update-transaction/DELETE-ME-LATER/${transaction.id}`, { process: "reverse", subprocess: "return-approve" })

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
            message: "Something went wrong whilst trying to save the reverse approve details. Please try again."
          })
        }
      }
    })
  }

  const submitReturnHandler = () => {
    onClose()
    onReturn({
      id: transaction.id,
      reasonDefault: data.reason
    })
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
            state === `reverse-receive` && user?.role === `AP Tagging` &&
            <Button
              variant="outlined"
              color="error"
              onClick={submitReturnHandler}
              disableElevation
            > Return
            </Button>
          }

          {
            state === `reverse-receive` && user?.role === `AP Associate` &&
            <Button
              variant="contained"
              color="primary"
              onClick={submitReverseApproveHandler}
              disableElevation
            > Approve
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