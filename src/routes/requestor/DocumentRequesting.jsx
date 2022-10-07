import React from 'react'

import axios from 'axios'

import moment from 'moment'
import business from 'moment-business'

import { Link, useNavigate } from 'react-router-dom'

import {
  Box,
  Paper,
  Typography,
  InputAdornment,
  Button,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Tabs,
  Tab,
  Stack,
  Chip,
  Tooltip,
  OutlinedInput,
  Divider
} from '@mui/material'

import {
  Search,
  Close,
  Add,
  Error
} from '@mui/icons-material'

import EmptyImage from '../../assets/img/empty.svg'

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
        <Stack className="FstoStackToolbar-root" justifyContent="space-between" gap={2}>
          <Stack className="FstoStackToolbar-item" direction="row" alignItems="center" justifyContent="center" gap={2}>
            <Typography variant="heading">
              Creation of Request
            </Typography>

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
          </Stack>

          <Stack className="FstoStackToolbar-item" direction="row" alignItems="center" justifyContent="center" gap={1}>
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

            <DocumentRequestingFilter filterData={filterData} />
          </Stack>
        </Stack>

        <TableContainer className="FstoTableContainer-root">
          <Table className="FstoTable-root" size="small">
            <TableHead className="FstoTableHead-root">
              <TableRow className="FstoTableRow-root">
                <TableCell className="FstoTableCell-root FstoTableCell-head">
                  TRANSACTION
                </TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">
                  REQUESTOR
                </TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">
                  CHARGING
                </TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">
                  AMOUNT DETAILS
                </TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">
                  PO DETAILS
                </TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head" align="center">
                  STATUS
                </TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head" align="center">
                  ACTIONS
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody className="FstoTableBody-root">
              {
                status === 'loading'
                && <TablePreloader row={3} />}

              {
                status === 'success'
                && data.data.map((data, index) => {

                  const currentDate = moment()
                  const estimatedReleaseDate = business.addWeekDays(moment(data.date_requested), data.supplier.supplier_type.transaction_days)

                  return (
                    <TableRow className="FstoTableRow-root" key={index} hover>
                      <TableCell className="FstoTableCell-root FstoTableCell-body">
                        <Typography className="FstoTypography-root FstoTypography-transaction" variant="button">
                          {data.transaction_id}
                          &nbsp;&mdash;&nbsp;
                          {data.document_type}
                          {
                            data.document_id === 4 && data.payment_type.toLowerCase() === `partial` &&
                            <Chip className="FstoChip-root FstoChip-payment" label={data.payment_type} size="small" />
                          }
                          {
                            Boolean(data.is_latest_transaction) &&
                            <Chip className="FstoChip-root FstoChip-latest" label="Latest" size="small" color="primary" />
                          }
                          {
                            data.supplier.supplier_type.id === 1 &&
                            <Chip className="FstoChip-root FstoChip-priority" label={data.supplier.supplier_type.name} size="small" color="secondary" />
                          }
                        </Typography>

                        <Typography className="FstoTypography-root FstoTypography-supplier" variant="caption">
                          {data.supplier.name}
                        </Typography>

                        <Typography className="FstoTypography-root FstoTypography-remarks" variant="h6">
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
                        <Typography className="FstoTypography-root FstoTypography-requestor" variant="subtitle1">
                          {data.users.first_name.toLowerCase()} {data.users.middle_name.toLowerCase()} {data.users.last_name.toLowerCase()}
                        </Typography>

                        <Typography variant="subtitle2">
                          {data.users.department[0].name}
                        </Typography>

                        <Typography variant="subtitle2">
                          {data.users.position}
                        </Typography>
                      </TableCell>

                      <TableCell className="FstoTableCell-root FstoTableCell-body">
                        <Typography variant="subtitle1">
                          {data.company}
                        </Typography>

                        <Typography variant="subtitle2">
                          {data.department}
                        </Typography>

                        <Typography variant="subtitle2">
                          {data.location}
                        </Typography>
                      </TableCell>

                      <TableCell className="FstoTableCell-root FstoTableCell-body">
                        <Typography className="FstoTypography-root FstoTypography-number" variant="caption">
                          {data.document_id !== 4 && data.document_no?.toUpperCase()}
                          {data.document_id === 4 && data.referrence_no?.toUpperCase()}
                        </Typography>

                        <Typography className="FstoTypography-root FstoTypography-amount" variant="h6">
                          &#8369;
                          {data.document_id !== 4 && data.document_amount?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                          {data.document_id === 4 && data.referrence_amount?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                        </Typography>
                      </TableCell>

                      <TableCell className="FstoTableCell-root FstoTableCell-body">
                        {
                          Boolean(data.po_details.length) &&
                          <React.Fragment>
                            <Typography className="FstoTypography-root FstoTypography-number" variant="caption">
                              {data.po_details[0].po_no.toUpperCase()}
                              {data.po_details.length > 1 && <React.Fragment>&nbsp;&bull;&bull;&bull;</React.Fragment>}
                            </Typography>

                            <Typography className="FstoTypography-root FstoTypography-amount" variant="h6">
                              &#8369;
                              {data.po_details[0].po_total_amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                            </Typography>
                          </React.Fragment>
                        }

                        {
                          !Boolean(data.po_details.length) &&
                          <React.Fragment>
                            &mdash;
                          </React.Fragment>
                        }
                      </TableCell>

                      <TableCell className="FstoTableCell-root FstoTableCell-body" align="center">
                        <Tooltip title="Hello world. Hello, Fisto!" placement="top" disableInteractive disableFocusListener arrow>
                          <Chip className="FstoChip-root FstoChip-status" label={data.status} size="small" color="warning" />
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

        <DocumentRequestingTransaction {...view} />

        <ReasonDialog onSuccess={refetchData} {...reason} />
      </Paper>
    </Box>
  )
}

export default DocumentRequesting