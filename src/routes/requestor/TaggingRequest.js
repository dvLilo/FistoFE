import React from 'react'

// import axios from 'axios'
// eslint-disable-next-line
import { Link, useNavigate, useLocation } from 'react-router-dom'

import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  TablePagination,

  // Menu,
  // MenuItem,

  // Dialog,
  // DialogTitle,
  // DialogActions,
  // DialogContent,
  // Divider,
  // Chip,

  // List,
  // ListItem,
  // ListItemText,

  Tabs,
  Tab
} from '@mui/material'

import {
  Search,
  Close,
  Add
} from '@mui/icons-material'

import Transaction from '../../components/Transaction'
import Preloader from '../../components/Preloader'
import TaggingRequestActions from './TaggingRequestActions'

import useTransaction from '../../hooks/useTransaction'

const TaggingRequest = () => {

  const { status, data, searchData, changeStatus, changePage, changeRows } = useTransaction("/api/transactions")

  const [state, setState] = React.useState("request")
  const [search, setSearch] = React.useState("")

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperTable-root" elevation={1}>
        <Box className="FstoBoxToolbar2-root">
          <Box className="FstoBoxToolbar-left">
            <Typography variant="heading">Tagging of Request</Typography>

            <Button
              className="FstoButtonNew-root"
              variant="contained"
              component={Link}
              startIcon={<Add />}
              to="new-request"
              disableElevation
            >
              New
            </Button>
          </Box>

          <Box className="FstoBoxToolbar-right">
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
              <Tab className="FstoTab-root" label="Requested" value="request" disableRipple />
              <Tab className="FstoTab-root" label="Held" value="hold" disableRipple />
              <Tab className="FstoTab-root" label="Voided" value="void" disableRipple />
            </Tabs>

            <TextField
              className="FstoTextFieldToolbar-root"
              variant="outlined"
              size="small"
              autoComplete="off"
              placeholder="Search"
              value={search}
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
                      disabled={!Boolean(search)}
                      onClick={() => {
                        setSearch("")
                        searchData(null)
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") searchData(e.target.value)
              }}
            />
          </Box>
        </Box>

        <TableContainer className="FstoTableContainer-root">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={false}>DATE REQUESTED</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={false}>TRANSACTION NO.</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={false}>DOCUMENT</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={false}>COMPANY</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={false}>SUPPLIER</TableSortLabel>
                </TableCell>

                {/* <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={false}>PO AMOUNT</TableSortLabel>
                </TableCell> */}

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={false}>REF AMOUNT</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={false}>AMOUNT</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={false}>PAYMENT</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={false}>STATUS</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root" align="center">ACTIONS</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {
                status === 'loading'
                  ? <Preloader row={5} col={11} />
                  : data
                    ? data.data.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell className="FstoTableData-root">
                          {data.date_requested}
                        </TableCell>

                        <TableCell className="FstoTableData-root">
                          {data.transaction_id}
                        </TableCell>

                        <TableCell className="FstoTableData-root">
                          {data.document_type}
                        </TableCell>

                        <TableCell className="FstoTableData-root">
                          {data.company}
                        </TableCell>

                        <TableCell className="FstoTableData-root">
                          {data.supplier}
                        </TableCell>

                        {/* <TableCell className="FstoTableData-root">
                          {
                            data.po_total_amount
                              ? <>&#8369;{data.po_total_amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</>
                              : <>&mdash;</>
                          }
                        </TableCell> */}

                        <TableCell className="FstoTableData-root">
                          {
                            data.referrence_amount
                              ? <>&#8369;{data.referrence_amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</>
                              : <>&mdash;</>
                          }
                        </TableCell>

                        <TableCell className="FstoTableData-root">
                          {
                            data.document_amount
                              ? <>&#8369;{data.document_amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</>
                              : <>&mdash;</>
                          }
                        </TableCell>

                        <TableCell className="FstoTableData-root" sx={{ textTransform: "capitalize" }}>
                          {data.payment_type}
                        </TableCell>

                        <TableCell className="FstoTableData-root">
                          {data.status}
                        </TableCell>

                        <TableCell className="FstoTableData-root" align="center">
                          <TaggingRequestActions />
                        </TableCell>
                      </TableRow>
                    ))
                    : (
                      <TableRow>
                        <TableCell align="center" colSpan={11}>NO RECORDS FOUND</TableCell>
                      </TableRow>
                    )
              }
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={data ? data.total : 0}
          page={data ? data.current_page - 1 : 0}
          rowsPerPage={data ? data.per_page : 10}
          onPageChange={(e, page) => changePage(page)}
          onRowsPerPageChange={(e) => changeRows(e.target.value)}
          rowsPerPageOptions={[10, 20, 50, 100]}
        />

        <Transaction />
      </Paper>
    </Box>
  )
}

export default TaggingRequest