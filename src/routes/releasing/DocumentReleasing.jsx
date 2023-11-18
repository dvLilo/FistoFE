import React, { Fragment } from 'react'

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

import statusColor from '../../colors/statusColor'

import useToast from '../../hooks/useToast'
import useConfirm from '../../hooks/useConfirm'
import useCheques from '../../hooks/useCheques'

import {
  RELEASE,
  RECEIVE,
  RETURN,
  UNRETURN
} from '../../constants'

import EmptyImage from '../../assets/img/empty.svg'

import ReasonDialog from '../../components/ReasonDialog'
import TablePreloader from '../../components/TablePreloader'
import FilterPopover from '../../components/FilterPopover'

import DocumentReleasingActions from './DocumentReleasingActions'
import DocumentReleasingTransaction from './DocumentReleasingTransaction'

const DocumentReleasing = () => {

  const {
    status,
    data,
    refetchData,
    searchData,
    filterData,
    changeStatus,
    changePage,
    changeRows
  } = useCheques("/api/cheques", "pending-release")

  const toast = useToast()
  const confirm = useConfirm()

  const [search, setSearch] = React.useState("")
  const [state, setState] = React.useState("pending-release")

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
          response = await axios.post(`/api/transactions/flow/update-transaction/${ID}`, {
            process: RELEASE,
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

  const onReturn = (data) => {
    setReason(currentValue => ({
      ...currentValue,
      open: true,
      process: RELEASE,
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
          response = await axios.post(`/api/transactions/flow/update-transaction/${ID}`, {
            process: RELEASE,
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

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperTable-root" elevation={1}>
        <Stack className="FstoStackToolbar-root" justifyContent="space-between" gap={2}>
          <Stack className="FstoStackToolbar-item" direction="row" justifyContent="center" gap={2}>
            <Typography variant="heading">
              Releasing of Cheque
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
              <Tab className="FstoTab-root" label="Pending" value="pending-release" disableRipple />
              <Tab className="FstoTab-root" label="Received" value="release-receive" disableRipple />
              <Tab className="FstoTab-root" label="Released" value="release-release" disableRipple />
              <Tab className="FstoTab-root" label="Returned" value="release-return" disableRipple />
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
                  <TableSortLabel active={false}>VOUCHER DETAILS</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">
                  <TableSortLabel active={false}>CHEQUE DETAILS</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">
                  <TableSortLabel active={false}>CHARGING</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">
                  <TableSortLabel active={false}>AMOUNT DETAILS</TableSortLabel>
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
                      <Typography className="FstoTypography-root FstoTypography-transaction" variant="button" gap={1}>
                        <span>TAG#{item.tag_no}</span>

                        &mdash;

                        <span>{item.voucher.no}</span>

                        &mdash;

                        <span>
                          {item.document.name}
                          {
                            item.supplier.type.toUpperCase() === "RUSH" &&
                            <Chip className="FstoChip-root FstoChip-priority" label={item.supplier.type} size="small" color="secondary" />
                          }
                        </span>
                      </Typography>

                      <Typography className="FstoTypography-root FstoTypography-dates" variant="caption">
                        Voucher Month: {moment(item.date_requested).format("MMMM YYYY")}
                      </Typography>

                      <Typography className="FstoTypography-root FstoTypography-remarks" variant="h6">
                        {item.supplier.name}
                      </Typography>

                      <Typography className="FstoTypography-root FstoTypography-supplier" variant="caption" sx={{ textTransform: "unset!important" }}>
                        {
                          item.remarks
                            ? item.remarks
                            : <Fragment>&mdash;</Fragment>
                        }
                      </Typography>

                      <Typography className="FstoTypography-root FstoTypography-dates" variant="caption">
                        {moment(item.date_requested).format("MMMM DD, YYYY — hh:mm A")}
                      </Typography>
                    </TableCell>

                    <TableCell className="FstoTableCell-root FstoTableCell-body">
                      <Stack direction="row" alignItems="center">
                        <Typography className="FstoTypography-root FstoTypography-number" variant="caption">
                          {item.cheques.at(0).bank.name}
                        </Typography>

                        {
                          item.cheques.length > 1 &&
                          <Chip className="FstoChip-root FstoChip-priority" label={`+${item.cheques.length - 1} more`} size="small" />
                        }
                      </Stack>

                      <Typography className="FstoTypography-root FstoTypography-number" variant="caption">
                        {item.cheques.at(0).no}
                      </Typography>

                      <Typography className="FstoTypography-root FstoTypography-amount" variant="h6">
                        &#8369;{item.cheques.at(0).amount?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                      </Typography>
                    </TableCell>

                    <TableCell className="FstoTableCell-root FstoTableCell-body">
                      <Typography variant="subtitle1">
                        {item.company.name}
                      </Typography>

                      <Typography variant="subtitle2">
                        {item.department.name}
                      </Typography>

                      <Typography variant="subtitle2">
                        {item.location.name}
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
                      <DocumentReleasingActions
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

        <DocumentReleasingTransaction
          {...manage}
          state={state}
          refetchData={refetchData}
          onReturn={onReturn}
        />

        <ReasonDialog {...reason} />
      </Paper>
    </Box>
  )
}

export default DocumentReleasing