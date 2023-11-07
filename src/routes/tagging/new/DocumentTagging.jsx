import React from 'react'

import moment from 'moment'

import { useDispatch } from 'react-redux'

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
  // Divider,
  OutlinedInput,
  Checkbox,
  Menu,
  MenuItem
} from '@mui/material'

import {
  Search,
  AccessTime,
  MoreHoriz,
  TaskOutlined
} from '@mui/icons-material'

import statusColor from '../../../colors/statusColor'

import useToast from '../../../hooks/useToast'

import useReason from '../../../hooks/useReason'
import useConfirmation from '../../../hooks/useConfirmation'
import useTransactionParams from '../../../hooks/useTransactionParams'

import {
  useFetchTransactionsQuery,
  useMutateTransactionMutation,

  useReceiveTransactionsMutation
} from '../../../features/transactions/transactions.api'

import { openTransaction } from '../../../features/dialog/dialog.slice'

import {
  TAG,
  RECEIVE,
  HOLD,
  UNHOLD,
  RETURN,
  UNRETURN,
  VOID
} from '../../../constants'

import EmptyImage from '../../../assets/img/empty.svg'

import TablePreloader from '../../../components/TablePreloader'
import FilterPopover from '../../../components/FilterPopover'

import DocumentTaggingActions from './DocumentTaggingActions'
import DocumentTaggingTransaction from './DocumentTaggingTransaction'

