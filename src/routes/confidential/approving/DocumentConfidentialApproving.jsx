import React from 'react'

import axios from 'axios'

import moment from 'moment'

import {
  Box,
  Paper,
  Typography,
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
  Chip,
  Divider,
  OutlinedInput
} from '@mui/material'

import {
  Search,
  Close
} from '@mui/icons-material'

import statusColor from '../../../colors/statusColor'

import useToast from '../../../hooks/useToast'
import useConfirm from '../../../hooks/useConfirm'
import useTransactions from '../../../hooks/useTransactions'

import {
  APPROVAL,
  RECEIVE,
  HOLD,
  UNHOLD,
  RETURN,
  UNRETURN
} from '../../../constants'

import EmptyImage from '../../../assets/img/empty.svg'

import FilterPopover from '../../../components/FilterPopover'
import ReasonDialog from '../../../components/ReasonDialog'
import TablePreloader from '../../../components/TablePreloader'

import DocumentConfidentialApprovingTransaction from './DocumentConfidentialApprovingTransaction'
import DocumentConfidentialApprovingActions from './DocumentConfidentialApprovingActions'

const DocumentConfidentialApproving = () => {

  const {
    // status,
    // data,
    refetchData,
    searchData,
    filterData,
    changeStatus,
    changePage,
    changeRows
  } = useTransactions("/api/transactions")

  const toast = useToast()
  const confirm = useConfirm()

  const [search, setSearch] = React.useState("")
  const [state, setState] = React.useState("pending")

  const [reason, setReason] = React.useState({
    open: false,
    data: null,
    process: null,
    subprocess: null,
    onSuccess: refetchData,
    onClose: () => setReason(currentValue => ({
      ...currentValue,
      open: false
    }))
  })

  const [manage, setManage] = React.useState({
    open: false,
    transaction: null,
    onBack: undefined,
    onClose: () => setManage(currentValue => ({
      ...currentValue,
      open: false
    }))
  })

  const onManage = (transaction) => {
    setManage(currentValue => ({
      ...currentValue,
      transaction,
      open: true,
      onBack: onManage
    }))
  }

  const onView = (transaction) => {
    setManage(currentValue => ({
      ...currentValue,
      transaction,
      open: true,
      onBack: onView
    }))
  }

  const onReceive = (ID) => {
    confirm({
      open: true,
      wait: true,
      onConfirm: async () => {
        let response
        try {
          response = await axios.post(`/api/transactions/flow/update-transaction/DELETE-ME-LATER/${ID}`, {
            process: APPROVAL,
            subprocess: RECEIVE
          })

          const { message } = response.data

          refetchData()
          toast({
            message,
            title: "Success!"
          })
        } catch (error) {
          console.log("Fisto Error Status", error.request)

          toast({
            severity: "error",
            title: "Error!",
            message: "Something went wrong whilst trying to receive transaction. Please try again later."
          })
        }
      }
    })
  }

  const onHold = (data) => {
    setReason(currentValue => ({
      ...currentValue,
      open: true,
      process: APPROVAL,
      subprocess: HOLD,
      data,
    }))
  }

  const onUnhold = (ID) => {
    confirm({
      open: true,
      wait: true,
      onConfirm: async () => {
        let response
        try {
          response = await axios.post(`/api/transactions/flow/update-transaction/DELETE-ME-LATER/${ID}`, {
            process: APPROVAL,
            subprocess: UNHOLD
          })

          const { message } = response.data

          refetchData()
          toast({
            message,
            title: "Success!"
          })
        } catch (error) {
          console.log("Fisto Error Status", error.request)

          toast({
            severity: "error",
            title: "Error!",
            message: "Something went wrong whilst trying to unhold transaction. Please try again later."
          })
        }
      }
    })
  }

  const onReturn = (data) => {
    setReason(currentValue => ({
      ...currentValue,
      open: true,
      process: APPROVAL,
      subprocess: RETURN,
      data,
    }))
  }

  const onUnreturn = (ID) => {
    confirm({
      open: true,
      wait: true,
      onConfirm: async () => {
        let response
        try {
          response = await axios.post(`/api/transactions/flow/update-transaction/DELETE-ME-LATER/${ID}`, {
            process: APPROVAL,
            subprocess: UNRETURN
          })

          const { message } = response.data

          refetchData()
          toast({
            message,
            title: "Success!"
          })
        } catch (error) {
          console.log("Fisto Error Status", error.request)

          toast({
            severity: "error",
            title: "Error!",
            message: "Something went wrong whilst trying to cancel return transaction. Please try again later."
          })
        }
      }
    })
  }

  const status = 'success'
  const data = {
    total: 1,
    per_page: 10,
    current_page: 1,
    data: [
      {
        id: 1,
        tag_no: 2,
        is_latest_transaction: 0,
        users_id: 2,
        request_id: 1,
        supplier_id: 30,
        document_id: 1,
        transaction_id: "MISC001",
        document_type: "PAD",
        payment_type: "Full",
        supplier: {
          id: 30,
          name: "1ST ADVENUE ADVERTISING",
          supplier_type: {
            id: 2,
            name: "rush",
            transaction_days: 7
          }
        },
        remarks: "swfattener lara: growing performance form, weekly fattener inventory form",
        date_requested: "2022-06-29 09:07:37",
        company_id: 1,
        company: "RDF Corporate Services",
        department: "Management Information System Common",
        location: "Common",
        document_no: "pad#11001",
        document_amount: 50000,
        referrence_no: null,
        referrence_amount: null,
        status: "pending",
        ...(Boolean(state.match(/-receive.*/)) && { status: "receive" }),
        ...(Boolean(state.match(/-approve.*/)) && { status: "approve" }),
        ...(Boolean(state.match(/-hold.*/)) && { status: "hold" }),
        ...(Boolean(state.match(/-return.*/)) && { status: "return" }),
        users: {
          id: 2,
          first_name: "VINCENT LOUIE",
          middle_name: "LAYNES",
          last_name: "ABAD",
          department: [
            {
              id: 12,
              name: "Management Information System Common"
            },
            {
              id: 3,
              name: "Management Information System"
            }
          ],
          position: "System Developer"
        },
        po_details: [
          {
            id: 50,
            request_id: 1,
            po_no: "PO#11002",
            po_total_amount: 50000
          },
          {
            id: 51,
            request_id: 1,
            po_no: "PO#11001",
            po_total_amount: 50000
          }
        ]
      }
    ]
  }

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperTable-root" elevation={1}>
        <Stack className="FstoStackToolbar-root" justifyContent="space-between" gap={2}>
          <Stack className="FstoStackToolbar-item" direction="row" justifyContent="center" gap={2}>
            <Typography variant="heading">
              Transaction Approval
            </Typography>
          </Stack>

          <Stack className="FstoStackToolbar-item" direction="column" justifyContent="center" gap={1}>
            <Tabs
              className="FstoTabsToolbar-root"
              value={state}
              onChange={(e, value) => {
                setState(value)
                changeStatus(value)
              }}
              TabIndicatorProps={{
                className: "FstoTabsIndicator-root",
                children: <span className="FstoTabsIndicator-root" />
              }}
            >
              <Tab className="FstoTab-root" label="Pending" value="pending" disableRipple />
              <Tab className="FstoTab-root" label="Received" value="approve-receive" disableRipple />
              <Tab className="FstoTab-root" label="Approved" value="approve-approve" disableRipple />
              <Tab className="FstoTab-root" label="Held" value="approve-hold" disableRipple />
              <Tab className="FstoTab-root" label="Returned" value="approve-return" disableRipple />
            </Tabs>

            <Stack direction="row" alignItems="center" justifyContent="center" gap={1}>
              <OutlinedInput
                className="FstoTextFieldSearch-root"
                size="small"
                autoComplete="off"
                placeholder="Search"
                value={search}
                startAdornment={
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      size="small"
                      disabled={
                        !Boolean(search)
                      }
                      onClick={() => {
                        setSearch("")
                        searchData(null)
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                }
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") searchData(e.target.value)
                }}
              />

              <FilterPopover onFilter={filterData} />
            </Stack>
          </Stack>
        </Stack>

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

            <TableBody>
              {
                status === 'loading'
                && <TablePreloader row={3} />}

              {
                status === 'success'
                && data.data.map((item, index) => (
                  <TableRow className="FstoTableRow-root" key={index} hover>
                    <TableCell className="FstoTableCell-root FstoTableCell-body">
                      <Typography variant="button" sx={{ display: `flex`, alignItems: `center`, fontWeight: 700, lineHeight: 1.25 }}>
                        TAG#{item.tag_no}
                        &nbsp;&mdash;&nbsp;
                        {item.document_type}
                        {
                          item.document_id === 4 && item.payment_type.toLowerCase() === `partial` &&
                          <Chip label={item.payment_type} size="small" sx={{ height: `20px`, marginLeft: `5px`, textTransform: `capitalize`, fontWeight: 500 }} />
                        }
                        {
                          Boolean(item.is_latest_transaction) &&
                          <Chip label="Latest" size="small" color="primary" sx={{ height: `20px`, marginLeft: `5px`, textTransform: `capitalize`, fontWeight: 500 }} />
                        }
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: `1.25em`, textTransform: `uppercase`, lineHeight: 1.55 }}>
                        {item.supplier.name}
                        {
                          item.supplier.supplier_type.id === 1 &&
                          <Chip label={item.supplier.supplier_type.name} size="small" color="primary" sx={{ height: `20px`, marginLeft: `5px`, textTransform: `capitalize`, fontWeight: 500 }} />
                        }
                      </Typography>
                      <Typography variant="h6" sx={{ marginTop: `4px`, marginBottom: `4px`, fontSize: `1.35em`, fontWeight: 700, lineHeight: 1 }}>
                        {
                          item.remarks
                            ? item.remarks
                            : <React.Fragment>&mdash;</React.Fragment>
                        }
                      </Typography>
                      <Typography variant="caption" sx={{ lineHeight: 1.65 }}>{moment(item.date_requested).format("YYYY-MM-DD hh:mm A")}</Typography>
                    </TableCell>

                    <TableCell className="FstoTableCell-root FstoTableCell-body">
                      <Typography variant="subtitle1" sx={{ textTransform: `capitalize` }}>{item.users.first_name.toLowerCase()} {item.users.middle_name?.toLowerCase()} {item.users.last_name.toLowerCase()}</Typography>
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
                            <Typography variant="caption" sx={{ fontWeight: 500 }}>{item.po_details[0].po_no.toUpperCase()}{item.po_details.length > 1 && `...`}</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>&#8369;{item.po_details[0].po_total_amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Typography>
                          </React.Fragment>
                          : <React.Fragment>
                            &mdash;
                          </React.Fragment>
                      }
                    </TableCell>

                    <TableCell className="FstoTableCell-root FstoTableCell-body" align="center">
                      <Chip label={item.status} size="small" sx={{ backgroundColor: statusColor(item.status), minWidth: 60, color: `#fff`, textTransform: `capitalize`, fontWeight: 500 }} />
                    </TableCell>

                    <TableCell className="FstoTableCell-root FstoTableCell-body" align="center">
                      <DocumentConfidentialApprovingActions
                        data={item}
                        state={state}
                        onReceive={onReceive}
                        onCancel={onUnreturn}
                        onManage={onManage}
                        onView={onView}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {
            status === 'error' &&
            <React.Fragment>
              <Divider variant="fullWidth" />

              <Box className="FstoTableBox-root">
                <img alt="No Data" src={EmptyImage} />
                <Typography variant="body1">NO RECORDS FOUND</Typography>
              </Box>
            </React.Fragment>}

        </TableContainer>

        <TablePagination
          className="FstoTablePagination-root"
          component="div"
          count={data ? data.total : 0}
          page={data ? data.current_page - 1 : 0}
          rowsPerPage={data ? data.per_page : 10}
          onPageChange={(e, page) => changePage(page)}
          onRowsPerPageChange={(e) => changeRows(e.target.value)}
          rowsPerPageOptions={[10, 20, 50, 100]}
          showFirstButton
          showLastButton
        />

        <DocumentConfidentialApprovingTransaction
          {...manage}
          state={state}
          refetchData={refetchData}
          onHold={onHold}
          onUnhold={onUnhold}
          onReturn={onReturn}
        />

        <ReasonDialog {...reason} />
      </Paper>
    </Box>
  )
}

export default DocumentConfidentialApproving