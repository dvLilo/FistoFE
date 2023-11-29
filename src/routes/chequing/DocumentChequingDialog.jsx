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
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Stack,
  Divider,
} from '@mui/material'

import {
  LocalizationProvider,
  DatePicker
} from '@mui/lab'

import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import useBanks from '../../hooks/useBanks'
import useToast from '../../hooks/useToast'
import useConfirm from '../../hooks/useConfirm'

import AccountTitleDialog from '../../components/AccountTitleDialog'

const TYPE_LIST = [
  "Cheque",
  "Telegraphic",
  "Managers Cheque"
]

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

const DocumentChequingDialog = ({
  open = false,
  state = null,
  transactions = [],
  refetchData = () => { },
  clearData = () => { },
  onBack = () => { },
  onClose = () => { }
}) => {

  const toast = useToast()
  const confirm = useConfirm()

  const {
    refetch: fetchBanks,
    status: BANKS_STATUS,
    data: BANKS_LIST
  } = useBanks()
  React.useEffect(() => {
    if (open) fetchBanks()

    // eslint-disable-next-line 
  }, [open])

  const [chequeData, setChequeData] = React.useState({
    process: "cheque",
    transactions: [],
    accounts: [],
    cheques: []
  })

  const [CQ, setCQ] = React.useState({
    update: false,
    index: null,

    type: null,
    bank: null,
    date: null,
    no: "",
    amount: ""
  })

  const [manageAccountTitle, setManageAccountTitle] = React.useState({
    open: false,
    state: null,
    transaction: null,
    onBack: undefined,
    onClose: () => setManageAccountTitle(currentValue => ({
      ...currentValue,
      open: false,
    }))
  })

  React.useEffect(() => {
    if (!open) clearChequeHandler()

    // eslint-disable-next-line
  }, [open])

  React.useEffect(() => {
    if (open && !chequeData.transactions.length && !chequeData.accounts.length) setChequeData((currentValue) => {
      const selectedTransactions = transactions.map((item) => item.id)

      const selectedAccounts = transactions.reduce((carry, item) => {
        return [
          ...carry,
          ...item.accounts
            .filter((item) => item.entry.toLowerCase() === "credit")
            .map((item) => ({
              ...item,
              entry: "Debit"
            }))
        ]
      }, [])

      return {
        ...currentValue,
        transactions: selectedTransactions,
        accounts: selectedAccounts
      }
    })

    // eslint-disable-next-line
  }, [open, transactions])

  const [validate, setValidate] = React.useState({
    status: false,
    data: []
  })

  const [error, setError] = React.useState({
    status: false,
    data: []
  })

  const addChequeHandler = () => {
    if (!CQ.update) {
      setChequeData((currentValue) => ({
        ...currentValue,
        cheques: [
          ...currentValue.cheques,
          {
            type: CQ.type,
            bank: CQ.bank,
            no: CQ.no,
            date: CQ.date,
            amount: parseFloat(CQ.amount)
          }
        ],
        accounts: [
          ...currentValue.accounts,
          {
            entry: "Credit",
            account_title: CQ.bank.account_title_one,
            business_unit: CQ.bank.business_unit_one,
            company: CQ.bank.company_one,
            department: CQ.bank.department_one,
            sub_unit: CQ.bank.sub_unit_one,
            location: CQ.bank.location_one,
            amount: parseFloat(CQ.amount),
            remarks: null,
            is_default: true
          }
        ]
      }))
    }

    if (!!CQ.update) {
      setChequeData((currentValue) => {

        const updatedCheques = currentValue.cheques.map((item, index) => {
          if (CQ.index === index) {
            return {
              type: CQ.type,
              bank: CQ.bank,
              no: CQ.no,
              date: CQ.date,
              amount: parseFloat(CQ.amount)
            }
          }

          return item
        })

        const updatedAccounts = currentValue.accounts.filter((item) => item.entry.toLowerCase() === "credit").map((item, index) => {
          if (CQ.index === index) {
            return {
              ...item,
              account_title: CQ.bank.account_title_one,
              business_unit: CQ.bank.business_unit_one,
              company: CQ.bank.company_one,
              department: CQ.bank.department_one,
              sub_unit: CQ.bank.sub_unit_one,
              location: CQ.bank.location_one,
              amount: parseFloat(CQ.amount)
            }
          }

          return item
        })

        return {
          ...currentValue,
          cheques: updatedCheques,
          accounts: [
            ...currentValue.accounts.filter((item) => item.entry.toLowerCase() === "debit"),
            ...updatedAccounts
          ]
        }
      })
    }

    clearChequeHandler()
  }

  const editChequeHandler = (item, index) => {
    if (BANKS_STATUS === "success") {
      const bank = BANKS_LIST.find((bank) => bank.id === item.bank.id)

      setCQ({
        update: true,
        index,

        ...item, bank,
        amount: item.amount.toString()
      })
    }
  }

  const removeChequeHandler = (index) => {
    setChequeData((currentValue) => {
      const updatedCheques = currentValue.cheques.filter((_, itemIndex) => itemIndex !== index)

      const updatedAccounts = currentValue.accounts.filter((item) => item.entry.toLowerCase() === "credit").filter((_, itemIndex) => itemIndex !== index)

      return {
        ...currentValue,
        cheques: updatedCheques,
        accounts: [
          ...currentValue.accounts.filter((item) => item.entry.toLowerCase() === "debit"),
          ...updatedAccounts,
        ]
      }
    })
  }

  const submitChequehandler = () => {
    onClose()
    confirm({
      open: true,
      wait: true,
      onConfirm: async () => {
        let response
        try {
          response = await axios.post(`/api/transactions/flow/cheque`, chequeData)

          const { message } = response.data

          clearData()
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
            message: "Something went wrong whilst trying to save the cheque details. Please try again."
          })
        }
      }
    })
  }

  const clearChequeHandler = () => {
    setCQ({
      update: false,
      index: null,

      type: null,
      bank: null,
      date: null,
      no: "",
      amount: ""
    })
  }

  const closeChequeHandler = () => {
    clearChequeHandler()
    setChequeData((currentValue) => ({
      ...currentValue,
      transactions: [],
      accounts: [],
      cheques: []
    }))

    onClose()
  }


  const viewAccountTitleHandler = () => {
    onClose()

    setManageAccountTitle(currentValue => ({
      ...currentValue,
      state,
      open: true,
      onBack: onBack,

      transaction: {
        document_amount: transactions?.reduce((a, b) => a + b.document_amount, 0),
        referrence_amount: transactions?.reduce((a, b) => a + b.referrence_amount, 0),
      },

      ...(Boolean(state.match(/-receive$|-hold$|-return$|-void$/)) && {
        state: "transmit-",
        accounts: chequeData.accounts
      })
    }))
  }


  const checkChequeHandler = async (e) => {
    if (error.status && error.data.cheque_no) {
      delete error.data.cheque_no
      setError(currentValue => ({
        ...currentValue,
        data: error.data
      }))
    }

    if (!CQ.no) return

    setValidate(currentValue => ({
      status: true,
      data: [
        ...currentValue.data, 'cheque_no'
      ]
    }))

    const check = chequeData.cheques.some((item) => item.no === CQ.no && item.bank.id === CQ.bank.id)
    if (check && !CQ.update) {
      setError(currentValue => ({
        status: true,
        data: {
          ...currentValue.data,
          cheque_no: [
            "Cheque number already in the list."
          ]
        }
      }))
    }

    try {
      await axios.post(`/api/transactions/flow/validate-cheque-no`, {
        bank_id: CQ.bank.id,
        cheque_no: CQ.no
      })
    }
    catch (error) {
      if (error.request.status === 422) {
        const { errors } = error.response.data

        setError(currentValue => ({
          status: true,
          data: {
            ...currentValue.data,
            cheque_no: errors["cheque.no"]
          }
        }))
      }
    }

    setValidate(currentValue => ({
      ...currentValue,
      data: currentValue.data.filter((data) => data !== 'cheque_no')
    }))
  }

  return (
    <>
      <Dialog
        className="FstoDialogCheque-root"
        open={open}
        PaperProps={{
          className: "FstoPaperCheque-root"
        }}
        fullWidth
        disablePortal
      >
        <DialogTitle className="FstoDialogCheque-title">
          Cheque Details Entry

          <IconButton size="large" onClick={closeChequeHandler}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent className="FstoDialogCheque-content">
          <Box className="FstoBoxCheque-root">
            <Autocomplete
              className="FstoSelectForm-root"
              size="small"
              options={TYPE_LIST}
              value={CQ.type}
              renderInput={
                (props) => <TextField {...props} label="Type" variant="outlined" />
              }
              PaperComponent={
                (props) => <Paper {...props} sx={{ textTransform: 'capitalize' }} />
              }
              getOptionDisabled={
                (option) => option.toLowerCase() !== "cheque"
              }
              isOptionEqualToValue={
                (option, value) => option === value
              }
              onChange={(e, value) => setCQ((currentValue) => ({
                ...currentValue,
                type: value
              }))}
              disablePortal
              disableClearable
            />

            <Autocomplete
              className="FstoSelectForm-root"
              size="small"
              options={BANKS_LIST || []}
              value={CQ.bank}
              loading={
                BANKS_STATUS === 'loading'
              }
              renderInput={
                (props) => <TextField {...props} label="Bank" variant="outlined" />
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
              onChange={(e, value) => setCQ((currentValue) => ({
                ...currentValue,
                bank: value
              }))}
              disablePortal
              disableClearable
            />

            <TextField
              className="FstoTextfieldForm-root"
              label="Cheque Number"
              variant="outlined"
              autoComplete="off"
              size="small"
              type="number"
              value={CQ.no}
              error={
                error.status
                && Boolean(error.data.cheque_no)
              }
              helperText={
                (error.status
                  && error.data.cheque_no
                  && error.data.cheque_no[0])
                ||
                (validate.status
                  && validate.data.includes('cheque_no')
                  && "Please wait...")
              }
              onBlur={checkChequeHandler}
              onKeyDown={(e) => ["E", "e", ".", "+", "-"].includes(e.key) && e.preventDefault()}
              onChange={(e) => setCQ((currentValue) => ({
                ...currentValue,
                no: e.target.value
              }))}
            />

            <LocalizationProvider dateAdapter={DateAdapter}>
              <DatePicker
                value={CQ.date}
                renderInput={
                  (props) => <TextField {...props} className="FstoTextfieldForm-root" label="Date" variant="outlined" size="small" onKeyDown={(e) => e.preventDefault()} />
                }
                onChange={(value) => setCQ((currentValue) => ({
                  ...currentValue,
                  date: moment(value).format("YYYY-MM-DD")
                }))}
                showToolbar
                disabled
              />
            </LocalizationProvider>

            <TextField
              className="FstoTextfieldForm-root"
              label="Amount"
              variant="outlined"
              autoComplete="off"
              size="small"
              value={CQ.amount}
              InputProps={{
                inputComponent: NumberField
              }}
              onChange={(e) => setCQ((currentValue) => ({
                ...currentValue,
                amount: e.target.value
              }))}
            />

            <Button
              variant="contained"
              startIcon={
                CQ.update ? <EditIcon /> : <AddIcon />
              }
              onClick={addChequeHandler}
              disabled={
                !Boolean(CQ.no) ||
                !Boolean(CQ.type) ||
                !Boolean(CQ.bank) ||
                !Boolean(CQ.amount) ||
                (error.status && Boolean(error.data.cheque_no)) ||
                (validate.status && Boolean(validate.data.includes('cheque_no')))
              }
              disableElevation
            > {CQ.update ? "Update" : "Add"}
            </Button>
          </Box>

          {
            Boolean(chequeData.cheques.length) &&
            <React.Fragment>
              <Button
                sx={{ float: "right", marginTop: 1, marginBottom: 2 }}
                onClick={viewAccountTitleHandler}
              > View Account Title Details
              </Button>

              <TableContainer sx={{ marginBottom: 5 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Bank</TableCell>
                      <TableCell>Cheque Number</TableCell>
                      <TableCell className="FstoTabelCellCheque-root">Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody className="FstoTableBodyCheque-root">
                    {
                      chequeData.cheques.map((item, index) => (
                        <TableRow className="FstoTableRowCheque-root" key={index}>
                          <TableCell size="small">
                            {item.type}
                          </TableCell>

                          <TableCell size="small">
                            {item.bank.name}
                          </TableCell>

                          <TableCell size="small">
                            {item.no}
                          </TableCell>

                          <TableCell className="FstoTabelCellCheque-root" size="small">
                            {
                              item.date
                                ? moment(item.date).format("MM/DD/YYYY")
                                : <>&mdash;</>
                            }
                          </TableCell>

                          <TableCell size="small">
                            &#8369;{item.amount.toLocaleString()}
                          </TableCell>

                          <TableCell align="right" size="small">
                            <IconButton onClick={() => editChequeHandler(item, index)}>
                              <EditIcon fontSize="small" />
                            </IconButton>

                            <IconButton onClick={() => removeChequeHandler(index)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </TableContainer>

              <Stack className="FstoDialogCheque-root" direction="row">
                <Typography variant="body1" sx={{ flex: 1 }}>Total Cheque Amount</Typography>
                <Typography variant="h6">
                  &#8369;{chequeData.cheques.reduce((a, b) => a + b.amount, 0).toLocaleString()}
                </Typography>
              </Stack>

              <Stack className="FstoDialogCheque-root" direction="row">
                <Typography variant="body1" sx={{ flex: 1 }}>Total Document Amount</Typography>
                <Typography variant="h6">
                  &#8369;{transactions.reduce((a, b) => a + (b?.document_amount || b?.referrence_amount), 0).toLocaleString()}
                </Typography>
              </Stack>

              <Divider variant="middle" sx={{ marginY: 2 }} />

              <Stack className="FstoDialogCheque-root" direction="row">
                <Typography variant="body1" sx={{ flex: 1 }}>Variance</Typography>
                <Typography variant="h6">
                  &#8369;{(chequeData.cheques.reduce((a, b) => a + b.amount, 0) - transactions.reduce((a, b) => a + (b?.document_amount || b?.referrence_amount), 0)).toLocaleString()}
                </Typography>
              </Stack>
            </React.Fragment>
          }
        </DialogContent>

        <DialogActions className="FstoDialogCheque-actions">
          <Button
            variant="contained"
            onClick={submitChequehandler}
            disabled={
              !Boolean(chequeData.cheques.length) ||
              !Boolean(chequeData.accounts.length) ||
              !chequeData.accounts.some((item) => item.entry.toLowerCase() === `debit`) ||
              !chequeData.accounts.some((item) => item.entry.toLowerCase() === `credit`)
            }
            disableElevation
          > {state?.match(/receive$/gi) ? "Submit" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <AccountTitleDialog
        accounts={chequeData.accounts}
        onClear={closeChequeHandler}
        {...manageAccountTitle}
      />
    </>
  )
}

export default DocumentChequingDialog