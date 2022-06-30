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

// const status = `success`
// const data = {
//   "transaction": {
//     "id": 114,
//     "is_latest_transaction": 1,
//     "request_id": 103,
//     "no": "MIS104",
//     "date_requested": "2022-05-31 09:59:21",
//     "data_received": null,
//     "status": "Pending",
//     "state": "request"
//   },
//   "reason": {
//     "id": null,
//     "description": null,
//     "remarks": null
//   },
//   "requestor": {
//     "id": 1,
//     "id_prefix": "RDFFLFI",
//     "id_no": 10791,
//     "role": "Administrator",
//     "position": "System Developer",
//     "first_name": "Limay Louie",
//     "middle_name": "Ocampo",
//     "last_name": "Ducut",
//     "suffix": null,
//     "department": "Management Information System"
//   },
//   "document": {
//     "id": 4,
//     "name": "Receipt",
//     "date": "2022-05-31 00:00:00",
//     "payment_type": "Partial",
//     "remarks": null,
//     "category": {
//       "id": 1,
//       "name": "general"
//     },
//     "company": {
//       "id": 1,
//       "name": "RDF Corporate Services"
//     },
//     "department": {
//       "id": 1,
//       "name": "Corporate Common"
//     },
//     "location": {
//       "id": 5,
//       "name": "Common"
//     },
//     "supplier": {
//       "id": 30,
//       "name": "1ST ADVENUE ADVERTISING"
//     },
//     "reference": {
//       "id": 2,
//       "type": "OR",
//       "no": "999903",
//       "amount": 2000
//     }
//   },
//   "po_group": [
//     {
//       "no": "999902",
//       "amount": 5000,
//       "rr_no": [
//         "0987654321"
//       ],
//       "previous_balance": 2000,
//       "balance": 0
//     },
//     {
//       "no": "999901",
//       "amount": 10000,
//       "rr_no": [
//         "1234567890"
//       ],
//       "previous_balance": 0,
//       "balance": 0
//     }
//   ],
//   "voucher": {
//     "ap_associate": {
//       "id": 1,
//       "name": "LORENZO YUMOL"
//     },
//     "approver": {
//       "id": 1,
//       "name": "REDEN CUNANAN"
//     },
//     "receipt_type": "official",
//     "witholding_tax": 4850,
//     "percentage_tax": 1860,
//     "gross_amount": 100000,
//     "net_amount": 100000,
//     "month_in": 2206,
//     "no": "FO-1001-9999",
//     "date_vouchered": "2022-06-08 00:00:00",
//     "date_filed": "2022-06-08 00:00:00",
//     "account_title": {
//       "account_title_details": [
//         {
//           "id": 1,
//           "name": "SE - Depr. Equipment, Furniture & Fixtures",
//           "type": "debit",
//           "amount": 100000,
//           "remarks": "Payment for office chair in Corporate Common."
//         },
//         {
//           "id": 2,
//           "name": "Accounts Payable",
//           "type": "credit",
//           "amount": 100000,
//           "remarks": null
//         }
//       ]
//     }
//   },
//   "cheque": {
//     "date": "2022-06-08 00:00:00",
//     "cheque_details": [
//       {
//         "no": "203-4024-424",
//         "date": "2022-06-08 00:00:00",
//         "amount": 100000,
//         "bank": {
//           "id": 1,
//           "name": "Asia United Bank"
//         }
//       }
//     ],
//     "account_title": {
//       "account_title_details": [
//         {
//           "id": 2,
//           "name": "Accounts Payable",
//           "type": "debit",
//           "amount": 100000
//         },
//         {
//           "id": 3,
//           "name": "Clearing - AUB",
//           "type": "credit",
//           "amount": 100000
//         }
//       ]
//     }
//   }
// }

