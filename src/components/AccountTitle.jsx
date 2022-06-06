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
  Button
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'

// import useConfirm from '../hooks/useConfirm'

const AccountTitle = (props) => {

  const {
    // data,
    open = false,
    onClose = () => { }
  } = props

  // const confirm = useConfirm()

  return (
    <Dialog
      className="FstoDialogAccountTitle-root"
      open={open}
      scroll="body"
      maxWidth="lg"
      PaperProps={{
        className: "FstoPaperAccountTitle-root"
      }}
      onClose={onClose}
      fullWidth
      disablePortal
    >
      <DialogTitle className="FstoDialogAccountTitle-title">
        Account Title Entry
        <IconButton size="large" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="FstoDialogAccountTitle-contents">
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
            sx={{
              flexBasis: `210px`
            }}
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
            sx={{
              flex: 1
            }}
            disablePortal
            disableClearable
          />

          <TextField
            className="FstoTextfieldForm-root"
            label="Amount"
            variant="outlined"
            autoComplete="off"
            size="small"
            onChange={(e) => console.log(e.target.value)}
            sx={{
              flex: 1
            }}
          />

          <Button
            className=""
            variant="contained"
            startIcon={<AddIcon />}
            disableElevation
          > Add
          </Button>
        </Box>
      </DialogContent>

      <DialogActions className="FstoDialogAccountTitle-actions">

      </DialogActions>
    </Dialog>
  )
}

export default AccountTitle