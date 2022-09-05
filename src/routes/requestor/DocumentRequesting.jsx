import React from 'react'

import axios from 'axios'

import moment from 'moment'
import business from 'moment-business'

import { Link, useNavigate } from 'react-router-dom'

import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Button,
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
  Tooltip
} from '@mui/material'

import {
  Search,
  Close,
  Add,
  Error
} from '@mui/icons-material'

import useToast from '../../hooks/useToast'
import useTransactions from '../../hooks/useTransactions'

import TablePreloader from '../../components/TablePreloader'
import ReasonDialog from '../../components/ReasonDialog'

import DocumentRequestingActions from './DocumentRequestingActions'
import DocumentRequestingFilter from './DocumentRequestingFilter'
import DocumentRequestingTransaction from './DocumentRequestingTransaction'

const DocumentRequesting = () => {

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

  const navigate = useNavigate()

  const toast = useToast()

  const [active, setActive] = React.useState(true)
  const [state, setState] = React.useState("pending")
  const [search, setSearch] = React.useState("")

  const [view, setView] = React.useState({
    open: false,
    transaction: null,
    onClose: () => setView(currentValue => ({
      ...currentValue,
      open: false
    }))
  })

  const [reason, setReason] = React.useState({
    data: null,
    open: false,
    onClose: () => setReason(currentValue => ({
      ...currentValue,
      open: false
    }))
  })

  React.useEffect(() => {
    (async () => {
      try {
        await axios.post(`/api/users/department-validation`)

        setActive(false)
      }
      catch (error) {
        if (error.request.status === 404) {
          setActive(true)

          toast({
            title: "Error!",
            message: "Your department is not registered. Please inform the technical support.",
            severity: "error",
            duration: null
          })
        }

        if (error.request.status !== 404)
          toast({
            title: "Error!",
            message: "Something went wrong whilst validation user department.",
            severity: "error"
          })
      }
    })()
    // eslint-disable-next-line
  }, [])

  const onView = (transaction) => setView(currentValue => ({
    ...currentValue,
    transaction,
    open: true
  }))

  const onUpdate = (data) => {
    const { id } = data

    navigate(`/request/update-request/${id}`)
  }

  const onVoid = (data) => setReason(currentValue => ({
    ...currentValue,
    data,
    open: true
  }))


  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperTable-root" elevation={1}>
        <Box className="FstoBoxToolbar2-root">
          <Box className="FstoBoxToolbar-left">
            <Typography variant="heading">Creation of Request</Typography>

            <Button
              className="FstoButtonNew-root"
              variant="contained"
              component={Link}
              startIcon={<Add />}
              to="new-request"
              disabled={active}
              disableElevation
            >
              New
            </Button>
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
              <Tab className="FstoTab-root" label="Voided" value="requestor-void" disableRipple />
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

              <DocumentRequestingFilter filterData={filterData} />
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
                && data.data.map((data, index) => {

                  const currentDate = moment()
                  const estimatedReleaseDate = business.addWeekDays(moment(data.date_requested), data.supplier.supplier_type.transaction_days)

                  return (
                    <TableRow className="FstoTableRow-root" key={index} hover>
                      <TableCell className="FstoTableCell-root FstoTableCell-body">
                        <Typography variant="button" sx={{ display: `flex`, alignItems: `center`, marginBottom: `5px`, fontWeight: 700, lineHeight: 1.25 }}>
                          {data.transaction_id}
                          &nbsp;&mdash;&nbsp;
                          {data.document_type}
                          {
                            data.document_id === 4 && data.payment_type.toLowerCase() === `partial` &&
                            <Chip label={data.payment_type} size="small" sx={{ height: `20px`, marginLeft: `5px`, textTransform: `capitalize`, fontWeight: 500 }} />
                          }
                          {
                            Boolean(data.is_latest_transaction) &&
                            <Chip label="Latest" size="small" color="primary" sx={{ height: `20px`, marginLeft: `5px`, textTransform: `capitalize`, fontWeight: 500 }} />
                          }
                        </Typography>
                        <Typography variant="caption" sx={{ display: `flex`, alignItems: `center`, fontSize: `1.25em`, textTransform: `uppercase`, lineHeight: 1.55 }}>
                          {data.supplier.name}
                          {
                            data.supplier.supplier_type.id === 1 &&
                            <Chip label={data.supplier.supplier_type.name} size="small" color="primary" sx={{ height: `20px`, marginLeft: `5px`, textTransform: `capitalize`, fontWeight: 500 }} />
                          }
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
                          {
                            data.remarks
                              ? data.remarks
                              : <React.Fragment>&mdash;</React.Fragment>
                          }
                        </Typography>
                        <Typography variant="caption" sx={{ display: `flex`, alignItems: `center`, lineHeight: 1.65 }}>
                          Estimated Release Date:&nbsp;
                          <strong>
                            {estimatedReleaseDate.format("MMMM DD, YYYY")}
                          </strong>&nbsp;
                          <i>
                            {currentDate.to(estimatedReleaseDate)}
                          </i>
                          {currentDate.to(estimatedReleaseDate).match(/ago/gi) && <Error color="error" fontSize="small" sx={{ marginLeft: `3px` }} />}
                        </Typography>
                      </TableCell>

                      <TableCell className="FstoTableCell-root FstoTableCell-body">
                        <Typography variant="subtitle1" sx={{ textTransform: `capitalize` }}>{data.users.first_name.toLowerCase()} {data.users.middle_name.toLowerCase()} {data.users.last_name.toLowerCase()}</Typography>
                        <Typography variant="subtitle2">{data.users.department[0].name}</Typography>
                        <Typography variant="subtitle2">{data.users.position}</Typography>
                      </TableCell>

                      <TableCell className="FstoTableCell-root FstoTableCell-body">
                        <Typography variant="subtitle1">{data.company}</Typography>
                        <Typography variant="subtitle2">{data.department}</Typography>
                        <Typography variant="subtitle2">{data.location}</Typography>
                      </TableCell>

                      <TableCell className="FstoTableCell-root FstoTableCell-body">
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                          {data.document_id !== 4 && data.document_no?.toUpperCase()}
                          {data.document_id === 4 && data.referrence_no?.toUpperCase()}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          &#8369;
                          {data.document_id !== 4 && data.document_amount?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                          {data.document_id === 4 && data.referrence_amount?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                        </Typography>
                      </TableCell>

                      <TableCell className="FstoTableCell-root FstoTableCell-body">
                        {
                          data.po_details.length
                            ? <React.Fragment>
                              <Typography variant="caption" sx={{ fontWeight: 500 }}>{data.po_details[0].po_no.toUpperCase()}{data.po_details.length > 1 && '...'}</Typography>
                              <Typography variant="h6" sx={{ fontWeight: 700 }}>&#8369;{data.po_details[0].po_total_amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Typography>
                            </React.Fragment>
                            : <React.Fragment>&mdash;</React.Fragment>
                        }
                      </TableCell>

                      <TableCell className="FstoTableCell-root FstoTableCell-body" align="center">
                        <Tooltip title="Hello world. Hello, Fisto!" disableInteractive disableFocusListener arrow>
                          <Chip label={data.status} size="small" color="warning" sx={{ textTransform: `capitalize`, fontWeight: 500 }} />
                        </Tooltip>
                      </TableCell>

                      <TableCell className="FstoTableCell-root FstoTableCell-body" align="center">
                        <DocumentRequestingActions
                          state={state}
                          data={data}
                          onView={onView}
                          onUpdate={onUpdate}
                          onVoid={onVoid}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })
              }
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

        <DocumentRequestingTransaction {...view} />

        <ReasonDialog onSuccess={refetchData} {...reason} />
      </Paper>
    </Box>
  )
}

export default DocumentRequesting