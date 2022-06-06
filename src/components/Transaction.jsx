import React from 'react'

import {
  Box,
  Skeleton,
  Typography,
  Alert,
  AlertTitle
} from '@mui/material'

import '../assets/css/styles.transaction.scss'

import ReportIcon from '@mui/icons-material/ReportOutlined'

import useTransaction from '../hooks/useTransaction'

const Transaction = (props) => {

  const ID = props.data?.id
  const {
    status,
    data
  } = useTransaction(ID)

  return (
    <React.Fragment>
      {
        (data?.transaction.state === `hold` || data?.transaction.state === `void`)
        &&
        <Alert
          className="FstoAlertTransaction-root"
          severity={
            data?.transaction.state === `void` ? "error" : "info"
          }
          icon={
            <ReportIcon className="FstoAlertTransaction-icon" />
          }
        >
          <AlertTitle className="FstoAlertTransaction-title">{data?.reason.description}</AlertTitle>
          Remarks:&nbsp;
          {
            data?.reason.remarks
              ? <strong>{data?.reason.remarks}</strong>
              : <i>None</i>
          }
        </Alert>
      }

      <Box className="FstoBoxTable-root">
        <Box className="FstoBoxRow-root">
          <Box className="FstoBoxRow-half">
            <Box className="FstoBoxCell-root">
              Requestor
              {
                status === `loading`
                  ? <Skeleton variant="text" />
                  : <strong>{data?.requestor.last_name}, {data?.requestor.first_name} {data?.requestor.middle_name} {data?.requestor.suffix}</strong>}
            </Box>

            <Box className="FstoBoxCell-root">
              Department
              {
                status === `loading`
                  ? <Skeleton variant="text" />
                  : <strong>{data?.requestor.department}</strong>}
            </Box>
          </Box>

          <Box className="FstoBoxRow-half">
            <Box className="FstoBoxCell-root">
              Position
              {
                status === `loading`
                  ? <Skeleton variant="text" />
                  : <strong>{data?.requestor.position}</strong>}
            </Box>

            <Box className="FstoBoxCell-root">
              Role
              {
                status === `loading`
                  ? <Skeleton variant="text" />
                  : <strong>{data?.requestor.role}</strong>}
            </Box>
          </Box>
        </Box>

        <Box className="FstoBoxRow-root">
          <Box className="FstoBoxRow-half">
            {
              (data?.transaction.tag_no !== undefined)
              &&
              <Box className="FstoBoxCell-root">
                Accounting Tag
                <strong>{data?.transaction.tag_no}</strong>
              </Box>
            }

            <Box className="FstoBoxCell-root">
              Transaction Number
              {
                status === `loading`
                  ? <Skeleton variant="text" />
                  : <strong>{data?.transaction.no}</strong>}
            </Box>
          </Box>

          <Box className="FstoBoxRow-half">
            <Box className="FstoBoxCell-root">
              Document Type
              {
                status === `loading`
                  ? <Skeleton variant="text" />
                  : <strong>{data?.document.name}</strong>}
            </Box>

            {
              (data?.document.id === 1 || data?.document.id === 2 || data?.document.id === 5)
              &&
              <Box className="FstoBoxCell-root">
                Document Number
                <strong>{data?.document.no}</strong>
              </Box>
            }
          </Box>
        </Box>

        <Box className="FstoBoxRow-root">
          <Box className="FstoBoxRow-half">
            <Box className="FstoBoxCell-root">
              Payment Type
              {
                status === `loading`
                  ? <Skeleton variant="text" />
                  : <strong>{data?.document.payment_type}</strong>}
            </Box>

            {
              (data?.document.id === 1 || data?.document.id === 2 || data?.document.id === 4 || data?.document.id === 5)
              &&
              <Box className="FstoBoxCell-root">
                Category
                <strong>{data?.document.category.name}</strong>
              </Box>
            }
          </Box>

          <Box className="FstoBoxRow-half">
            {
              (data?.document.id === 1 || data?.document.id === 2 || data?.document.id === 4 || data?.document.id === 5 || data?.document.id === 8)
              &&
              <Box className="FstoBoxCell-root">
                Document Date
                <strong>
                  {
                    new Date(data?.document.date).toLocaleString("default", {
                      month: "numeric",
                      day: "numeric",
                      year: "numeric"
                    })}
                </strong>
              </Box>
            }

            {
              (data?.document.id === 6 || data?.document.id === 7)
              &&
              <Box className="FstoBoxCell-root">
                Coverage Date
                <strong>
                  {
                    new Date(data?.document.from).toLocaleString("default", {
                      month: "numeric",
                      day: "numeric",
                      year: "numeric"
                    })}
                  &nbsp;-&nbsp;
                  {
                    new Date(data?.document.to).toLocaleString("default", {
                      month: "numeric",
                      day: "numeric",
                      year: "numeric"
                    })}
                </strong>
              </Box>
            }

            <Box className="FstoBoxCell-root">
              Date Requested
              {
                status === `loading`
                  ? <Skeleton variant="text" />
                  : <strong>
                    {
                      new Date(data?.transaction.date_requested).toLocaleString("default", {
                        month: "numeric",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric"
                      })}
                  </strong>}
            </Box>
          </Box>
        </Box>

        <Box className="FstoBoxRow-root">
          {
            (data?.document.id === 1 || data?.document.id === 2 || data?.document.id === 5 || data?.document.id === 6 || data?.document.id === 7 || data?.document.id === 8)
            &&
            <Box className="FstoBoxRow-half">
              <Box className="FstoBoxCell-root">
                Document Amount
                <strong>&#8369;{data?.document.amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
              </Box>
            </Box>
          }

          <Box className="FstoBoxRow-half">
            <Box className="FstoBoxCell-root">
              Supplier
              {
                status === `loading`
                  ? <Skeleton variant="text" />
                  : <strong>{data?.document.supplier.name}</strong>}
            </Box>
          </Box>
        </Box>

        { // Reference Number, Reference Type, reference Amount
          (data?.document.id === 4)
          &&
          <Box className="FstoBoxRow-root">
            <Box className="FstoBoxRow-half">
              <Box className="FstoBoxCell-root">
                Reference Numbner
                <strong>{data?.document.reference.no}</strong>
              </Box>

              <Box className="FstoBoxCell-root">
                Reference Type
                <strong>{data?.document.reference.type}</strong>
              </Box>

              <Box className="FstoBoxCell-root">
                Reference Amount
                <strong>&#8369;{data?.document.reference.amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
              </Box>
            </Box>
          </Box>}

        { // Utility Category, Utility Location, Account Number, SOA Number
          (data?.document.id === 6)
          &&
          <Box className="FstoBoxRow-root">
            <Box className="FstoBoxRow-half">
              <Box className="FstoBoxCell-root">
                Utility Category
                <strong>{data?.document.utility.category.name}</strong>
              </Box>

              <Box className="FstoBoxCell-root">
                Utility Location
                <strong>{data?.document.utility.location.name}</strong>
              </Box>
            </Box>

            <Box className="FstoBoxRow-half">
              <Box className="FstoBoxCell-root">
                Utility Category
                <strong>{data?.document.utility.account_no.no}</strong>
              </Box>

              <Box className="FstoBoxCell-root">
                Utility Category
                <strong>{data?.document.utility.receipt_no}</strong>
              </Box>
            </Box>
          </Box>}

        { // Payroll Type, Payroll Category, Payroll Clients
          (data?.document.id === 7)
          &&
          <Box className="FstoBoxRow-root">
            <Box className="FstoBoxRow-half">
              <Box className="FstoBoxCell-root">
                Payroll Type
                <strong>{data?.document.payroll.type}</strong>
              </Box>

              <Box className="FstoBoxCell-root">
                Payroll Category
                <strong>{data?.document.payroll.category.name}</strong>
              </Box>

              <Box className="FstoBoxCell-root">
                Payroll Clients
                <strong>{data?.document.payroll.clients.map(item => item.name).join(", ")}</strong>
              </Box>
            </Box>
          </Box>}


        <Box className="FstoBoxRow-root">
          <Box className="FstoBoxRow-half">
            <Box className="FstoBoxCell-root">
              Company Charging
              {
                status === `loading`
                  ? <Skeleton variant="text" />
                  : <strong>{data?.document.company.name}</strong>}
            </Box>

            <Box className="FstoBoxCell-root">
              Department Charging
              {
                status === `loading`
                  ? <Skeleton variant="text" />
                  : <strong>{data?.document.department.name}</strong>}
            </Box>

            <Box className="FstoBoxCell-root">
              Location Charging
              {
                status === `loading`
                  ? <Skeleton variant="text" />
                  : <strong>{data?.document.location.name}</strong>}
            </Box>
          </Box>
        </Box>

        <Box className="FstoBoxRow-root">
          <Box className="FstoBoxRow-half">
            <Box className="FstoBoxCell-root">
              Remarks
              {
                status === `loading`
                  ? <Skeleton variant="text" />
                  : data?.document.remarks
                    ? <strong>{data?.document.remarks}</strong>
                    : <i>None</i>}
            </Box>
          </Box>
        </Box>
      </Box>

      {
        Boolean(data?.po_group.length)
        &&
        <React.Fragment>
          <Typography className="FstoTypographyTransaction-root" variant="heading">Purchase Order Information</Typography>

          <Box className="FstoBoxTable-root">
            <Box className="FstoBoxRow-root">
              <Box className="FstoBoxCell-root FstoBoxCell-head">
                <strong>Purchase Order Number</strong>
              </Box>

              <Box className="FstoBoxCell-root FstoBoxCell-head">
                <strong>Receive Receipt Number</strong>
              </Box>

              <Box className="FstoBoxCell-root FstoBoxCell-head">
                <strong>Amount</strong>
              </Box>
            </Box>

            {
              data?.po_group.map((item, index) => (
                <Box className="FstoBoxRow-root" key={index}>
                  <Box className="FstoBoxCell-root" sx={{ borderLeft: 0, borderRight: 0, alignItems: "center" }}>
                    {item.no}
                  </Box>

                  <Box className="FstoBoxCell-root" sx={{ borderLeft: 0, borderRight: 0, alignItems: "center" }}>
                    {item.rr_no.join(", ")}
                  </Box>

                  <Box className="FstoBoxCell-root" sx={{ borderLeft: 0, borderRight: 0, alignItems: "center" }}>
                    &#8369;{item.amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                  </Box>
                </Box>
              ))}
          </Box>
        </React.Fragment>}
    </React.Fragment>
  )
}

export default Transaction