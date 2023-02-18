import React from 'react'

import axios from 'axios'

import moment from 'moment'

import DateAdapter from '@mui/lab/AdapterDateFns'

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

import {
  LocalizationProvider,
  DatePicker
} from '@mui/lab'

import CloseIcon from '@mui/icons-material/Close'

import useToast from '../../hooks/useToast'
import useConfirm from '../../hooks/useConfirm'
import useApprover from '../../hooks/useApprover'
import useTransaction from '../../hooks/useTransaction'

import TransactionDialog from '../../components/TransactionDialog'
import AccountTitleDialog from '../../components/AccountTitleDialog'
import ChequeEntryDialog from '../../components/ChequeEntryDialog'

const RECEIPT_TYPE_LIST = [
  {
    id: 1,
    name: "Official"
  },
  {
    id: 2,
    name: "Unofficial"
  }
]

const DocumentVoucheringTransaction = (props) => {

  const {
    state,
    open = false,
    transaction = null,
    refetchData = () => { },
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

  const {
    refetch: fetchApprover,
    data: APPROVER_LIST,
    status: APPROVER_STATUS
  } = useApprover()

  React.useEffect(() => {
    if (open) fetchTransaction()

    if (open && !APPROVER_LIST) fetchApprover()
    // eslint-disable-next-line
  }, [open])

  React.useEffect(() => {
    if (open && state === `voucher-receive` && APPROVER_STATUS === `success` && (status === `success` && !Boolean(data.voucher?.approver))) {
      if (transaction.document_amount <= 500000.00 || transaction.referrence_amount <= 500000.00) {
        setVoucherData(currentValue => ({
          ...currentValue,
          approver: APPROVER_LIST.find((item) => item.position.toLowerCase() === `supervisor`)
        }))
      }

      if ((transaction.document_amount >= 500001.00 && transaction.document_amount <= 1000000.00) || (transaction.referrence_amount >= 500001.00 && transaction.referrence_amount <= 1000000.00)) {
        setVoucherData(currentValue => ({
          ...currentValue,
          approver: APPROVER_LIST.find((item) => item.position.toLowerCase() === `manager`)
        }))
      }

      if (transaction.document_amount >= 1000001.00 || transaction.referrence_amount >= 1000001.00) {
        setVoucherData(currentValue => ({
          ...currentValue,
          approver: APPROVER_LIST.find((item) => item.position.toLowerCase() === `director`)
        }))
      }
    }

    // eslint-disable-next-line
  }, [open, status, APPROVER_STATUS])

  React.useEffect(() => {
    if (open && status === `success` && !Boolean(voucherData.receipt_type) && !Boolean(voucherData.voucher.no)) {
      setVoucherData(currentValue => ({
        ...currentValue,
        receipt_type: data.voucher?.receipt_type || "",
        voucher: {
          no: data.voucher?.no || "",
          month: data.voucher?.month || null
        },
        accounts: data.voucher?.accounts,

        ...(Boolean(data.voucher?.approver) && {
          approver: data.voucher?.approver
        })
      }))
    }

    // eslint-disable-next-line
  }, [open, data, status])

  const [validate, setValidate] = React.useState({
    status: false,
    data: []
  })

  const [error, setError] = React.useState({
    status: false,
    data: []
  })

  const [voucherData, setVoucherData] = React.useState({
    process: "voucher",
    subprocess: "voucher",
    receipt_type: "",
    voucher: {
      no: "",
      month: null,
    },
    approver: null,
    accounts: []
  })

  const [manageAccountTitle, setManageAccountTitle] = React.useState({
    open: false,
    state: null,
    transaction: null,
    onBack: undefined,
    onClose: () => setManageAccountTitle(currentValue => ({
      ...currentValue,
      open: false
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
    setVoucherData(currentValue => ({
      ...currentValue,
      receipt_type: "",
      voucher: {
        no: "",
        month: null,
      },
      approver: null,
      accounts: []
    }))

    setError({
      status: false,
      data: []
    })
  }

  const closeHandler = () => {
    onClose()
    clearHandler()
  }

  const submitVoucherHandler = () => {
    onClose()
    confirm({
      open: true,
      wait: true,
      onConfirm: async () => {
        let response
        try {
          response = await axios.post(`/api/transactions/flow/update-transaction/${transaction.id}`, voucherData)

          const { message } = response.data

          refetchData()
          clearHandler()
          toast({
            message,
            title: "Success!"
          })
        }
        catch (error) {
          switch (error.request.status) {
            case 422:
              const { message } = error.response.data
              toast({
                message,
                title: "Error!",
                severity: "error"
              })
              break

            default:
              toast({
                severity: "error",
                title: "Error!",
                message: "Something went wrong whilst trying to save the voucher details. Please try again."
              })
          }

          console.log("Fisto Error Status", error.request)
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
        state: "transmit-"
      })
    }))
  }

  const onAccountTitleInsert = (data) => {
    setVoucherData(currentValue => ({
      ...currentValue,
      accounts: [
        ...currentValue.accounts,
        data
      ]
    }))
  }

  const onAccountTitleUpdate = (data, index) => {
    setVoucherData(currentValue => ({
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
    setVoucherData(currentValue => ({
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
      state: "-release",
      transaction,
      open: true,
      onBack: onBack
    }))
  }


  const checkVoucherHandler = async (e) => {
    if (error.status && error.data.voucher_no) {
      delete error.data.voucher_no
      setError(currentValue => ({
        ...currentValue,
        data: error.data
      }))
    }

    if (!voucherData.voucher.no) return

    setValidate(currentValue => ({
      status: true,
      data: [
        ...currentValue.data, 'voucher_no'
      ]
    }))

    try {
      await axios.post(`/api/transactions/flow/validate-voucher-no`, {
        voucher_no: voucherData.voucher.no,
        ...(
          /voucher-voucher|return-return/i.test(state) && {
            id: transaction?.id
          }
        )
      })
    }
    catch (error) {
      if (error.request.status === 422) {
        const { errors } = error.response.data

        setError(currentValue => ({
          status: true,
          data: {
            ...currentValue.data,
            voucher_no: errors["voucher.no"]
          }
        }))
      }
    }

    setValidate(currentValue => ({
      ...currentValue,
      data: currentValue.data.filter((data) => data !== 'voucher_no')
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
            (state === `voucher-receive` || state === `voucher-voucher` || state === `return-return`) &&
            <React.Fragment>
              <Divider className="FstoDividerTransaction-root" variant="middle" />

              <Box className="FstoBoxTransactionForm-root">
                <Box className="FstoBoxTransactionForm-content">
                  <Autocomplete
                    className="FstoSelectForm-root"
                    size="small"
                    options={RECEIPT_TYPE_LIST}
                    value={RECEIPT_TYPE_LIST.find((row) => row.name === voucherData.receipt_type) || null}
                    renderInput={
                      (props) => <TextField {...props} label="Type of Receipt" variant="outlined" />
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
                    onChange={(e, value) => setVoucherData(currentValue => ({
                      ...currentValue,
                      receipt_type: value.name
                    }))}
                    fullWidth
                    disablePortal
                    disableClearable
                  />

                  <Divider variant="middle" sx={{ margin: "1.25em" }} />

                  <LocalizationProvider dateAdapter={DateAdapter}>
                    <DatePicker
                      views={['month', 'year']}
                      value={voucherData.voucher.month}
                      renderInput={
                        (props) => <TextField {...props} className="FstoTextfieldForm-root" label="Voucher Month" variant="outlined" size="small" onKeyPress={(e) => e.preventDefault()} fullWidth />
                      }
                      onChange={(value) => setVoucherData(currentValue => ({
                        ...currentValue,
                        voucher: {
                          ...currentValue.voucher,
                          // month: value
                          month: moment(value).format("YYYY-MM-DD")
                        }
                      }))}
                      showToolbar
                    />
                  </LocalizationProvider>

                  <TextField
                    className="FstoTextfieldForm-root"
                    label="Voucher Number"
                    variant="outlined"
                    autoComplete="off"
                    size="small"
                    value={voucherData.voucher.no}
                    error={
                      error.status
                      && Boolean(error.data.voucher_no)
                    }
                    helperText={
                      (error.status
                        && error.data.voucher_no
                        && error.data.voucher_no[0])
                      ||
                      (validate.status
                        && validate.data.includes('voucher_no')
                        && "Please wait...")
                    }
                    onBlur={checkVoucherHandler}
                    onChange={(e) => setVoucherData(currentValue => ({
                      ...currentValue,
                      voucher: {
                        ...currentValue.voucher,
                        no: e.target.value
                      }
                    }))}
                    fullWidth
                  />

                  <Divider variant="middle" sx={{ margin: "1.25em" }} />

                  <Autocomplete
                    className="FstoSelectForm-root"
                    size="small"
                    options={APPROVER_LIST || []}
                    value={voucherData.approver}
                    loading={
                      APPROVER_STATUS === 'loading'
                    }
                    renderInput={
                      (props) => <TextField {...props} label="Approver" variant="outlined" />
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
                    onChange={(e, value) => setVoucherData(currentValue => ({
                      ...currentValue,
                      approver: value
                    }))}
                    fullWidth
                    disablePortal
                    disableClearable
                  />
                </Box>
              </Box>
            </React.Fragment>
          }
        </DialogContent>

        {
          (state === `voucher-receive` || state === `voucher-voucher` || state === `voucher-hold` || state === `return-return`) &&
          <DialogActions className="FstoDialogTransaction-actions">
            {
              (state === `voucher-receive` || state === `voucher-voucher` || state === `return-return`) &&
              <Button
                variant="contained"
                onClick={
                  state === `voucher-voucher` || state === `return-return`
                    ? submitVoucherHandler
                    : onAccountTitleManage
                }
                disabled={
                  !Boolean(voucherData.approver) ||
                  !Boolean(voucherData.receipt_type) ||
                  !Boolean(voucherData.voucher.no) ||
                  !Boolean(voucherData.voucher.month) ||

                  (error.status && Boolean(error.data.voucher_no)) ||
                  (validate.status && Boolean(validate.data.includes('voucher_no')))
                }
                disableElevation
              > {state === `voucher-receive` ? "Approve" : "Save"}
              </Button>
            }

            {
              state === `voucher-hold` &&
              <Button
                variant="contained"
                onClick={submitUnholdHandler}
                disableElevation
              > Unhold
              </Button>
            }

            {
              state !== `voucher-hold` &&
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
        accounts={voucherData.accounts}
        onClear={clearHandler}
        onSubmit={submitVoucherHandler}
        onInsert={onAccountTitleInsert}
        onUpdate={onAccountTitleUpdate}
        onRemove={onAccountTitleRemove}
        {...manageAccountTitle}
      />

      <ChequeEntryDialog
        accounts={data?.cheque?.accounts || data?.voucher?.accounts}
        cheques={data?.cheque?.cheques}
        onView={onAccountTitleView}
        {...viewCheque}
      />
    </React.Fragment>
  )
}

export default DocumentVoucheringTransaction