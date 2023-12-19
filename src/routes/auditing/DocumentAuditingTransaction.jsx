import React from 'react'

import axios from 'axios'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

import useToast from '../../hooks/useToast'
import useConfirm from '../../hooks/useConfirm'

import { AUDIT } from '../../constants'

import ChequeDialog from '../../components/ChequeDialog'

const DocumentAuditingTransaction = ({
  state,
  open = false,
  transaction = null,
  refetchData = () => { },
  onHold = () => { },
  onUnhold = () => { },
  onReturn = () => { },
  onClose = () => { }
}) => {

  const toast = useToast()
  const confirm = useConfirm()

  const closeHandler = () => {
    onClose()
  }

  const submitApproveHandler = () => {
    onClose()
    confirm({
      open: true,
      wait: true,
      onConfirm: async () => {
        let response
        try {
          response = await axios.post(`/api/cheque/flow`, {
            process: AUDIT,
            subprocess: AUDIT,

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
            message: "Something went wrong whilst trying to save the approval details. Please try again."
          })
        }
      }
    })
  }

  const submitHoldHandler = () => {
    onClose()
    onHold({
      bank_id: transaction?.bank.id,
      cheque_no: transaction?.no
    })
  }

  const submitUnholdHandler = () => {
    onClose()
    onUnhold({
      bank_id: transaction?.bank.id,
      cheque_no: transaction?.no
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
        </DialogContent>

        {
          (state === `audit-receive` || state === `audit-audit` || state === `audit-hold`) &&
          <DialogActions className="FstoDialogTransaction-actions">
            {
              state === `audit-receive` &&
              <Button
                variant="contained"
                onClick={submitApproveHandler}
                disableElevation
              > Approve
              </Button>
            }

            {
              state === `audit-hold` &&
              <Button
                variant="contained"
                onClick={submitUnholdHandler}
                disableElevation
              > Unhold
              </Button>
            }

            {
              state !== `audit-hold` &&
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
          </DialogActions>
        }
      </Dialog>
    </React.Fragment>
  )
}

export default DocumentAuditingTransaction