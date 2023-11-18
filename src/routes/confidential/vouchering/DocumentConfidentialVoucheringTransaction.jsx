import React from 'react'

import axios from 'axios'

import moment from 'moment'

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

import useToast from '../../../hooks/useToast'
import useConfirm from '../../../hooks/useConfirm'
import useApprover from '../../../hooks/useApprover'
// import useTransaction from '../../../hooks/useTransaction'

import {
  VOUCHER
} from '../../../constants'

import TransactionDialog from '../../../components/TransactionDialog'
import AccountTitleDialog from '../../../components/AccountTitleDialog'

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

const DocumentConfidentialVoucheringTransaction = (props) => {

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
        status: "voucher-receive",
        state: "receive"
      }),
      ...(Boolean(state.match(/-hold.*/)) && {
        status: "voucher-hold",
        state: "hold"
      }),
      ...(Boolean(state.match(/-return.*/)) && {
        status: "voucher-return",
        state: "return"
      }),
      ...(Boolean(state.match(/-void.*/)) && {
        status: "voucher-void",
        state: "void"
      }),
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
    ...(Boolean(state.match(/-void.*/)) && {
      reason: {
        id: 4,
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
    ...(Boolean(state.match(/-receive|-hold|-return|-void.*/)) && {
      voucher: {
        status: "voucher-receive",
        date: "2022-08-11",
        no: null,
        month: null,
        tax: null,
        accounts: [],
        approver: {
          id: null,
          name: null
        },
        reason: null
      }
    }),
    ...(Boolean(state.match(/-voucher.*/)) && {
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
      }
    })
  }

  const toast = useToast()
  const confirm = useConfirm()

  // const {
  //   data,
  //   status,
  //   refetch: fetchTransaction
  // } = useTransaction(transaction?.id)

  const {
    data: APPROVER_LIST,
    status: APPROVER_STATUS
  } = useApprover({
    enabled: open
  })

  React.useEffect(() => {
    // if (open) fetchTransaction()
    // eslint-disable-next-line
  }, [open])

  React.useEffect(() => {
    if (open && status === `success` && !!state.match(/-voucher|-hold|-return|-void/i)) {
      setVoucherData(currentValue => ({
        ...currentValue,
        tax: {
          receipt_type: data.voucher.tax?.receipt_type || "",
          percentage_tax: data.voucher.tax?.percentage_tax || "",
          withholding_tax: data.voucher.tax?.witholding_tax || "",
          net_amount: data.voucher.tax?.net_amount || ""
        },
        voucher: {
          no: data.voucher?.no,
          month: data.voucher?.month
        },
        approver: data.voucher?.approver,
        accounts: data.voucher?.accounts[0]
      }))
    }

    // eslint-disable-next-line
  }, [open, status]) /*[open, data, status]*/

  const [validate, setValidate] = React.useState({
    status: false,
    data: []
  })

  const [error, setError] = React.useState({
    status: false,
    data: []
  })

  const [voucherData, setVoucherData] = React.useState({
    process: VOUCHER,
    subprocess: VOUCHER,
    tax: {
      receipt_type: "",
      percentage_tax: "",
      withholding_tax: null,
      net_amount: null
    },
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

  const clearHandler = () => {
    setVoucherData(currentValue => ({
      ...currentValue,
      tax: {
        receipt_type: "",
        percentage_tax: "",
        withholding_tax: null,
        net_amount: null
      },
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
          response = await axios.post(`/api/transactions/flow/update-transaction/DELETE-ME-LATER/${transaction.id}`, voucherData)

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
      ...(Boolean(state.match(/-hold|-return|-void.*/)) && {
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
          <TransactionDialog data={data} status={status} onAccountTitleView={onAccountTitleView} />

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
                    type="number"
                    value={voucherData.tax.percentage_tax}
                    disabled={
                      !Boolean(voucherData.tax.receipt_type) || voucherData.tax.receipt_type === `Unofficial`
                    }
                    onKeyPress={
                      (e) => ["E", "e", ".", "+", "-"].includes(e.key) && e.preventDefault()
                    }
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
                  !Boolean(voucherData.tax.receipt_type) ||
                  !Boolean(voucherData.voucher.no) ||
                  !Boolean(voucherData.voucher.month) ||
                  (voucherData.tax.receipt_type === `Official` && !Boolean(voucherData.tax.net_amount)) ||
                  (voucherData.tax.receipt_type === `Official` && !Boolean(voucherData.tax.percentage_tax)) ||
                  (voucherData.tax.receipt_type === `Official` && !Boolean(voucherData.tax.withholding_tax))
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
    </React.Fragment>
  )
}

export default DocumentConfidentialVoucheringTransaction