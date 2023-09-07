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
import useDistribute from '../hooks/useDistribute'

import '../assets/css/styles.transfer.scss'

const TransferDialog = ({
  data,
  process,
  subprocess,
  open = false,
  onSuccess = () => { },
  onClose = () => { }
}) => {

  const toast = useToast()
  const {
    refetch: fetchDistribute,
    data: DISTUBUTE_LIST,
    status: DISTRIBUTE_STATUS
  } = useDistribute(data?.company_id)

  React.useEffect(() => {
    if (open && !DISTUBUTE_LIST) fetchDistribute()
    // eslint-disable-next-line
  }, [open])

  const [isSaving, setIsSaving] = React.useState(false)
  const [transfer, setTransfer] = React.useState(null)

  const transferCloseHandler = () => {
    onClose()
    setTransfer(null)
  }

  const transferSubmitHandler = async () => {
    setIsSaving(true)

    let response
    try {
      response = await axios.put(`/api/transactions/flow/transfer/${data.id}`, {
        process,
        subprocess,
        transfer
      })

      const { message } = response.data

      onSuccess()
      transferCloseHandler()
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
        message: `Something went wrong whilst trying to transfer this transaction. Please try again later.`
      })
    }

    setIsSaving(false)
  }


  return (
    <Dialog
      className="FstoDialogTransfer-root"
      open={open}
      PaperProps={{
        className: "FstoPaperTransfer-root"
      }}
      fullWidth
    >
      <DialogTitle className="FstoDialogTitleTransfer-root">
        Confirmation
        <IconButton onClick={transferCloseHandler}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent className="FstoDialogContentTransfer-root">
        <Box className="FstoDialogContentTransfer-box">
          <WarningIcon className="FstoDialogContentTransfer-icon" />
          Are you sure you want to transfer this transaction?
        </Box>

        <Autocomplete
          className="FstoDialogContentTransfer-option"
          size="small"
          options={DISTUBUTE_LIST || []}
          value={transfer}
          loading={
            DISTRIBUTE_STATUS === 'loading'
          }
          renderInput={
            (props) => <TextField {...props} label="Select Recipient" variant="outlined" />
          }
          getOptionLabel={
            (option) => option.name
          }
          isOptionEqualToValue={
            (option, value) => option.id === value.id
          }
          onChange={(e, value) => setTransfer(value)}
          fullWidth
          disableClearable
        />
      </DialogContent>

      <DialogActions className="FstoDialogActionsTransfer-root">
        <Button
          className="FstoDialogActionsTransfer-button"
          variant="text"
          onClick={transferCloseHandler}
        > No
        </Button>

        <LoadingButton
          className="FstoDialogActionsReason-button"
          variant="contained"
          loadingPosition="start"
          loading={isSaving}
          startIcon={<></>}
          onClick={transferSubmitHandler}
          disabled={
            !Boolean(transfer)
          }
          disableElevation
        > Yes
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default TransferDialog