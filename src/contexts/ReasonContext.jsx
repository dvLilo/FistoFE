import React from 'react'

// import axios from 'axios'

import {
  Box,
  TextField,
  IconButton,
  Button,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'

import { LoadingButton } from '@mui/lab'

import CloseIcon from '@mui/icons-material/CloseRounded'
import WarningIcon from '@mui/icons-material/WarningAmberRounded'

import '../assets/css/styles.reason.scss'

// import useToast from '../hooks/useToast'
// import useReasons from '../hooks/useReasons'

export const ReasonContext = React.createContext()

const ReasonContextProvider = ({ children }) => {

  // const toast = useToast()

  const [dialog, setDialog] = React.useState({
    open: false,
    loading: false,
    onConfirm: undefined
  })

  const [data, setData] = React.useState({
    process: null,
    subprocess: null,
    reason: null
  })

  const onCloseDialog = () => {
    setDialog(currentValue => ({
      ...currentValue,
      open: false,
      loading: false,
      onConfirm: undefined
    }))
  }

  const reason = (props) => {
    const {
      open = true,
      process = null,
      subprocess = null,
      onConfirm = undefined
    } = props

    setDialog(currentValue => ({
      ...currentValue,
      open,
      onConfirm
    }))

    setData(currentValue => ({
      ...currentValue,
      process,
      subprocess
    }))
  }

  return (
    <ReasonContext.Provider value={{ reason }}>
      {/* App content here */}
      {children}

      <Dialog
        className="FstoDialogReason-root"
        open={dialog.open}
        PaperProps={{
          className: "FstoPaperReason-root"
        }}
        fullWidth
      >
        <DialogTitle className="FstoDialogTitleReason-root">
          Confirmation
          <IconButton onClick={onCloseDialog}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent className="FstoDialogContentReason-root">
          <Box className="FstoDialogContentReason-box">
            <WarningIcon className="FstoDialogContentReason-icon" />
            Are you sure you want to *SUBPROCESS* this transaction?
          </Box>

          <form className="FstoDialogContentReason-form" >
            <Autocomplete
              className="FstoDialogContentReason-option"
              size="small"
              options={[]}
              value={data.reason}
              loading={false}
              renderInput={
                (props) => <TextField {...props} variant="outlined" label="Select Reason" />
              }
              getOptionLabel={
                (option) => option.description
              }
              isOptionEqualToValue={
                (option, value) => option.id === value.id
              }
              onChange={(e, value) => setData(currentValue => ({
                ...currentValue,
                reason: {
                  ...currentValue.reason,
                  id: value.id,
                  description: value.description
                }
              }))}
              fullWidth
              disableClearable
            />

            <TextField
              className="FstoDialogContentReason-input"
              variant="outlined"
              autoComplete="off"
              size="small"
              label="Remarks (Optional)"
              rows={3}
              value={data.reason.remarks}
              onChange={(e) => setData(currentValue => ({
                ...currentValue,
                reason: {
                  ...currentValue.reason,
                  remarks: e.target.value
                }
              }))}
              fullWidth
              multiline
            />
          </form>
        </DialogContent>

        <DialogActions className="FstoDialogActionsReason-root">
          <Button
            className="FstoDialogActionsReason-button"
            variant="text"
            onClick={onCloseDialog}
          > No
          </Button>

          <LoadingButton
            className="FstoDialogActionsReason-button"
            variant="contained"
            loadingPosition="start"
            loading={dialog.loading}
            startIcon={<></>}
            onClick={dialog.onConfirm}
            disabled={false}
            disableElevation
          > Yes
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </ReasonContext.Provider>
  )
}

export default ReasonContextProvider