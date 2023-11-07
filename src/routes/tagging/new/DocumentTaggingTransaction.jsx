import React, { Fragment } from 'react'

// import axios from 'axios'

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

// import useToast from '../../../hooks/useToast'
// import useConfirm from '../../../hooks/useConfirm'



import useDistribute from '../../../hooks/new/useDistribute'

import { useDispatch, useSelector } from 'react-redux'

import { useViewTransactionQuery } from '../../../features/transactions/transactions.api'

import { closeDialog } from '../../../features/dialog/dialog.slice'

// import TransactionDialog from '../../../components/TransactionDialog'
// import AccountTitleDialog from '../../../components/AccountTitleDialog'
// import ChequeEntryDialog from '../../../components/ChequeEntryDialog'

import {
  TAG
} from '../../../constants'

const RECEIPT_TYPE_LIST = ["Official", "Unofficial"]

const DocumentTaggingTransaction = (props) => {

  const {
    id,

    transaction,
    // entry,
    // cheque,
    // print
  } = useSelector((state) => state.dialog)

  const {
    state,
    onHold = () => { },
    onUnhold = () => { },
    onReturn = () => { },
    onUnreturn = () => { },
    onVoid = () => { }
  } = props

  const { data, isSuccess } = useViewTransactionQuery(id, { skip: !transaction })

  const dispatch = useDispatch()

  // const toast = useToast()
  // const confirm = useConfirm()

  const {
    data: DISTUBUTE_LIST,
    status: DISTRIBUTE_STATUS
  } = useDistribute({ enabled: isSuccess, company: data?.document?.company?.id })

  React.useEffect(() => {
    if (transaction && state === `tag-receive` && DISTRIBUTE_STATUS === `success`) {
      setTagData(currentValue => ({
        ...currentValue,
        distributed_to: DISTUBUTE_LIST.at(0)
      }))
    }

    // eslint-disable-next-line
  }, [transaction, DISTRIBUTE_STATUS])


  // React.useEffect(() => {
  //   if (open && (state === `tag-tag` || state === `return-tag`) && status === `success`) {
  //     setTagData(currentValue => ({
  //       ...currentValue,
  //       receipt_type: data.tag.receipt_type,
  //       distributed_to: data.tag.distributed_to
  //     }))
  //   }

  //   // eslint-disable-next-line
  // }, [open, status, data])



  const [tagData, setTagData] = React.useState({
    process: TAG,
    subprocess: TAG,
    receipt_type: null,
    distributed_to: null
  })

  // const [viewAccountTitle, setViewAccountTitle] = React.useState({
  //   open: false,
  //   state: null,
  //   transaction: null,
  //   onBack: undefined,
  //   onClose: () => setViewAccountTitle(currentValue => ({
  //     ...currentValue,
  //     open: false,
  //   }))
  // })

  // const [viewCheque, setViewCheque] = React.useState({
  //   open: false,
  //   state: null,
  //   transaction: null,
  //   onBack: undefined,
  //   onClose: () => setViewCheque(currentValue => ({
  //     ...currentValue,
  //     open: false,
  //   }))
  // })

  const clearHandler = () => {
    setTagData(currentValue => ({
      ...currentValue,
      receipt_type: null,
      distributed_to: null
    }))
  }

  const closeHandler = () => {
    dispatch(closeDialog())
    clearHandler()
  }

  const submitTagHandler = () => {
    // confirm({
    //   open: true,
    //   wait: true,
    //   onConfirm: async () => {
    //     let response
    //     try {
    //       response = await axios.post(`/api/transactions/flow/update-transaction/${transaction.id}`, tagData)

    //       const { message } = response.data

    //       refetchData()
    //       clearHandler()
    //       toast({
    //         message,
    //         title: "Success!"
    //       })
    //     }
    //     catch (error) {
    //       console.log("Fisto Error Status", error.request)

    //       toast({
    //         severity: "error",
    //         title: "Error!",
    //         message: "Something went wrong whilst trying to save the tag details. Please try again."
    //       })
    //     }
    //   }
    // })
  }

  const submitUnholdHandler = () => {
    onUnhold(id)

    dispatch(closeDialog())
  }

  const submitHoldHandler = () => {
    onHold(id)

    dispatch(closeDialog())
  }

  const submitReturnHandler = () => {
    onReturn(id)

    dispatch(closeDialog())
  }

  const submitUnreturnHandler = () => {
    onUnreturn(id)

    dispatch(closeDialog())
  }

  const submitVoidHandler = () => {
    onVoid(id)

    dispatch(closeDialog())
  }




  // const onAccountTitleView = () => {
  //   onClose()

  //   setViewAccountTitle(currentValue => ({
  //     ...currentValue,
  //     state: "transmit-",
  //     transaction,
  //     open: true,
  //     onBack: onBack
  //   }))
  // }

  // const onChequeView = () => {
  //   onClose()

  //   setViewCheque(currentValue => ({
  //     ...currentValue,
  //     state,
  //     transaction,
  //     open: true,
  //     onBack: onBack
  //   }))
  // }

  return (
    <Fragment>
      <Dialog
        className="FstoDialogTransaction-root"
        open={transaction}
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
          {/* <TransactionDialog data={data} status={status} onAccountTitleView={onAccountTitleView} onChequeView={onChequeView} /> */}

          {
            (!!state.match(/(tag$)|(receive$)/)) &&
            <Fragment>
              <Divider className="FstoDividerTransaction-root" variant="middle" />

              <Box className="FstoBoxTransactionForm-root">
                <Box className="FstoBoxTransactionForm-content">
                  <Autocomplete
                    className="FstoSelectForm-root"
                    size="small"
                    options={RECEIPT_TYPE_LIST}
                    value={tagData.receipt_type}
                    renderInput={
                      (props) => <TextField {...props} label="Type of Receipt" variant="outlined" />
                    }
                    PaperComponent={
                      (props) => <Paper {...props} sx={{ textTransform: 'capitalize' }} />
                    }
                    isOptionEqualToValue={
                      (option, value) => option === value
                    }
                    onChange={(e, value) => setTagData((currentValue) => ({
                      ...currentValue,
                      receipt_type: value
                    }))}
                    fullWidth
                    disablePortal
                    disableClearable
                  />

                  <Autocomplete
                    className="FstoSelectForm-root"
                    size="small"
                    options={DISTUBUTE_LIST || []}
                    value={tagData.distributed_to}
                    loading={
                      DISTRIBUTE_STATUS === 'loading'
                    }
                    renderInput={
                      (props) => <TextField {...props} label="Distribute To" variant="outlined" />
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
                    onChange={(e, value) => setTagData((currentValue) => ({
                      ...currentValue,
                      distributed_to: value
                    }))}
                    disablePortal
                    disableClearable
                  />
                </Box>
              </Box>
            </Fragment>
          }
        </DialogContent>

        <DialogActions className="FstoDialogTransaction-actions">
          {
            (!!state.match(/(tag$)|(receive$)/)) &&
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
            (!!state.match(/(tag$)|(receive$)/)) &&
            <Button
              variant="outlined"
              color="error"
              onClick={submitHoldHandler}
              disableElevation
            > Hold
            </Button>
          }

          {
            (!!state.match(/(hold$)/)) &&
            <Button
              variant="contained"
              onClick={submitUnholdHandler}
              disableElevation
            > Unhold
            </Button>
          }

          {
            (!!state.match(/(hold$)|(tag$)|(receive$)/)) &&
            <Button
              variant="outlined"
              color="error"
              onClick={submitReturnHandler}
              disableElevation
            > Return
            </Button>
          }

          {
            (!!state.match(/(return$)/)) &&
            <Button
              variant="contained"
              onClick={submitUnreturnHandler}
              disableElevation
            > Unreturn
            </Button>
          }
          {
            (!!state.match(/(hold$)|(tag$)|(receive$)/)) &&
            <Button
              variant="outlined"
              color="error"
              onClick={submitVoidHandler}
              // disabled={(transaction?.document_id === 1 || transaction?.document_id === 4) && transaction?.payment_type.toLowerCase() === `partial` && !transaction?.is_latest_transaction}
              disableElevation
            > Void
            </Button>
          }
        </DialogActions>
      </Dialog>

      {/*
      <AccountTitleDialog
        accounts={data?.cheque?.accounts || data?.voucher?.accounts}
        {...viewAccountTitle}
      />

      <ChequeEntryDialog
        accounts={data?.cheque?.accounts || data?.voucher?.accounts}
        cheques={data?.cheque?.cheques}
        onView={onAccountTitleView}
        {...viewCheque}
      />
      */}
    </Fragment>
  )
}

export default DocumentTaggingTransaction