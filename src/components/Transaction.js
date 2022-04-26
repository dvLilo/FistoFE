import React from 'react'

import {
  Box,
  Dialog,
  DialogContent,
  Typography
} from '@mui/material'

import '../assets/css/styles.transaction.scss'

const Transaction = (props) => {


  return (
    <Dialog
      className="FstoDialogTransaction-root"
      open={false}
      maxWidth="lg"
      PaperProps={{
        className: "FstoPaperTransaction-root"
      }}
      fullWidth
      disablePortal
    >
      <DialogContent>
        <Box className="FstoBoxTable-root">
          <Box className="FstoBoxRow-root">
            <Box className="FstoBoxRow-half">
              <Box className="FstoBoxCell-root">
                Transaction Number
                <strong>MIS002</strong>
              </Box>
            </Box>

            <Box className="FstoBoxRow-half">
              <Box className="FstoBoxCell-root">
                Document Type
                <strong>PAD</strong>
              </Box>

              <Box className="FstoBoxCell-root">
                Document Number
                <strong>pad#00-0001</strong>
              </Box>
            </Box>
          </Box>


          <Box className="FstoBoxRow-root">
            <Box className="FstoBoxRow-half">
              <Box className="FstoBoxCell-root">
                Payment Type
                <strong>FULL</strong>
              </Box>

              <Box className="FstoBoxCell-root">
                Category
                <strong>GENERAL</strong>
              </Box>
            </Box>

            <Box className="FstoBoxRow-half">
              <Box className="FstoBoxCell-root">
                Document Date
                <strong>04/20/2022</strong>
              </Box>

              <Box className="FstoBoxCell-root">
                Date Requested
                <strong>04/20/2022 11:11 AM</strong>
              </Box>
            </Box>
          </Box>


          <Box className="FstoBoxRow-root">
            <Box className="FstoBoxRow-half">
              <Box className="FstoBoxCell-root">
                Document Amount
                <strong>₱80,000.00</strong>
              </Box>
            </Box>

            <Box className="FstoBoxRow-half">
              <Box className="FstoBoxCell-root">
                Supplier
                <strong>1ST ADVENUE ADVERTISING</strong>
              </Box>
            </Box>
          </Box>


          <Box className="FstoBoxRow-root">
            <Box className="FstoBoxRow-half">
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
          </Box>


          <Box className="FstoBoxRow-root last">
            <Box className="FstoBoxRow-half">
              <Box className="FstoBoxCell-root">
                Remarks
                <i>None</i>
              </Box>
            </Box>
          </Box>
        </Box>

        <Typography className="FstoTypographyTransaction-root" variant="heading">Purchase Order Information</Typography>

        <Box className="FstoBoxTable-root">
          <Box className="FstoBoxRow-root">
            <Box className="FstoBoxCell-root FstoBoxCell-head">
              <strong>Purchase Order Number</strong>
            </Box>

            <Box className="FstoBoxCell-root FstoBoxCell-head">
              <strong>Receive Receipt Report</strong>
            </Box>

            <Box className="FstoBoxCell-root FstoBoxCell-head">
              <strong>Amount</strong>
            </Box>
          </Box>

          <Box className="FstoBoxRow-root">
            <Box className="FstoBoxCell-root" sx={{ borderLeft: 0, borderRight: 0, alignItems: "center" }}>
              1001
            </Box>

            <Box className="FstoBoxCell-root" sx={{ borderLeft: 0, borderRight: 0, alignItems: "center" }}>
              123, 321
            </Box>

            <Box className="FstoBoxCell-root" sx={{ borderLeft: 0, borderRight: 0, alignItems: "center" }}>
              ₱80,000.00
            </Box>
          </Box>

          <Box className="FstoBoxRow-root">
            <Box className="FstoBoxCell-root" sx={{ borderLeft: 0, borderRight: 0, alignItems: "center" }}>
              1001
            </Box>

            <Box className="FstoBoxCell-root" sx={{ borderLeft: 0, borderRight: 0, alignItems: "center" }}>
              123, 321
            </Box>

            <Box className="FstoBoxCell-root" sx={{ borderLeft: 0, borderRight: 0, alignItems: "center" }}>
              ₱80,000.00
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default Transaction