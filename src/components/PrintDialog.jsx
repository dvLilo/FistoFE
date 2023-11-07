import React from 'react'

import moment from 'moment'

import { useReactToPrint } from 'react-to-print'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'

import {
  Close,
  Print
} from '@mui/icons-material'

const PrintDialog = ({
  open = false,
  state = null,
  transaction = null,
  data = null,
  onBack = () => { },
  onClose = () => { }
}) => {

  const ref = React.useRef()

  const onPrintHandler = useReactToPrint({
    content: () => ref.current
  })

  const closePrintHandler = () => {
    onClose()
  }

  const backPrintHandler = () => {
    onClose()
    onBack(transaction)
  }

  return (
    <Dialog open={open} scroll="body" maxWidth="lg" fullWidth disablePortal>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          Voucher Print Preview

          <IconButton size="large" onClick={closePrintHandler}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent ref={ref}>
        <Typography variant="h5" align="center" sx={{ fontWeight: 700, marginTop: 6, marginBottom: 6 }}>CHECK VOUCHER</Typography>

        <Stack direction="row">
          <Stack direction="column" flex={1}>
            <List dense>
              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Payee:</span>
                <strong>{data?.document?.supplier?.name}</strong>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Tag No.:</span>
                <strong>{data?.tag?.no}</strong>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Voucher No.:</span>
                <strong>{data?.voucher?.no}</strong>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Invoice No.:</span>
                <strong>{data?.document?.reference?.no || data?.document?.no}</strong>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Operating Unit:</span>
                <strong>{data?.voucher?.accounts?.at(0)?.company?.name}</strong>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Description:</span>
                <strong>{data?.document?.remarks}</strong>
              </ListItem>
            </List>
          </Stack>

          <Stack direction="column" flex={1}>
            <List dense>
              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Amount:</span>
                <strong>&#8369;{data?.document?.reference?.amount?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') || data?.document?.amount?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</strong>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Invoice Date:</span>
                <strong>{moment(data?.document?.date).format("MMM. DD, YYYY")}</strong>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>GL Date:</span>
                <strong>{moment(data?.voucher?.dates?.vouchered).format("MMM. DD, YYYY")}</strong>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Payment Details</span>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Bank:</span>
                <strong>___________________________________________</strong>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Cheque No.:</span>
                <strong>___________________________________________</strong>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Cheque Date:</span>
                <strong>___________________________________________</strong>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Delivery Date:</span>
                <strong>___________________________________________</strong>
              </ListItem>
            </List>
          </Stack>
        </Stack>

        <TableContainer sx={{ marginTop: 4, marginBottom: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ background: "rgba(0, 0, 0, 0.16)", border: "1px solid rgba(0, 0, 0, 0.54)", padding: 1 }}>Line No.</TableCell>

                <TableCell sx={{ background: "rgba(0, 0, 0, 0.16)", border: "1px solid rgba(0, 0, 0, 0.54)", padding: 1 }}>Account</TableCell>

                <TableCell sx={{ background: "rgba(0, 0, 0, 0.16)", border: "1px solid rgba(0, 0, 0, 0.54)", padding: 1 }}>Amount</TableCell>

                <TableCell sx={{ background: "rgba(0, 0, 0, 0.16)", border: "1px solid rgba(0, 0, 0, 0.54)", padding: 1 }}>Description</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {
                data?.voucher?.accounts?.filter((item) => item.entry.toLowerCase() === "debit").map((item, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ border: "1px solid rgba(0, 0, 0, 0.54)" }}>{index + 1}</TableCell>

                    <TableCell sx={{ border: "1px solid rgba(0, 0, 0, 0.54)" }}>{item.company.name} &mdash; {item.department.name} &mdash; {item.location.name} &mdash; {item.account_title.name}</TableCell>

                    <TableCell sx={{ border: "1px solid rgba(0, 0, 0, 0.54)" }}>&#8369;{data?.document?.reference?.amount?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') || data?.document?.amount?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</TableCell>

                    <TableCell sx={{ border: "1px solid rgba(0, 0, 0, 0.54)" }}>{data?.document?.remarks}</TableCell>
                  </TableRow>
                ))
              }

            </TableBody>
          </Table>
        </TableContainer>

        <Stack direction="row">
          <Stack direction="column" flex={1}>
            <List className="FstoListPrint-root" dense>
              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Processing Approval Details</span>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>CV No.:</span>
                <strong style={{ textIndent: 16, borderBottom: "1px solid" }}>{data?.voucher?.no}</strong>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Prepared by:</span>
                <strong style={{ textIndent: 16, borderBottom: "1px solid" }}>{data?.tag?.distributed_to?.name}</strong>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Approved by:</span>
                <strong style={{ textIndent: 16, borderBottom: "1px solid" }}>{data?.voucher?.approver?.name}</strong>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>GAS:</span>
                <strong style={{ borderBottom: "1px solid" }}>&nbsp;</strong>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Treasury 1:</span>
                <strong style={{ borderBottom: "1px solid" }}>&nbsp;</strong>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Treasury 2:</span>
                <strong style={{ borderBottom: "1px solid" }}>&nbsp;</strong>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Audited by:</span>
                <strong style={{ borderBottom: "1px solid" }}>&nbsp;</strong>
              </ListItem>
            </List>
          </Stack>

          <Stack direction="column" flex={1}>
            <List className="FstoListPrint-root" dense>
              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>&nbsp;</span>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>&nbsp;</span>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  gap: 2,
                  alignItems: "baseline",
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Date:</span>
                <strong style={{ textIndent: 16, borderBottom: "1px solid" }}>{moment(data?.voucher?.dates?.vouchered).format("MMM. DD, YYYY")}</strong>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  gap: 2,
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Date:</span>
                <strong style={{ borderBottom: "1px solid" }}>&nbsp;</strong>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  gap: 2,
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Date:</span>
                <strong style={{ borderBottom: "1px solid" }}>&nbsp;</strong>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  gap: 2,
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Date:</span>
                <strong style={{ borderBottom: "1px solid" }}>&nbsp;</strong>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  gap: 2,
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Date:</span>
                <strong style={{ borderBottom: "1px solid" }}>&nbsp;</strong>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  gap: 2,
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Date:</span>
                <strong style={{ borderBottom: "1px solid" }}>&nbsp;</strong>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  gap: 2,
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Date:</span>
                <strong style={{ borderBottom: "1px solid" }}>&nbsp;</strong>
              </ListItem>
            </List>
          </Stack>

          <Stack direction="column" flex={1}>
            <List className="FstoListPrint-root" dense>
              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Collection Recipient Details</span>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>&nbsp;</span>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>&nbsp;</span>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Received by:</span>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>&nbsp;</span>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span style={{ textAlign: "center", borderBottom: "1px solid" }}>
                  {data?.requestor?.first_name} {data?.requestor?.last_name}
                </span>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span style={{ textAlign: "center" }}>Signature over printed name</span>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>&nbsp;</span>
              </ListItem>

              <ListItem
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "baseline",
                  "& span": {
                    flex: 1
                  },
                  "& strong": {
                    flex: 2
                  }
                }}
                dense
              >
                <span>Date: ___________________________________________</span>
              </ListItem>
            </List>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ padding: "2em" }}>
        <Button variant="outlined" onClick={backPrintHandler} disableElevation>Back</Button>

        <Button variant="contained" startIcon={<Print />} onClick={onPrintHandler} disableElevation>Print</Button>
      </DialogActions>
    </Dialog>
  )
}

