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

import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'

import useAccountTitles from '../hooks/useAccountTitles'

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

const AccountTitleDialog = (props) => {

  const {
    open = false,
    state = null,
    transaction = null,
    accounts = [],
    onInsert = () => { },
    onUpdate = () => { },
    onRemove = () => { },
    onBack = () => { },
    onClear = () => { },
    onClose = () => { },
    onSubmit = () => { }
  } = props

  const {
    refetch: fetchAccountTitles,
    data: ACCOUNT_TITLE_LIST,
    status: ACCOUNT_TITLE_STATUS
  } = useAccountTitles()

  React.useEffect(() => {
    if (open && !ACCOUNT_TITLE_LIST) fetchAccountTitles()
    // eslint-disable-next-line
  }, [open])

  const [AT, setAT] = React.useState({
    update: false,
    index: null,

    entry: null,
    account_title: null,
    amount: "",
    remarks: ""
  })

  React.useEffect(() => {
    if (!open) clearAccountTitleHandler()
    // eslint-disable-next-line
  }, [open])


  const addAccountTitleHandler = () => {
    if (!AT.update)
      onInsert({
        entry: AT.entry,
        amount: parseFloat(AT.amount),
        remarks: AT.remarks,
        account_title: AT.account_title
      })

    if (!!AT.update)
      onUpdate({
        entry: AT.entry,
        amount: parseFloat(AT.amount),
        remarks: AT.remarks,
        account_title: AT.account_title
      }, AT.index)

    clearAccountTitleHandler()
  }

  const editAccountTitleHandler = (item, index) => {
    setAT({
      update: true,
      index,

      ...item,
      amount: item.amount.toString()
    })
  }

  const removeAccountTitleHandler = (index) => {
    onRemove(index)
  }


  const submitAccountTitleHandler = () => {
    onClose()
    onSubmit()
  }

  const backAccountTitleHandler = () => {
    onClose()
    onBack(transaction)
  }

  const clearAccountTitleHandler = () => {
    setAT({
      update: false,
      index: null,

      entry: null,
      account_title: null,
      amount: "",
      remarks: ""
    })
  }

  const closeAccountTitleHandler = () => {
    onClose()
    onClear()
    clearAccountTitleHandler()
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
        <IconButton size="large" onClick={closeAccountTitleHandler}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="FstoDialogAccountTitle-content">
        {
          Boolean(state) && !Boolean(state.match(/approve-|transmit-|release-|file-.*/)) &&
          <Box className="FstoBoxAccountTitle-root" sx={{ marginBottom: 5 }}>
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
              getOptionDisabled={
                (option) => Boolean(state) && Boolean(state.match(/cheque-.*/)) && option.name.toLowerCase() === `debit`
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
              getOptionDisabled={
                (option) => accounts.some((item) => item.account_title.id === option.id)
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
              startIcon={
                AT.update ? <EditIcon /> : <AddIcon />
              }
              onClick={addAccountTitleHandler}
              disabled={
                !Boolean(AT.entry) ||
                !Boolean(AT.account_title) ||
                !Boolean(AT.amount)
              }
              disableElevation
            > {AT.update ? "Update" : "Add"}
            </Button>
          </Box>
        }

        {
          Boolean(accounts.length) &&
          <React.Fragment>
            <TableContainer sx={{ marginBottom: 5 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Account Title</TableCell>
                    <TableCell className="FstoTabelCellAccountTitle-root" align="right">Debit</TableCell>
                    <TableCell>Credit</TableCell>
                    {
                      Boolean(state) && !Boolean(state.match(/approve-|transmit-|release-|file-.*/)) &&
                      <TableCell align="right">Action</TableCell>
                    }
                  </TableRow>
                </TableHead>

                <TableBody className="FstoTableBodyAccountTitle-root">
                  {
                    accounts.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell size="small">
                          <strong>{item.account_title.name}</strong>
                          {
                            item.remarks && <React.Fragment><br /><i>{item.remarks}</i></React.Fragment>
                          }
                        </TableCell>

                        <TableCell className="FstoTabelCellAccountTitle-root" align="right" size="small">
                          {
                            item.entry === `Debit`
                              ? <React.Fragment>&#8369;{item.amount.toLocaleString()}</React.Fragment>
                              : <React.Fragment>&mdash;</React.Fragment>
                          }
                        </TableCell>

                        <TableCell size="small">
                          {
                            item.entry === `Credit`
                              ? <React.Fragment>&#8369;{item.amount.toLocaleString()}</React.Fragment>
                              : <React.Fragment>&mdash;</React.Fragment>
                          }
                        </TableCell>

                        {
                          Boolean(state) && !Boolean(state.match(/approve-|transmit-|release-|file-.*/)) &&
                          <TableCell align="right" size="small">
                            <IconButton onClick={() => editAccountTitleHandler(item, index)} disabled={Boolean(state) && Boolean(state.match(/cheque-.*/)) && !Boolean(index)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => removeAccountTitleHandler(index)} disabled={Boolean(state) && Boolean(state.match(/cheque-.*/)) && !Boolean(index)}>
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

            {
              accounts.some((item) => item.entry === `Credit`) &&
              <Stack className="FstoStackAccountTitle-root" direction="row">
                <Typography variant="body1" sx={{ flex: 1 }}>Total Credit Amount</Typography>
                <Typography variant="h6">
                  &#8369;{accounts.filter((item) => item.entry === `Credit`).map((item) => item.amount).reduce((a, b) => a + b, 0).toLocaleString()}
                </Typography>
              </Stack>}
            {
              accounts.some((item) => item.entry === `Debit`) &&
              <Stack className="FstoStackAccountTitle-root" direction="row">
                <Typography variant="body1" sx={{ flex: 1 }}>Total Debit Amount</Typography>
                <Typography variant="h6">
                  &#8369;{accounts.filter((item) => item.entry === `Debit`).map((item) => item.amount).reduce((a, b) => a + b, 0).toLocaleString()}
                </Typography>
              </Stack>}

            <Divider variant="middle" sx={{ marginY: 2 }} />

            <Stack className="FstoStackAccountTitle-root" direction="row">
              <Typography variant="body1" sx={{ flex: 1 }}>Variance</Typography>
              <Typography variant="h6">
                &#8369;
                {((accounts.filter((item) => item.entry === `Debit`).map((item) => item.amount).reduce((a, b) => a + b, 0)) - (accounts.filter((item) => item.entry === `Credit`).map((item) => item.amount).reduce((a, b) => a + b, 0))).toLocaleString()}
              </Typography>
            </Stack>

          </React.Fragment>
        }
      </DialogContent>

      <DialogActions className="FstoDialogAccountTitle-actions">
        <Button
          variant="outlined"
          color="info"
          onClick={backAccountTitleHandler}
          disableElevation
        > Back
        </Button>

        {
          Boolean(state) && !Boolean(state.match(/approve-|transmit-|release-|file-.*/)) &&
          <Button
            variant="contained"
            onClick={submitAccountTitleHandler}
            disabled={
              !Boolean(accounts.length) ||
              !accounts.some((item) => item.entry.toLowerCase() === `debit`) ||
              !accounts.some((item) => item.entry.toLowerCase() === `credit`) ||
              !(accounts.filter((item) => item.entry.toLowerCase() === `debit`).map((item) => item.amount).reduce((a, b) => a + b, 0) === (transaction?.document_amount || transaction?.referrence_amount)) ||
              !(accounts.filter((item) => item.entry.toLowerCase() === `credit`).map((item) => item.amount).reduce((a, b) => a + b, 0) === (transaction?.document_amount || transaction?.referrence_amount)) ||
              !(accounts.filter((item) => item.entry.toLowerCase() === `debit`).map((item) => item.amount).reduce((a, b) => a + b, 0) === accounts.filter((item) => item.entry.toLowerCase() === `credit`).map((item) => item.amount).reduce((a, b) => a + b, 0))
            }
            disableElevation
          > {state.match(/receive.*/) ? "Submit" : "Save"}
          </Button>}
      </DialogActions>
    </Dialog >
  )
}

export default AccountTitleDialog