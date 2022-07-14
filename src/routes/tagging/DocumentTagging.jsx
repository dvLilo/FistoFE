import React from 'react'

import moment from 'moment'

import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  TablePagination,
  Tabs,
  Tab,
  Stack,
  Chip
} from '@mui/material'

import {
  Search,
  Close
} from '@mui/icons-material'

import useConfirm from '../../hooks/useConfirm'

import DocumentTaggingFilter from './DocumentTaggingFilter'
import DocumentTaggingActions from './DocumentTaggingActions'
import DocumentTaggingTransaction from './DocumentTaggingTransaction'

const data = [
  {
    "id": 1,
    "users_id": 2,
    "request_id": 1,
    "document_id": 1,
    "transaction_id": "MISC001",
    "tag_id": "1000159",
    "document_type": "PAD",
    "payment_type": "Full",
    "supplier": "1st Advenue Advertising",
    "remarks": "Fisto test transaction.",
    "date_requested": "2022-06-29 09:07:37",
    "company": "RDF Corporate Services",
    "department": "Management Information System Common",
    "location": "Common",
    "document_no": "pad#11001",
    "document_amount": 50000,
    "referrence_no": null,
    "referrence_amount": null,
    "status": "Pending",
    "users": {
      "id": 2,
      "first_name": "VINCENT LOUIE",
      "middle_name": "LAYNES",
      "last_name": "ABAD",
      "position": "System Developer",
      "department": [
        {
          "id": 12,
          "name": "Management Information System Common"
        },
        {
          "id": 3,
          "name": "Management Information System"
        }
      ]
    },
    "po_details": [
      {
        "id": 50,
        "request_id": 1,
        "po_no": "PO#11002",
        "po_total_amount": 50000
      },
      {
        "id": 51,
        "request_id": 1,
        "po_no": "PO#11001",
        "po_total_amount": 50000
      }
    ]
  }
]

