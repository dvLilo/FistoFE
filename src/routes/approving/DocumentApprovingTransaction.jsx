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
import useTransaction from '../../hooks/useTransaction'

import TransactionDialog from '../../components/TransactionDialog'
import AccountTitleDialog from '../../components/AccountTitleDialog'

const DocumentApprovingTransaction = (props) => {

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
      setApprovalData(currentValue => ({
        ...currentValue,
        distributed_to: data.tag.distributed_to
      }))
    }

    // eslint-disable-next-line
  }, [open, status])

  const [approvalData, setApprovalData] = React.useState({
    process: "approve",
    subprocess: "approve",
    distributed_to: null
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

  const clearHandler = () => {
    setApprovalData(currentValue => ({
      ...currentValue,
      distributed_to: null
    }))
  }

  const closeHandler = () => {
    onClose()
    clearHandler()
  }

  const submitApproveHandler = () => {
    onClose()
    confirm({
      open: true,
      wait: true,
      onConfirm: async () => {
        let response
        try {
          response = await axios.post(`/api/transactions/flow/update-transaction/${transaction.id}`, approvalData)

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
          Transaction
          <IconButton size="large" onClick={closeHandler}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent className="FstoDialogTransaction-content">
          <TransactionDialog data={data} status={status} onView={onAccountTitleView} />

          {
            (state === `approve-receive` || state === `approve-approve`) &&
            <React.Fragment>
              <Divider className="FstoDividerTransaction-root" variant="middle" />

              <Box className="FstoBoxTransactionForm-root">
                <Box className="FstoBoxTransactionForm-content">
                  <Autocomplete
                    className="FstoSelectForm-root"
                    size="small"
                    options={DISTUBUTE_LIST || []}
                    value={approvalData.distributed_to}
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
                    onChange={(e, value) => setApprovalData(currentValue => ({
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
          (state === `approve-receive` || state === `approve-approve` || state === `approve-hold`) &&
          <DialogActions className="FstoDialogTransaction-actions">
            {
              (state === `approve-receive` || state === `approve-approve`) &&
              <Button
                variant="contained"
                onClick={submitApproveHandler}
                disableElevation
              > {state === `approve-receive` ? "Approve" : "Save"}
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
        accounts={data?.voucher.account_title[0]}
      />
    </React.Fragment>
  )
}

export default DocumentApprovingTransaction