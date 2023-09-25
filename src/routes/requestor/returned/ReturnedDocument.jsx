import React from 'react'

import moment from 'moment'

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
  Close
} from '@mui/icons-material'

import statusColor from '../../../colors/statusColor'

import useTransactions from '../../../hooks/useTransactions'

import {
  REQUESTOR,
  VOID,
} from '../../../constants'

import EmptyImage from '../../../assets/img/empty.svg'

import ReasonDialog from '../../../components/ReasonDialog'
import Preloader from '../../../components/Preloader'
import FilterPopover from '../../../components/FilterPopover'

import ReturnedDocumentActions from './ReturnedDocumentActions'

import DocumentRequestingTransaction from '../DocumentRequestingTransaction'

const ReturnedDocument = () => {

  const {
    status,
    data,
    refetchData,
    searchData,
    filterData,
    changeStatus,
    changePage,
    changeRows
  } = useTransactions("/api/transactions", "return-request")

  const navigate = useNavigate()

  const [search, setSearch] = React.useState("")
  const [state, setState] = React.useState("return-request")

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

  const onView = (transaction) => {
    setManage(currentValue => ({
      ...currentValue,
      transaction,
      open: true,
      onBack: onView
    }))
  }

  const onVoid = (data) => {
    setReason(currentValue => ({
      ...currentValue,
      open: true,
      process: REQUESTOR,
      subprocess: VOID,
      data,
    }))
  }

  const onUpdate = (data) => {
    const { id } = data

    navigate(`/request/update-request/${id}`)
  }

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperTable-root" elevation={1}>
        <Stack className="FstoStackToolbar-root" justifyContent="space-between" gap={2}>
          <Stack className="FstoStackToolbar-item" direction="row" justifyContent="center" gap={2}>
            <Typography variant="heading">
              Returned Requests
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
              <Tab className="FstoTab-root" label="Returned" value="return-request" disableRipple />
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
                        <ReturnedDocumentActions
                          data={data}
                          state={state}
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

        <DocumentRequestingTransaction
          {...manage}
        />

        <ReasonDialog
          {...reason}
        />
      </Paper>
    </Box>
  )
}

export default ReturnedDocument