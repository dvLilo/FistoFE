import React from 'react'

import axios from 'axios'

import moment from 'moment'

import { useSelector } from 'react-redux'

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
  Close,
  AccessTime
} from '@mui/icons-material'

import statusColor from '../../colors/statusColor'

import useToast from '../../hooks/useToast'
import useConfirm from '../../hooks/useConfirm'
import useTransactions from '../../hooks/useTransactions'

import {
  TRANSMIT,
  RECEIVE,
  TRANSFER
} from '../../constants'

import EmptyImage from '../../assets/img/empty.svg'

import TransferDialog from '../../components/TransferDialog'
import TablePreloader from '../../components/TablePreloader'
import FilterPopover from '../../components/FilterPopover'

import DocumentTransmittingActions from './DocumentTransmittingActions'
import DocumentTransmittingTransaction from './DocumentTransmittingTransaction'

const DocumentTransmitting = () => {

  const {
    status,
    data,
    refetchData,
    searchData,
    filterData,
    changeStatus,
    changePage,
    changeRows
  } = useTransactions("/api/transactions", "pending-transmit")

  const user = useSelector(state => state.user)

  const toast = useToast()
  const confirm = useConfirm()

  const [search, setSearch] = React.useState("")
  const [state, setState] = React.useState("pending-transmit")

  const [transfer, setTransfer] = React.useState({
    open: false,
    data: null,
    process: null,
    subprocess: null,
    onClose: () => setTransfer(currentValue => ({
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
          response = await axios.post(`/api/transactions/flow/update-transaction/${ID}`, {
            process: TRANSMIT,
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

  const onTransfer = (data) => {
    setTransfer(currentValue => ({
      ...currentValue,
      open: true,
      process: TRANSMIT,
      subprocess: TRANSFER,
      data,
    }))
  }

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperTable-root" elevation={1}>
        <Stack className="FstoStackToolbar-root" justifyContent="space-between" gap={2}>
          <Stack className="FstoStackToolbar-item" direction="row" justifyContent="center" gap={2}>
            <Typography variant="heading">
              Transmittal of Document
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
              <Tab className="FstoTab-root" label="Pending" value="pending-transmit" disableRipple />
              {
                user?.role === `AP Specialist` &&
                <Tab className="FstoTab-root" label="Transferred" value="transmit-transfer" disableRipple />
              }
              <Tab className="FstoTab-root" label="Received" value="transmit-receive" disableRipple />
              <Tab className="FstoTab-root" label="Transmitted" value="transmit-transmit" disableRipple />
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
                        label={item.status}
                        sx={{
                          backgroundColor: statusColor(item.status)
                        }}
                      />
                    </TableCell>

                    <TableCell className="FstoTableCell-root FstoTableCell-body" align="center">
                      <DocumentTransmittingActions
                        data={item}
                        state={state}
                        onReceive={onReceive}
                        onTransfer={onTransfer}
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

        <DocumentTransmittingTransaction
          {...manage}
          state={state}
          refetchData={refetchData}
        />

        <TransferDialog
          {...transfer}
          onSuccess={refetchData}
        />
      </Paper>
    </Box>
  )
}

export default DocumentTransmitting