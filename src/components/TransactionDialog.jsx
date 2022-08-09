import React from 'react'

import {
  Alert,
  AlertTitle,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  Skeleton,
  Stack,
  Typography
} from '@mui/material'

import '../assets/css/styles.transaction.scss'

import ReportIcon from '@mui/icons-material/ReportOutlined'

import useTransaction from '../hooks/useTransaction'

const TransactionDialog = (props) => {

  const {
    status,
    data
  } = useTransaction(props.data.id)

  React.useEffect(() => {
    if (status === `success` && data.tag.distributed_to && props.callback !== undefined)
      props.callback(currentValue => ({
        ...currentValue,
        distributed_to: data.tag.distributed_to
      }))

    // eslint-disable-next-line
  }, [status])

  return (
    <React.Fragment>

      {
        status === `success` && (data.transaction.state === `hold` || data.transaction.state === `return` || data.transaction.state === `void`) &&
        <Alert
          className="FstoAlertTransactionDetails-root"
          severity={data.transaction.state === `void` ? "error" : "info"}
          icon={
            <ReportIcon className="FstoAlertTransactionDetails-icon" />
          }
        >
          <AlertTitle className="FstoAlertTransactionDetails-title">{data.reason.description}</AlertTitle>
          Remarks: {data.reason.remarks ? <b>{data.reason.remarks}</b> : <i>None</i>}
        </Alert>}

      <Box className="FstoBoxTransactionDetails-root">
        <Box className="FstoBoxTransactionDetails-content">
          <Divider className="FstoDividerTransactionDetails-root" textAlign="left">
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Requestor</Typography>
          </Divider>

          {
            status === `loading` &&
            <List className="FstoListTransactionDetails-root" dense>
              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <Skeleton variant="text" width="50%" />
                <Skeleton variant="text" width="80%" />
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <Skeleton variant="text" width="65%" />
                <Skeleton variant="text" width="85%" />
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="70%" />
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <Skeleton variant="text" width="30%" />
                <Skeleton variant="text" width="65%" />
              </ListItem>
            </List>}
          {
            status === `success` &&
            <List className="FstoListTransactionDetails-root" dense>
              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Name:</span>
                <strong>{data.requestor.first_name.toLowerCase()} {data.requestor.middle_name.toLowerCase()} {data.requestor.last_name.toLowerCase()}</strong>
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Department:</span>
                <strong>{data.requestor.department}</strong>
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Position:</span>
                <strong>{data.requestor.position}</strong>
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Role:</span>
                <strong>{data.requestor.role}</strong>
              </ListItem>
            </List>}




          <Divider className="FstoDividerTransactionDetails-root" textAlign="left">
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Charging</Typography>
          </Divider>

          {
            status === `loading` &&
            <List className="FstoListTransactionDetails-root" dense>
              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <Skeleton variant="text" width="50%" />
                <Skeleton variant="text" width="80%" />
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <Skeleton variant="text" width="65%" />
                <Skeleton variant="text" width="85%" />
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="70%" />
              </ListItem>
            </List>}
          {
            status === `success` &&
            <List className="FstoListTransactionDetails-root" dense>
              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Company:</span>
                <strong>{data.document.company.name}</strong>
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Department:</span>
                <strong>{data.document.department.name}</strong>
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Location:</span>
                <strong>{data.document.location.name}</strong>
              </ListItem>
            </List>}




          <Divider className="FstoDividerTransactionDetails-root" textAlign="left">
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Transaction</Typography>
          </Divider>

          {
            status === `loading` &&
            <List className="FstoListTransactionDetails-root" dense>
              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <Skeleton variant="text" width="50%" />
                <Skeleton variant="text" width="80%" />
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <Skeleton variant="text" width="65%" />
                <Skeleton variant="text" width="85%" />
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="70%" />
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <Skeleton variant="text" width="30%" />
                <Skeleton variant="text" width="65%" />
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <Skeleton variant="text" width="50%" />
                <Skeleton variant="text" width="80%" />
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="70%" />
              </ListItem>
            </List>}
          {
            status === `success` &&
            <List className="FstoListTransactionDetails-root" dense>
              {
                data.tag.no &&
                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Tag No:</span>
                  <strong>{data.tag.no}</strong>
                </ListItem>}

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Transaction No.:</span>
                <strong>{data.transaction.no.toUpperCase()}</strong>
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Date Requested:</span>
                <strong>{data.transaction.date_requested}</strong>
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Payment Type:</span>
                <strong>{data.document.payment_type}</strong>
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Document Type:</span>
                <strong>{data.document.name}</strong>
              </ListItem>

              {
                data.document.no &&
                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Document No.:</span>
                  <strong>{data.document.no.toUpperCase()}</strong>
                </ListItem>}

              {
                data.document.capex_no &&
                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>CAPEX No.:</span>
                  <strong>{data.document.capex_no.toUpperCase()}</strong>
                </ListItem>}

              {
                data.document.from && data.document.to &&
                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Coverage Date:</span>
                  <strong>{data.document.from} - {data.document.to}</strong>
                </ListItem>}

              {
                data.document.amount &&
                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Document Amount:</span>
                  <strong>&#8369;{data.document.amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                </ListItem>}

              {
                data.document.date &&
                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Document Date:</span>
                  <strong>{data.document.date}</strong>
                </ListItem>}

              {
                data.document.category &&
                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Category:</span>
                  <strong>{data.document.category.name}</strong>
                </ListItem>}

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Supplier:</span>
                <strong>{data.document.supplier.name}</strong>
              </ListItem>

              {
                Boolean(data.document.reference) &&
                <React.Fragment>
                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>Reference Type:</span>
                    <strong>{data.document.reference.type.toUpperCase()}</strong>
                  </ListItem>

                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>Reference No.:</span>
                    <strong>{data.document.reference.no.toUpperCase()}</strong>
                  </ListItem>

                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>Reference Amount:</span>
                    <strong>&#8369;{data.document.reference.amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                  </ListItem>
                </React.Fragment>
              }

              {
                Boolean(data.document.utility) &&
                <React.Fragment>
                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>Utility Location:</span>
                    <strong>{data.document.utility.location.name}</strong>
                  </ListItem>

                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>Utility Category:</span>
                    <strong>{data.document.utility.category.name}</strong>
                  </ListItem>

                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>Account No.:</span>
                    <strong>{data.document.utility.account_no.no.toUpperCase()}</strong>
                  </ListItem>

                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>SOA No.:</span>
                    <strong>{data.document.utility.receipt_no.toUpperCase()}</strong>
                  </ListItem>

                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>Consumption:</span>
                    <strong>{data.document.utility.consumption}</strong>
                  </ListItem>
                </React.Fragment>
              }

              {
                Boolean(data.document.payroll) &&
                <React.Fragment>
                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>Payroll Type:</span>
                    <strong>{data.document.payroll.type}</strong>
                  </ListItem>

                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>Payroll Category:</span>
                    <strong>{data.document.payroll.category.name}</strong>
                  </ListItem>

                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>Payroll Clients:</span>
                    <strong>{data.document.payroll.clients.map((item) => item.name).join(", ")}</strong>
                  </ListItem>
                </React.Fragment>
              }

              {
                Boolean(data.document.pcf_batch) &&
                <React.Fragment>
                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>PCF Name:</span>
                    <strong>{data.document.pcf_batch.name.toUpperCase()}</strong>
                  </ListItem>

                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>PCF Letter:</span>
                    <strong>{data.document.pcf_batch.letter}</strong>
                  </ListItem>

                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>PCF Date:</span>
                    <strong>{data.document.pcf_batch.date}</strong>
                  </ListItem>
                </React.Fragment>
              }

              {
                Boolean(data.voucher) &&
                <React.Fragment>
                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>Type of Receipt:</span>
                    <strong>{data.voucher.receipt_type}</strong>
                  </ListItem>

                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>Withholding Tax:</span>
                    <strong>&#8369;{data.voucher.witholding_tax.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                  </ListItem>

                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>Percentage Tax:</span>
                    <strong>&#8369;{data.voucher.percentage_tax.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                  </ListItem>

                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>Net of Amount:</span>
                    <strong>&#8369;{data.voucher.gross_amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                  </ListItem>
                </React.Fragment>
              }

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Remarks:</span>
                {
                  data.document.remarks
                    ? <b>{data.document.remarks}</b>
                    : <i>None</i>
                }
              </ListItem>
            </List>}




          {
            Boolean(data?.voucher) &&
            <React.Fragment>
              <Divider className="FstoDividerTransactionDetails-root" textAlign="left">
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Voucher</Typography>
              </Divider>

              <List className="FstoListTransactionDetails-root" dense>
                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Voucher No.:</span>
                  <strong>F0-1001-9898</strong>
                </ListItem>

                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Voucher Month:</span>
                  <strong>2207</strong>
                </ListItem>

                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Date Vouchered:</span>
                  <strong>07/12/2022</strong>
                </ListItem>

                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Date Filed:</span>
                  <strong>07/12/2022</strong>
                </ListItem>

                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Account Title Details:</span>
                  <strong style={{ color: `blue` }}>View</strong>
                </ListItem>

                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Vouchered By:</span>
                  <strong>Lorenzo Yumul</strong>
                </ListItem>

                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Approved By:</span>
                  <strong>Reden Cunanan</strong>
                </ListItem>
              </List>
            </React.Fragment>}




          {
            Boolean(data?.cheque) &&
            <React.Fragment>
              <Divider className="FstoDividerTransactionDetails-root" textAlign="left">
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Cheque</Typography>
              </Divider>

              <List className="FstoListTransactionDetails-root" dense>
                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Bank Name:</span>
                  <strong>Asia United Bank</strong>
                </ListItem>

                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Cheque No.:</span>
                  <strong>203-4024-425</strong>
                </ListItem>

                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Cheque Details:</span>
                  <strong style={{ color: `blue` }}>View</strong>
                </ListItem>

                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Date Created:</span>
                  <strong>07/12/2022</strong>
                </ListItem>

                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Date Released:</span>
                  <strong>07/15/2022</strong>
                </ListItem>
              </List>
            </React.Fragment>}
        </Box>

        <Divider variant="middle" orientation="vertical" flexItem />

        <Box className="FstoBoxTransactionDetails-content">
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Purchase Order</Typography>

          {
            status === `loading` &&
            <List dense>
              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <Skeleton variant="text" width="50%" />
                <Skeleton variant="text" width="70%" />
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <Skeleton variant="text" width="65%" />
                <Skeleton variant="text" width="75%" />
              </ListItem>
            </List>}
          {
            status === `success` && Boolean(data.po_group.length) && data.document.payment_type.toLowerCase() === `partial` &&
            <List dense>
              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Balance:</span>
                <strong>&#8369;{data.po_group[0].balance.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Total Amount:</span>
                <strong>&#8369;{data.po_group.map((data) => data.amount).reduce((a, b) => a + b).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
              </ListItem>
            </List>}
          {
            status === `success` && Boolean(data.po_group.length) && data.document.payment_type.toLowerCase() === `full` &&
            <List dense>
              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Balance:</span>
                <strong>&#8369;{(data.po_group.map((data) => data.amount).reduce((a, b) => a + b) - (data.document.amount || data.document.reference.amount)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root" dense>
                <span>Total Amount:</span>
                <strong>&#8369;{data.po_group.map((data) => data.amount).reduce((a, b) => a + b).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
              </ListItem>
            </List>}
          {
            status === `success` && !Boolean(data.po_group.length) &&
            <Typography sx={{ marginLeft: 2, marginTop: 1, marginBottom: 1 }}>
              No PO attached.
            </Typography>}




          <Divider variant="middle" />




          {
            status === `loading` &&
            <List dense sx={{ marginTop: 3 }}>
              <ListItem className="FstoListItemTransactionDetails-root FstoListItemTransactionDetails-alt" dense divider>
                <Skeleton variant="text" width="50%" />
                <Skeleton variant="text" width="50%" />

                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="65%" />

                <Skeleton variant="text" width="50%" />
                <Stack direction="row" spacing={1}>
                  <Skeleton variant="text" width="20%" />
                  <Skeleton variant="text" width="20%" />
                  <Skeleton variant="text" width="20%" />
                </Stack>
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root FstoListItemTransactionDetails-alt" dense divider>
                <Skeleton variant="text" width="50%" />
                <Skeleton variant="text" width="50%" />

                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="65%" />

                <Skeleton variant="text" width="50%" />
                <Stack direction="row" spacing={1}>
                  <Skeleton variant="text" width="20%" />
                  <Skeleton variant="text" width="20%" />
                  <Skeleton variant="text" width="20%" />
                </Stack>
              </ListItem>

              <ListItem className="FstoListItemTransactionDetails-root FstoListItemTransactionDetails-alt" dense divider>
                <Skeleton variant="text" width="50%" />
                <Skeleton variant="text" width="50%" />

                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="65%" />

                <Skeleton variant="text" width="50%" />
                <Stack direction="row" spacing={1}>
                  <Skeleton variant="text" width="20%" />
                  <Skeleton variant="text" width="20%" />
                  <Skeleton variant="text" width="20%" />
                </Stack>
              </ListItem>
            </List>}
          {
            status === `success` && Boolean(data.po_group.length) &&
            <List dense sx={{ marginTop: 3 }}>
              {
                data.po_group.map((item, index) => {
                  return (
                    <ListItem className="FstoListItemTransactionDetails-root FstoListItemTransactionDetails-alt" key={index} dense divider>
                      <span>PO No.:</span>
                      <strong style={{ display: `flex`, alignItems: `center` }}>
                        {item.no.toUpperCase()}
                        {
                          item.amount === item.previous_balance &&
                          <Chip label="New" size="small" color="primary" sx={{ height: `20px`, marginLeft: `5px`, fontWeight: 500 }} />
                        }
                      </strong>

                      <span>PO Amount.:</span>
                      <strong>&#8369;{item.amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>

                      <span>PO Balance.:</span>
                      <strong>&#8369;{item.previous_balance.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>

                      <span>RR No.:</span>
                      <strong>
                        {item.rr_no.map((no, index) => <Chip label={no.toUpperCase()} size="small" key={index} sx={{ marginRight: `3px`, marginBottom: `3px` }} />)}
                      </strong>
                    </ListItem>
                  )
                })}
            </List>}
        </Box>
      </Box>
    </React.Fragment>
  )
}

export default TransactionDialog