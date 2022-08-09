import React from 'react'

import NumberFormat from 'react-number-format'

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

// import useToast from '../../hooks/useToast'
import useConfirm from '../../hooks/useConfirm'
import useApprover from '../../hooks/useApprover'

import TransactionDialog from '../../components/TransactionDialog'
import AccountTitleDialog from '../../components/AccountTitleDialog'

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
    data,
    open = false,
    onHold = () => { },
    onUnhold = () => { },
    onReturn = () => { },
    onBack = () => { },
    onClose = () => { }
  } = props

  // const toast = useToast()
  const confirm = useConfirm()
  const {
    data: APPROVER_LIST,
    status: APPROVER_STATUS
  } = useApprover()

  const [voucherData, setVoucherData] = React.useState({
    process: "voucher",
    subprocess: "voucher",
    tax: {
      receipt_type: null,
      percentage_tax: null,
      withholding_tax: null,
      net_amount: null
    },
    voucher: {
      no: "",
      month: null,
    },
    approver: null
  })

  const [manageAccountTitle, setManageAccountTitle] = React.useState({
    data: null,
    open: false,
    onBack: undefined,
    onSubmit: undefined,
    onClose: () => setManageAccountTitle(currentValue => ({
      ...currentValue,
      open: false
    }))
  })

  const onSubmit = () => {
    confirm({
      open: true,
      wait: true,
      onConfirm: () => console.log(`${data.transaction_id} has been submitted.`)
    })
  }

  const submitHoldHandler = () => {
    onClose()
    onHold(data)
  }

  const submitUnholdHandler = () => {
    onClose()
    onUnhold(data.id)
  }

  const submitReturnHandler = () => {
    onClose()
    onReturn(data)
  }

  const submitVoidHandler = () => {
    onClose()

    confirm({
      open: true,
      wait: true,
      onConfirm: () => console.log(`${data.transaction_id} has been voided.`)
    })
  }

  const onAccountTitleManage = () => {
    onClose()

    setManageAccountTitle(currentValue => ({
      ...currentValue,
      data: data,
      open: true,
      onBack: onBack,
      onSubmit: onSubmit
    }))
  }

  const onAccountTitleView = () => {
    onClose()

    setManageAccountTitle(currentValue => ({
      ...currentValue,
      data: data,
      open: true,
      onBack: onBack,
      onSubmit: onSubmit
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
          <IconButton size="large" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent className="FstoDialogTransaction-content">
          <TransactionDialog data={data} onView={onAccountTitleView} />

          {
            (state === `voucher-receive` || state === `voucher-voucher`) &&
            <React.Fragment>
              <Divider className="FstoDividerTransaction-root" variant="middle" />

              <Box className="FstoBoxTransactionForm-root">
                <Box className="FstoBoxTransactionForm-content">
                  <Autocomplete
                    className="FstoSelectForm-root"
                    size="small"
                    options={RECEIPT_TYPE_LIST}
                    value={RECEIPT_TYPE_LIST.find((row) => row.name === voucherData.tax.receipt_type) || null}
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
                      tax: {
                        ...currentValue.tax,
                        receipt_type: value.name,
                        percentage_tax: "",
                        withholding_tax: "",
                        net_amount: ""
                      }
                    }))}
                    fullWidth
                    disablePortal
                    disableClearable
                  />

                  <TextField
                    className="FstoTextfieldForm-root"
                    label="Percentage Tax"
                    variant="outlined"
                    autoComplete="off"
                    size="small"
                    value={voucherData.tax.percentage_tax}
                    disabled={
                      !Boolean(voucherData.tax.receipt_type) || voucherData.tax.receipt_type === `Unofficial`
                    }
                    InputProps={{
                      inputComponent: NumberField
                    }}
                    onChange={(e) => setVoucherData(currentValue => ({
                      ...currentValue,
                      tax: {
                        ...currentValue.tax,
                        percentage_tax: e.target.value
                      }
                    }))}
                    fullWidth
                  />

                  <TextField
                    className="FstoTextfieldForm-root"
                    label="Withholding Tax"
                    variant="outlined"
                    autoComplete="off"
                    size="small"
                    value={voucherData.tax.withholding_tax}
                    disabled={
                      !Boolean(voucherData.tax.receipt_type) || voucherData.tax.receipt_type === `Unofficial`
                    }
                    InputProps={{
                      inputComponent: NumberField
                    }}
                    onChange={(e) => setVoucherData(currentValue => ({
                      ...currentValue,
                      tax: {
                        ...currentValue.tax,
                        withholding_tax: e.target.value
                      }
                    }))}
                    fullWidth
                  />

                  <TextField
                    className="FstoTextfieldForm-root"
                    label="Net of Amount"
                    variant="outlined"
                    autoComplete="off"
                    size="small"
                    value={voucherData.tax.net_amount}
                    disabled={
                      !Boolean(voucherData.tax.receipt_type) || voucherData.tax.receipt_type === `Unofficial`
                    }
                    InputProps={{
                      inputComponent: NumberField
                    }}
                    onChange={(e) => setVoucherData(currentValue => ({
                      ...currentValue,
                      tax: {
                        ...currentValue.tax,
                        net_amount: e.target.value
                      }
                    }))}
                    fullWidth
                  />
                </Box>

                <Box className="FstoBoxTransactionForm-content">
                  <LocalizationProvider dateAdapter={DateAdapter}>
                    <DatePicker
                      views={['month', 'year']}
                      value={voucherData.voucher.month}
                      renderInput={
                        (props) => <TextField {...props} className="FstoTextfieldForm-root" label="Voucher Month" variant="outlined" size="small" fullWidth />
                      }
                      onChange={(value) => setVoucherData(currentValue => ({
                        ...currentValue,
                        voucher: {
                          ...currentValue.voucher,
                          month: value
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
          (state === `voucher-receive` || state === `voucher-voucher` || state === `voucher-hold`) &&
          <DialogActions className="FstoDialogTransaction-actions">
            {
              (state === `voucher-receive` || state === `voucher-voucher`) &&
              <Button
                variant="contained"
                onClick={onAccountTitleManage}
                // disabled={
                //   !Boolean(voucherData.approver) ||
                //   !Boolean(voucherData.tax.receipt_type) ||
                //   (voucherData.tax.receipt_type === `Official` && !Boolean(voucherData.tax.net_amount)) ||
                //   (voucherData.tax.receipt_type === `Official` && !Boolean(voucherData.tax.percentage_tax)) ||
                //   (voucherData.tax.receipt_type === `Official` && !Boolean(voucherData.tax.withholding_tax)) ||
                //   !Boolean(voucherData.voucher.no) ||
                //   !Boolean(voucherData.voucher.month)
                // }
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

      <AccountTitleDialog {...manageAccountTitle} />
    </React.Fragment>
  )
}

export default DocumentVoucheringTransaction