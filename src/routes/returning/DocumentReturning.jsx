import React from 'react'

import axios from 'axios'

import moment from 'moment'

import { useSelector } from 'react-redux'

import { useNavigate } from 'react-router-dom'

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
  Close,
  AccessTime,
  // DensitySmall,
  // DensityMedium
} from '@mui/icons-material'

import statusColor from '../../colors/statusColor'

import useToast from '../../hooks/useToast'
import useConfirm from '../../hooks/useConfirm'
import useTransactions from '../../hooks/useTransactions'

import {
  REVERSE,
  RETURN,
  HOLD,
  VOID,

  TAG,
  VOUCHER,
  CHEQUE,
  RELEASE
} from '../../constants'

import EmptyImage from '../../assets/img/empty.svg'

import ReasonDialog from '../../components/ReasonDialog'
// import TransferDialog from '../../components/TransferDialog'
import TablePreloader from '../../components/TablePreloader'
import Preloader from '../../components/Preloader'
import FilterPopover from '../../components/FilterPopover'

import DocumentReturningActions from './DocumentReturningActions'

import DocumentRequestingTransaction from '../requestor/DocumentRequestingTransaction'
import DocumentTaggingTransaction from '../tagging/DocumentTaggingTransaction'
import DocumentVoucheringTransaction from '../vouchering/DocumentVoucheringTransaction'
import DocumentChequingTransaction from '../chequing/DocumentChequingTransaction'

