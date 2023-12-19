import React, { Fragment } from 'react'

import axios from 'axios'

import DateAdapter from '@mui/lab/AdapterDateFns'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Divider,
  Box,
  TextField
} from '@mui/material'

import {
  LocalizationProvider,
  DatePicker
} from '@mui/lab'

import CloseIcon from '@mui/icons-material/Close'

import useToast from '../../hooks/useToast'
import useConfirm from '../../hooks/useConfirm'

import { ISSUE } from '../../constants'

import ChequeDialog from '../../components/ChequeDialog'
import AccountTitleDialog from '../../components/AccountTitleDialog'

const DocumentIssuingTransaction = ({
  state,
  open = false,
  transaction = null,
  refetchData = () => { },
  onUnhold = () => { },
  onBack = () => { },
  onClose = () => { }
}) => {

  const toast = useToast()
  const confirm = useConfirm()

  React.useEffect(() => {
    if (open) {
      setChequeData(currentValue => ({
        ...currentValue,
        bank_id: transaction?.bank.id,
        cheque_no: transaction?.no,
        cheque: transaction?.cheque,
        accounts: transaction?.accounts
      }))
    }

    // eslint-disable-next-line
  }, [open])

  const [chequeData, setChequeData] = React.useState({
    process: ISSUE,
    subprocess: ISSUE,
    bank_id: null,
    cheque_no: null,
    cheque: null,
    accounts: []
  })

  const [manageAccountTitle, setManageAccountTitle] = React.useState({
    open: false,
    state: null,
    transaction: null,
    onBack: undefined,
    onClose: () => setManageAccountTitle(currentValue => {
      const { accounts, onSubmit, ...remainingItems } = currentValue

      return ({
        ...remainingItems,
        open: false,
      })
    })
  })

  const clearHandler = () => {
    setChequeData(currentValue => ({
      ...currentValue,
      accounts: [],
      cheque: null
    }))
  }

  const closeHandler = () => {
    onClose()
    clearHandler()
  }

  const submitChequeHandler = () => {
    onClose()
    confirm({
      open: true,
      wait: true,
      onConfirm: async () => {
        let response
        try {
          response = await axios.post(`/api/cheque/flow`, chequeData)

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
            message: "Something went wrong whilst trying to save the cheque details. Please try again."
          })
        }
      }
    })
  }

  const submitUnholdHandler = () => {
    onClose()
    onUnhold(transaction.id)
  }



  const onAccountTitleManage = () => {
    onClose()

    setManageAccountTitle(currentValue => ({
      ...currentValue,
      state,
      transaction,
      open: true,
      onBack: onBack
    }))
  }

  const onAccountTitleInsert = (data) => {
    setChequeData(currentValue => ({
      ...currentValue,
      accounts: [
        ...currentValue.accounts,
        data
      ]
    }))
  }

  const onAccountTitleUpdate = (data, index) => {
    setChequeData(currentValue => ({
      ...currentValue,
      accounts: [
        ...currentValue.accounts.map((item, itemIndex) => {
          if (itemIndex === index) return data
          return item
        })
      ]
    }))
  }

  const onAccountTitleRemove = (index) => {
    setChequeData(currentValue => ({
      ...currentValue,
      accounts: [
        ...currentValue.accounts.filter((item, itemIndex) => {
          return itemIndex !== index
        })
      ]
    }))
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
            state === `issue-receive` && (
              <Fragment>
                <Divider className="FstoDividerTransaction-root" variant="middle" />

                <Box className="FstoBoxTransactionForm-root">
                  <Box className="FstoBoxTransactionForm-content">
                    <LocalizationProvider dateAdapter={DateAdapter}>
                      <DatePicker
                        value={chequeData.cheque?.date || null}
                        minDate={new Date()}
                        renderInput={
                          (props) => <TextField {...props} className="FstoTextfieldForm-root" label="Cheque Date" variant="outlined" size="small" onKeyDown={(e) => e.preventDefault()} fullWidth />
                        }
                        onChange={(value) => setChequeData(currentValue => ({
                          ...currentValue,
                          cheque: {
                            ...currentValue.cheque,
                            date: new Date(value).toISOString()
                          }
                        }))}
                        showToolbar
                      />
                    </LocalizationProvider>
                  </Box>
                </Box>
              </Fragment>
            )}
        </DialogContent>

        {
          (state === `issue-receive` || state === `issue-issue` || state === `return-release` || state === `issue-hold`) &&
          <DialogActions className="FstoDialogTransaction-actions">
            {
              (state === `issue-receive` || state === `return-release`) &&
              <Button
                variant="contained"
                onClick={onAccountTitleManage}
                disabled={
                  !chequeData.cheque?.date
                }
                disableElevation
              > Release
              </Button>
            }

            {
              state === `issue-hold` &&
              <Button
                variant="contained"
                onClick={submitUnholdHandler}
                disableElevation
              > Unhold
              </Button>
            }
          </DialogActions>
        }
      </Dialog>

      <AccountTitleDialog
        accounts={chequeData.accounts}
        onClear={clearHandler}
        onSubmit={
          !!state.match(/-receive/)
            ? submitChequeHandler
            : onAccountTitleManage
        }
        onInsert={onAccountTitleInsert}
        onUpdate={onAccountTitleUpdate}
        onRemove={onAccountTitleRemove}
        {...manageAccountTitle}
      />
    </React.Fragment>
  )
}

export default DocumentIssuingTransaction