const DocumentTagging = () => {

  const confirm = useConfirm()

  const [state, setState] = React.useState("request")

  const [manage, setManage] = React.useState({
    data: null,
    open: false,
    onClose: () => setManage(currentValue => ({
      ...currentValue,
      open: false
    }))
  })

  const onReceive = (ID) => {
    confirm({
      open: true,
      onConfirm: () => console.log("Transaction", ID, "has been received.")
    })
  }

  const onManage = (data) => {
    setManage(currentValue => ({
      ...currentValue,
      data,
      open: true
    }))
  }

  const onView = (data) => {
    setManage(currentValue => ({
      ...currentValue,
      data,
      open: true
    }))
  }

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperTable-root" elevation={1}>
        <Box className="FstoBoxToolbar2-root">
          <Box className="FstoBoxToolbar-left">
            <Typography variant="heading">Tagging of Documents</Typography>
          </Box>

          <Box className="FstoBoxToolbar-right">
            <Tabs
              className="FstoTabsToolbar-root"
              value={state}
              onChange={(e, value) => setState(value)}
              TabIndicatorProps={{
                className: "FstoTabsIndicator-root",
                children: <span className="FstoTabsIndicator-root" />
              }}
            >
              <Tab className="FstoTab-root" label="Requested" value="request" disableRipple />
              <Tab className="FstoTab-root" label="Received" value="receive" disableRipple />
              <Tab className="FstoTab-root" label="Tagged" value="tag" disableRipple />
              <Tab className="FstoTab-root" label="Held" value="hold" disableRipple />
              <Tab className="FstoTab-root" label="Voided" value="void" disableRipple />
            </Tabs>

            <Stack className="FstoStackToolbar-root" direction="row">
              <TextField
                className="FstoTextFieldToolbar-root"
                variant="outlined"
                size="small"
                autoComplete="off"
                placeholder="Search"
                InputProps={{
                  className: "FstoTextfieldSearch-root",
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => { }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                onChange={(e) => console.log(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") console.log(e.target.value)
                }}
              />

              <DocumentTaggingFilter />
            </Stack>
          </Box>
        </Box>

        <TableContainer className="FstoTableContainer-root">
          <Table className="FstoTable-root" size="small">
            <TableHead className="FstoTableHead-root">
              <TableRow className="FstoTableRow-root">
                <TableCell className="FstoTableCell-root FstoTableCell-head">
                  <TableSortLabel active={false}>TRANSACTION</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">
                  <TableSortLabel active={false}>REQUESTOR</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">
                  <TableSortLabel active={false}>CHARGING</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">
                  <TableSortLabel active={false}>AMOUNT DETAILS</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">
                  <TableSortLabel active={false}>PO DETAILS</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head" align="center">STATUS</TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head" align="center">ACTIONS</TableCell>
              </TableRow>
            </TableHead>

            <TableBody className="FstoTableBody-root">
              {
                data.map((item, index) => (
                  <TableRow className="FstoTableRow-root" key={index} hover>
                    <TableCell className="FstoTableCell-root FstoTableCell-body">
                      <Typography variant="button" sx={{ display: `flex`, alignItems: `center`, fontWeight: 700, lineHeight: 1.25 }}>
                        {
                          state === `tag` ? `TAG#${item.tag_id}` : item.transaction_id
                        }
                        &nbsp;&mdash;&nbsp;
                        {item.document_type}
                        {
                          item.document_id === 4 &&
                          item.payment_type.toLowerCase() === `partial` &&
                          <Chip label={item.payment_type} size="small" sx={{ height: `20px`, marginLeft: `5px`, textTransform: `capitalize`, fontWeight: 500 }} />
                        }
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: `1.25em`, textTransform: `uppercase`, lineHeight: 1.55 }}>{item.supplier}</Typography>
                      <Typography variant="h6" sx={{ marginTop: `5px`, fontWeight: 700, lineHeight: 1 }}>
                        {
                          item.remarks
                            ? item.remarks
                            : <React.Fragment>&mdash;</React.Fragment>
                        }
                      </Typography>
                      <Typography variant="caption" sx={{ lineHeight: 1.65 }}>{moment(item.date_requested).format("YYYY-MM-DD hh:mm A")}</Typography>
                    </TableCell>

                    <TableCell className="FstoTableCell-root FstoTableCell-body">
                      <Typography variant="subtitle1" sx={{ textTransform: `capitalize` }}>{item.users.first_name.toLowerCase()} {item.users.middle_name.toLowerCase()} {item.users.last_name.toLowerCase()}</Typography>
                      <Typography variant="subtitle2">{item.users.department[0].name}</Typography>
                      <Typography variant="subtitle2">{item.users.position}</Typography>
                    </TableCell>

                    <TableCell className="FstoTableCell-root FstoTableCell-body">
                      <Typography variant="subtitle1">{item.company}</Typography>
                      <Typography variant="subtitle2">{item.department}</Typography>
                      <Typography variant="subtitle2">{item.location}</Typography>
                    </TableCell>

                    <TableCell className="FstoTableCell-root FstoTableCell-body">
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        {item.document_id !== 4 && item.document_no?.toUpperCase()}
                        {item.document_id === 4 && item.referrence_no?.toUpperCase()}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        &#8369;
                        {item.document_id !== 4 && item.document_amount?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                        {item.document_id === 4 && item.referrence_amount?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                      </Typography>
                    </TableCell>

                    <TableCell className="FstoTableCell-root FstoTableCell-body">
                      {
                        item.po_details.length
                          ? <React.Fragment>
                            <Typography variant="caption" sx={{ fontWeight: 500 }}>{item.po_details[0].po_no.toUpperCase()}{item.po_details.length > 1 && '...'}</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>&#8369;{item.po_details[0].po_total_amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Typography>
                          </React.Fragment>
                          : <React.Fragment>&mdash;</React.Fragment>
                      }
                    </TableCell>

                    <TableCell className="FstoTableCell-root FstoTableCell-body" align="center">
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.status}</Typography>
                    </TableCell>

                    <TableCell className="FstoTableCell-root FstoTableCell-body" align="center">
                      <DocumentTaggingActions
                        data={item}
                        state={state}
                        onReceive={onReceive}
                        onManage={onManage}
                        onView={onView}
                      />
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          className="FstoTablePagination-root"
          component="div"
          count={0}
          page={0}
          rowsPerPage={10}
          onPageChange={(e, page) => console.log(page)}
          onRowsPerPageChange={(e) => console.log(e.target.value)}
          rowsPerPageOptions={[10, 20, 50, 100]}
          showFirstButton
          showLastButton
        />

        <DocumentTaggingTransaction state={state} {...manage} />
      </Paper>
    </Box>
  )
}

export default DocumentTagging