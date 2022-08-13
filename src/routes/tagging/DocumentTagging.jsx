import React from 'react'

import axios from 'axios'

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

import useToast from '../../hooks/useToast'
import useConfirm from '../../hooks/useConfirm'
import useTransactions from '../../hooks/useTransactions'

import {
  TAG,
  RECEIVE,
  HOLD,
  UNHOLD,
  RETURN,
  UNRETURN,
  VOID
} from '../../constants'

import ReasonDialog from '../../components/ReasonDialog'
import TablePreloader from '../../components/TablePreloader'

import DocumentTaggingFilter from './DocumentTaggingFilter'
import DocumentTaggingActions from './DocumentTaggingActions'
import DocumentTaggingTransaction from './DocumentTaggingTransaction'

const DocumentTagging = () => {

  const {
    status,
    data,
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
    onClose: () => setReason(currentValue => ({
      ...currentValue,
      open: false
    }))
  })

  const [manage, setManage] = React.useState({
    open: false,
    transaction: null,
    onClose: () => setManage(currentValue => ({
      ...currentValue,
      open: false
    }))
  })

  const onReceive = (ID) => {
    confirm({
      open: true,
      wait: true,
      onConfirm: async () => {
        let response
        try {
          response = await axios.post(`/api/transactions/flow/update-transaction/${ID}`, {
            process: TAG,
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

  const onManage = (transaction) => {
    setManage(currentValue => ({
      ...currentValue,
      transaction,
      open: true
    }))
  }

  const onView = (transaction) => {
    setManage(currentValue => ({
      ...currentValue,
      transaction,
      open: true
    }))
  }

  const onHold = (data) => {
    setReason(currentValue => ({
      ...currentValue,
      open: true,
      process: TAG,
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
          response = await axios.post(`/api/transactions/flow/update-transaction/${ID}`, {
            process: TAG,
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
      process: TAG,
      subprocess: RETURN,
      data,
    }))
  }

  const onCancel = (ID) => {
    confirm({
      open: true,
      wait: true,
      onConfirm: async () => {
        let response
        try {
          response = await axios.post(`/api/transactions/flow/update-transaction/${ID}`, {
            process: TAG,
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

  const onVoid = (data) => {
    setReason(currentValue => ({
      ...currentValue,
      open: true,
      process: TAG,
      subprocess: VOID,
      data,
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
              onChange={(e, value) => {
                setState(value)
                changeStatus(value)
              }}
              TabIndicatorProps={{
                className: "FstoTabsIndicator-root",
                children: <span className="FstoTabsIndicator-root" />
              }}
            >
              <Tab className="FstoTab-root" label="Requested" value="pending" disableRipple />
              <Tab className="FstoTab-root" label="Received" value="tag-receive" disableRipple />
              <Tab className="FstoTab-root" label="Tagged" value="tag-tag" disableRipple />
              <Tab className="FstoTab-root" label="Held" value="tag-hold" disableRipple />
              <Tab className="FstoTab-root" label="Returned" value="tag-return" disableRipple />
              <Tab className="FstoTab-root" label="Voided" value="tag-void" disableRipple />
            </Tabs>

            <Stack className="FstoStackToolbar-root" direction="row">
              <TextField
                className="FstoTextFieldToolbar-root"
                variant="outlined"
                size="small"
                autoComplete="off"
                placeholder="Search"
                value={search}
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
                        disabled={!Boolean(search)}
                        onClick={() => {
                          setSearch("")
                          searchData(null)
                        }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") searchData(e.target.value)
                }}
              />

              <DocumentTaggingFilter filterData={filterData} />
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
                status === 'loading'
                && <TablePreloader row={3} />}

              {
                status === 'error'
                && <TableRow><TableCell align="center" colSpan={7}>NO RECORDS FOUND</TableCell></TableRow>}

              {
                status === 'success'
                && data.data.map((item, index) => {
                  let statusColor
                  switch (item.status) {
                    case `tag`:
                      statusColor = `#3a2fa7`
                      break;

                    case `receive`:
                      statusColor = `#949494`
                      break;

                    case `hold`:
                    case `return`:
                    case `void`:
                      statusColor = `#ff5252`
                      break;

                    default:
                      statusColor = `#ed6c02`
                  }

                  return (
                    <TableRow className="FstoTableRow-root" key={index} hover>
                      <TableCell className="FstoTableCell-root FstoTableCell-body">
                        <Typography variant="button" sx={{ display: `flex`, alignItems: `center`, fontWeight: 700, lineHeight: 1.25 }}>
                          {
                            state === `tag-tag` ? `TAG#${item.tag_no}` : item.transaction_id
                          }
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
                              <Typography variant="caption" sx={{ fontWeight: 500 }}>{item.po_details[0].po_no.toUpperCase()}{item.po_details.length > 1 && `...`}</Typography>
                              <Typography variant="h6" sx={{ fontWeight: 700 }}>&#8369;{item.po_details[0].po_total_amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Typography>
                            </React.Fragment>
                            : <React.Fragment>
                              &mdash;
                            </React.Fragment>
                        }
                      </TableCell>

                      <TableCell className="FstoTableCell-root FstoTableCell-body" align="center">
                        <Chip label={item.status} size="small" sx={{ backgroundColor: statusColor, minWidth: 60, color: `#fff`, textTransform: `capitalize`, fontWeight: 500 }} />
                      </TableCell>

                      <TableCell className="FstoTableCell-root FstoTableCell-body" align="center">
                        <DocumentTaggingActions
                          data={item}
                          state={state}
                          onReceive={onReceive}
                          onCancel={onCancel}
                          onManage={onManage}
                          onView={onView}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}

            </TableBody>
          </Table>
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

        <DocumentTaggingTransaction state={state} refetchData={refetchData} onHold={onHold} onUnhold={onUnhold} onReturn={onReturn} onVoid={onVoid} {...manage} />

        <ReasonDialog onSuccess={refetchData} {...reason} />
      </Paper>
    </Box>
  )
}

export default DocumentTagging