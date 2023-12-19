import React, { Fragment } from 'react'

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

import useCheques from '../../hooks/useCheques'

import EmptyImage from '../../assets/img/empty.svg'

import TablePreloader from '../../components/TablePreloader'
import FilterPopover from '../../components/FilterPopover'

import DocumentClearingActions from './DocumentClearingActions'
import DocumentClearingTransaction from './DocumentClearingTransaction'

const DocumentClearing = () => {

  const {
    status,
    data,
    refetchData,
    searchData,
    filterData,
    changeStatus,
    changePage,
    changeRows
  } = useCheques("/api/cheques1", "pending-clear")

  const [search, setSearch] = React.useState("")
  const [state, setState] = React.useState("pending-clear")

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

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperTable-root" elevation={1}>
        <Stack className="FstoStackToolbar-root" justifyContent="space-between" gap={2}>
          <Stack className="FstoStackToolbar-item" direction="row" justifyContent="center" gap={2}>
            <Typography variant="heading">
              Clearing of Cheque
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
              <Tab className="FstoTab-root" label="Pending" value="pending-clear" disableRipple />
              <Tab className="FstoTab-root" label="Cleared" value="clear-clear" disableRipple />
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
                  <TableSortLabel active={false}>CHEQUE DETAILS</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">
                  <TableSortLabel active={false}>VOUCHER DETAILS</TableSortLabel>
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
                      <Typography className="FstoTypography-root FstoTypography-bank" variant="body1">
                        {item.bank.name}
                      </Typography>

                      <Typography className="FstoTypography-root FstoTypography-number" variant="caption">
                        {item.no}
                      </Typography>

                      <Typography className="FstoTypography-root FstoTypography-amount" variant="h6">
                        &#8369;{item.amount?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                      </Typography>

                      <Typography className="FstoTypography-root FstoTypography-dates" variant="caption">
                        {item.date && moment(item.date).format("MMMM YYYY")}
                      </Typography>
                    </TableCell>

                    <TableCell className="FstoTableCell-root FstoTableCell-body">
                      {
                        item.transactions.map((trxnItem) => (
                          <Typography className="FstoTypography-root FstoTypography-voucher" variant="button" gap={1}>
                            <Stack direction="column">
                              <Typography>{trxnItem.document.name}</Typography>

                              <span>TAG#{trxnItem.tag_no} &mdash; {trxnItem.voucher.no}</span>
                            </Stack>
                          </Typography>
                        ))}
                    </TableCell>

                    <TableCell className="FstoTableCell-root FstoTableCell-body">
                      <Typography variant="subtitle1">
                        {item.transactions.at(0).company.name}
                      </Typography>

                      <Typography variant="subtitle2">
                        {item.transactions.at(0).department.name}
                      </Typography>

                      <Typography variant="subtitle2">
                        {item.transactions.at(0).location.name}
                      </Typography>
                    </TableCell>

                    <TableCell className="FstoTableCell-root FstoTableCell-body">
                      {
                        item.transactions.map((trxnItem) => (
                          <Fragment>
                            <Typography className="FstoTypography-root FstoTypography-number" variant="caption">
                              {trxnItem.document.id !== 4 && trxnItem.document_no?.toUpperCase()}
                              {trxnItem.document.id === 4 && trxnItem.referrence_no?.toUpperCase()}
                            </Typography>

                            <Typography className="FstoTypography-root FstoTypography-amount" variant="h6">
                              &#8369;
                              {trxnItem.document.id !== 4 && trxnItem.document_amount?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                              {trxnItem.document.id === 4 && trxnItem.referrence_amount?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                            </Typography>
                          </Fragment>
                        ))}
                    </TableCell>

                    <TableCell className="FstoTableCell-root FstoTableCell-body" align="center">
                      <Chip
                        className="FstoChip-root FstoChip-status"
                        size="small"
                        color="primary"
                        label={item.transactions.at(0).state}
                        sx={{
                          backgroundColor: statusColor(item.transactions.at(0).status)
                        }}
                      />
                    </TableCell>

                    <TableCell className="FstoTableCell-root FstoTableCell-body" align="center">
                      <DocumentClearingActions
                        data={item}
                        state={state}
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

        <DocumentClearingTransaction
          {...manage}
          state={state}
          refetchData={refetchData}
        />
      </Paper>
    </Box>
  )
}

export default DocumentClearing