const Transaction = (props) => {

  const {
    data: transaction,
    onView = () => { }
  } = props

  const {
    status,
    data
  } = useTransaction(transaction.id)

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
                <strong style={{ textTransform: "uppercase" }}>{data?.document.no} {data?.document.id === 5 && `(CAPEX${data?.document.capex_no})`}</strong>
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
            </Box>

            <Box className="FstoBoxRow-half">
              <Box className="FstoBoxCell-root">
                Reference Amount
                <strong>&#8369;{data?.document.reference.amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
              </Box>
            </Box>
          </Box>}

        { // Type of Receipt, Withholding Tax, Percentage Tax, Net of Amount
          (data?.voucher.receipt_type !== null)
          &&
          <Box className="FstoBoxRow-root">
            <Box className="FstoBoxRow-half">
              <Box className="FstoBoxCell-root">
                Type of Receipt
                <strong>{data?.voucher.receipt_type}</strong>
              </Box>

              {
                (data?.voucher.witholding_tax !== null)
                &&
                <Box className="FstoBoxCell-root">
                  Withholding Tax
                  <strong>&#8369;{data?.voucher.witholding_tax.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                </Box>
              }
            </Box>

            <Box className="FstoBoxRow-half">
              {
                (data?.voucher.percentage_tax !== null)
                &&
                <Box className="FstoBoxCell-root">
                  Percentage Tax
                  <strong>&#8369;{data?.voucher.percentage_tax.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
                </Box>
              }

              <Box className="FstoBoxCell-root">
                Net of Amount
                <strong>&#8369;{data?.voucher.net_amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
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

        { // PCF name, PCF Letter, PCF Date
          (data?.document.id === 8)
          &&
          <Box className="FstoBoxRow-root">
            <Box className="FstoBoxRow-half">
              <Box className="FstoBoxCell-root">
                PCF Name
                <strong>{data?.document.pcf_batch.name}</strong>
              </Box>

              <Box className="FstoBoxCell-root">
                PCF Letter
                <strong>{data?.document.pcf_batch.letter}</strong>
              </Box>

              <Box className="FstoBoxCell-root">
                PCF Date
                <strong>{new Date(data?.document.pcf_batch.date).toLocaleString('default', { month: 'long', year: 'numeric' })}</strong>
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

      { // PO Information
        Boolean(data?.po_group.length)
        &&
        <React.Fragment>
          <Typography className="FstoTypographyTransaction-root" variant="heading">Purchase Order Information</Typography>

          <Box className="FstoBoxTable-root">
            <Box className="FstoBoxRow-root" sx={{ flexDirection: "row" }}>
              <Box className="FstoBoxCell-root FstoBoxCell-head">
                <strong>PO Number</strong>
              </Box>

              <Box className="FstoBoxCell-root FstoBoxCell-head">
                <strong>RR Number</strong>
              </Box>

              <Box className="FstoBoxCell-root FstoBoxCell-head">
                <strong>Amount</strong>
              </Box>
            </Box>

            {
              data?.po_group.map((item, index) => (
                <Box className="FstoBoxRow-root" key={index} sx={{ flexDirection: "row" }}>
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

      { // Voucher Information
        Boolean(data?.voucher.no) &&
        Boolean(data?.voucher.month_in) &&
        Boolean(data?.voucher.date_vouchered)
        &&
        <React.Fragment>
          <Box className="FstoBoxTable-root">
            <Box className="FstoBoxRow-alt">
              <Box className="FstoBoxCell-root FstoBoxCell-head">
                <strong>Voucher Information</strong>
              </Box>
            </Box>

            <Box className="FstoBoxRow-alt">
              <Box className="FstoBoxCell-alt">
                Voucher Number
                <strong>{data?.voucher.no}</strong>
              </Box>

              <Box className="FstoBoxCell-alt">
                Voucher Month
                <strong>{data?.voucher.month_in}</strong>
              </Box>

              <Box className="FstoBoxCell-alt">
                Date Vouchered
                <strong>
                  {
                    new Date(data?.voucher.date_vouchered).toLocaleString("default", {
                      month: "numeric",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric"
                    })}
                </strong>
              </Box>

              {
                (data?.voucher.date_filed)
                &&
                <Box className="FstoBoxCell-alt">
                  Date Filed
                  <strong>
                    {
                      new Date(data?.voucher.date_filed).toLocaleString("default", {
                        month: "numeric",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric"
                      })}
                  </strong>
                </Box>
              }

              <Box className="FstoBoxCell-alt">
                Account Title Details
                <strong style={{ color: `blue`, cursor: `pointer` }} onClick={onView}>Update</strong>
              </Box>

              <Box className="FstoBoxCell-alt">
                Vouchered by
                <strong>{data?.voucher.ap_associate.name.toLowerCase()}</strong>
              </Box>

              {
                (data?.voucher.approver)
                &&
                <Box className="FstoBoxCell-alt">
                  Approved by
                  <strong>{data?.voucher.approver.name.toLowerCase()}</strong>
                </Box>
              }
            </Box>
          </Box>
        </React.Fragment>}

    </React.Fragment>
  )
}

export default Transaction