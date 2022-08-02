import React from 'react'

import axios from 'axios'

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

import useToast from '../hooks/useToast'
import useReasons from '../hooks/useReasons'

import '../assets/css/styles.reason.scss'


const ReasonDialog = (props) => {

  const {
    data,
    process,
    subprocess,
    open = false,
    onSuccess = () => { },
    onClose = () => { }
  } = props

  const toast = useToast()
  const {
    refetch: fetchReasons,
    status: REASON_STATUS,
    data: REASON_LIST,
  } = useReasons()

  React.useEffect(() => {
    if (open && !REASON_LIST) fetchReasons()
    // eslint-disable-next-line
  }, [open])

  const [isSaving, setIsSaving] = React.useState(false)
  const [reason, setReason] = React.useState({
    id: null,
    description: "",
    remarks: ""
  })

  const reasonCloseHandler = () => {
    onClose()
    setReason({
      id: null,
      description: "",
      remarks: ""
    })
  }

  const reasonSubmitHandler = async () => {
    setIsSaving(true)

    let response
    try {
      response = await axios.post(`/api/transactions/flow/update-transaction/${data.id}`, {
        process: process,
        subprocess: subprocess,
        reason: reason
      })

      const { message } = response.data

      onSuccess()
      reasonCloseHandler()
      toast({
        title: "Success!",
        message
      })
    }
    catch (error) {
      toast({
        open: true,
        severity: "error",
        title: "Error!",
        message: `Something went wrong whilst trying to ${subprocess} this transaction. Please try again later.`
      })
    }

    setIsSaving(false)
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

        <form className="FstoDialogContentReason-form" >
          <Autocomplete
            className="FstoDialogContentReason-option"
            size="small"
            options={REASON_LIST || []}
            value={
              reason.id && reason.description
                ? reason
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
              id: value.id,
              description: value.description
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
            value={reason.remarks}
            onChange={(e) => setReason(currentValue => ({
              ...currentValue,
              remarks: e.target.value
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
        > No
        </Button>

        <LoadingButton
          className="FstoDialogActionsReason-button"
          variant="contained"
          loadingPosition="start"
          loading={isSaving}
          startIcon={<></>}
          onClick={reasonSubmitHandler}
          disabled={
            !Boolean(reason.id) &&
            !Boolean(reason.description)
          }
          disableElevation
        > Yes
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default ReasonDialog