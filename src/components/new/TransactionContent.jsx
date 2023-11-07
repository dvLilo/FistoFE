import React, { Fragment } from 'react'

import {
  Box,
  Divider,
  List,
  ListItem,
  Stack,
  Typography
} from '@mui/material'

const TransactionContent = ({
  data = null,
  status = "pending"
}) => {

  if (status === "pending") {
    return (
      <Box className="FstoBoxTransaction-root">
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  if (status === "fulfilled") {
    return (
      <Box className="FstoBoxTransaction-root">
        <Stack direction="row">
          <Box>
            {/* Requestor */}
            <Divider textAlign="left">
              <Typography variant="h6" fontWeight={700}>
                Requestor
              </Typography>
            </Divider>

            <List dense>
              <ListItem dense>
                <span>Name:</span>
                <strong>{data.requestor.first_name.toLowerCase()} {data.requestor.middle_name?.toLowerCase()} {data.requestor.last_name.toLowerCase()}</strong>
              </ListItem>

              <ListItem dense>
                <span>Department:</span>
                <strong>{data.requestor.department}</strong>
              </ListItem>
            </List>

            {/* Charging */}
            <Divider textAlign="left">
              <Typography variant="h6" fontWeight={700}>
                Charging
              </Typography>
            </Divider>

            <List dense>
              <ListItem dense>
                <span>Company:</span>
                <strong>{data.document.company.name}</strong>
              </ListItem>

              <ListItem dense>
                <span>Department:</span>
                <strong>{data.document.department.name}</strong>
              </ListItem>

              <ListItem dense>
                <span>Location:</span>
                <strong>{data.document.location.name}</strong>
              </ListItem>
            </List>

            {/* Transaction */}
            <Divider textAlign="left">
              <Typography variant="h6" fontWeight={700}>
                Transaction
              </Typography>
            </Divider>

            <List dense>
              {
                Boolean(data.tag) &&
                <ListItem dense>
                  <span>Date Received:</span>
                  <Stack direction="column">
                    <strong>{formatDates(data.tag.dates.received)} <Chip label="Tagged" size="small" sx={{ height: 20, fontWeight: 400 }} /></strong>
                    {
                      Boolean(data.release) &&
                      <strong>{formatDates(data.release.dates.received)} <Chip label="Released" size="small" sx={{ height: 20, fontWeight: 400 }} /></strong>}
                  </Stack>
                </ListItem>}

              {
                Boolean(data.tag) && Boolean(data.tag.no) &&
                <ListItem dense>
                  <span>Tag No:</span>
                  <strong>{data.tag.no}</strong>
                </ListItem>}

              <ListItem dense>
                <span>Transaction No.:</span>
                <strong>{data.transaction.no.toUpperCase()}</strong>
              </ListItem>

              {
                Boolean(data.tag) && Boolean(data.tag.no) &&
                <ListItem dense>
                  <span>Date Tagged:</span>
                  <strong>{formatDates(data.tag.dates.tagged)}</strong>
                </ListItem>}

              <ListItem dense>
                <span>Date Requested:</span>
                <strong>{formatDates(data.transaction.date_requested)}</strong>
              </ListItem>

              <ListItem dense>
                <span>Payment Type:</span>
                <strong>{data.document.payment_type}</strong>
              </ListItem>

              <ListItem dense>
                <span>Document Type:</span>
                <strong>{data.document.name}</strong>
              </ListItem>

              {
                data.document.no &&
                <ListItem dense>
                  <span>Document No.:</span>
                  <strong>{data.document.no.toUpperCase()}</strong>
                </ListItem>}

              {
                data.document.capex_no &&
                <ListItem dense>
                  <span>CAPEX No.:</span>
                  <strong>{data.document.capex_no.toUpperCase()}</strong>
                </ListItem>}

              {
                data.document.from && data.document.to &&
                <ListItem dense>
                  <span>Coverage Date:</span>
                  <strong>{moment(data.document.from).format("MMM. DD, YYYY")} - {moment(data.document.to).format("MMM. DD, YYYY")}</strong>
                </ListItem>}

              {
                data.document.amount &&
                <ListItem dense>
                  <span>Document Amount:</span>
                  <strong>&#8369;{data.document.amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                </ListItem>}

              {
                data.document.date &&
                <ListItem dense>
                  <span>Document Date:</span>
                  <strong>{moment(data.document.date).format("MMM. DD, YYYY")}</strong>
                </ListItem>}

              {
                data.document.batch_no &&
                <ListItem dense>
                  <span>Batch No.:</span>
                  <strong>{data.document.batch_no}</strong>
                </ListItem>}

              {
                data.document.prm_multiple_from && data.document.prm_multiple_to &&
                <ListItem dense>
                  <span>Period Covered:</span>
                  <strong>{moment(data.document.prm_multiple_from).format("MMM. DD, YYYY")} - {moment(data.document.prm_multiple_to).format("MMM. DD, YYYY")}</strong>
                </ListItem>}

              {
                data.document.release_date &&
                <ListItem dense>
                  <span>Release Date:</span>
                  <strong>{moment(data.document.release_date).format("MMM. DD, YYYY")}</strong>
                </ListItem>}

              {
                data.document.cheque_date &&
                <ListItem dense>
                  <span>Cheque Date:</span>
                  <strong>{moment(data.document.cheque_date).format("MMM. DD, YYYY")}</strong>
                </ListItem>}

              {
                data.document.amortization &&
                <ListItem dense>
                  <span>Amortization:</span>
                  <strong>&#8369;{data.document.amortization.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                </ListItem>}

              {
                data.document.gross_amount &&
                <ListItem dense>
                  <span>Gross Amount:</span>
                  <strong>&#8369;{data.document.gross_amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                </ListItem>}

              {
                data.document.principal &&
                <ListItem dense>
                  <span>Principal Amount:</span>
                  <strong>&#8369;{data.document.principal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                </ListItem>}

              {
                data.document.interest &&
                <ListItem dense>
                  <span>Interest:</span>
                  <strong>&#8369;{data.document.interest.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                </ListItem>}

              {
                data.document.witholding_tax &&
                <ListItem dense>
                  <span>Withholding Tax:</span>
                  <strong>&#8369;{data.document.witholding_tax.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                </ListItem>}

              {
                data.document.cwt &&
                <ListItem dense>
                  <span>Withholding Tax:</span>
                  <strong>&#8369;{data.document.cwt.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                </ListItem>}

              {
                data.document.net_of_amount &&
                <ListItem dense>
                  <span>Net Amount:</span>
                  <strong>&#8369;{data.document.net_of_amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                </ListItem>}

              {
                data.document.category &&
                <ListItem dense>
                  <span>Category:</span>
                  <strong>{data.document.category.name}</strong>
                </ListItem>}

              <ListItem dense>
                <span>Supplier:</span>
                <strong>{data.document.supplier.name}</strong>
              </ListItem>

              {
                Boolean(data.document.reference) &&
                <React.Fragment>
                  <ListItem dense>
                    <span>Reference Type:</span>
                    <strong>{data.document.reference.type.toUpperCase()}</strong>
                  </ListItem>

                  <ListItem dense>
                    <span>Reference No.:</span>
                    <strong>{data.document.reference.no.toUpperCase()}</strong>
                  </ListItem>

                  <ListItem dense>
                    <span>Reference Amount:</span>
                    <strong>&#8369;{data.document.reference.amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                  </ListItem>
                </React.Fragment>
              }

              {
                Boolean(data.document.utility) &&
                <React.Fragment>
                  <ListItem dense>
                    <span>Utility Location:</span>
                    <strong>{data.document.utility.location.name}</strong>
                  </ListItem>

                  <ListItem dense>
                    <span>Utility Category:</span>
                    <strong>{data.document.utility.category.name}</strong>
                  </ListItem>

                  <ListItem dense>
                    <span>Account No.:</span>
                    <strong>{data.document.utility.account_no.no.toUpperCase()}</strong>
                  </ListItem>

                  <ListItem dense>
                    <span>SOA No.:</span>
                    <strong>{data.document.utility.receipt_no.toUpperCase()}</strong>
                  </ListItem>

                  <ListItem dense>
                    <span>Consumption:</span>
                    <strong>{data.document.utility.consumption}</strong>
                  </ListItem>
                </React.Fragment>
              }

              {
                Boolean(data.document.payroll) &&
                <React.Fragment>
                  {
                    data.document.payroll.control_no &&
                    <ListItem dense>
                      <span>Control No.:</span>
                      <strong>{data.document.payroll.control_no}</strong>
                    </ListItem>}

                  <ListItem dense>
                    <span>Payroll Type:</span>
                    <strong>{data.document.payroll.type}</strong>
                  </ListItem>

                  <ListItem dense>
                    <span>Payroll Category:</span>
                    <strong>{data.document.payroll.category.name}</strong>
                  </ListItem>

                  <ListItem dense>
                    <span>Payroll Clients:</span>
                    <strong>{data.document.payroll.clients.map((item) => item.name).join(", ")}</strong>
                  </ListItem>
                </React.Fragment>
              }

              {
                Boolean(data.document.pcf_batch) &&
                <React.Fragment>
                  <ListItem dense>
                    <span>PCF Name:</span>
                    <strong>{data.document.pcf_batch.name.toUpperCase()}</strong>
                  </ListItem>

                  <ListItem dense>
                    <span>PCF Letter:</span>
                    <strong>{data.document.pcf_batch.letter}</strong>
                  </ListItem>

                  <ListItem dense>
                    <span>PCF Date:</span>
                    <strong>{data.document.pcf_batch.date}</strong>
                  </ListItem>
                </React.Fragment>
              }

              {
                Boolean(data.tag) && Boolean(data.tag.receipt_type) &&
                <ListItem dense>
                  <span>Type of Receipt:</span>
                  <strong>{data.tag.receipt_type}</strong>
                </ListItem>
              }

              <ListItem dense>
                <span>Remarks:</span>
                {
                  data.document.remarks
                    ? <b>{data.document.remarks}</b>
                    : <i>None</i>
                }
              </ListItem>
            </List>


            {/* Voucher */
              Boolean(data?.voucher?.no) &&
              <Fragment>
                <Divider textAlign="left">
                  <Stack direction="row" alignItems="center" gap={1}>
                    {
                      data.voucher.accounts.every((item) => !item.is_default) &&
                      <ReportIcon color="error" fontSize="large" />}

                    <Typography variant="h6" fontWeight={700}>Voucher</Typography>

                    {
                      (user?.role.toLowerCase() === `ap associate` || user?.role.toLowerCase() === `ap specialist`) &&
                      <IconButton>
                        <PrintIcon />
                      </IconButton>}
                  </Stack>
                </Divider>

                <List dense>
                  <ListItem dense>
                    <span>Date Received:</span>
                    <Stack direction="column">
                      <strong>{formatDates(data.voucher.dates.received)} <Chip label="Vouchered" size="small" sx={{ height: 20, fontWeight: 400 }} /></strong>
                      {
                        Boolean(data.approve) &&
                        <strong>{formatDates(data.approve.dates.received)} <Chip label="Approved" size="small" sx={{ height: 20, fontWeight: 400 }} /></strong>}
                      {
                        Boolean(data.transmit) &&
                        <strong>{formatDates(data.transmit.dates.received)} <Chip label="Transmitted" size="small" sx={{ height: 20, fontWeight: 400 }} /></strong>}
                      {
                        Boolean(data.inspect) &&
                        <strong>{formatDates(data.inspect.dates.received)} <Chip label="Audited" size="small" sx={{ height: 20, fontWeight: 400 }} /></strong>}
                      {
                        Boolean(data.file) &&
                        <strong>{formatDates(data.file.dates.received)} <Chip label="Filed" size="small" sx={{ height: 20, fontWeight: 400 }} /></strong>}
                      {
                        Boolean(data.debit) &&
                        <strong>{formatDates(data.debit.dates.received)} <Chip label="Filed" size="small" sx={{ height: 20, fontWeight: 400 }} /></strong>}
                    </Stack>
                  </ListItem>

                  <ListItem dense>
                    <span>Voucher No.:</span>
                    <strong>{data.voucher.no}</strong>
                  </ListItem>

                  <ListItem dense>
                    <span>Voucher Month:</span>
                    <strong>{moment(data.voucher.month).format("MMMM YYYY")}</strong>
                  </ListItem>

                  {
                    data.voucher && data.voucher.status === `voucher-voucher` &&
                    <ListItem dense>
                      <span>Date Vouchered:</span>
                      <strong>{formatDates(data.voucher.dates.vouchered)}</strong>
                    </ListItem>}

                  {
                    data.approve && data.approve.status === `approve-approve` &&
                    <ListItem dense>
                      <span>Date Approved:</span>
                      <strong>{formatDates(data.approve.dates.approved)}</strong>
                    </ListItem>}

                  {
                    data.transmit && data.transmit.status === `transmit-transmit` &&
                    <ListItem dense>
                      <span>Date Transmitted:</span>
                      <strong>{formatDates(data.transmit.dates.transmitted)}</strong>
                    </ListItem>}

                  {
                    data.inspect && data.inspect.status === `inspect-inspect` &&
                    <ListItem dense>
                      <span>Date Audited:</span>
                      <strong>{formatDates(data.inspect.dates.inspected)}</strong>
                    </ListItem>}

                  {
                    data.file && data.file.status === `file-file` &&
                    <ListItem dense>
                      <span>Date Filed:</span>
                      <strong>{formatDates(data.file.dates.filed)}</strong>
                    </ListItem>}

                  {
                    data.debit && data.debit.status === `debit-file` &&
                    <ListItem dense>
                      <span>Date Filed:</span>
                      <strong>{formatDates(data.debit.dates.filed)}</strong>
                    </ListItem>}

                  <ListItem dense>
                    <span>Account Title Details:</span>
                    <strong>
                      <span style={{ color: `blue` }}>View</span>
                    </strong>
                  </ListItem>

                  <ListItem dense>
                    <span>Vouchered By:</span>
                    <strong>{data.tag.distributed_to.name}</strong>
                  </ListItem>

                  {
                    data.approve && data.approve.status === `approve-approve` &&
                    <ListItem dense>
                      <span>Approved By:</span>
                      <strong>{data.voucher.approver.name}</strong>
                    </ListItem>}
                </List>
              </Fragment>}




            {/*Cheque*/
              Boolean(data?.cheque) && Boolean(data.cheque.cheques.length) && Boolean(data.cheque.accounts.length) &&
              <Fragment>
                <Divider textAlign="left">
                  <Typography variant="h6" fontWeight={700}>Cheque</Typography>
                </Divider>

                <List dense>
                  {
                    Boolean(data.cheque) &&
                    <ListItem dense>
                      <span>Date Received:</span>
                      <Stack direction="column">
                        <strong>{formatDates(data.cheque.dates.received)} <Chip label="Created" size="small" sx={{ height: 20, fontWeight: 400 }} /></strong>
                        {
                          Boolean(data.audit) &&
                          <strong>{formatDates(data.audit.dates.received)} <Chip label="Audited" size="small" sx={{ height: 20, fontWeight: 400 }} /></strong>}
                        {
                          Boolean(data.executive) &&
                          <strong>{formatDates(data.executive.dates.received)} <Chip label="Transmitted" size="small" sx={{ height: 20, fontWeight: 400 }} /></strong>}
                        {
                          Boolean(data.clear) &&
                          <strong>{formatDates(data.clear.dates.received)} <Chip label="Cleared" size="small" sx={{ height: 20, fontWeight: 400 }} /></strong>}
                      </Stack>
                    </ListItem>}

                  <ListItem dense>
                    <span>Bank Name:</span>
                    <strong>
                      {data.cheque.cheques.length <= 1 ? data.cheque.cheques[0].bank.name : `${data.cheque.cheques[0].bank.name}...`}
                    </strong>
                  </ListItem>

                  <ListItem dense>
                    <span>Cheque No.:</span>
                    <strong>
                      {data.cheque.cheques.length <= 1 ? data.cheque.cheques[0].no : `${data.cheque.cheques[0].no}...`}
                    </strong>
                  </ListItem>

                  <ListItem dense>
                    <span>Cheque Details:</span>
                    <strong>
                      <span style={{ color: `blue`, cursor: `pointer` }} onClick={onChequeView}>View</span>
                    </strong>
                  </ListItem>

                  {
                    data.cheque && data.cheque.status === `cheque-cheque` &&
                    <ListItem dense>
                      <span>Date Created:</span>
                      <strong>{formatDates(data.cheque.dates.created)}</strong>
                    </ListItem>}

                  {
                    data.audit && data.audit.status === `audit-audit` &&
                    <ListItem dense>
                      <span>Date Audited:</span>
                      <strong>{formatDates(data.cheque.dates.audited)}</strong>
                    </ListItem>}

                  {
                    data.executive && data.executive.status === `executive-executive` &&
                    <ListItem dense>
                      <span>Date Signed:</span>
                      <strong>{formatDates(data.executive.dates.signed)}</strong>
                    </ListItem>}

                  {
                    data.issue && data.issue.status === `issue-issue` &&
                    <ListItem dense>
                      <span>Date Released:</span>
                      <Stack direction="column">
                        <strong>{formatDates(data.issue.dates.issued)}  <Chip label="Internal" size="small" sx={{ height: 20, fontWeight: 400 }} /></strong>
                        {
                          data.release && data.release.status === `release-release` &&
                          <strong>{formatDates(data.release.dates.released)}  <Chip label="External" size="small" sx={{ height: 20, fontWeight: 400 }} /></strong>}
                      </Stack>
                    </ListItem>}

                  {
                    data.clear && data.clear.status === `clear-clear` &&
                    <ListItem dense>
                      <span>Date Cleared:</span>
                      <strong>{formatDates(data.clear.date)}</strong>
                    </ListItem>}
                </List>
              </Fragment>}
          </Box>
        </Stack>
      </Box>
    )
  }
}

export default TransactionContent