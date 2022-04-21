import React from 'react'

import { Box, Dialog } from '@mui/material'

import '../assets/css/styles.transaction.scss'

const Transaction = (props) => {

  return (
    <Dialog
      className="FstoDialogTransaction-root"
      open={true}
      maxWidth="lg"
      PaperProps={{
        className: "FstoPaperTransaction-root"
      }}
      fullWidth
      disablePortal
    >
      <Box className="FstoBoxTable-root">
        <Box className="FstoBoxRow-root">
          <Box className="FstoBoxCell-root" sx={{ flex: 2 }}>
            Transaction Number
            <strong>MIS002</strong>
          </Box>

          <Box className="FstoBoxCell-root">
            Document Type
            <strong>PAD</strong>
          </Box>

          <Box className="FstoBoxCell-root">
            Document Number
            <strong>pad#00-0001</strong>
          </Box>
        </Box>

        <Box className="FstoBoxRow-root">
          <Box className="FstoBoxCell-root" sx={{ flex: 2 }}>
            Payment Type
            <strong>FULL</strong>
          </Box>

          <Box className="FstoBoxCell-root">
            Document Date
            <strong>04/20/2022</strong>
          </Box>

          <Box className="FstoBoxCell-root">
            Date Requested
            <strong>04/20/2022 11:11 AM</strong>
          </Box>
        </Box>

        <Box className="FstoBoxRow-root">
          <Box className="FstoBoxCell-root">
            Document Amount
            <strong>₱80,000.00</strong>
          </Box>

          <Box className="FstoBoxCell-root">
            Supplier
            <strong>1ST ADVENUE ADVERTISING</strong>
          </Box>
        </Box>

        <Box className="FstoBoxRow-root">
          <Box className="FstoBoxCell-root">
            Company
            <strong>RDF Corporate Services</strong>
          </Box>

          <Box className="FstoBoxCell-root">
            Department
            <strong>Head Office Common</strong>
          </Box>

          <Box className="FstoBoxCell-root">
            Location
            <strong>Common</strong>
          </Box>
        </Box>

        <Box className="FstoBoxRow-root last">
          <Box className="FstoBoxCell-root">
            Remarks
            <i>None</i>
          </Box>
        </Box>
      </Box>
    </Dialog>
  )
}

export default Transaction