import React from 'react'

import axios from 'axios'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

import useToast from '../../hooks/useToast'
import useConfirm from '../../hooks/useConfirm'

import { EXECUTIVE } from '../../constants'

import ChequeDialog from '../../components/ChequeDialog'

const DocumentSigningTransaction = ({
  state,
  open = false,
  transaction = null,
  refetchData = () => { },
  onClose = () => { }
}) => {

  const toast = useToast()
  const confirm = useConfirm()

  const closeHandler = () => {
    onClose()
  }

  const submitTransmitHandler = () => {
    onClose()
    confirm({
      open: true,
      wait: true,
      onConfirm: async () => {
        let response
        try {
          response = await axios.post(`/api/cheque/flow`, {
            process: EXECUTIVE,
            subprocess: EXECUTIVE,

            bank_id: transaction?.bank.id,
            cheque_no: transaction?.no
          })

          const { message } = response.data

          refetchData()
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
            message: "Something went wrong whilst trying to save the transmittal details. Please try again."
          })
        }
      }
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
        </DialogContent>

        {
          state === `executive-receive` &&
          <DialogActions className="FstoDialogTransaction-actions">
            <Button
              variant="contained"
              onClick={submitTransmitHandler}
              disableElevation
            > Transmit
            </Button>
          </DialogActions>
        }
      </Dialog>
    </React.Fragment>
  )
}

export default DocumentSigningTransaction