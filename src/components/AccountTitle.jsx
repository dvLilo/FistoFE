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

const AccountTitle = (props) => {

  const {
    data,
    open = false,
    onBack = () => { },
    onClose = () => { },
    onSubmit = () => { }
  } = props

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
            options={[]}
            value={null}
            renderInput={
              props =>
                <TextField
                  {...props}
                  variant="outlined"
                  label="Entry"
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
                  label="Account Title"
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
            label="Amount"
            variant="outlined"
            autoComplete="off"
            size="small"
            onChange={() => { }}
          />

          <TextField
            className="FstoTextfieldForm-root"
            label="Remarks (Optional)"
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
          size="large"
          onClick={backAccountTitleHandler}
          disableElevation
        > Back
        </Button>

        <Button
          variant="contained"
          size="large"
          onClick={submitAccountTitleHandler}
          disableElevation
        > Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AccountTitle