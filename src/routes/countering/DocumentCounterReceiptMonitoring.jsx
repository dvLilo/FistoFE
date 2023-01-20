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
  TablePagination,
  Stack,
  Button,
  OutlinedInput,
  Divider,
  Chip,
  Tabs,
  Tab
} from '@mui/material'

import {
  Search,
  Close,
  UploadFile
} from '@mui/icons-material'

import EmptyImage from '../../assets/img/empty.svg'

import {
  MONITORING,
  RECEIVE,
  RETURN,
  UNRETURN
} from '../../constants'

import Preloader from '../../components/Preloader'

import useToast from '../../hooks/useToast'
import useConfirm from '../../hooks/useConfirm'
import useCounterReceipts from '../../hooks/useCounterReceipts'

import DocumentCounterReceiptFilter from './DocumentCounterReceiptFilter'
import DocumentCounterReceiptExport from './DocumentCounterReceiptExport'
import DocumentCounterReceiptTransaction from './DocumentCounterReceiptTransaction'
import DocumentCounterReceiptMonitoringActions from './DocumentCounterReceiptMonitoringActions'
import DocumentCounterReceiptReason from './DocumentCounterReceiptReason'

const DocumentCounterReceiptMonitoring = () => {

  const {
    status,
    data,
    refetchData,
    searchData,
    filterData,
    changeStatus,
    changePage,
    changeRows
  } = useCounterReceipts("/api/counter-receipts", "pending-monitoring")

  const toast = useToast()
  const confirm = useConfirm()

  const [search, setSearch] = React.useState("")
  const [state, setState] = React.useState("pending-monitoring")

  const [reasonProps, setReason] = React.useState({
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

  const [viewProps, setView] = React.useState({
    open: false,
    transaction: null,
    onBack: undefined,
    onClose: () => setView(currentValue => ({
      ...currentValue,
      open: false
    }))
  })

  const [exportProps, setExport] = React.useState({
    open: false,
    onClose: () => setExport(currentValue => ({
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
          response = await axios.post(`/api/counter-receipts/flow/${ID}`, {
            process: MONITORING,
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
            message: "Something went wrong whilst trying to receive counter receipt. Please try again later."
          })
        }
      }
    })
  }

  const onView = (transaction) => {
    setView(currentValue => ({
      ...currentValue,
      transaction,
      open: true,
      onBack: onView
    }))
  }

  const onReturn = (data) => {
    setReason(currentValue => ({
      ...currentValue,
      open: true,
      process: MONITORING,
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
          response = await axios.post(`/api/counter-receipts/flow/${ID}`, {
            process: MONITORING,
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
            message: "Something went wrong whilst trying to cancel return counter receipt. Please try again later."
          })
        }
      }
    })
  }

  const onExport = () => {
    setExport(currentValue => ({
      ...currentValue,
      open: true
    }))
  }


  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperTable-root" elevation={1}>
        <Stack className="FstoStackToolbar-root" justifyContent="space-between" gap={2}>
          <Stack className="FstoStackToolbar-item" direction="row" justifyContent="center" gap={2}>
            <Typography variant="heading">
              Monitoring of Counter Receipt
            </Typography>

            <Button
              variant="contained"
              startIcon={<UploadFile />}
              onClick={onExport}
              disableElevation
            >
              Export
            </Button>
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
              <Tab className="FstoTab-root" label="Pending" value="pending-monitoring" disableRipple />
              <Tab className="FstoTab-root" label="Received" value="monitoring-receive" disableRipple />
              <Tab className="FstoTab-root" label="Returned" value="monitoring-return" disableRipple />
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

              <DocumentCounterReceiptFilter onFilter={filterData} />
            </Stack>
          </Stack>
        </Stack>

        <TableContainer className="FstoTableContainer-root FstoTableContainerCounter-root">
          <Table className="FstoTableCounter-root" size="small">
            <TableHead className="FstoTableHeadCounter-root">
              <TableRow className="FstoTableRowCounter-root">
                <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-head">
                  DATE COUNTERED
                </TableCell>

                <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-head">
                  COUNTER RECEIPT NO.
                </TableCell>

                <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-head">
                  DATE TRANSACT
                </TableCell>

                <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-head">
                  RECEIPT TYPE
                </TableCell>

                <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-head">
                  RECEIPT NO.
                </TableCell>

                <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-head">
                  SUPPLIER
                </TableCell>

                <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-head">
                  DEPARTMENT
                </TableCell>

                <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-head" align="right">
                  AMOUNT
                </TableCell>

                {
                  state !== 'pending' &&
                  <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-head">
                    MEMO NOTICE
                  </TableCell>}

                <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-head" align="center">
                  STATUS
                </TableCell>

                <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-head" align="center">
                  ACTIONS
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody className="FstoTableBodyCounter-root">
              {
                status === 'loading'
                && <Preloader col={state === 'pending' ? 10 : 11} row={3} />}

              {
                status === 'success'
                && data.data.map((item, index) => (
                  <TableRow className="FstoTableRowCounter-root" key={index}>
                    <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-body">
                      {moment(item.date_countered).format("MM/DD/YYYY")}
                    </TableCell>

                    <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-body">
                      {item.counter_receipt_no}
                    </TableCell>

                    <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-body">
                      {moment(item.date_transaction).format("MM/DD/YYYY")}
                    </TableCell>

                    <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-body">
                      {item.receipt_type}
                    </TableCell>

                    <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-body">
                      {item.receipt_no}
                    </TableCell>

                    <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-body">
                      {item.supplier}
                    </TableCell>

                    <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-body">
                      {item.department}
                    </TableCell>

                    <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-body" align="right">
                      {
                        item.amount.toLocaleString("default", {
                          style: "currency",
                          currency: "PHP",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                    </TableCell>

                    {
                      state !== 'pending' &&
                      <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-body">
                        {
                          item.memo
                            ? moment(item.memo).format("MM/DD/YYYY")
                            : <>&mdash;</>
                        }
                      </TableCell>}

                    <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-body" align="center">
                      <Chip label={item.status} size="small" color={Boolean(item.state.match(/-return/i)) ? `error` : `primary`} />
                    </TableCell>

                    <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-body" align="center">
                      <DocumentCounterReceiptMonitoringActions
                        data={item}
                        state={item.state}
                        onReceive={onReceive}
                        onView={onView}
                        onReturn={onReturn}
                        onCancel={onCancel}
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
          rowsPerPageOptions={[10, 20, 50, 100]}
          onPageChange={(e, page) => changePage(page)}
          onRowsPerPageChange={(e) => changeRows(e.target.value)}
          showFirstButton
          showLastButton
        />

        <DocumentCounterReceiptTransaction
          {...viewProps}
          state={state}
        />

        <DocumentCounterReceiptExport {...exportProps} />

        <DocumentCounterReceiptReason {...reasonProps} />


      </Paper>
    </Box>
  )
}

export default DocumentCounterReceiptMonitoring