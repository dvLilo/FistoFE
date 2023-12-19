import React, { useState } from 'react'

import moment from 'moment'

import {
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  Stack,
  Typography
} from '@mui/material'

import '../assets/css/styles.transaction.scss'

const ChequeDialog = ({
  data,
}) => {

  const [transaction, setTransaction] = useState(data.transactions.at(0) || null)

  return (
    <Box className="FstoBoxTransactionDetails-root">
      <Box className="FstoBoxTransactionDetails-content">
        <Divider className="FstoDividerTransactionDetails-root" textAlign="left">
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Cheque</Typography>
        </Divider>

        <List className="FstoListTransactionDetails-root" dense>
          <ListItem className="FstoListItemTransactionDetails-root" dense>
            <span>Bank Name:</span>
            <strong>{data?.bank.name}</strong>
          </ListItem>

          <ListItem className="FstoListItemTransactionDetails-root" dense>
            <span>Cheque No.:</span>
            <strong>{data?.no}</strong>
          </ListItem>

          <ListItem className="FstoListItemTransactionDetails-root" dense>
            <span>Cheque Date:</span>
            {
              !!data?.date
                ? <strong>{data?.date && moment(data?.date).format("MMM. DD, YYYY")}</strong>
                : <strong>&mdash;</strong>}
          </ListItem>

          <ListItem className="FstoListItemTransactionDetails-root" dense>
            <span>Amount:</span>
            <strong>{data?.amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
          </ListItem>
        </List>


        <Divider className="FstoDividerTransactionDetails-root" textAlign="left">
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Charging</Typography>
        </Divider>

        <List className="FstoListTransactionDetails-root" dense>
          <ListItem className="FstoListItemTransactionDetails-root" dense>
            <span>Company:</span>
            <strong>{data?.transactions.at(0).company.name}</strong>
          </ListItem>

          <ListItem className="FstoListItemTransactionDetails-root" dense>
            <span>Department:</span>
            <strong>{data?.transactions.at(0).department.name}</strong>
          </ListItem>

          <ListItem className="FstoListItemTransactionDetails-root" dense>
            <span>Location:</span>
            <strong>{data?.transactions.at(0).location.name}</strong>
          </ListItem>
        </List>


        <Divider className="FstoDividerTransactionDetails-root" textAlign="left">
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Supplier</Typography>
        </Divider>

        <List className="FstoListTransactionDetails-root" dense>
          <ListItem className="FstoListItemTransactionDetails-root" dense>
            <span>Supplier Name:</span>
            <strong>{data?.supplier.name}</strong>
          </ListItem>

          <ListItem className="FstoListItemTransactionDetails-root" dense>
            <span>Type:</span>
            <strong>{data?.supplier.type}</strong>
          </ListItem>
        </List>


        <Divider className="FstoDividerTransactionDetails-root" textAlign="left">
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Vouchers</Typography>
        </Divider>

        <Stack direction="row" gap={1} margin={1}>
          {
            data?.transactions.map((item) => (
              <Chip label={item.voucher.no} color={transaction.id === item.id ? "primary" : "default"} onClick={() => setTransaction(item)} />
            ))}
        </Stack>
      </Box>

      <Divider className="FstoDividerTransactionDetails-root" variant="middle" orientation="vertical" flexItem />

      <Box className="FstoBoxTransactionDetails-content">
        <Divider className="FstoDividerTransactionDetails-root" textAlign="left">
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Transaction</Typography>
        </Divider>

        {
          transaction && (
            <List className="FstoListTransactionDetails-root" dense>
              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Transaction No.:</span>
                <strong>{transaction?.transaction_no}</strong>
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Date Requested:</span>
                <strong>{moment(transaction?.date_requested).format("MMM. DD, YYYY HH:mm A")}</strong>
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Payment Type:</span>
                <strong>{transaction?.payment_type}</strong>
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Document Type:</span>
                <strong>{transaction?.document.name}</strong>
              </ListItem>

              {
                transaction?.document_no &&
                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Document No.:</span>
                  <strong>{transaction?.document_no}</strong>
                </ListItem>}

              {
                transaction?.reference_no &&
                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Reference No.:</span>
                  <strong>{transaction?.reference_no}</strong>
                </ListItem>}

              {
                transaction?.document_amount &&
                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Document Amount:</span>
                  <strong>{transaction?.document_amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                </ListItem>}

              {
                transaction?.reference_amount &&
                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Reference No.:</span>
                  <strong>{transaction?.reference_amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                </ListItem>}

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Document Date:</span>
                <strong>{moment(transaction?.document_date).format("MMM. DD, YYYY")}</strong>
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Category:</span>
                <strong>{transaction?.category}</strong>
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Description:</span>
                <strong>{transaction?.remarks}</strong>
              </ListItem>
            </List>
          )}
      </Box>
    </Box>
  )
}

export default ChequeDialog