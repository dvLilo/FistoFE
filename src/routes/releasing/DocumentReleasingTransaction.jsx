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

import ChequeDialog from '../../components/ChequeDialog'

const DocumentReleasingTransaction = ({
  state,
  open = false,
  transaction = null,
  refetchData = () => { },
  onReturn = () => { },
  onClose = () => { }
}) => {

  const toast = useToast()
  const confirm = useConfirm()

  const {
    refetch: fetchDistribute,
    data: DISTUBUTE_LIST,
    status: DISTRIBUTE_STATUS
  } = useDistribute(transaction?.transactions.at(0).company.id)

  React.useEffect(() => {
    if (open && !DISTUBUTE_LIST) fetchDistribute()

    // eslint-disable-next-line
  }, [open])

  React.useEffect(() => {
    if (open) {
      setReleaseData(currentValue => ({
        ...currentValue,
        bank_id: transaction?.bank.id,
        cheque_no: transaction?.no,
        distributed_to: transaction?.distributed
      }))
    }

    // eslint-disable-next-line
  }, [open])

  const [releaseData, setReleaseData] = React.useState({
    process: "release",
    subprocess: "release",
    bank_id: null,
    cheque_no: null,
    distributed_to: null
  })

  const clearHandler = () => {
    setReleaseData(currentValue => ({
      ...currentValue,
      bank_id: null,
      cheque_no: null,
      distributed_to: null
    }))
  }

  const closeHandler = () => {
    onClose()
    clearHandler()
  }

  const submitReleaseHandler = () => {
    onClose()

    confirm({
      open: true,
      wait: true,
      onConfirm: async () => {
        let response
        try {
          response = await axios.post(`/api/cheque/flow`, releaseData)

          const { message } = response.data

          refetchData()
          clearHandler()
          toast({
            message,
            title: "Success!"
          })
        }
        catch (error) {
          console.log("Fisto Error Status", error.request)

          toast({
            severity: "error",
            title: "Error!",
            message: "Something went wrong whilst trying to save the file details. Please try again."
          })
        }
      }
    })
  }

  const submitReturnHandler = () => {
    onClose()
    onReturn({
      bank_id: transaction?.bank.id,
      cheque_no: transaction?.no
    })
  }


  return (
    <React.Fragment>
      <Dialog
        className="FstoDialogTransaction-root"
        open={open}
        scroll="body"
        maxWidth="lg"
        PaperProps={{
          className: "FstoPaperTransaction-root"
        }}
        fullWidth
        disablePortal
      >
        <DialogTitle className="FstoDialogTransaction-title">
          Transaction Details
          <IconButton size="large" onClick={closeHandler}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent className="FstoDialogTransaction-content">
          <ChequeDialog data={transaction} />

          {
            (state === `release-receive` || state === `release-release`) &&
            <React.Fragment>
              <Divider className="FstoDividerTransaction-root" variant="middle" />

              <Box className="FstoBoxTransactionForm-root">
                <Box className="FstoBoxTransactionForm-content">
                  <Autocomplete
                    className="FstoSelectForm-root"
                    size="small"
                    options={DISTUBUTE_LIST || []}
                    value={releaseData.distributed_to}
                    loading={
                      DISTRIBUTE_STATUS === 'loading'
                    }
                    renderInput={
                      (props) => <TextField {...props} label="Distribute To" variant="outlined" />
                    }
                    PaperComponent={
                      (props) => <Paper {...props} sx={{ textTransform: 'capitalize' }} />
                    }
                    getOptionLabel={
                      (option) => option.name
                    }
                    isOptionEqualToValue={
                      (option, value) => option.id === value.id
                    }
                    onChange={(e, value) => setReleaseData(currentValue => ({
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
          (state === `release-receive` || state === `release-release`) &&
          <DialogActions className="FstoDialogTransaction-actions">
            <Button
              variant="contained"
              onClick={submitReleaseHandler}
              disabled={
                Boolean(!releaseData.distributed_to)
              }
              disableElevation
            > {state === `release-receive` ? "Release" : "Save"}
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={submitReturnHandler}
              disableElevation
            > Return
            </Button>
          </DialogActions>
        }
      </Dialog>
    </React.Fragment>
  )
}

export default DocumentReleasingTransaction