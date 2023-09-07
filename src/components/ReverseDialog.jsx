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
  DialogActions,
  CircularProgress
} from '@mui/material'

import CloseIcon from '@mui/icons-material/CloseRounded'
import WarningIcon from '@mui/icons-material/WarningAmberRounded'

import useReasons from '../hooks/useReasons'

import '../assets/css/styles.reverse.scss'

const ReverseDialog = ({
  open = false,
  reverse = null,
  onSelect = () => { },
  onChange = () => { },
  onSubmit = () => { },
  onClose = () => { },
  onClear = () => { }
}) => {

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

  const reverseCloseHandler = () => {
    onClose()
    onClear()
  }

  const reverseSubmitHandler = async () => {
    setIsSaving(true)
    await onSubmit()
    setIsSaving(false)
    onClose()
  }

  return (
    <Dialog
      className="FstoDialogReverse-root"
      open={open}
      PaperProps={{
        className: "FstoPaperReverse-root"
      }}
      fullWidth
    >
      <DialogTitle className="FstoDialogTitleReverse-root">
        Confirmation
        <IconButton onClick={reverseCloseHandler}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent className="FstoDialogContentReverse-root">
        <Box className="FstoDialogContentReverse-box">
          <WarningIcon className="FstoDialogContentReverse-icon" />
          Are you sure you want to reverse this transaction?
        </Box>

        <Autocomplete
          className="FstoDialogContentReverse-option"
          size="small"
          options={REASON_LIST || []}
          value={
            reverse.id && reverse.description
              ? reverse
              : null
          }
          loading={
            REASON_STATUS === 'loading'
          }
          renderInput={
            (props) => <TextField {...props} label="Select Reason" variant="outlined" />
          }
          getOptionLabel={
            (option) => option.description
          }
          isOptionEqualToValue={
            (option, value) => option.id === value.id
          }
          onChange={(e, value) => onSelect(value)}
          fullWidth
          disableClearable
        />

        <TextField
          className="FstoDialogContentReverse-input"
          variant="outlined"
          autoComplete="off"
          size="small"
          label="Remarks (Optional)"
          rows={3}
          value={reverse.remarks}
          onChange={(e) => onChange(e.target.value)}
          fullWidth
          multiline
        />
      </DialogContent>

      <DialogActions className="FstoDialogActionsReverse-root">
        <Button
          className="FstoDialogActionsReverse-button"
          variant="text"
          onClick={reverseCloseHandler}
        > No
        </Button>

        <Button
          className="FstoDialogActionsReason-button"
          variant="contained"
          onClick={reverseSubmitHandler}
          startIcon={
            isSaving && <CircularProgress color="inherit" size={16} thickness={4} />
          }
          disabled={
            isSaving ||
            (!Boolean(reverse.id) && !Boolean(reverse.description))
          }
          disableElevation
        > Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ReverseDialog