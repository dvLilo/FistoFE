import React from 'react'

import {
  Dialog,
  DialogActions,
  Button,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material'

import ErrorIcon from '@mui/icons-material/Error'

const ErrorDialog = ({
  open,
  data,
  onClose
}) => {

  return (
    <Dialog
      className="FstoDialogError-root"
      open={open}
      maxWidth="sm"
      PaperProps={{
        className: "FstoPaperImport-root"
      }}
      fullWidth
      disablePortal
    >
      <Typography className="FstoPaperImport-title" variant="h5" color="error">
        <ErrorIcon sx={{ fontSize: 38, marginRight: 1 }} /> {data?.message}
      </Typography>

      <TableContainer>
        <Table size="small" stickyHeader={true}>
          <TableHead>
            <TableRow>
              <TableCell>Error</TableCell>
              <TableCell>Row</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {
              data.result?.map((error, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ color: "#D32F2F", fontWeight: 500, textTransform: "capitalize" }}>{error.error_type}</TableCell>
                  <TableCell>{error.line}</TableCell>
                  <TableCell
                    sx={{
                      '&::first-letter': {
                        textTransform: "uppercase"
                      }
                    }}
                  >
                    {error.description}
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>

      <DialogActions>
        <Button
          className="FstoDialogError-button"
          variant="text"
          color="error"
          onClick={onClose}
          sx={{
            textTransform: "capitalize"
          }}
          disableElevation
        >Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ErrorDialog