const DocumentReturning = () => {

  const {
    status,
    data,
    refetchData,
    searchData,
    filterData,
    changeStatus,
    changePage,
    changeRows
  } = useTransactions("/api/transactions", "return-return")

  React.useEffect(() => {
    changeStatus(state)

    // eslint-disable-next-line
  }, [])

  const user = useSelector(state => state.user)

  const toast = useToast()
  const confirm = useConfirm()
  const navigate = useNavigate()

  const [search, setSearch] = React.useState("")
  const [state, setState] = React.useState("return-return")
  // const [density, setDensity] = React.useState("small")

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

  const onHold = (data) => {
    setReason(currentValue => ({
      ...currentValue,
      open: true,
      process: getProcess(user?.role),
      subprocess: HOLD,
      data,
    }))
  }

  const onVoid = (data) => {
    setReason(currentValue => ({
      ...currentValue,
      open: true,
      process: getProcess(user?.role),
      subprocess: VOID,
      data,
    }))
  }

  const onReturn = (data) => {
    setReason(currentValue => ({
      ...currentValue,
      open: true,
      process: getProcess(user?.role),
      subprocess: RETURN,
      data,
    }))
  }

  const onUpdate = (data) => {
    const { id } = data

    navigate(`/request/update-request/${id}`)
  }

  const onRelease = (ID) => {
    confirm({
      open: true,
      wait: true,
      onConfirm: async () => {
        let response
        try {
          response = await axios.post(`/api/transactions/flow/update-transaction/${ID}`, {
            process: CHEQUE,
            subprocess: RELEASE
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


  const getProcess = (role) => {
    switch (role) {
      case "AP Tagging":
        return TAG

      case "AP Associate":
        return VOUCHER

      case "AP Specialist":
        return VOUCHER

      case "Treasury Associate":
        return CHEQUE

      default:
        return REVERSE
    }
  }

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperTable-root" elevation={1}>
        <Stack className="FstoStackToolbar-root" justifyContent="space-between" gap={2}>
          <Stack className="FstoStackToolbar-item" direction="row" justifyContent="center" gap={2}>
            <Typography variant="heading">
              Returned Documents
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
              <Tab className="FstoTab-root" label="Returned" value="return-return" disableRipple />
              {
                user?.role !== `Requestor` && user?.role !== `Treasury Associate` &&
                [
                  <Tab className="FstoTab-root" key="Hold" label="Hold" value="return-hold" disableRipple />,
                  <Tab className="FstoTab-root" key="Voided" label="Voided" value="return-void" disableRipple />
                ]}
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

              {/* {
                user?.role === `Requestor` &&
                <IconButton
                  onClick={() => setDensity(currentValue => {
                    if (currentValue === 'small')
                      return "large"

                    return "small"
                  })}
                >
                  {density === 'small' ? <DensitySmall /> : <DensityMedium />}
                </IconButton>
              } */}
            </Stack>
          </Stack>
        </Stack>

        <TableContainer className="FstoTableContainer-root">
          {
            // ((density === 'large' && user?.role === `Requestor`) || user?.role !== `Requestor`) &&
            user?.role !== `Requestor` &&
            <React.Fragment>
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
                          <Typography className="FstoTypography-root FstoTypography-transaction" variant="button">
                            TAG#${item.tag_no}&nbsp;&mdash;&nbsp;{item.document_type}
                            {
                              item.document_id === 4 && item.payment_type.toLowerCase() === `partial` &&
                              <Chip className="FstoChip-root FstoChip-payment" label={item.payment_type} size="small" />
                            }
                            {
                              Boolean(item.is_latest_transaction) &&
                              <Chip className="FstoChip-root FstoChip-latest" label="Latest" size="small" color="primary" />
                            }
                            {
                              item.supplier.supplier_type.id === 1 &&
                              <Chip className="FstoChip-root FstoChip-priority" label={item.supplier.supplier_type.name} size="small" color="secondary" />
                            }
                          </Typography>

                          <Typography className="FstoTypography-root FstoTypography-supplier" variant="caption">
                            {item.supplier.name}
                          </Typography>

                          <Typography className="FstoTypography-root FstoTypography-remarks" variant="h6">
                            {
                              item.remarks
                                ? item.remarks
                                : <React.Fragment>&mdash;</React.Fragment>
                            }
                          </Typography>

                          <Typography className="FstoTypography-root FstoTypography-dates" variant="caption">
                            <AccessTime sx={{ fontSize: `1.3em` }} />
                            {moment(item.date_requested).format("MMMM DD, YYYY — hh:mm A")}
                          </Typography>
                        </TableCell>

                        <TableCell className="FstoTableCell-root FstoTableCell-body">
                          <Typography className="FstoTypography-root FstoTypography-requestor" variant="subtitle1">
                            {item.users.first_name.toLowerCase()} {item.users.middle_name.toLowerCase()} {item.users.last_name.toLowerCase()}
                          </Typography>

                          <Typography variant="subtitle2">
                            {item.users.department[0].name}
                          </Typography>

                          <Typography variant="subtitle2">
                            {item.users.position}
                          </Typography>
                        </TableCell>

                        <TableCell className="FstoTableCell-root FstoTableCell-body">
                          <Typography variant="subtitle1">
                            {item.company}
                          </Typography>

                          <Typography variant="subtitle2">
                            {item.department}
                          </Typography>

                          <Typography variant="subtitle2">
                            {item.location}
                          </Typography>
                        </TableCell>

                        <TableCell className="FstoTableCell-root FstoTableCell-body">
                          <Typography className="FstoTypography-root FstoTypography-number" variant="caption">
                            {item.document_id !== 4 && item.document_no?.toUpperCase()}
                            {item.document_id === 4 && item.referrence_no?.toUpperCase()}
                          </Typography>

                          <Typography className="FstoTypography-root FstoTypography-amount" variant="h6">
                            &#8369;
                            {item.document_id !== 4 && item.document_amount?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                            {item.document_id === 4 && item.referrence_amount?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                          </Typography>
                        </TableCell>

                        <TableCell className="FstoTableCell-root FstoTableCell-body">
                          {
                            Boolean(item.po_details.length) &&
                            <React.Fragment>
                              <Typography className="FstoTypography-root FstoTypography-number" variant="caption">
                                {item.po_details[0].po_no.toUpperCase()}
                                {item.po_details.length > 1 && <React.Fragment>&nbsp;&bull;&bull;&bull;</React.Fragment>}
                              </Typography>

                              <Typography className="FstoTypography-root FstoTypography-amount" variant="h6">
                                &#8369;
                                {item.po_details[0].po_total_amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                              </Typography>
                            </React.Fragment>
                          }

                          {
                            !Boolean(item.po_details.length) &&
                            <React.Fragment>
                              &mdash;
                            </React.Fragment>
                          }
                        </TableCell>

                        <TableCell className="FstoTableCell-root FstoTableCell-body" align="center">
                          <Chip
                            className="FstoChip-root FstoChip-status"
                            size="small"
                            color="primary"
                            label={item.status}
                            sx={{
                              backgroundColor: statusColor(item.status)
                            }}
                          />
                        </TableCell>

                        <TableCell className="FstoTableCell-root FstoTableCell-body" align="center">
                          <DocumentReturningActions
                            data={item}
                            state={state}
                            // onTransfer={onTransfer}
                            onManage={onManage}
                            onUpdate={onUpdate}
                            onView={onView}
                            onVoid={onVoid}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </React.Fragment>
          }


          {
            // density === 'small' && user?.role === `Requestor` &&
            user?.role === `Requestor` &&
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
                            <Chip className="FstoChip-root FstoChip-status" label={data.status} size="small" color="primary" sx={{ backgroundColor: statusColor(data.status) }} />
                          </TableCell>

                          <TableCell className="FstoTableData-root" align="center">
                            <DocumentReturningActions
                              data={data}
                              state={state}
                              // onTransfer={onTransfer}
                              onManage={onManage}
                              onUpdate={onUpdate}
                              onView={onView}
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

        {
          user?.role === `AP Tagging` &&
          <DocumentTaggingTransaction
            {...manage}
            state={state}
            refetchData={refetchData}
            onHold={onHold}
            onReturn={onReturn}
            onVoid={onVoid}
          />}

        {
          (user?.role === `AP Associate` || user?.role === `AP Specialist`) &&
          <DocumentVoucheringTransaction
            {...manage}
            state={state}
            refetchData={refetchData}
            onHold={onHold}
            onReturn={onReturn}
            onVoid={onVoid}
          />
        }

        {
          user?.role === `Treasury Associate` &&
          <DocumentChequingTransaction
            {...manage}
            state={state}
            refetchData={refetchData}
            onRelease={onRelease}
            onHold={onHold}
            onReturn={onReturn}
            onVoid={onVoid}
          />
        }

        {
          user?.role === `Requestor` &&
          <DocumentRequestingTransaction
            {...manage}
          />
        }

        {/* <TransferDialog
          {...transfer}
          onSuccess={refetchData}
        /> */}

        <ReasonDialog {...reason} />
      </Paper>
    </Box>
  )
}

export default DocumentReturning