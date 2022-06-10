import React from 'react'

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

const ChequeEntry = (props) => {

  const {
    data,
    open = false,
    onBack = () => { },
    onClose = () => { },
    onSubmit = () => { }
  } = props

  const submitChequehandler = () => {
    onClose()
    onSubmit(data)
  }

  const backChequeHandler = () => {
    onClose()
    onBack(data)
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
        <IconButton size="large" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="FstoDialogCheque-content">
        <Box className="FstoBoxCheque-root">
          <Autocomplete
            className="FstoSelectForm-root"
            size="small"
            options={[]}
            value={null}
            renderInput={
              props =>
                <TextField
                  {...props}
                  variant="outlined"
                  label="Bank"
                />
            }
            PaperComponent={
              props =>
                <Paper
                  {...props}
                  sx={{ textTransform: 'capitalize' }}
                />
            }
            onChange={(e, value) => console.log(value)}
            disablePortal
            disableClearable
          />

          <TextField
            className="FstoTextfieldForm-root"
            label="Cheque Number"
            variant="outlined"
            autoComplete="off"
            size="small"
            onChange={() => { }}
          />

          <TextField
            className="FstoTextfieldForm-root"
            label="Cheque Date"
            variant="outlined"
            autoComplete="off"
            size="small"
            onChange={() => { }}
          />

          <TextField
            className="FstoTextfieldForm-root"
            label="Amount"
            variant="outlined"
            autoComplete="off"
            size="small"
            onChange={() => { }}
          />

          <Button
            className=""
            variant="contained"
            startIcon={<AddIcon />}
            disableElevation
          > Add
          </Button>
        </Box>

        <TableContainer sx={{ marginY: 5 }}>
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
              <TableRow>
                <TableCell size="small">AUB Angeles Branch</TableCell>
                <TableCell size="small">203-4024-424</TableCell>
                <TableCell className="FstoTabelCellCheque-root" size="small">11/27/2021</TableCell>
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

        <Stack className="FstoDialogCheque-root" direction="row">
          <Typography variant="body1" sx={{ flex: 1 }}>Total Cheque Amount</Typography>
          <Typography variant="h6">₱100,000.00</Typography>
        </Stack>

        <Stack className="FstoDialogCheque-root" direction="row">
          <Typography variant="body1" sx={{ flex: 1 }}>Document Amount</Typography>
          <Typography variant="h6">₱100,000.00</Typography>
        </Stack>

        <Divider variant="middle" sx={{ marginY: 2 }} />

        <Stack className="FstoDialogCheque-root" direction="row">
          <Typography variant="body1" sx={{ flex: 1 }}>Variance</Typography>
          <Typography variant="h6">₱0.00</Typography>
        </Stack>
      </DialogContent>

      <DialogActions className="FstoDialogCheque-actions">
        <Button
          variant="outlined"
          color="info"
          size="large"
          onClick={backChequeHandler}
          disableElevation
        > Back
        </Button>

        <Button
          variant="contained"
          size="large"
          onClick={submitChequehandler}
          disableElevation
        > Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ChequeEntry