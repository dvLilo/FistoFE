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
  Checkbox,
  MenuItem,
  Menu
} from '@mui/material'

import {
  Search,
  Close,
  TaskOutlined,
  MoreHoriz,
  DescriptionOutlined
} from '@mui/icons-material'

import statusColor from '../../colors/statusColor'

import useToast from '../../hooks/useToast'
import useConfirm from '../../hooks/useConfirm'
import useCheques from '../../hooks/useCheques'

import {
  CHEQUE,
  RECEIVE,
  HOLD,
  UNHOLD,
  RETURN,
  UNRETURN,
  VOID,
  // RELEASE
} from '../../constants'

import EmptyImage from '../../assets/img/empty.svg'

import ReasonDialog from '../../components/ReasonDialog'
import TablePreloader from '../../components/TablePreloader'

import DocumentChequingActions from './DocumentChequingActions'
import DocumentChequingTransaction from './DocumentChequingTransaction'
import DocumentChequingDialog from './DocumentChequingDialog'
import DocumentChequingFilter from './DocumentChequingFilter'

const DocumentChequing = () => {

  const {
    status,
    data,
    refetchData,
    searchData,
    filterData,
    changeStatus,
    changePage,
    changeRows
  } = useCheques("/api/cheques", "pending-cheque")

  const toast = useToast()
  const confirm = useConfirm()

  const [anchor, setAnchor] = React.useState(null)

  const [search, setSearch] = React.useState("")
  const [state, setState] = React.useState("pending-cheque")

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

  const [multiCheque, setMultiCheque] = React.useState({
    open: false,
    transactions: [],
    onClose: () => setMultiCheque(currentValue => ({
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
            process: CHEQUE,
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

  const onRevert = (ID) => {
    confirm({
      open: true,
      wait: true,
      message: "Are you sure you want to revert this cheque? All other transaction that is connected to this cheque will also reverted.",
      onConfirm: async () => {
        let response
        try {
          response = await axios.post(`/api/transactions/flow/cheque-revert/${ID}`)

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

  const onHold = (data) => {
    setReason(currentValue => ({
      ...currentValue,
      open: true,
      process: CHEQUE,
      subprocess: HOLD,
      data,
    }))
  }

  const onUnhold = (ID) => {
    confirm({
      open: true,
      wait: true,
      onConfirm: async () => {
        let response
        try {
          response = await axios.post(`/api/transactions/flow/update-transaction/${ID}`, {
            process: CHEQUE,
            subprocess: UNHOLD
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
            message: "Something went wrong whilst trying to unhold transaction. Please try again later."
          })
        }
      }
    })
  }

  const onReturn = (data) => {
    setReason(currentValue => ({
      ...currentValue,
      open: true,
      process: CHEQUE,
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
            process: CHEQUE,
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

  const onVoid = (data) => {
    setReason(currentValue => ({
      ...currentValue,
      open: true,
      process: CHEQUE,
      subprocess: VOID,
      data,
    }))
  }

  const onCheck = (e) => {
    if (e.target.checked) {
      return setSelected((currentValue) => ([
        ...currentValue,
        parseInt(e.target.value)
      ]))
    }

    setSelected((currentValue) => ([
      ...currentValue.filter((item) => item !== parseInt(e.target.value))
    ]))
  }

  const onReceiveAll = () => {
    confirm({
      open: true,
      wait: true,
      onConfirm: async () => {
        let response
        try {
          response = await axios.post(`api/transactions/flow/receive`, {
            process: CHEQUE,
            transactions: selected
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


  // For multiple voucher in one cheque
  const [selectedVoucher, setSelectedVoucher] = React.useState([])

  const onVoucherTick = (e) => {
    if (e.target.checked) {
      setSelectedVoucher((currentValue) => ([
        ...currentValue,
        JSON.parse(e.target.value)
      ]))
    }
    else {
      const value = JSON.parse(e.target.value)

      setSelectedVoucher((currentValue) => {
        return currentValue.filter((item) => item.id !== value.id)
      })
    }
  }

  const onManageAll = () => {
    setMultiCheque(currentValue => ({
      ...currentValue,
      open: true,
      transactions: selectedVoucher,

      onBack: onManageAll
    }))
  }

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperTable-root" elevation={1}>
        <Stack className="FstoStackToolbar-root" justifyContent="space-between" gap={2}>
          <Stack className="FstoStackToolbar-item" direction="row" justifyContent="center" gap={2}>
            <Typography variant="heading">
              Creation of Cheque
            </Typography>
          </Stack>

          <Stack className="FstoStackToolbar-item" direction="column" justifyContent="center" gap={1}>
            <Tabs
              className="FstoTabsToolbar-root"
              value={state}
              onChange={(e, value) => {
                setState(value)
                changeStatus(value)

                setSelected([])
                setSelectedVoucher([])
              }}
              TabIndicatorProps={{
                className: "FstoTabsIndicator-root",
                children: <span className="FstoTabsIndicator-root" />
              }}
            >
              <Tab className="FstoTab-root" label="Pending" value="pending-cheque" disableRipple />
              <Tab className="FstoTab-root" label="Received" value="cheque-receive" disableRipple />
              <Tab className="FstoTab-root" label="Created" value="cheque-cheque" disableRipple />
              <Tab className="FstoTab-root" label="Held" value="cheque-hold" disableRipple />
              <Tab className="FstoTab-root" label="Returned" value="cheque-return" disableRipple />
              <Tab className="FstoTab-root" label="Voided" value="cheque-void" disableRipple />
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

              <DocumentChequingFilter onFilter={filterData} />
            </Stack>
          </Stack>
        </Stack>

        <TableContainer className="FstoTableContainer-root">
          <Table className="FstoTable-root" size="small">
            <TableHead className="FstoTableHead-root">
              <TableRow className="FstoTableRow-root">
                {
                  !!state.match(/pending|receive/gi) && status === 'success' &&
                  <TableCell className="FstoTableCell-root FstoTableCell-head" align="center">
                    <IconButton
                      onClick={(e) => setAnchor(e.currentTarget)}
                      disabled={selected.length < 2 && selectedVoucher.length < 2}
                    >
                      <MoreHoriz />
                    </IconButton>

                    <Menu
                      className="FstoTableMenu-root"
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
                      {
                        state === 'pending-cheque' &&
                        <MenuItem
                          sx={{ fontWeight: 500 }}
                          onClick={() => {
                            setAnchor(null)
                            onReceiveAll()
                          }}
                          dense
                        >
                          <TaskOutlined sx={{ fontSize: 21, marginRight: 1, opacity: 0.75 }} /> Receive
                        </MenuItem>}

                      {
                        state === 'cheque-receive' &&
                        <MenuItem
                          sx={{ fontWeight: 500 }}
                          onClick={() => {
                            setAnchor(null)
                            onManageAll(selectedVoucher)
                          }}
                          dense
                        >
                          <DescriptionOutlined sx={{ fontSize: 21, marginRight: 1, opacity: 0.75 }} /> Manage
                        </MenuItem>}
                    </Menu>
                  </TableCell>}

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
                  <TableRow className="FstoTableRow-root" key={index} selected={selected.includes(item.id) || selectedVoucher.some((selectedItem) => selectedItem.id === item.id)} hover>
                    {
                      state === 'pending-cheque' && status === 'success' &&
                      <TableCell className="FstoTableCell-root FstoTableCell-body" align="center">
                        <Checkbox className="FstoCheckbox-root" onChange={onCheck} value={item.id} checked={selected.includes(item.id)} />
                      </TableCell>}

                    {
                      state === 'cheque-receive' && status === 'success' &&
                      <TableCell className="FstoTableCell-root FstoTableCell-body" align="center">
                        <Checkbox
                          className="FstoCheckbox-root"
                          value={JSON.stringify(item)}
                          checked={selectedVoucher.some((selectedItem) => selectedItem.id === item.id)}
                          disabled={selectedVoucher.some((selectedItem) => selectedItem.supplier.id !== item.supplier.id)}
                          onChange={onVoucherTick}
                        />
                      </TableCell>}

                    <TableCell className="FstoTableCell-root FstoTableCell-body">
                      <Typography className="FstoTypography-root FstoTypography-transaction" variant="button" gap={1}>
                        <span>TAG#{item.tag_no}</span>

                        &mdash;

                        <span>{item.voucher.no}</span>

                        &mdash;

                        <span>
                          {item.document.name}

                          <Chip className="FstoChip-root FstoChip-priority" label={item.supplier.type} size="small" color="secondary" />
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
                      {
                        !item.cheques.length &&
                        <Fragment>
                          &mdash;
                        </Fragment>}

                      {
                        !!item.cheques.length &&
                        <Fragment>
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
                            &#8369;
                            {item.cheques.at(0).amount?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                          </Typography>
                        </Fragment>}
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
                      <DocumentChequingActions
                        data={item}
                        state={state}
                        onReceive={onReceive}
                        onRevert={onRevert}
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

        <DocumentChequingTransaction
          {...manage}
          state={state}
          refetchData={refetchData}
          onHold={onHold}
          onUnhold={onUnhold}
          onReturn={onReturn}
          onVoid={onVoid}
        />

        <DocumentChequingDialog
          {...multiCheque}
          state={state}
          refetchData={refetchData}
          clearData={() => setSelectedVoucher([])}
        />

        <ReasonDialog {...reason} />
      </Paper>
    </Box >
  )
}

export default DocumentChequing