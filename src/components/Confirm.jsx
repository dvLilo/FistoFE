import React from 'react'

import {
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'

import { 
  WarningAmberRounded as Caution,
  CloseRounded as Close 
} from '@mui/icons-material'

import { LoadingButton } from '@mui/lab'

import { makeStyles } from '@mui/styles'

const useStyles = makeStyles({
  FstoDialog: {
    '& .MuiDialog-paper': {
      padding: "1em 2em"
    }
  },
  FstoDialogIcon: {
    marginRight: "20px",
    fontSize: "3.25em",
    verticalAlign: "middle"
  },
  FstoDialogTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1em",
    padding: 0,
    fontSize: "1.20rem",
    fontWeight: 700
  },
  FstoDialogContent: {
    display: "flex",
    alignItems: "center",
    padding: 0,
    fontSize: "0.95em",
    fontWeight: 500
  },
  FstoDialogActions: {
    marginTop: "1em",
    padding: 0,
    '& .MuiButton-root': {
      textTransform: "capitalize"
    }
  },
  FstoDialogButton: {
    '& .MuiLoadingButton-loadingIndicator' : {
      left: "6px"
    }
  }
})

const Confirm = ({ open = false, isLoading = false, onConfirm, onClose }) => {
  const classes = useStyles()

  return (
    <Dialog
      className={classes.FstoDialog}
      open={open}
    >
      <DialogTitle className={classes.FstoDialogTitle}>
        Confirmation
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.FstoDialogContent}>
        <Caution className={classes.FstoDialogIcon} />
        Are you sure you want to proceed?
      </DialogContent>
      <DialogActions className={classes.FstoDialogActions}>
        <Button onClick={onClose}>No</Button>
        <LoadingButton
          className={classes.FstoDialogButton}
          variant="contained"
          loadingPosition="start"
          loading={isLoading}
          startIcon={<></>}
          disableElevation={true}
          onClick={onConfirm}
        >
          Yes
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default Confirm
