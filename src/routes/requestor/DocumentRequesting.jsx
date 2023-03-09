import React from 'react'

import axios from 'axios'

import moment from 'moment'
// import business from 'moment-business'

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
  // Error,
  // AccessTime,
  // DensitySmall,
  // DensityMedium
} from '@mui/icons-material'

import EmptyImage from '../../assets/img/empty.svg'

import useToast from '../../hooks/useToast'
import useTransactions from '../../hooks/useTransactions'

// import TablePreloader from '../../components/TablePreloader'
import Preloader from '../../components/Preloader'

import DocumentRequestingActions from './DocumentRequestingActions'
import DocumentRequestingFilter from './DocumentRequestingFilter'
import DocumentRequestingReason from './DocumentRequestingReason'
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
  } = useTransactions("/api/transactions", "pending-request-requestor")

  const navigate = useNavigate()

  const toast = useToast()

  const [active, setActive] = React.useState(true)
  const [state, setState] = React.useState("pending-request-requestor")
  const [search, setSearch] = React.useState("")
  // const [density, setDensity] = React.useState("small")

  const [view, setView] = React.useState({
    open: false,
    transaction: null,
    onBack: undefined,
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
    open: true,
    onBack: onView
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

  const getStatusMessage = (state) => {

    const [process, subprocess, recipient] = state.split("-")

    switch (process) {
      case "tag":
        if (subprocess === 'receive')
          return "Received by AP Tagging for tagging."

        if (subprocess === 'tag')
          return "Tagged by AP Tagging."

        if (subprocess === 'hold')
          return "Held by AP Tagging."

        if (subprocess === 'return')
          return "Returned by AP Tagging."

        if (subprocess === 'void')
          return "Voided by AP Tagging."

        break

      case "voucher":
        if (subprocess === 'receive')
          return "Received by AP Associate for vouchering."

        if (subprocess === 'voucher')
          return "Vouchered by AP Associate."

        if (subprocess === 'hold')
          return "Held by AP Associate."

        if (subprocess === 'return')
          return "Returned by AP Associate."

        if (subprocess === 'void')
          return "Voided by AP Associate."

        break

      case "approve":
        if (subprocess === 'receive')
          return "Received by Approver for approval."

        if (subprocess === 'voucher')
          return "Approved by Approver."

        if (subprocess === 'hold')
          return "Held by Approver."

        if (subprocess === 'return')
          return "Returned by Approver."

        if (subprocess === 'void')
          return "Voided by Approver."

        break

      case "transmit":
        if (subprocess === 'receive')
          return "Received by AP Associate for transmittal."

        if (subprocess === 'transmit')
          return "Transmitted by AP Associate."

        if (subprocess === 'hold')
          return "Held by AP Associate."

        if (subprocess === 'return')
          return "Returned by AP Associate."

        if (subprocess === 'void')
          return "Voided by AP Associate."

        break

      case "cheque":
        if (subprocess === 'receive')
          return "Received by Treasury Associate for cheque creation."

        if (subprocess === 'cheque')
          return "Created cheque by Treasury Associate."

        if (subprocess === 'release')
          return "Released cheque by Treasury Associate."

        if (subprocess === 'reverse')
          return "Reversed cheque by Treasury Associate."

        if (subprocess === 'file')
          return "Filed by Treasury Associate."

        if (subprocess === 'hold')
          return "Held by Treasury Associate."

        if (subprocess === 'return')
          return "Returned by Treasury Associate."

        if (subprocess === 'void')
          return "Voided by Treasury Associate."

        break

      case "release":
        if (subprocess === 'receive')
          return "Received by AP Tagging for releasing."

        if (subprocess === 'release')
          return "Released by AP Tagging."

        if (subprocess === 'hold')
          return "Held by AP Tagging."

        if (subprocess === 'return')
          return "Returned by AP Tagging."

        if (subprocess === 'void')
          return "Voided by AP Tagging."

        break

      case "file":
        if (subprocess === 'receive')
          return "Received by AP Associate for voucher filing."

        if (subprocess === 'file')
          return "Filed by AP Associate."

        if (subprocess === 'hold')
          return "Held by AP Associate."

        if (subprocess === 'return')
          return "Returned by AP Associate."

        if (subprocess === 'void')
          return "Voided by AP Associate."

        break

      case "reverse":
        if (subprocess === 'request')
          return "Requested return voucher by AP Tagging."

        if (subprocess === 'receive' && recipient === 'approver')
          return "Received by AP Associate for return voucher."

        if (subprocess === 'approve')
          return "Approved return voucher by AP Associate."

        if (subprocess === 'receive' && recipient === 'requestor')
          return "Received by AP Tagging for return voucher."

        if (subprocess === 'return')
          return "Returned by AP Tagging for reversal."

        break

      default:
        return "Pending for tagging."
    }
  }

  const getStateMessage = (state) => {
    if (state.toLowerCase() === 'pending')
      return state

    const [process, subprocess] = state.split("-")

    if (process === 'requestor' && subprocess === 'void')
      return `voided`

    switch (subprocess) {
      case "tag":
        return `${process} • tagged`

      case "hold":
        return `${process} • held`

      case "transmit":
        return `${process} • transmitted`

      default:
        if (subprocess.endsWith("e"))
          return `${process} • ${subprocess}d`

        return `${process} • ${subprocess}ed`
    }
  }

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
              <Tab className="FstoTab-root" label="Requested" value="pending-request-requestor" disableRipple />
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

            {/* <IconButton
              onClick={() => setDensity(currentValue => {
                if (currentValue === 'small')
                  return "large"

                return "small"
              })}
            >
              {density === 'small' ? <DensitySmall /> : <DensityMedium />}
            </IconButton> */}
          </Stack>
        </Stack>

        <TableContainer className="FstoTableContainer-root">
          {
            // density === 'large' &&
            // <React.Fragment>
            //   <Table className="FstoTable-root" size="small">
            //     <TableHead className="FstoTableHead-root">
            //       <TableRow className="FstoTableRow-root">
            //         <TableCell className="FstoTableCell-root FstoTableCell-head">
            //           TRANSACTION
            //         </TableCell>

            //         <TableCell className="FstoTableCell-root FstoTableCell-head">
            //           REQUESTOR
            //         </TableCell>

            //         <TableCell className="FstoTableCell-root FstoTableCell-head">
            //           CHARGING
            //         </TableCell>

            //         <TableCell className="FstoTableCell-root FstoTableCell-head">
            //           AMOUNT DETAILS
            //         </TableCell>

            //         <TableCell className="FstoTableCell-root FstoTableCell-head">
            //           PO DETAILS
            //         </TableCell>

            //         <TableCell className="FstoTableCell-root FstoTableCell-head" align="center">
            //           STATUS
            //         </TableCell>

            //         <TableCell className="FstoTableCell-root FstoTableCell-head" align="center">
            //           ACTIONS
            //         </TableCell>
            //       </TableRow>
            //     </TableHead>

            //     <TableBody className="FstoTableBody-root">
            //       {
            //         status === 'loading'
            //         && <TablePreloader row={3} />}

            //       {
            //         status === 'success'
            //         && data.data.map((data, index) => {

            //           // const currentDate = moment()
            //           // const estimatedReleaseDate = business.addWeekDays(moment(data.date_requested), data.supplier.supplier_type.transaction_days)

            //           return (
            //             <TableRow className="FstoTableRow-root" key={index} hover>
            //               <TableCell className="FstoTableCell-root FstoTableCell-body">
            //                 <Typography className="FstoTypography-root FstoTypography-transaction" variant="button">
            //                   {data.transaction_id}
            //                   &nbsp;&mdash;&nbsp;
            //                   {data.document_type}
            //                   {
            //                     data.document_id === 4 && data.payment_type.toLowerCase() === `partial` &&
            //                     <Chip className="FstoChip-root FstoChip-payment" label={data.payment_type} size="small" />
            //                   }
            //                   {
            //                     Boolean(data.is_latest_transaction) &&
            //                     <Chip className="FstoChip-root FstoChip-latest" label="Latest" size="small" color="primary" />
            //                   }
            //                   {
            //                     data.supplier.supplier_type.id === 1 &&
            //                     <Chip className="FstoChip-root FstoChip-priority" label={data.supplier.supplier_type.name} size="small" color="secondary" />
            //                   }
            //                 </Typography>

            //                 <Typography className="FstoTypography-root FstoTypography-supplier" variant="caption">
            //                   {data.supplier.name}
            //                 </Typography>

            //                 <Typography className="FstoTypography-root FstoTypography-remarks" variant="h6">
            //                   {
            //                     data.remarks
            //                       ? data.remarks
            //                       : <React.Fragment>&mdash;</React.Fragment>
            //                   }
            //                 </Typography>

            //                 {/*
            //                 {
            //                   !!data.state.match(/^pending|^tag|^voucher|^approve|^transmit|^cheque|^reverse/i) &&
            //                   <Typography variant="caption" sx={{ display: `flex`, alignItems: `center`, lineHeight: 1.65 }}>
            //                     Estimated Release Date:&nbsp;
            //                     <strong>
            //                       {estimatedReleaseDate.format("MMMM DD, YYYY")}
            //                     </strong>&nbsp;
            //                     <i>
            //                       {currentDate.to(estimatedReleaseDate)}
            //                     </i>
            //                     {currentDate.to(estimatedReleaseDate).match(/ago/gi) && <Error color="error" fontSize="small" sx={{ marginLeft: `3px` }} />}
            //                   </Typography>
            //                 }

            //                 {
            //                   !!data.state.match(/^release|^file|^clear/i) &&
            //                   <Typography className="FstoTypography-root FstoTypography-dates" variant="caption">
            //                     <AccessTime sx={{ fontSize: `1.3em` }} />
            //                     {moment(data.date_requested).format("MMMM DD, YYYY — hh:mm A")}
            //                   </Typography>
            //                 }
            //                 */}

            //                 <Typography className="FstoTypography-root FstoTypography-dates" variant="caption">
            //                   <AccessTime sx={{ fontSize: `1.3em` }} />
            //                   {moment(data.date_requested).format("MMMM DD, YYYY — hh:mm A")}
            //                 </Typography>
            //               </TableCell>

            //               <TableCell className="FstoTableCell-root FstoTableCell-body">
            //                 <Typography className="FstoTypography-root FstoTypography-requestor" variant="subtitle1">
            //                   {data.users.first_name.toLowerCase()} {data.users.middle_name?.toLowerCase()} {data.users.last_name.toLowerCase()}
            //                 </Typography>

            //                 <Typography variant="subtitle2">
            //                   {data.users.department[0].name}
            //                 </Typography>

            //                 <Typography variant="subtitle2">
            //                   {data.users.position}
            //                 </Typography>
            //               </TableCell>

            //               <TableCell className="FstoTableCell-root FstoTableCell-body">
            //                 <Typography variant="subtitle1">
            //                   {data.company}
            //                 </Typography>

            //                 <Typography variant="subtitle2">
            //                   {data.department}
            //                 </Typography>

            //                 <Typography variant="subtitle2">
            //                   {data.location}
            //                 </Typography>
            //               </TableCell>

            //               <TableCell className="FstoTableCell-root FstoTableCell-body">
            //                 <Typography className="FstoTypography-root FstoTypography-number" variant="caption">
            //                   {data.document_id !== 4 && data.document_no?.toUpperCase()}
            //                   {data.document_id === 4 && data.referrence_no?.toUpperCase()}
            //                 </Typography>

            //                 <Typography className="FstoTypography-root FstoTypography-amount" variant="h6">
            //                   &#8369;
            //                   {data.document_id !== 4 && data.document_amount?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
            //                   {data.document_id === 4 && data.referrence_amount?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
            //                 </Typography>
            //               </TableCell>

            //               <TableCell className="FstoTableCell-root FstoTableCell-body">
            //                 {
            //                   Boolean(data.po_details.length) &&
            //                   <React.Fragment>
            //                     <Typography className="FstoTypography-root FstoTypography-number" variant="caption">
            //                       {data.po_details[0].po_no.toUpperCase()}
            //                       {data.po_details.length > 1 && <React.Fragment>&nbsp;&bull;&bull;&bull;</React.Fragment>}
            //                     </Typography>

            //                     <Typography className="FstoTypography-root FstoTypography-amount" variant="h6">
            //                       &#8369;
            //                       {data.po_details[0].po_total_amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
            //                     </Typography>
            //                   </React.Fragment>
            //                 }

            //                 {
            //                   !Boolean(data.po_details.length) &&
            //                   <React.Fragment>
            //                     &mdash;
            //                   </React.Fragment>
            //                 }
            //               </TableCell>

            //               <TableCell className="FstoTableCell-root FstoTableCell-body" align="center">
            //                 <Tooltip title={getStatusMessage(data.state)} placement="top" disableInteractive disableFocusListener arrow>
            //                   <Chip className="FstoChip-root FstoChip-status" label={data.status} size="small" color="primary" />
            //                 </Tooltip>
            //               </TableCell>

            //               <TableCell className="FstoTableCell-root FstoTableCell-body" align="center">
            //                 <DocumentRequestingActions
            //                   state={state}
            //                   data={data}
            //                   onView={onView}
            //                   onUpdate={onUpdate}
            //                   onVoid={onVoid}
            //                 />
            //               </TableCell>
            //             </TableRow>
            //           )
            //         })}
            //     </TableBody>
            //   </Table>
            // </React.Fragment>
          }

          {
            // density === 'small' &&
            <React.Fragment>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="FstoTableHead-root">
                      DATE REQUESTED
                    </TableCell>

                    <TableCell className="FstoTableHead-root">
                      TRANSACTION NO.
                    </TableCell>

                    <TableCell className="FstoTableHead-root">
                      DOCUMENT
                    </TableCell>

                    <TableCell className="FstoTableHead-root">
                      COMPANY
                    </TableCell>

                    <TableCell className="FstoTableHead-root">
                      SUPPLIER
                    </TableCell>

                    <TableCell className="FstoTableHead-root">
                      PO NO.
                    </TableCell>

                    <TableCell className="FstoTableHead-root" align="right">
                      PO AMOUNT
                    </TableCell>

                    <TableCell className="FstoTableHead-root" align="right">
                      AMOUNT
                    </TableCell>

                    <TableCell className="FstoTableHead-root" align="center">
                      STATUS
                    </TableCell>

                    <TableCell className="FstoTableHead-root" align="center">
                      ACTIONS
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {
                    status === 'loading'
                    && <Preloader size="medium" col={10} row={6} />}

                  {
                    status === 'success'
                    && data.data.map((data, index) => {
                      return (
                        <TableRow hover key={index}>
                          <TableCell className="FstoTableData-root">
                            {
                              moment(data.date_requested).format("MMM. DD, YYYY hh:mm A")
                            }
                          </TableCell>

                          <TableCell className="FstoTableData-root">
                            {data.transaction_id}
                            {
                              data.tag_no
                              && <Chip className="FstoChip-root FstoChip-latest" label={`Tag#${data.tag_no}`} size="small" color="info" />
                            }
                          </TableCell>

                          <TableCell className="FstoTableData-root">
                            {data.document_type}
                            {
                              data.payment_type === 'Partial'
                              && <Chip className="FstoChip-root FstoChip-payment" label={data.payment_type} size="small" />
                            }
                            {
                              Boolean(data.is_latest_transaction) &&
                              <Chip className="FstoChip-root FstoChip-latest" label="Latest" size="small" color="primary" />
                            }
                          </TableCell>

                          <TableCell className="FstoTableData-root">
                            <Box
                              sx={{
                                width: '100%',
                                maxWidth: '230px',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden'
                              }}
                            >
                              {data.company}
                            </Box>
                          </TableCell>

                          <TableCell className="FstoTableData-root">
                            <Box
                              sx={{
                                width: '100%',
                                maxWidth: '230px',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden'
                              }}
                            >
                              {data.supplier.name}
                            </Box>
                          </TableCell>

                          <TableCell className="FstoTableData-root">
                            {
                              Boolean(data.po_details.length) &&
                              <React.Fragment>
                                {data.po_details[0].po_no.toUpperCase()}
                                {
                                  data.po_details.length > 1
                                  && <React.Fragment>&nbsp;&bull;&bull;&bull;</React.Fragment>}
                              </React.Fragment>
                            }

                            {
                              !Boolean(data.po_details.length)
                              && <React.Fragment>&mdash;</React.Fragment>
                            }
                          </TableCell>

                          <TableCell className="FstoTableData-root" align="right">
                            {
                              Boolean(data.po_details.length) &&
                              data.po_details[0].po_total_amount.toLocaleString('default', { style: 'currency', currency: 'PHP', maximumFractionDigits: 2, minimumFractionDigits: 2 })
                            }

                            {
                              !Boolean(data.po_details.length)
                              && <React.Fragment>&mdash;</React.Fragment>
                            }
                          </TableCell>

                          <TableCell className="FstoTableData-root" align="right">
                            {
                              data.referrence_amount?.toLocaleString('default', { style: 'currency', currency: 'PHP', maximumFractionDigits: 2, minimumFractionDigits: 2 }) ||
                              data.document_amount?.toLocaleString('default', { style: 'currency', currency: 'PHP', maximumFractionDigits: 2, minimumFractionDigits: 2 })
                            }
                          </TableCell>

                          <TableCell className="FstoTableData-root" align="center">
                            <Tooltip title={getStatusMessage(data.state)} placement="top" disableInteractive disableFocusListener arrow>
                              <Chip className="FstoChip-root FstoChip-status" label={getStateMessage(data.state)} size="small" color="warning" />
                            </Tooltip>
                          </TableCell>

                          <TableCell className="FstoTableData-root" align="center">
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
                    })}
                </TableBody>
              </Table>
            </React.Fragment>
          }

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

        <DocumentRequestingReason onSuccess={refetchData} {...reason} />
      </Paper>
    </Box>
  )
}

export default DocumentRequesting