// const DATA = {
//   transaction: {
//     id: 2,
//     is_latest_transaction: 1,
//     request_id: 2,
//     no: "MIS002",
//     date_requested: "2023-10-23 22:49:15",
//     status: "approve-receive",
//     state: "approve"
//   },
//   reason: {
//     id: null,
//     description: null,
//     remarks: null,
//     date: null
//   },
//   requestor: {
//     id: 99,
//     id_prefix: "RDFFLFI",
//     id_no: 11146,
//     role: "Requestor",
//     position: "ENTRY LEVEL DEVELOPER",
//     first_name: "JEROME",
//     middle_name: "HERNANDEZ",
//     last_name: "PERONA",
//     suffix: null,
//     department: "MANAGEMENT INFORMATION SYSTEM"
//   },
//   document: {
//     id: 1,
//     name: "PAD",
//     no: "pad#1001",
//     date: "2023-10-23 00:00:00",
//     payment_type: "Full",
//     amount: 1000,
//     remarks: "PAD test 1",
//     category: {
//       id: 1,
//       name: "common"
//     },
//     company: {
//       id: 1,
//       name: "RDF Corporate Services"
//     },
//     department: {
//       id: 3,
//       name: "Corporate Common"
//     },
//     location: {
//       id: 2,
//       name: "Head Office"
//     },
//     supplier: {
//       id: 1127,
//       name: "CENON D. TUBIL JR."
//     },
//     business_unit: {
//       id: null,
//       name: null
//     },
//     sub_unit: {
//       id: null,
//       name: null
//     }
//   },
//   autoDebit_group: [],
//   po_group: [
//     {
//       id: 1,
//       no: "PO#1002",
//       amount: 500,
//       rr_no: [
//         "888"
//       ],
//       request_id: 2,
//       is_editable: 1,
//       previous_balance: 500
//     },
//     {
//       id: 2,
//       no: "PO#1001",
//       amount: 500,
//       rr_no: [
//         "888"
//       ],
//       request_id: 2,
//       is_editable: 1,
//       previous_balance: 500
//     }
//   ],
//   tag: {
//     status: "tag-tag",
//     receipt_type: "Unofficial",
//     no: 1,
//     dates: {
//       received: "2023-10-24T00:40:53.000000Z",
//       tagged: "2023-10-24T00:47:18.000000Z"
//     },
//     distributed_to: {
//       id: 15,
//       name: "LORENZO YUMUL"
//     },
//     reason: null
//   },
//   voucher: {
//     status: "voucher-voucher",
//     no: "2310-002",
//     dates: {
//       transfered: null,
//       received: "2023-10-24T00:48:23.000000Z",
//       vouchered: "2023-10-24T01:49:51.000000Z"
//     },
//     month: "2023-10-24 00:00:00",
//     receipt_type: null,
//     accounts: [
//       {
//         id: 15,
//         entry: "Debit",
//         account_title: {
//           id: 817,
//           code: "561050",
//           name: "GA - Meeting Expenses"
//         },
//         amount: 1000,
//         remarks: null,
//         company: {
//           id: 1,
//           name: "RDF Corporate Services",
//           code: "10"
//         },
//         department: {
//           id: 3,
//           name: "Corporate Common",
//           code: "0010"
//         },
//         location: {
//           id: 2,
//           name: "Head Office",
//           code: "0001"
//         },
//         business_unit: {
//           id: null,
//           name: null,
//           code: null
//         },
//         sub_unit: {
//           id: null,
//           name: null,
//           code: null
//         }
//       },
//       {
//         id: 15,
//         entry: "Credit",
//         account_title: {
//           id: 380,
//           code: "211101",
//           name: "Accounts Payable"
//         },
//         amount: 1000,
//         remarks: null,
//         company: {
//           id: 1,
//           name: "RDF Corporate Services",
//           code: "10"
//         },
//         department: {
//           id: 3,
//           name: "Corporate Common",
//           code: "0010"
//         },
//         location: {
//           id: 2,
//           name: "Head Office",
//           code: "0001"
//         },
//         business_unit: {
//           id: null,
//           name: null,
//           code: null
//         },
//         sub_unit: {
//           id: null,
//           name: null,
//           code: null
//         }
//       }
//     ],
//     approver: {
//       id: 80,
//       name: "REDEN CUNANAN"
//     },
//     reason: null
//   },
//   approve: {
//     dates: {
//       received: "2023-10-24T01:48:01.000000Z",
//       approved: null
//     },
//     status: "approve-receive",
//     distributed_to: {
//       id: 15,
//       name: "LORENZO YUMUL"
//     },
//     reason: null
//   }
// }

export default PrintDialog