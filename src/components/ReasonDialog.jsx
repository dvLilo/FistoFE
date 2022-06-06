import React from 'react'

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

import {
  CloseRounded as CloseIcon,
  WarningAmberRounded as WarningIcon
} from '@mui/icons-material'

import useReasons from '../hooks/useReasons'

import '../assets/css/styles.reason.scss'


const ReasonDialog = ({ open = false, data = null, onClose = () => { } }) => {

  const {
    status: REASON_STATUS,
    data: REASON_LIST
  } = useReasons()

  const [reason, setReason] = React.useState({
    status: "void",
    transaction: {
      id: null,
      no: ""
    },
    reason: {
      id: null,
      description: "",
      remarks: ""
    }
  })

  React.useEffect(() => {
    if (open)
      setReason(currentValue => ({
        ...currentValue,
        transaction: {
          id: data.id,
          no: data.transaction_id
        }
      }))
    // eslint-disable-next-line
  }, [open])

  const reasonCloseHandler = () => {
    setReason({
      status: "void",
      transaction: {
        id: null,
        no: ""
      },
      reason: {
        id: null,
        description: "",
        remarks: ""
      }
    })
    onClose()
  }

  return (
    <Dialog
      className="FstoDialogReason-root"
      open={open}
      PaperProps={{
        className: "FstoPaperReason-root"
      }}
      fullWidth
    >
      <DialogTitle className="FstoDialogTitleReason-root">
        Confirmation
        <IconButton onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent className="FstoDialogContentReason-root">
        <Box className="FstoDialogContentReason-box">
          <WarningIcon className="FstoDialogContentReason-icon" />
          Are you sure you want to void this transaction?
        </Box>

        <form className="FstoDialogContentReason-form">
          <Autocomplete
            className="FstoDialogContentReason-option"
            size="small"
            options={REASON_LIST || []}
            value={
              reason.reason.id && reason.reason.description
                ? reason.reason
                : null
            }
            loading={
              REASON_STATUS === 'loading'
            }
            renderInput={
              props =>
                <TextField
                  {...props}
                  variant="outlined"
                  label="Select Reason"
                />
            }
            getOptionLabel={
              (option) => option.description
            }
            isOptionEqualToValue={
              (option, value) => option.id === value.id
            }
            onChange={(e, value) => setReason(currentValue => ({
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
            value={reason.reason.remarks}
            onChange={(e) => setReason(currentValue => ({
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
          onClick={reasonCloseHandler}
        >No</Button>

        <LoadingButton
          className="FstoDialogActionsReason-button"
          variant="contained"
          loadingPosition="start"
          loading={false}
          startIcon={<></>}
          disabled={
            !Boolean(reason.reason.id) &&
            !Boolean(reason.reason.description)
          }
          disableElevation
        >Yes</LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default ReasonDialog