const DocumentTagging = () => {

  const {
    params,
    changePage,
    changeRows,
    changeStatus,

    searchData,
    filterData
  } = useTransactionParams({ state: "pending" })

  const {
    data: transactions,

    isLoading,
    isFetching,
    isSuccess,
    isError,

    // error
  } = useFetchTransactionsQuery(params, { refetchOnMountOrArgChange: true })

  // console.log("Params: ", params)

  const [mutateTransaction] = useMutateTransactionMutation()
  const [receiveTransactions] = useReceiveTransactionsMutation()

  const dispatch = useDispatch()

  const toast = useToast()

  const reason = useReason()
  const confirmation = useConfirmation()

  const [anchor, setAnchor] = React.useState(null)

  const [selected, setSelected] = React.useState([])


  const [manage, setManage] = React.useState({
    open: false,
    transaction: null,
    onBack: undefined,
    onClose: () => setManage(currentValue => ({
      ...currentValue,
      open: false
    }))
  })

  // const onManage = (transaction) => {
  //   setManage(currentValue => ({
  //     ...currentValue,
  //     transaction,
  //     open: true,
  //     onBack: onManage
  //   }))
  // }

  const onManage = (ID) => dispatch(openTransaction(ID))

  const onView = (transaction) => {
    setManage(currentValue => ({
      ...currentValue,
      transaction,
      open: true,
      onBack: onView
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
    confirmation({
      title: "Confirmation",
      description: "Are you sure you want to receive these transactions?",
      callback: () => receiveTransactions({ process: TAG, transactions: selected, }).unwrap()
    }).then((response) => {
      if (response.isConfirmed) {
        toast({
          title: "Success!",
          message: response.result.message,
        })
      }
    }).catch((error) => {
      console.log("Bulk receiving error: ", error)

      if (error.isConfirmed) {
        toast({
          severity: "error",
          title: "Error!",
          message: "Something went wrong whilst trying to receive these transactions. Please try again later."
        })
      }
    })
  }

  const onReceive = (ID) => {
    confirmation({
      title: "Confirmation",
      description: "Are you sure you want to receive this transaction?",
      callback: () => mutateTransaction({ id: ID, process: TAG, subprocess: RECEIVE, }).unwrap()
    }).then((response) => {
      if (response.isConfirmed) {
        toast({
          title: "Success!",
          message: response.result.message,
        })
      }
    }).catch((error) => {
      console.log("Receiving error: ", error)

      if (error.isConfirmed) {
        toast({
          severity: "error",
          title: "Error!",
          message: "Something went wrong whilst trying to receive transaction. Please try again later."
        })
      }
    })
  }

  const onHold = (ID) => {
    reason({
      title: "Confirmation",
      description: "Are you sure you want to hold this transaction?",
      callback: (REASON) => mutateTransaction({ id: ID, process: TAG, subprocess: HOLD, reason: REASON }).unwrap()
    }).then((response) => {
      if (response.isConfirmed) {
        toast({
          title: "Success!",
          message: response.result.message,
        })
      }
    }).catch((error) => {
      console.log("Holding error: ", error)

      if (error.isConfirmed) {
        toast({
          severity: "error",
          title: "Error!",
          message: "Something went wrong whilst trying to hold transaction. Please try again later."
        })
      }
    })
  }

  const onUnhold = (ID) => {
    confirmation({
      title: "Confirmation",
      description: "Are you sure you want to unhold this transaction?",
      callback: () => mutateTransaction({ id: ID, process: TAG, subprocess: UNHOLD, }).unwrap()
    }).then((response) => {
      if (response.isConfirmed) {
        toast({
          title: "Success!",
          message: response.result.message,
        })
      }
    }).catch((error) => {
      console.log("Unholding error: ", error)

      if (error.isConfirmed) {
        toast({
          severity: "error",
          title: "Error!",
          message: "Something went wrong whilst trying to unhold transaction. Please try again later."
        })
      }
    })
  }

  const onReturn = (ID) => {
    reason({
      title: "Confirmation",
      description: "Are you sure you want to return this transaction?",
      callback: (REASON) => mutateTransaction({ id: ID, process: TAG, subprocess: RETURN, reason: REASON }).unwrap()
    }).then((response) => {
      if (response.isConfirmed) {
        toast({
          title: "Success!",
          message: response.result.message,
        })
      }
    }).catch((error) => {
      console.log("Returning error: ", error)

      if (error.isConfirmed) {
        toast({
          severity: "error",
          title: "Error!",
          message: "Something went wrong whilst trying to return transaction. Please try again later."
        })
      }
    })
  }

  const onUnreturn = (ID) => {
    confirmation({
      title: "Confirmation",
      description: "Are you sure you want to unreturn this transaction?",
      callback: () => mutateTransaction({ id: ID, process: TAG, subprocess: UNRETURN, }).unwrap()
    }).then((response) => {
      if (response.isConfirmed) {
        toast({
          title: "Success!",
          message: response.result.message,
        })
      }
    }).catch((error) => {
      console.log("Unreturning error: ", error)

      if (error.isConfirmed) {
        toast({
          severity: "error",
          title: "Error!",
          message: "Something went wrong whilst trying to unreturn transaction. Please try again later."
        })
      }
    })
  }

  const onVoid = (ID) => {
    reason({
      title: "Confirmation",
      description: "Are you sure you want to void this transaction? Please note that you cannot undo this action.",
      callback: (REASON) => mutateTransaction({ id: ID, process: TAG, subprocess: VOID, reason: REASON }).unwrap()
    }).then((response) => {
      if (response.isConfirmed) {
        toast({
          title: "Success!",
          message: response.result.message,
        })
      }
    }).catch((error) => {
      console.log("Voiding error: ", error)

      if (error.isConfirmed) {
        toast({
          severity: "error",
          title: "Error!",
          message: "Something went wrong whilst trying to void transaction. Please try again later."
        })
      }
    })
  }


  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperTable-root" elevation={1}>
        <Stack className="FstoStackToolbar-root" justifyContent="space-between" gap={2}>
          <Stack className="FstoStackToolbar-item" direction="row" justifyContent="center" gap={2}>
            <Typography variant="heading">
              Tagging of Documents
            </Typography>
          </Stack>

          <Stack className="FstoStackToolbar-item" direction="column" justifyContent="center" gap={1}>
            <Tabs
              className="FstoTabsToolbar-root"
              value={params.state}
              onChange={(e, value) => {
                changeStatus(value)

                setSelected([])
              }}
              TabIndicatorProps={{
                className: "FstoTabsIndicator-root",
                children: <span className="FstoTabsIndicator-root" />
              }}
            >
              <Tab className="FstoTab-root" label="Requested" value="pending" disableRipple />
              <Tab className="FstoTab-root" label="Received" value="tag-receive" disableRipple />
              <Tab className="FstoTab-root" label="Tagged" value="tag-tag" disableRipple />
              <Tab className="FstoTab-root" label="Held" value="tag-hold" disableRipple />
              <Tab className="FstoTab-root" label="Returned" value="tag-return" disableRipple />
              <Tab className="FstoTab-root" label="Voided" value="tag-void" disableRipple />
            </Tabs>

            <Stack direction="row" alignItems="center" justifyContent="center" gap={1}>
              <OutlinedInput
                className="FstoTextFieldSearch-root"
                size="small"
                autoComplete="off"
                placeholder="Search"
                inputProps={{
                  type: "search"
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                }
                onKeyPress={(e) => {
                  if (e.key === "Enter") searchData(e.target.value)
                }}
                onChange={(e) => {
                  if (!e.target.value) searchData("")
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
                  params.state === 'pending' && isSuccess && !isLoading && !isFetching &&
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

                <TableCell className="FstoTableCell-root FstoTableCell-head">TRANSACTION</TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">REQUESTOR</TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">CHARGING</TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">AMOUNT DETAILS</TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">PO DETAILS</TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head" align="center">STATUS</TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head" align="center">ACTIONS</TableCell>
              </TableRow>
            </TableHead>

            {
              (isLoading || isFetching) && (
                <TableBody className="FstoTableBody-root">
                  <TablePreloader row={3} />
                </TableBody>
              )
            }

            {
              (isSuccess && !isLoading && !isFetching) && (
                <TableBody className="FstoTableBody-root">
                  {
                    transactions.data.map((item, index) => (
                      <TableRow className="FstoTableRow-root" key={index} selected={selected.includes(item.id)} hover>
                        {
                          params.state === 'pending' && isSuccess && !isLoading && !isFetching &&
                          <TableCell className="FstoTableCell-root FstoTableCell-body" align="center">
                            <Checkbox className="FstoCheckbox-root" onChange={onCheck} value={item.id} checked={selected.includes(item.id)} />
                          </TableCell>}

                        <TableCell className="FstoTableCell-root FstoTableCell-body">
                          <Typography className="FstoTypography-root FstoTypography-transaction" variant="button">
                            {
                              params.state === `tag-tag`
                                ? `TAG#${item.tag_no}`
                                : item.transaction_id
                            }
                            &nbsp;&mdash;&nbsp;
                            {item.document_type}
                            {
                              item.receipt_type?.toLowerCase() === `official` &&
                              <Chip className="FstoChip-root FstoChip-latest" label={item.receipt_type} size="small" color="primary" />
                            }
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
                            {
                              item.supplier.supplier_type.id === 2 &&
                              <Chip className="FstoChip-root FstoChip-priority" label={item.supplier.supplier_type.name} size="small" color="default" />
                            }
                            {
                              item.supplier.supplier_type.id === 3 &&
                              <Chip className="FstoChip-root FstoChip-priority" label={item.supplier.supplier_type.name} size="small" color="default" />
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
                            {item.users.first_name.toLowerCase()} {item.users.middle_name?.toLowerCase()} {item.users.last_name.toLowerCase()}
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
                          <Chip className="FstoChip-root FstoChip-status" label={item.status} size="small" color="primary" sx={{ backgroundColor: statusColor(item.status) }} />
                        </TableCell>

                        <TableCell className="FstoTableCell-root FstoTableCell-body" align="center">
                          <DocumentTaggingActions
                            data={item}
                            state={params.state}
                            onReceive={onReceive}
                            onCancel={onUnreturn}
                            onManage={onManage}
                            onView={onView}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              )
            }

            {
              (isError && !isLoading && !isFetching) && (
                <TableBody className="FstoTableBody-root">
                  <TableRow className="FstoTableRow-root">
                    <TableCell className="FstoTableCell-root FstoTableCell-body" align="center" colSpan={7}>
                      <img alt="No Data" src={EmptyImage} />
                      <Typography variant="body1">NO RECORDS FOUND</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )
            }
          </Table>
        </TableContainer>

        <TablePagination
          className="FstoTablePagination-root"
          component="div"
          count={transactions ? transactions.total : 0}
          page={transactions ? transactions.current_page - 1 : 0}
          rowsPerPage={transactions ? transactions.per_page : 10}
          onPageChange={(e, page) => changePage(page)}
          onRowsPerPageChange={(e) => changeRows(e.target.value)}
          rowsPerPageOptions={[10, 15, 20]}
          showFirstButton
          showLastButton
        />

        <DocumentTaggingTransaction state={params.state} onHold={onHold} onUnhold={onUnhold} onReturn={onReturn} onUnreturn={onUnreturn} onVoid={onVoid} {...manage} />
      </Paper>
    </Box >
  )
}

export default DocumentTagging