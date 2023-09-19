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
import ErrorIcon from '@mui/icons-material/Error';

import useBanks from '../hooks/useBanks'

const TYPE_LIST = [
  {
    id: 1,
    name: "Cheque"
  },
  {
    id: 2,
    name: "Debit Memo"
  },
  {
    id: 3,
    name: "Telegraphic"
  },
  {
    id: 4,
    name: "Managers Cheque"
  }
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

const ChequeEntryDialog = ({
  open = false,
  state = null,
  transaction = null,
  accounts = [],
  cheques = [],
  onInsert = () => { },
  onUpdate = () => { },
  onRemove = () => { },
  onBack = () => { },
  onClear = () => { },
  onView = () => { },
  onClose = () => { },
  onSubmit = () => { }
}) => {

  const {
    refetch: fetchBanks,
    status: BANKS_STATUS,
    data: BANKS_LIST
  } = useBanks()
  React.useEffect(() => {
    if (open) fetchBanks()

    // eslint-disable-next-line 
  }, [open])

  const [CQ, setCQ] = React.useState({
    update: false,
    index: null,

    bank: null,
    date: null,
    no: "",
    amount: "",
    type: ""
  })

  React.useEffect(() => {
    if (!open) clearChequeHandler()

    // eslint-disable-next-line
  }, [open])

  const [validate, setValidate] = React.useState({
    status: false,
    data: []
  })

  const [error, setError] = React.useState({
    status: false,
    data: []
  })

  const addChequeHandler = () => {
    if (!CQ.update)
      onInsert({
        type: CQ.type,
        bank: CQ.bank,
        no: CQ.no,
        date: CQ.date,
        amount: parseFloat(CQ.amount)
      })

    if (!!CQ.update)
      onUpdate({
        type: CQ.type,
        bank: CQ.bank,
        no: CQ.no,
        date: CQ.date,
        amount: parseFloat(CQ.amount)
      }, CQ.index)

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
    onRemove(index)
  }

  const submitChequehandler = () => {
    onClose()
    onSubmit()
  }

  const backChequeHandler = () => {
    onClose()
    onBack(transaction)
  }

  const clearChequeHandler = () => {
    setCQ({
      update: false,
      index: null,

      bank: null,
      date: null,
      no: "",
      amount: "",
      type: ""
    })
  }

  const closeChequeHandler = () => {
    onClose()
    onClear()
    clearChequeHandler()
  }

  const viewAccountTitleHandler = () => {
    onClose()
    onView()
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

    const check = cheques.some((item) => item.no === CQ.no)
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
        cheque_no: CQ.no,
        ...(
          /cheque-cheque|cheque-receive|return-cheque/i.test(state) && {
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
        {
          Boolean(state) && !Boolean(state.match(/-release|file|reverse|clear|return-tag|return-voucher|return-release|release-|counter-.*/)) &&
          <Box className="FstoBoxCheque-root">
            <Autocomplete
              className="FstoSelectForm-root"
              size="small"
              options={TYPE_LIST}
              value={TYPE_LIST.find((row) => row.name === CQ.type) || null}
              disabled={
                Boolean(state.match(/issue-.*/))
              }
              renderInput={
                (props) => <TextField {...props} label="Type" variant="outlined" />
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
              onChange={(e, value) => setCQ(currentValue => ({
                ...currentValue,
                type: value.name
              }))}
              disablePortal
              disableClearable
            />

            <Autocomplete
              className="FstoSelectForm-root"
              size="small"
              options={BANKS_LIST || []}
              value={CQ.bank}
              disabled={
                Boolean(state.match(/issue-.*/))
              }
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
              onChange={(e, value) => setCQ(currentValue => ({
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
              disabled={
                Boolean(state.match(/issue-.*/))
              }
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
              onChange={(e) => setCQ(currentValue => ({
                ...currentValue,
                no: e.target.value
              }))}
            />

            <LocalizationProvider dateAdapter={DateAdapter}>
              <DatePicker
                value={CQ.date}
                renderInput={
                  (props) => <TextField {...props} className="FstoTextfieldForm-root" label="Date" variant="outlined" size="small" onKeyPress={(e) => e.preventDefault()} />
                }
                onChange={(value) => setCQ(currentValue => ({
                  ...currentValue,
                  // date: new Date(value).toISOString()
                  date: moment(value).format("YYYY-MM-DD")
                }))}
                showToolbar
              />
            </LocalizationProvider>

            <TextField
              className="FstoTextfieldForm-root"
              label="Amount"
              variant="outlined"
              autoComplete="off"
              size="small"
              value={CQ.amount}
              disabled={
                Boolean(state.match(/issue-.*/))
              }
              InputProps={{
                inputComponent: NumberField
              }}
              onChange={(e) => setCQ(currentValue => ({
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
                !Boolean(CQ.date) ||
                !Boolean(CQ.amount) ||
                (error.status && Boolean(error.data.cheque_no)) ||
                (validate.status && Boolean(validate.data.includes('cheque_no')))
              }
              disableElevation
            > {CQ.update ? "Update" : "Add"}
            </Button>
          </Box>
        }

        {
          Boolean(cheques.length) &&
          <React.Fragment>
            <Button
              sx={{ float: "right", marginTop: 1, marginBottom: 2 }}
              color={
                accounts.some((item) => Boolean(item.entry.match(/credit/i))) && accounts.reduce((a, b) => a + b.amount / 2, 0) === (transaction?.document_amount || transaction?.referrence_amount)
                  ? "primary"
                  : "error"
              }
              startIcon={
                (
                  !accounts.some((item) => Boolean(item.entry.match(/credit/i))) ||
                  !Boolean(accounts.reduce((a, b) => a + b.amount / 2, 0) === (transaction?.document_amount || transaction?.referrence_amount))
                )
                && <ErrorIcon />
              }
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
                    {
                      Boolean(state) && !Boolean(state.match(/-release|file|reverse|clear|return-tag|return-voucher|return-release|release-|counter-.*/)) &&
                      <TableCell align="right">Action</TableCell>
                    }
                  </TableRow>
                </TableHead>

                <TableBody className="FstoTableBodyCheque-root">
                  {
                    cheques.map((item, index) => (
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
                          {moment(item.date).format("MM/DD/YYYY")}
                        </TableCell>

                        <TableCell size="small">
                          &#8369;{item.amount.toLocaleString()}
                        </TableCell>

                        {
                          Boolean(state) && !Boolean(state.match(/-release|file|reverse|clear|return-tag|return-voucher|return-release|release-|counter-.*/)) &&
                          <TableCell align="right" size="small">
                            <IconButton onClick={() => editChequeHandler(item, index)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => removeChequeHandler(index)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        }
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer>

            <Stack className="FstoDialogCheque-root" direction="row">
              <Typography variant="body1" sx={{ flex: 1 }}>Total Cheque Amount</Typography>
              <Typography variant="h6">
                &#8369;{cheques.map((item) => item.amount).reduce((a, b) => a + b, 0).toLocaleString()}
              </Typography>
            </Stack>

            <Stack className="FstoDialogCheque-root" direction="row">
              <Typography variant="body1" sx={{ flex: 1 }}>Document Amount</Typography>
              <Typography variant="h6">
                &#8369;{(transaction?.document_amount || transaction?.referrence_amount)?.toLocaleString()}
              </Typography>
            </Stack>

            <Divider variant="middle" sx={{ marginY: 2 }} />

            <Stack className="FstoDialogCheque-root" direction="row">
              <Typography variant="body1" sx={{ flex: 1 }}>Variance</Typography>
              <Typography variant="h6">
                &#8369;{(cheques.map((item) => item.amount).reduce((a, b) => a + b, 0) - (transaction?.document_amount || transaction?.referrence_amount)).toLocaleString()}
              </Typography>
            </Stack>

            {
              Boolean(cheques.length) &&
              cheques.map((item) => item.amount).reduce((a, b) => a + b, 0) !== (transaction?.document_amount || transaction?.referrence_amount) &&
              <Stack className="FstoStackAccountTitle-root" direction="row" justifyContent="flex-end">
                <Typography variant="caption" color="error">Total cheque and document amount are not equal.</Typography>
              </Stack>}
          </React.Fragment>
        }
      </DialogContent>

      <DialogActions className="FstoDialogCheque-actions">
        <Button
          variant="outlined"
          color="info"
          onClick={backChequeHandler}
          disableElevation
        > Back
        </Button>

        {
          Boolean(state) && !Boolean(state.match(/-release|file|reverse|clear|return-tag|return-voucher|return-release|release-|counter-.*/)) &&
          <Button
            variant="contained"
            onClick={submitChequehandler}
            disabled={
              !Boolean(cheques.length) ||
              !Boolean(accounts.length) ||
              !accounts.some((item) => item.entry.toLowerCase() === `debit`) ||
              !accounts.some((item) => item.entry.toLowerCase() === `credit`) ||
              !(accounts.filter((item) => item.entry.toLowerCase() === `debit`).reduce((a, b) => a + b.amount, 0) === (transaction?.document_amount || transaction?.referrence_amount)) ||
              !(accounts.filter((item) => item.entry.toLowerCase() === `credit`).reduce((a, b) => a + b.amount, 0) === (transaction?.document_amount || transaction?.referrence_amount)) ||
              !(cheques.reduce((a, b) => a + b.amount, 0) === (transaction?.document_amount || transaction?.referrence_amount))
            }
            disableElevation
          > {state?.match(/receive.*/) ? "Submit" : "Save"}
          </Button>
        }
      </DialogActions>
    </Dialog>
  )
}

export default ChequeEntryDialog