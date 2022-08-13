import React from 'react'

// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   IconButton,
//   Button
// } from '@mui/material'

// import CloseIcon from '@mui/icons-material/Close'

// import useConfirm from '../../hooks/useConfirm'

// import TransactionDialog from '../../components/TransactionDialog'
// import AccountTitleDialog from '../../components/AccountTitleDialog'

const DocumentTransmittingTransaction = (props) => {

  // const confirm = useConfirm()

  // const {
  //   state,
  //   data,
  //   open = false,
  //   onBack = () => { },
  //   onClose = () => { }
  // } = props

  // const [viewAccountTitle, setViewAccountTitle] = React.useState({
  //   data: null,
  //   open: false,
  //   onBack: undefined,
  //   onClose: () => setViewAccountTitle(currentValue => ({
  //     ...currentValue,
  //     open: false
  //   }))
  // })

  // const submitTransmitHandler = (e) => {
  //   e.preventDefault()
  //   onClose()

  //   confirm({
  //     open: true,
  //     wait: true,
  //     onConfirm: () => console.log(`${data.transaction_id} has been transmitted.`)
  //   })
  // }

  // const onAccountTitleView = () => {
  //   onClose()

  //   setViewAccountTitle(currentValue => ({
  //     ...currentValue,
  //     data: data,
  //     open: true,
  //     onBack: onBack
  //   }))
  // }

  // return (
  //   <React.Fragment>
  //     <Dialog
  //       className="FstoDialogTransaction-root"
  //       open={open}
  //       scroll="body"
  //       maxWidth="lg"
  //       onClose={onClose}
  //       fullWidth
  //       disablePortal
  //     >
  //       <DialogTitle className="FstoDialogTransaction-title">
  //         Transaction Details
  //         <IconButton size="large" onClick={onClose}>
  //           <CloseIcon />
  //         </IconButton>
  //       </DialogTitle>

  //       <DialogContent className="FstoDialogTransaction-content">
  //         {/* <TransactionDialog data={data} onView={onAccountTitleView} /> */}
  //       </DialogContent>

  //       {
  //         state === `receive` &&
  //         <DialogActions className="FstoDialogTransaction-actions">
  //           <Button
  //             variant="contained"
  //             onClick={submitTransmitHandler}
  //             disableElevation
  //           > Transmit
  //           </Button>
  //         </DialogActions>
  //       }
  //     </Dialog>

  //     <AccountTitleDialog {...viewAccountTitle} />
  //   </React.Fragment>
  // )

  return <h6>Transaction Details</h6>
}

export default DocumentTransmittingTransaction