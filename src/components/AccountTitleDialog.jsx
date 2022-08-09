import React from 'react'

import NumberFormat from 'react-number-format'

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

import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

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

const ENTRY_LIST = [
  {
    id: 1,
    name: "Debit"
  },
  {
    id: 2,
    name: "Credit"
  }
]

const ACCOUNT_TITLE_STATUS = `success`
const ACCOUNT_TITLE_LIST = [
  {
    id: 34,
    name: "SE - Salaries Expense"
  },
  {
    id: 33,
    name: "Accounts Payable"
  }
]

const AccountTitleDialog = (props) => {

  const {
    data,
    open = false,
    onBack = () => { },
    onClose = () => { },
    onSubmit = () => { }
  } = props

  const [AT, setAT] = React.useState({
    update: false,
    index: null,

    entry: null,
    account_title: null,
    amount: null,
    remarks: ""
  })

  const [accountsData, setAccountsData] = React.useState([])

  const addAccountTitleHandler = () => {
    setAccountsData(currentValue => ([
      ...currentValue,
      {
        entry: AT.entry,
        account_title: AT.account_title,
        amount: AT.amount,
        remarks: AT.remarks
      }
    ]))

    setAT({
      update: false,
      index: null,
      entry: null,
      account_title: null,
      amount: null,
      remarks: ""
    })
  }

  const submitAccountTitleHandler = () => {
    onClose()
    onSubmit(data)
  }

  const backAccountTitleHandler = () => {
    onClose()
    onBack(data)
  }

  return (
    <Dialog
      className="FstoDialogAccountTitle-root"
      open={open}
      PaperProps={{
        className: "FstoPaperAccountTitle-root"
      }}
      fullWidth
      disablePortal
    >
      <DialogTitle className="FstoDialogAccountTitle-title">
        Account Title Entry
        <IconButton size="large" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="FstoDialogAccountTitle-content">
        <Box className="FstoBoxAccountTitle-root">
          <Autocomplete
            className="FstoSelectForm-root"
            size="small"
            options={ENTRY_LIST}
            value={ENTRY_LIST.find((row) => row.name === AT.entry) || null}
            renderInput={
              (props) => <TextField {...props} label="Entry" variant="outlined" />
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
            onChange={(e, value) => setAT(currentValue => ({
              ...currentValue,
              entry: value.name
            }))}
            disablePortal
            disableClearable
          />

          <Autocomplete
            className="FstoSelectForm-root"
            size="small"
            options={ACCOUNT_TITLE_LIST || []}
            value={AT.account_title}
            loading={
              ACCOUNT_TITLE_STATUS === 'loading'
            }
            renderInput={
              (props) => <TextField {...props} label="Account Title" variant="outlined" />
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
            onChange={(e, value) => setAT(currentValue => ({
              ...currentValue,
              account_title: value
            }))}
            disablePortal
            disableClearable
          />

          <TextField
            className="FstoTextfieldForm-root"
            label="Amount"
            variant="outlined"
            autoComplete="off"
            size="small"
            value={AT.amount}
            InputProps={{
              inputComponent: NumberField
            }}
            onChange={(e) => setAT(currentValue => ({
              ...currentValue,
              amount: e.target.value
            }))}
          />

          <TextField
            className="FstoTextfieldForm-root"
            label="Remarks (Optional)"
            variant="outlined"
            autoComplete="off"
            size="small"
            value={AT.remarks}
            onChange={(e) => setAT(currentValue => ({
              ...currentValue,
              remarks: e.target.value
            }))}
          />

          <Button
            className=""
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addAccountTitleHandler}
            disableElevation
          > Add
          </Button>
        </Box>

        <TableContainer sx={{ marginY: 5 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Account Title</TableCell>
                <TableCell className="FstoTabelCellAccountTitle-root" align="right">Debit</TableCell>
                <TableCell>Credit</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody className="FstoTableBodyAccountTitle-root">
              <TableRow>
                <TableCell size="small"><strong>SE - Depr - Equipment, Furniture & Fixtures</strong><br /><i>Payment for chairset in Corporate Common. Payment for chairset in Corporate Common.</i></TableCell>
                <TableCell className="FstoTabelCellAccountTitle-root" align="right" size="small">₱100,000.00</TableCell>
                <TableCell size="small">&mdash;</TableCell>
                <TableCell align="right" size="small">
                  <IconButton>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell size="small">Accounts Payable</TableCell>
                <TableCell className="FstoTabelCellAccountTitle-root" align="right" size="small">&mdash;</TableCell>
                <TableCell size="small">₱100,000.00</TableCell>
                <TableCell align="right" size="small">
                  <IconButton>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Stack className="FstoStackAccountTitle-root" direction="row">
          <Typography variant="body1" sx={{ flex: 1 }}>Total Credit Amount</Typography>
          <Typography variant="h6">₱100,000.00</Typography>
        </Stack>

        <Stack className="FstoStackAccountTitle-root" direction="row">
          <Typography variant="body1" sx={{ flex: 1 }}>Total Debit Amount</Typography>
          <Typography variant="h6">₱100,000.00</Typography>
        </Stack>

        <Divider variant="middle" sx={{ marginY: 2 }} />

        <Stack className="FstoStackAccountTitle-root" direction="row">
          <Typography variant="body1" sx={{ flex: 1 }}>Variance</Typography>
          <Typography variant="h6">₱0.00</Typography>
        </Stack>
      </DialogContent>

      <DialogActions className="FstoDialogAccountTitle-actions">
        <Button
          variant="outlined"
          color="info"
          onClick={backAccountTitleHandler}
          disableElevation
        > Back
        </Button>

        <Button
          variant="contained"
          onClick={submitAccountTitleHandler}
          disableElevation
        > Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AccountTitleDialog