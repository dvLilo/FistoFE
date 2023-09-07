import React from 'react'

import moment from 'moment'

import {
  Alert,
  AlertTitle,
  Box,
  // Chip,
  Divider,
  List,
  ListItem,
  // Skeleton,
  // Stack,
  Typography
} from '@mui/material'

import ReportIcon from '@mui/icons-material/ReportOutlined'

import '../assets/css/styles.transaction.scss'

const CounterReceiptDialog = ({
  data,
  status,
}) => {

  console.log("I'm from Counter Receipt dialog.")
  console.log(data)

  const formatDates = (date) => {
    return moment(date).format("MMM. DD, YYYY HH:mm A")
  }

  if (status === `error`)
    return (
      <React.Fragment>
        No data found.
      </React.Fragment>
    )

  return (
    <React.Fragment>

      {
        status === `success` && Boolean(data.reason.id && data.reason.description) &&
        <Alert
          className="FstoAlertTransactionDetails-root"
          severity={Boolean(data.state.match(/void/gi)) ? "error" : "info"}
          icon={
            <ReportIcon className="FstoAlertTransactionDetails-icon" />
          }
        >
          <AlertTitle className="FstoAlertTransactionDetails-title">
            {data.reason.description}
          </AlertTitle>

          Remarks: {data.reason.remarks ? <b>{data.reason.remarks}</b> : <i>None</i>}
        </Alert>
      }

      <Box className="FstoBoxTransactionDetails-root">
        <Box className="FstoBoxTransactionDetails-content">
          <Divider className="FstoDividerTransactionDetails-root" textAlign="left">
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Receipt</Typography>
          </Divider>

          {
            status === `success` &&
            <List className="FstoListTransactionDetails-root" dense>
              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Counter Receipt No.:</span>
                <strong>{data.no}</strong>
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Date Countered:</span>
                <strong>{formatDates(data.date_countered)}</strong>
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Receipt No.:</span>
                <strong>{data.receipt_no}</strong>
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Receipt Type:</span>
                <strong>{data.receipt_type.type}</strong>
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Transaction Date:</span>
                <strong>{formatDates(data.date)}</strong>
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Amount:</span>
                <strong>{data.amount}</strong>
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Supplier:</span>
                <strong>{data.supplier.name}</strong>
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Department:</span>
                <strong>{data.department.name}</strong>
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Remarks:</span>
                {
                  data.remarks
                    ? <b>{data.remarks}</b>
                    : <i>None</i>
                }
              </ListItem>
            </List>
          }
        </Box>

        <Divider className="FstoDividerTransactionDetails-root" variant="middle" orientation="vertical" flexItem />

        <Box className="FstoBoxTransactionDetails-content"></Box>
      </Box>


    </React.Fragment>
  )
}

export default CounterReceiptDialog