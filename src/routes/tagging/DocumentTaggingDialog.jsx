import React from 'react'

import axios from 'axios'

import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField
} from '@mui/material'

import {
  Close,
  WarningAmberRounded,
} from '@mui/icons-material'

import useToast from '../../hooks/useToast'
import useDistribute from '../../hooks/useDistribute'

const DocumentTaggingDialog = ({
  open,
  data,
  process,
  onSuccess,
  onClose
}) => {

  const toast = useToast()

  const {
    refetch: fetchDistribute,
    data: DISTUBUTE_LIST = [],
    status: DISTRIBUTE_STATUS
  } = useDistribute()

  React.useEffect(() => {
    if (open && !DISTUBUTE_LIST.length) fetchDistribute()
    // eslint-disable-next-line
  }, [open])

  const [isSaving, setIsSaving] = React.useState(false)
  const [tagData, setTagData] = React.useState({
    receipt_type: null,
    distributed_to: null
  })

  const tagCloseHandler = () => {
    onClose()
    setTagData({
      receipt_type: null,
      distributed_to: null
    })
  }

  const tagSubmitHandler = async () => {
    setIsSaving(true)

    let response
    try {
      response = await axios.post(`/api/transactions/flow/tag`, {
        ...tagData,
        process: process,
        transactions: data
      })

      const { message } = response.data

      onSuccess()
      tagCloseHandler()
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
        message: "Something went wrong whilst trying to tag these transactions. Please try again later."
      })
    }

    setIsSaving(false)
  }

  return (
    <Dialog
      className="FstoDialogTagging-root"
      open={open}
      PaperProps={{
        className: "FstoPaperTagging-root"
      }}
      disablePortal
    >
      <DialogTitle className="FstoDialogTagging-title">
        Confirmation

        <IconButton onClick={tagCloseHandler}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent className="FstoDialogTagging-content">
        <Stack direction="row" alignItems="center">
          <WarningAmberRounded className="FstoIconTagging-root" />

          Are you sure you want to tag these transactions?
        </Stack>

        <Stack direction="column">
          <Autocomplete
            className="FstoAutocompleteTagging-root"
            size="small"
            options={["Official", "Unofficial"]}
            value={tagData.receipt_type}
            renderInput={
              (props) => <TextField {...props} label="Type of Receipt" variant="outlined" />
            }
            isOptionEqualToValue={
              (option, value) => option === value
            }
            onChange={(_, value) => setTagData((currentValue) => ({
              ...currentValue,
              receipt_type: value
            }))}
            fullWidth
            disableClearable
          />

          <Autocomplete
            className="FstoAutocompleteTagging-root"
            size="small"
            options={
              DISTUBUTE_LIST.map((item) => ({
                id: item.id,
                name: item.name
              }))
            }
            value={tagData.distributed_to}
            loading={
              DISTRIBUTE_STATUS === 'loading'
            }
            renderInput={
              (props) => <TextField {...props} label="Distribute To" variant="outlined" />
            }
            getOptionLabel={
              (option) => option.name
            }
            isOptionEqualToValue={
              (option, value) => option.id === value.id
            }
            onChange={(_, value) => setTagData((currentValue) => ({
              ...currentValue,
              distributed_to: value
            }))}
            fullWidth
            disableClearable
          />
        </Stack>
      </DialogContent>

      <DialogActions className="FstoDialogTagging-actions">
        <Button
          variant="contained"
          startIcon={
            isSaving && <CircularProgress color="inherit" size={16} thickness={4} />
          }
          disabled={
            isSaving ||
            (!Boolean(tagData.receipt_type) && !Boolean(tagData.distributed_to))
          }
          onClick={tagSubmitHandler}
          disableElevation
        >
          Tag
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DocumentTaggingDialog