import React from 'react'

import axios from 'axios'

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
  Divider
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

import useToast from '../../hooks/useToast'
import useConfirm from '../../hooks/useConfirm'
import useDistribute from '../../hooks/useDistribute'

import TransactionDialog from '../../components/TransactionDialog'

const DocumentTaggingTransaction = (props) => {

  const {
    state,
    data,
    open = false,
    refetchData,
    onHold = () => { },
    onUnhold = () => { },
    onReturn = () => { },
    onVoid = () => { },
    onClose = () => { }
  } = props

  const [tag, setTag] = React.useState({
    process: "tag",
    subprocess: "tag",
    distributed_to: null
  })

  const toast = useToast()
  const confirm = useConfirm()
  const {
    data: DISTUBUTE_LIST,
    status: DISTRIBUTE_STATUS
  } = useDistribute(data?.company_id)

  React.useEffect(() => {
    if (open && DISTRIBUTE_STATUS === `success`) {
      setTag(currentValue => ({
        ...currentValue,
        distributed_to: DISTUBUTE_LIST[0]
      }))
    }

    // eslint-disable-next-line
  }, [DISTRIBUTE_STATUS])

  const submitTagHandler = () => {
    onClose()

    confirm({
      open: true,
      wait: true,
      onConfirm: async () => {

        let response
        try {
          response = await axios.post(`/api/transactions/flow/update-transaction/${data.id}`, tag)

          const { message } = response.data

          refetchData()
          toast({
            message,
            title: "Success!"
          })
        }
        catch (error) {

        }
      }
    })
  }

  const submitUnholdHandler = () => {
    onClose()
    onUnhold(data.id)
  }

  const submitHoldHandler = () => {
    onClose()
    onHold(data)
  }

  const submitReturnHandler = () => {
    onClose()
    onReturn(data)
  }

  const submitVoidHandler = () => {
    onClose()
    onVoid(data)
  }

  return (
    <Dialog
      className="FstoDialogTransaction-root"
      open={open}
      scroll="body"
      maxWidth="lg"
      PaperProps={{
        className: "FstoPaperTransaction-root"
      }}
      onClose={onClose}
      fullWidth
      disablePortal
    >
      <DialogTitle className="FstoDialogTransaction-title">
        Transaction Details
        <IconButton size="large" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="FstoDialogTransaction-content">
        <TransactionDialog data={data} callback={setTag} />

        {
          (state === `tag-receive` || state === `tag-tag`) &&
          <React.Fragment>
            <Divider className="FstoDividerTransaction-root" variant="middle" />

            <Box className="FstoBoxTransactionForm-root">
              <Box className="FstoBoxTransactionForm-content">
                <Autocomplete
                  className="FstoSelectForm-root"
                  size="small"
                  options={DISTUBUTE_LIST || []}
                  value={tag.distributed_to}
                  loading={
                    DISTRIBUTE_STATUS === 'loading'
                  }
                  renderInput={
                    props =>
                      <TextField
                        {...props}
                        variant="outlined"
                        label="Distribute To..."
                      />
                  }
                  PaperComponent={
                    props =>
                      <Paper
                        {...props}
                        sx={{ textTransform: 'capitalize' }}
                      />
                  }
                  getOptionLabel={
                    option => option.name
                  }
                  isOptionEqualToValue={
                    (option, value) => option.id === value.id
                  }
                  sx={{ marginX: `10px` }}
                  onChange={(e, value) => setTag(currentValue => ({
                    ...currentValue,
                    distributed_to: value
                  }))}
                  disablePortal
                  disableClearable
                />
              </Box>
            </Box>
          </React.Fragment>
        }
      </DialogContent>

      {
        (state === `tag-receive` || state === `tag-tag` || state === `tag-hold`) &&
        <DialogActions className="FstoDialogTransaction-actions">
          {
            (state === `tag-receive` || state === `tag-tag`) &&
            <Button
              variant="contained"
              onClick={submitTagHandler}
              disabled={
                Boolean(!tag.distributed_to)
              }
              disableElevation
            > {state === `tag-receive` ? "Tag" : "Save"}
            </Button>
          }

          {
            state === `tag-hold` &&
            <Button
              variant="contained"
              onClick={submitUnholdHandler}
              disableElevation
            > Unhold
            </Button>
          }

          {
            state !== `tag-hold` &&
            <Button
              variant="outlined"
              color="error"
              onClick={submitHoldHandler}
              disableElevation
            > Hold
            </Button>
          }

          <Button
            variant="outlined"
            color="error"
            onClick={submitReturnHandler}
            disableElevation
          > Return
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={submitVoidHandler}
            disableElevation
          > Void
          </Button>
        </DialogActions>
      }
    </Dialog>
  )
}

export default DocumentTaggingTransaction