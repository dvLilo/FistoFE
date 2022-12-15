import React from 'react'

import moment from 'moment'

import { useSelector } from 'react-redux'

import {
  Alert,
  AlertTitle,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  Skeleton,
  Step,
  StepLabel,
  Stepper,
  Typography
} from '@mui/material'

import ReportIcon from '@mui/icons-material/ReportOutlined'

import '../assets/css/styles.transaction.scss'

const TransactionDialog = (props) => {

  const {
    data,
    status,
    onAccountTitleView = () => { },
    onChequeView = () => { }
  } = props

  const user = useSelector((state) => state.user)

  const process = [
    "Tagging of Document",
    "Creation of Voucher",
    "Approval of Voucher",
    "Transmittal of Document",
    "Creation of Cheque",
    "Releasing of Cheque",
    "Filing of Voucher"
  ]

  const activeStep = (state = "") => {
    if (Boolean(state.match(/^tag/i)))
      return 0

    if (Boolean(state.match(/^voucher/i)))
      return 1

    if (Boolean(state.match(/^approve/i)))
      return 2

    if (Boolean(state.match(/^transmit/i)))
      return 3

    if (Boolean(state.match(/^cheque/i)))
      return 4

    if (Boolean(state.match(/^release/i)))
      return 5

    if (Boolean(state.match(/^file/i)))
      return 6

    return -1
  }

  const activeComplete = (state = "") => {
    const [process, subprocess] = state.split("-")

    if (process === subprocess)
      return true

    return false
  }

  const activeStatus = (status = "") => {
    switch (status) {
      case "tag":
        return "tagged"

      case "hold":
        return "held"

      case "transmit":
        return "transmitted"

      default:
        if (status.endsWith("e"))
          return `${status}d`

        return `${status}ed`
    }
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
        status === `success` && Boolean(data.reason.id && data.reason.description && data.reason.remarks) && Boolean(data.transaction.state.match(/hold|return|void|request|receive-approver|receive-requestor|approve/i)) &&
        <Alert
          className="FstoAlertTransactionDetails-root"
          severity={data.transaction.state === `void` ? "error" : "info"}
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

      {
        status === `success` && user && user.role.toLowerCase() === `requestor` &&
        <Box className="FstoBoxTransactionSteps-root">
          <Stepper activeStep={activeStep(data.transaction.status)} alternativeLabel>
            {
              process.map((item, index) => (
                <Step
                  {...(activeStep(data.transaction.status) === index && { completed: activeComplete(data.transaction.status) })}
                  key={index}
                >
                  <StepLabel
                    optional={
                      activeStep(data.transaction.status) === index &&
                      <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                        <Chip label={activeStatus(data.transaction.state)} color="info" size="small" sx={{ textTransform: 'capitalize', paddingLeft: 0.5, paddingRight: 0.5, fontSize: '0.76em' }} />
                      </Box>
                    }>
                    {item}
                  </StepLabel>
                </Step>
              ))
            }
          </Stepper>
        </Box>
      }


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
                Boolean(data.tag) && Boolean(data.tag.no) &&
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
                <strong>{moment(data.transaction.date_requested).format("MM/DD/YYYY")}</strong>
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
                  <strong>{moment(data.document.from).format("MM/DD/YYYY")} - {moment(data.document.to).format("MM/DD/YYYY")}</strong>
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
                  <strong>{moment(data.document.date).format("MM/DD/YYYY")}</strong>
                </ListItem>}

              {
                data.document.batch_no &&
                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Batch No.:</span>
                  <strong>{data.document.batch_no}</strong>
                </ListItem>}

              {
                data.document.prm_multiple_from && data.document.prm_multiple_to &&
                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Period Covered:</span>
                  <strong>{moment(data.document.prm_multiple_from).format("MM/DD/YYYY")} - {moment(data.document.prm_multiple_to).format("MM/DD/YYYY")}</strong>
                </ListItem>}

              {
                data.document.release_date &&
                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Release Date:</span>
                  <strong>{moment(data.document.release_date).format("MM/DD/YYYY")}</strong>
                </ListItem>}

              {
                data.document.cheque_date &&
                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Cheque Date:</span>
                  <strong>{moment(data.document.cheque_date).format("MM/DD/YYYY")}</strong>
                </ListItem>}

              {
                data.document.amortization &&
                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Amortization:</span>
                  <strong>&#8369;{data.document.amortization.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                </ListItem>}

              {
                data.document.gross_amount &&
                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Gross Amount:</span>
                  <strong>&#8369;{data.document.gross_amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                </ListItem>}

              {
                data.document.principal &&
                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Principal Amount:</span>
                  <strong>&#8369;{data.document.principal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                </ListItem>}

              {
                data.document.interest &&
                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Interest:</span>
                  <strong>&#8369;{data.document.interest.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                </ListItem>}

              {
                data.document.witholding_tax &&
                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Withholding Tax:</span>
                  <strong>&#8369;{data.document.witholding_tax.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                </ListItem>}

              {
                data.document.cwt &&
                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Withholding Tax:</span>
                  <strong>&#8369;{data.document.cwt.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                </ListItem>}

              {
                data.document.net_of_amount &&
                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Net Amount:</span>
                  <strong>&#8369;{data.document.net_of_amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
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
                Boolean(data.voucher) && Boolean(data.voucher.tax) && Boolean(data.voucher.tax.receipt_type === 'Official') &&
                <React.Fragment>
                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>Type of Receipt:</span>
                    <strong>{data.voucher.tax.receipt_type}</strong>
                  </ListItem>

                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>Withholding Tax:</span>
                    <strong>&#8369;{data.voucher.tax.witholding_tax?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                  </ListItem>

                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>Percentage Tax:</span>
                    <strong>{data.voucher.tax.percentage_tax?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}%</strong>
                  </ListItem>

                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>Net of Amount:</span>
                    <strong>&#8369;{data.voucher.tax.net_amount?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
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
            Boolean(data?.voucher) && Boolean(data.voucher.no) && Boolean(data.voucher.month) &&
            <React.Fragment>
              <Divider className="FstoDividerTransactionDetails-root" textAlign="left">
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Voucher</Typography>
              </Divider>

              <List className="FstoListTransactionDetails-root" dense>
                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Voucher No.:</span>
                  <strong>{data.voucher.no}</strong>
                </ListItem>

                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Voucher Month:</span>
                  <strong>{moment(data.voucher.month).format("MMMM YYYY")}</strong>
                </ListItem>

                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Date Vouchered:</span>
                  <strong>{moment(data.voucher.date).format("MM/DD/YYYY")}</strong>
                </ListItem>

                {
                  data.file && data.file.status === `file-file` &&
                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>Date Filed:</span>
                    <strong>{moment(data.file.date).format("MM/DD/YYYY")}</strong>
                  </ListItem>}

                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Account Title Details:</span>
                  <strong>
                    <span style={{ color: `blue`, cursor: `pointer` }} onClick={onAccountTitleView}>View</span>
                  </strong>
                </ListItem>

                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Vouchered By:</span>
                  <strong>{data.tag.distributed_to.name}</strong>
                </ListItem>

                {
                  data.approve && data.approve.status === `approve-approve` &&
                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>Approved By:</span>
                    <strong>{data.voucher.approver.name}</strong>
                  </ListItem>}
              </List>
            </React.Fragment>}




          {
            Boolean(data?.cheque) && Boolean(data.cheque.cheques.length) && Boolean(data.cheque.accounts.length) &&
            <React.Fragment>
              <Divider className="FstoDividerTransactionDetails-root" textAlign="left">
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Cheque</Typography>
              </Divider>

              <List className="FstoListTransactionDetails-root" dense>
                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Bank Name:</span>
                  <strong>
                    {data.cheque.cheques.length <= 1 ? data.cheque.cheques[0].bank.name : `${data.cheque.cheques[0].bank.name}...`}
                  </strong>
                </ListItem>

                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Cheque No.:</span>
                  <strong>
                    {data.cheque.cheques.length <= 1 ? data.cheque.cheques[0].no : `${data.cheque.cheques[0].no}...`}
                  </strong>
                </ListItem>

                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Cheque Details:</span>
                  <strong>
                    <span style={{ color: `blue`, cursor: `pointer` }} onClick={onChequeView}>View</span>
                  </strong>
                </ListItem>

                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Date Created:</span>
                  <strong>{moment(data.cheque.date).format("MM/DD/YYYY")}</strong>
                </ListItem>

                {
                  data.release && data.release.status === `release-release` &&
                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>Date Released:</span>
                    <strong>{moment(data.release.date).format("MM/DD/YYYY")}</strong>
                  </ListItem>}

                {
                  data.clear && data.clear.status === `clear-clear` &&
                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>Date Cleared:</span>
                    <strong>{moment(data.clear.date).format("MM/DD/YYYY")}</strong>
                  </ListItem>}
              </List>
            </React.Fragment>}
        </Box>

        <Divider className="FstoDividerTransactionDetails-root" variant="middle" orientation="vertical" flexItem />

        { // Preloader for PO and Attachment
          status === `loading` &&
          <React.Fragment>
            <Box className="FstoBoxTransactionDetails-content">
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                <Skeleton variant="text" width="50%" />
              </Typography>

              <List dense>
                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span><Skeleton variant="text" width="50%" /></span>
                  <strong><Skeleton variant="text" width="70%" /></strong>
                </ListItem>

                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span><Skeleton variant="text" width="50%" /></span>
                  <strong><Skeleton variant="text" width="70%" /></strong>
                </ListItem>
              </List>

              <Divider variant="middle" />

              <List dense sx={{ marginTop: 3 }}>
                <ListItem className="FstoListItemTransactionDetails-root FstoListItemTransactionDetails-alt" dense divider>
                  <span><Skeleton variant="text" width="50%" /></span>
                  <strong><Skeleton variant="text" width="70%" /></strong>

                  <span><Skeleton variant="text" width="50%" /></span>
                  <strong><Skeleton variant="text" width="70%" /></strong>
                </ListItem>

                <ListItem className="FstoListItemTransactionDetails-root FstoListItemTransactionDetails-alt" dense divider>
                  <span><Skeleton variant="text" width="50%" /></span>
                  <strong><Skeleton variant="text" width="70%" /></strong>

                  <span><Skeleton variant="text" width="50%" /></span>
                  <strong><Skeleton variant="text" width="70%" /></strong>
                </ListItem>

                <ListItem className="FstoListItemTransactionDetails-root FstoListItemTransactionDetails-alt" dense divider>
                  <span><Skeleton variant="text" width="50%" /></span>
                  <strong><Skeleton variant="text" width="70%" /></strong>

                  <span><Skeleton variant="text" width="50%" /></span>
                  <strong><Skeleton variant="text" width="70%" /></strong>
                </ListItem>
              </List>
            </Box>
          </React.Fragment>}

        { // Attachment
          status === `success` && data.document.id === 9 &&
          <React.Fragment>
            <Box className="FstoBoxTransactionDetails-content">
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Attachment</Typography>

              <List dense>
                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Total Principal:</span>
                  <strong>&#8369;{data.autoDebit_group.reduce((a, b) => a + b.principal_amount, 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                </ListItem>

                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Total Interest:</span>
                  <strong>&#8369;{data.autoDebit_group.reduce((a, b) => a + b.interest_due, 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                </ListItem>

                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Total CWT:</span>
                  <strong>&#8369;{data.autoDebit_group.reduce((a, b) => a + b.cwt, 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                </ListItem>

                <ListItem className="FstoListItemTransactionDetails-root" dense>
                  <span>Total Net of CWT:</span>
                  <strong>&#8369;{data.autoDebit_group.reduce((a, b) => ((b.principal_amount + b.interest_due) - b.cwt) + a, 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                </ListItem>
              </List>

              <Divider variant="middle" />

              <List dense sx={{ marginTop: 3 }}>
                {
                  data.autoDebit_group.map((item, index) => {
                    return (
                      <ListItem className="FstoListItemTransactionDetails-root FstoListItemTransactionDetails-alt" key={index} dense divider>
                        <span>PN No.:</span>
                        <strong>{item.pn_no}</strong>

                        <span>Principal Amount:</span>
                        <strong>&#8369;{item.principal_amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>

                        <span>Interest:</span>
                        <strong>&#8369;{item.interest_due.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>

                        <span>CWT:</span>
                        <strong>&#8369;{item.cwt.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>

                        <span>Net of Amount:</span>
                        <strong>&#8369;{((item.principal_amount + item.interest_due) - item.cwt).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                      </ListItem>
                    )
                  })
                }
              </List>
            </Box>
          </React.Fragment>}

        { // PO
          status === `success` && data.document.id !== 9 &&
          <React.Fragment>
            <Box className="FstoBoxTransactionDetails-content">
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Purchase Order</Typography>

              {
                status === `success` && Boolean(data.po_group.length) && data.document.payment_type.toLowerCase() === `partial` &&
                <List dense>
                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>Balance:</span>
                    <strong>&#8369;{data.po_group[0].balance.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                  </ListItem>

                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>Total Amount:</span>
                    <strong>&#8369;{data.po_group.reduce((a, b) => a + b.amount, 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                  </ListItem>
                </List>}
              {
                status === `success` && Boolean(data.po_group.length) && data.document.payment_type.toLowerCase() === `full` &&
                <List dense>
                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>Balance:</span>
                    <strong>&#8369;{(data.po_group.reduce((a, b) => a + b.amount, 0) - (data.document.amount || data.document.reference.amount)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                  </ListItem>

                  <ListItem className="FstoListItemTransactionDetails-root" dense>
                    <span>Total Amount:</span>
                    <strong>&#8369;{data.po_group.reduce((a, b) => a + b.amount, 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                  </ListItem>
                </List>}
              {
                status === `success` && !Boolean(data.po_group.length) &&
                <Typography sx={{ marginLeft: 2, marginTop: 1, marginBottom: 1 }}>
                  No PO attached.
                </Typography>}

              <Divider variant="middle" />

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
          </React.Fragment>}


      </Box>
    </React.Fragment >
  )
}

export default TransactionDialog