import React from 'react'

import NumberFormat from 'react-number-format'

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
import useTransactionTypes from '../../hooks/useTransactionTypes'

import {
  VOUCHER
} from '../../constants'

import TransactionDialog from '../../components/TransactionDialog'
import AccountTitleDialog from '../../components/AccountTitleDialog'
import ChequeEntryDialog from '../../components/ChequeEntryDialog'
import PrintDialog from '../../components/PrintDialog'

const NumberField = React.forwardRef(function NumberField(props, ref) {
  const { onChange, ...rest } = props

  return (
    <NumberFormat
      {...rest}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          }
        })
      }}
      prefix="₱"
      allowNegative={false}
      thousandSeparator
      isNumericString
    />
  )
})

const DocumentVoucheringTransaction = ({
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
}) => {

  const toast = useToast()
  const confirm = useConfirm()

  const {
    data,
    status,
    refetch: fetchTransaction
  } = useTransaction(transaction?.id)

  const {
    data: APPROVER_LIST,
    status: APPROVER_STATUS
  } = useApprover({
    enabled: open
  })

  const {
    data: TRANSACTION_TYPE_LIST,
    status: TRANSACTION_TYPE_STATUS
  } = useTransactionTypes({
    enabled: open
  })

  React.useEffect(() => {
    if (open) fetchTransaction()
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
    if (open && status === `success` && !Boolean(voucherData.voucher.month)) {
      setVoucherData(currentValue => ({
        ...currentValue,
        voucher: {
          month: data.voucher?.month
        },
        accounts: data.voucher?.accounts,
        transaction_type: data.voucher?.transaction_type,
        input_tax: data.voucher?.input_tax,

        ...(Boolean(data.voucher?.approver) && {
          approver: data.voucher?.approver
        })
      }))
    }

    // eslint-disable-next-line
  }, [open, data, status])

  const [voucherData, setVoucherData] = React.useState({
    process: VOUCHER,
    subprocess: VOUCHER,
    voucher: {
      month: null,
    },
    approver: null,
    transaction_type: null,
    input_tax: "",
    accounts: []
  })

  const [manageAccountTitle, setManageAccountTitle] = React.useState({
    open: false,
    state: null,
    transaction: null,
    onBack: undefined,
    onClose: () => setManageAccountTitle((currentValue) => ({
      ...currentValue,
      open: false,
      transaction: null
    }))
  })

  const [viewCheque, setViewCheque] = React.useState({
    open: false,
    state: null,
    transaction: null,
    onBack: undefined,
    onClose: () => setViewCheque((currentValue) => ({
      ...currentValue,
      open: false,
    }))
  })

  const [viewPrint, setViewPrint] = React.useState({
    open: false,
    state: null,
    transaction: null,
    onBack: undefined,
    onClose: () => setViewPrint((currentValue) => ({
      ...currentValue,
      open: false,
    }))
  })

  const clearHandler = () => {
    setVoucherData(currentValue => ({
      ...currentValue,
      voucher: {
        month: null
      },
      approver: null,
      transaction_type: null,
      input_tax: "",
      accounts: []
    }))
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

    setManageAccountTitle((currentValue) => ({
      ...currentValue,
      state,

      open: true,
      onBack: onBack,
      transaction: {
        ...transaction,

        transaction_type_id: voucherData.transaction_type?.id
      }
    }))
  }

  const onAccountTitleView = () => {
    onClose()

    setManageAccountTitle((currentValue) => ({
      ...currentValue,
      state,

      open: true,
      onBack: onBack,
      transaction: {
        ...transaction,

        transaction_type_id: voucherData.transaction_type?.id
      },

      ...(!!state.match(/-receive|-hold|-return|-void/) && {
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


  const onPrintView = () => {
    onClose()

    setViewPrint(currentValue => ({
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
          <TransactionDialog data={data} state={state} status={status} onPrintView={onPrintView} onAccountTitleView={onAccountTitleView} onChequeView={onChequeView} />

          {
            (state === `voucher-receive` || state === `voucher-voucher` || state === `return-voucher`) &&
            <React.Fragment>
              <Divider className="FstoDividerTransaction-root" variant="middle" />

              <Box className="FstoBoxTransactionForm-root">
                <Box className="FstoBoxTransactionForm-content">
                  <TextField
                    className="FstoTextfieldForm-root"
                    label="Input Tax"
                    variant="outlined"
                    size="small"
                    value={voucherData.input_tax}
                    InputProps={{
                      inputComponent: NumberField
                    }}
                    onChange={(e) => setVoucherData((currentValue) => ({
                      ...currentValue,
                      input_tax: e.target.value
                    }))}
                    fullWidth
                  />

                  <Divider variant="middle" sx={{ marginBottom: "1.25em" }} />

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
                          month: moment(value).format("YYYY-MM-DD")
                        }
                      }))}
                      showToolbar
                    />
                  </LocalizationProvider>

                  <Autocomplete
                    className="FstoSelectForm-root"
                    size="small"
                    options={TRANSACTION_TYPE_LIST || []}
                    value={voucherData.transaction_type}
                    loading={
                      TRANSACTION_TYPE_STATUS === 'loading'
                    }
                    renderInput={
                      (props) => <TextField {...props} label="Transaction Type" variant="outlined" />
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
                    onChange={(e, value) => setVoucherData((currentValue) => ({
                      ...currentValue,
                      transaction_type: value,
                      accounts: []
                    }))}
                    fullWidth
                    disablePortal
                    disableClearable
                  />

                  <Divider variant="middle" sx={{ marginBottom: "1.25em" }} />

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
                    onChange={(e, value) => setVoucherData((currentValue) => ({
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
          (state === `voucher-receive` || state === `voucher-voucher` || state === `voucher-hold` || state === `return-voucher`) &&
          <DialogActions className="FstoDialogTransaction-actions">
            {
              (state === `voucher-receive` || state === `voucher-voucher` || state === `return-voucher`) &&
              <Button
                variant="contained"
                onClick={
                  state === `voucher-voucher` || state === `return-voucher`
                    ? submitVoucherHandler
                    : onAccountTitleManage
                }
                disabled={
                  !Boolean(voucherData.approver) ||
                  !Boolean(voucherData.transaction_type) ||
                  !Boolean(voucherData.voucher.month)
                }
                disableElevation
              > {state === `voucher-receive` ? "Create" : "Save"}
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

      <PrintDialog
        data={data}
        {...viewPrint}
      />
    </React.Fragment>
  )
}

export default DocumentVoucheringTransaction