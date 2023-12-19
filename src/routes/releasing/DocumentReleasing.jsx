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
  OutlinedInput,
  Menu,
  MenuItem,
  Checkbox
} from '@mui/material'

import {
  Search,
  Close,
  MoreHoriz,
  TaskOutlined
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

import ReasonChequeDialog from '../../components/ReasonChequeDialog'
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
  } = useCheques("/api/cheques1", "pending-release")

  const toast = useToast()
  const confirm = useConfirm()

  const [anchor, setAnchor] = React.useState(null)

  const [search, setSearch] = React.useState("")
  const [state, setState] = React.useState("pending-release")

  const [selected, setSelected] = React.useState([])

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

  const onReceive = (data) => {
    confirm({
      open: true,
      wait: true,
      onConfirm: async () => {
        let response
        try {
          response = await axios.post(`/api/cheque/flow`, {
            process: RELEASE,
            subprocess: RECEIVE,

            ...data
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

  const onUnreturn = (data) => {
    confirm({
      open: true,
      wait: true,
      onConfirm: async () => {
        let response
        try {
          response = await axios.post(`/api/cheque/flow`, {
            process: RELEASE,
            subprocess: UNRETURN,

            ...data
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

  const onCheck = (e) => {
    if (e.target.checked) {
      return setSelected((currentValue) => ([
        ...currentValue,
        JSON.parse(e.target.value)
      ]))
    }

    setSelected((currentValue) => ([
      ...currentValue.filter((item) => item.cheque_no !== JSON.parse(e.target.value).cheque_no)
    ]))
  }

  const onReceiveAll = () => {
    confirm({
      open: true,
      wait: true,
      onConfirm: async () => {
        let response
        try {
          response = await axios.post(`api/cheques/flow/receive`, {
            process: RELEASE,
            banks: selected
          })

          const { message } = response.data

          setSelected([])
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
                setSelected([])
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
                {
                  state === 'pending-release' && status === 'success' &&
                  <TableCell className="FstoTableCell-root FstoTableCell-head" align="center">
                    <IconButton onClick={(e) => setAnchor(e.currentTarget)} disabled={!selected.length}>
                      <MoreHoriz />
                    </IconButton>

                    <Menu
                      open={!!anchor}
                      elevation={2}
                      anchorEl={anchor}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                      MenuListProps={{
                        sx: { py: 0.5 }
                      }}
                      onClose={() => setAnchor(null)}
                      disablePortal
                    >
                      <MenuItem
                        sx={{ fontWeight: 500 }}
                        onClick={() => {
                          setAnchor(null)
                          onReceiveAll()
                        }}
                        dense
                      >
                        <TaskOutlined sx={{ fontSize: 21, marginRight: 1, opacity: 0.75 }} /> Receive
                      </MenuItem>
                    </Menu>
                  </TableCell>}

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
                  <TableRow className="FstoTableRow-root" key={index} selected={selected.some((selectedItem) => selectedItem.cheque_no === item.no)} hover>
                    {
                      state === 'pending-release' && status === 'success' &&
                      <TableCell className="FstoTableCell-root FstoTableCell-body" align="center">
                        <Checkbox className="FstoCheckbox-root" onChange={onCheck} value={JSON.stringify({ id: item.bank.id, cheque_no: item.no })} checked={selected.some((selectedItem) => selectedItem.cheque_no === item.no)} />
                      </TableCell>}

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

        <ReasonChequeDialog {...reason} />
      </Paper>
    </Box>
  )
}

export default DocumentReleasing