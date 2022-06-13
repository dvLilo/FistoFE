import React from 'react'

import { useNavigate } from 'react-router-dom'

import {
  Box,
  Paper,
  Typography,
  TextField,
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
  Tab
} from '@mui/material'

import {
  Search,
  Close
} from '@mui/icons-material'

import Preloader from '../../components/Preloader'
import ReasonDialog from '../../components/ReasonDialog'

import DocumentRequestingActions from './DocumentRequestingActions'
import DocumentRequestingTransaction from './DocumentRequestingTransaction'

const data = [
  {
    id: 43,
    date_requested: "2022-04-19 13:47:24",
    transaction_id: "MIS035",
    document_type: "PAD",
    company: "RDF Corporate Services",
    supplier: "1ST ADVENUE ADVERTISING",
    po_total_amount: 10000,
    referrence_total_amount: null,
    referrence_amount: null,
    document_amount: 10000,
    payment_type: "Full",
    status: "Pending"
  },
]

const ReturnedDocument = () => {

  const navigate = useNavigate()

  const [state, setState] = React.useState("return")

  const [view, setView] = React.useState({
    data: null,
    open: false,
    onClose: () => setView(currentValue => ({
      ...currentValue,
      open: false
    }))
  })

  const [reason, setReason] = React.useState({
    data: null,
    open: false,
    onClose: () => setReason(currentValue => ({
      ...currentValue,
      open: false
    }))
  })

  const onView = (data) => setView(currentValue => ({
    ...currentValue,
    data,
    open: true
  }))

  const onUpdate = (data) => {
    const { id } = data

    navigate(`/requestor/update-request/${id}`)
  }

  const onVoid = (data) => setReason(currentValue => ({
    ...currentValue,
    data,
    open: true
  }))

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperTable-root" elevation={1}>
        <Box className="FstoBoxToolbar2-root">
          <Box className="FstoBoxToolbar-left">
            <Typography variant="heading">Returned Requests</Typography>
          </Box>

          <Box className="FstoBoxToolbar-right">

            <Tabs
              className="FstoTabsToolbar-root"
              value={state}
              onChange={(e, value) => setState(value)}
              TabIndicatorProps={{
                className: "FstoTabsIndicator-root",
                children: <span className="FstoTabsIndicator-root" />
              }}
            >
              <Tab className="FstoTab-root" label="Returned" value="return" disableRipple />
              <Tab className="FstoTab-root" label="Held" value="hold" disableRipple />
              <Tab className="FstoTab-root" label="Voided" value="void" disableRipple />
            </Tabs>

            <TextField
              className="FstoTextFieldToolbar-root"
              variant="outlined"
              size="small"
              autoComplete="off"
              placeholder="Search"
              InputProps={{
                className: "FstoTextfieldSearch-root",
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => { }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              onChange={(e) => console.log(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") console.log(e.target.value)
              }}
            />
          </Box>
        </Box>

        <TableContainer className="FstoTableContainer-root">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell className="FstoTableHead-root">
                  <TableSortLabel>DATE REQUESTED</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel>TRANSACTION NO.</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel>DOCUMENT</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel>PAYMENT</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel>COMPANY</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel>SUPPLIER</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root" align="right">
                  <TableSortLabel>REF AMOUNT</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root" align="right">
                  <TableSortLabel>AMOUNT</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root" align="center">
                  <TableSortLabel>STATUS</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root" align="center">ACTIONS</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {
                !Boolean(data.length)
                  ? <Preloader row={5} col={10} />
                  : data.map((item, index) => (
                    <TableRow hover key={index}>
                      <TableCell className="FstoTableData-root">
                        {item.date_requested}
                      </TableCell>

                      <TableCell className="FstoTableData-root">
                        {item.transaction_id}
                      </TableCell>

                      <TableCell className="FstoTableData-root">
                        {item.document_type}
                      </TableCell>

                      <TableCell className="FstoTableData-root">
                        {item.payment_type}
                      </TableCell>

                      <TableCell className="FstoTableData-root">
                        {item.company}
                      </TableCell>

                      <TableCell className="FstoTableData-root">
                        {item.supplier}
                      </TableCell>

                      <TableCell className="FstoTableData-root" align="right">
                        {
                          item.referrence_amount
                            ? <>&#8369;{item.referrence_amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</>
                            : <>&mdash;</>
                        }
                      </TableCell>

                      <TableCell className="FstoTableData-root" align="right">
                        {
                          item.document_amount
                            ? <>&#8369;{item.document_amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</>
                            : <>&mdash;</>
                        }
                      </TableCell>

                      <TableCell className="FstoTableData-root" align="center">
                        {item.status}
                      </TableCell>

                      <TableCell className="FstoTableData-root" align="center">
                        <DocumentRequestingActions
                          state={state}
                          data={item}
                          onView={onView}
                          onUpdate={onUpdate}
                          onVoid={onVoid}
                        />
                      </TableCell>
                    </TableRow>
                  ))
              }
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          className="FstoTablePagination-root"
          component="div"
          count={0}
          page={0}
          rowsPerPage={10}
          onPageChange={(e, page) => console.log(page)}
          onRowsPerPageChange={(e) => console.log(e.target.value)}
          rowsPerPageOptions={[10, 20, 50, 100]}
          showFirstButton
          showLastButton
        />

        <DocumentRequestingTransaction {...view} />

        <ReasonDialog onSuccess={() => { }} {...reason} />
      </Paper>
    </Box>
  )
}

export default ReturnedDocument