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
    if (open && state === `tag-receive` && DISTRIBUTE_STATUS === `success`) {
      setTagData(currentValue => ({
        ...currentValue,
        distributed_to: DISTUBUTE_LIST[0]
      }))
    }

    // eslint-disable-next-line
  }, [open, DISTRIBUTE_STATUS])

  React.useEffect(() => {
    if (open && state === `tag-tag` && status === `success`) {
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
          (state === `tag-receive` || state === `tag-tag`) &&
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
        (state === `tag-receive` || state === `tag-tag` || state === `tag-hold`) &&
        <DialogActions className="FstoDialogTransaction-actions">
          {
            (state === `tag-receive` || state === `tag-tag`) &&
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