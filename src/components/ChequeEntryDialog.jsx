import React from 'react'

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

const TYPE_LIST = [
  {
    id: 1,
    name: "Cheque"
  },
  {
    id: 2,
    name: "Debit Memo"
  }
]

const BANK_LIST = [
  {
    id: 1,
    name: "AUB Angeles Branch"
  },
  {
    id: 2,
    name: "AUB Telebastagan Branch"
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

const ChequeEntryDialog = (props) => {

  const {
    open = false,
    // state = null,
    transaction = null,
    cheques = [],
    onInsert = () => { },
    onUpdate = () => { },
    onRemove = () => { },
    onBack = () => { },
    onClear = () => { },
    onClose = () => { },
    onSubmit = () => { }
  } = props

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
    setCQ({
      update: true,
      index,

      ...item,
      amount: item.amount.toString()
    })
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
        <Box className="FstoBoxCheque-root" sx={{ marginBottom: 5 }}>
          <Autocomplete
            className="FstoSelectForm-root"
            size="small"
            options={TYPE_LIST}
            value={TYPE_LIST.find((row) => row.name === CQ.type) || null}
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
            options={BANK_LIST || []}
            value={CQ.bank}
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
            value={CQ.no}
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
                date: new Date(value).toISOString()
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
            InputProps={{
              inputComponent: NumberField
            }}
            onChange={(e) => setCQ(currentValue => ({
              ...currentValue,
              amount: e.target.value
            }))}
          />

          <Button
            className=""
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
              !Boolean(CQ.amount)
            }
            disableElevation
          > {CQ.update ? "Update" : "Add"}
          </Button>
        </Box>

        {
          Boolean(cheques.length) &&
          <React.Fragment>
            <TableContainer sx={{ marginBottom: 5 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Bank</TableCell>
                    <TableCell>Cheque Number</TableCell>
                    <TableCell className="FstoTabelCellCheque-root">Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody className="FstoTableBodyCheque-root">
                  {
                    cheques.map((item, index) => (
                      <TableRow key={index}>
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
                &#8369;{cheques.map((item) => item.amount).reduce((a, b) => a + b, 0).toLocaleString()}
              </Typography>
            </Stack>

            <Stack className="FstoDialogCheque-root" direction="row">
              <Typography variant="body1" sx={{ flex: 1 }}>Document Amount</Typography>
              <Typography variant="h6">
                &#8369;{(transaction.document_amount || transaction.referrence_amount).toLocaleString()}
              </Typography>
            </Stack>

            <Divider variant="middle" sx={{ marginY: 2 }} />

            <Stack className="FstoDialogCheque-root" direction="row">
              <Typography variant="body1" sx={{ flex: 1 }}>Variance</Typography>
              <Typography variant="h6">
                &#8369;{(cheques.map((item) => item.amount).reduce((a, b) => a + b, 0) - (transaction.document_amount || transaction.referrence_amount)).toLocaleString()}
              </Typography>
            </Stack>
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

        <Button
          variant="contained"
          onClick={submitChequehandler}
          disabled={
            !Boolean(cheques.length) ||
            !(cheques.map((item) => item.amount).reduce((a, b) => a + b, 0) === (transaction.document_amount || transaction.referrence_amount))
          }
          disableElevation
        > Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ChequeEntryDialog