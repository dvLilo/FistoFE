import React from 'react'

import moment from 'moment'

import {
  Link,
  useNavigate
} from 'react-router-dom'

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
  Add,
  Search,
  Close
} from '@mui/icons-material'

import EmptyImage from '../../assets/img/empty.svg'

import {
  COUNTER,
  VOID
} from '../../constants'

import Preloader from '../../components/Preloader'
import ReasonDialog from '../../components/ReasonDialog'

import useCounterReceipts from '../../hooks/useCounterReceipts'

import DocumentCounterReceiptFilter from './DocumentCounterReceiptFilter'
import DocumentCounterReceiptCreatingActions from './DocumentCounterReceiptCreatingActions'
import DocumentCounterReceiptTransaction from './DocumentCounterReceiptTransaction'

const DocumentCounterReceiptCreating = () => {

  const {
    // status,
    // data,
    refetchData,
    searchData,
    filterData,
    changeStatus,
    changePage,
    changeRows
  } = useCounterReceipts("/api/counter-receipts", "counter-request")

  const navigate = useNavigate()

  const [search, setSearch] = React.useState("")
  const [state, setState] = React.useState("counter-request")

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

  const [view, setView] = React.useState({
    open: false,
    transaction: null,
    onBack: undefined,
    onClose: () => setView(currentValue => ({
      ...currentValue,
      open: false
    }))
  })

  const onView = (transaction) => {
    setView(currentValue => ({
      ...currentValue,
      transaction,
      open: true,
      onBack: onView
    }))
  }

  const onUpdate = (data) => {
    const { id } = data

    navigate(`/counter-receipt/update-counter-receipt/${id}`)
  }

  const onVoid = (data) => {
    setReason(currentValue => ({
      ...currentValue,
      open: true,
      process: COUNTER,
      subprocess: VOID,
      data,
    }))
  }


  const status = 'success'
  const data = [
    {
      id: 1,
      no: 1001,
      date: "10/03/2022",
      receipt: {
        type: "SI",
        no: "REF#10001",
        amount: 10000,
        date: "10/03/2022"
      },
      supplier: {
        id: 38,
        name: "8 SOURCES, INC."
      },
      department: {
        id: 12,
        name: "Management Information System Common"
      },
      status: "pending",
      state: "counter-pending",

      ...(Boolean(state.match(/counter-void/i)) && {
        status: "voided",
        state: "counter-void"
      }),
    },
    {
      id: 2,
      no: 1001,
      date: "10/03/2022",
      receipt: {
        type: "OR",
        no: "REF#10002",
        amount: 13000,
        date: "10/03/2022"
      },
      supplier: {
        id: 38,
        name: "8 SOURCES, INC."
      },
      department: {
        id: 12,
        name: "Management Information System Common"
      },
      status: "pending",
      state: "counter-pending",

      ...(Boolean(state.match(/counter-void/i)) && {
        status: "voided",
        state: "counter-void"
      }),
    },
    {
      id: 3,
      no: 1002,
      date: "10/03/2022",
      receipt: {
        type: "INTERNAL",
        no: "REF#456",
        amount: 8000,
        date: "09/26/2022"
      },
      supplier: {
        id: 1,
        name: "1ST ADVENUE ADVERTISING"
      },
      department: {
        id: 1,
        name: "Management Information System Common"
      },
      status: "unprocessed",
      state: "counter-unprocess",

      ...(Boolean(state.match(/counter-void/i)) && {
        status: "voided",
        state: "counter-void"
      }),
    },
    {
      id: 4,
      no: 1003,
      date: "10/03/2022",
      transaction: {
        id: 1,
        document_amount: 50000,
        referrence_amount: null
      },
      receipt: {
        type: "INTERNAL",
        no: "REF#789",
        amount: 9000,
        date: "09/26/2022"
      },
      supplier: {
        id: 1,
        name: "1ST ADVENUE ADVERTISING"
      },
      department: {
        id: 1,
        name: "Management Information System Common"
      },
      status: "processed",
      state: "counter-process",

      ...(Boolean(state.match(/counter-void/i)) && {
        status: "voided",
        state: "counter-void"
      }),
    }
  ]


  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperTable-root" elevation={1}>
        <Stack className="FstoStackToolbar-root" justifyContent="space-between" gap={2}>
          <Stack className="FstoStackToolbar-item" direction="row" alignItems="center" justifyContent="center" gap={2}>
            <Typography variant="heading">
              Creation of Counter Receipt
            </Typography>

            <Button
              variant="contained"
              component={Link}
              startIcon={<Add />}
              to="/counter-receipt/new-counter-receipt"
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
              <Tab className="FstoTab-root" label="Requested" value="counter-request" disableRipple />
              <Tab className="FstoTab-root" label="Voided" value="counter-void" disableRipple />
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

            <DocumentCounterReceiptFilter onFilter={filterData} />
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

                <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-head">
                  AMOUNT
                </TableCell>

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
                && <Preloader col={11} row={3} />}

              {
                status === 'success'
                && data.map((item, index) => (
                  <TableRow className="FstoTableRowCounter-root" key={index}>
                    <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-body">
                      {moment(item.date).format("MM/DD/YYYY")}
                    </TableCell>

                    <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-body">
                      {/* <Chip label={item.no} color="primary" size="small" /> */}
                      {item.no}
                    </TableCell>

                    <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-body">
                      {moment(item.receipt.date).format("MM/DD/YYYY")}
                    </TableCell>

                    <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-body">
                      {item.receipt.type}
                    </TableCell>

                    <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-body">
                      {item.receipt.no}
                    </TableCell>

                    <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-body">
                      {item.supplier.name}
                    </TableCell>

                    <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-body">
                      {item.department.name}
                    </TableCell>

                    <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-body">
                      {
                        item.receipt.amount.toLocaleString("default", {
                          style: "currency",
                          currency: "PHP",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                    </TableCell>

                    <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-body" align="center">
                      <Chip label={item.status} size="small" />
                    </TableCell>

                    <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-body" align="center">
                      <DocumentCounterReceiptCreatingActions
                        data={item}
                        state={item.state}
                        onUpdate={onUpdate}
                        onView={onView}
                        onVoid={onVoid}
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
          // count={data ? data.total : 0}
          // page={data ? data.current_page - 1 : 0}
          // rowsPerPage={data ? data.per_page : 10}
          count={0}
          page={0}
          rowsPerPage={10}
          rowsPerPageOptions={[10, 20, 50, 100]}
          onPageChange={(e, page) => changePage(page)}
          onRowsPerPageChange={(e) => changeRows(e.target.value)}
          showFirstButton
          showLastButton
        />

        <DocumentCounterReceiptTransaction
          {...view}
          state={state}
        />

        <ReasonDialog {...reason} />
      </Paper>
    </Box>
  )
}

export default DocumentCounterReceiptCreating