import React from 'react'

import { Link } from 'react-router-dom'

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
  OutlinedInput
} from '@mui/material'

import {
  Add,
  Search,
  Close
} from '@mui/icons-material'

import Preloader from '../../components/Preloader'
import FilterPopover from '../../components/FilterPopover'

const DocumentCounterReceiptCreating = () => {

  const [search, setSearch] = React.useState("")

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
                      // searchData(null)
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </InputAdornment>
              }
              onChange={(e) => setSearch(e.target.value)}
            // onKeyPress={(e) => {
            //   if (e.key === "Enter") searchData(e.target.value)
            // }}
            />

            <FilterPopover />
          </Stack>
        </Stack>

        <TableContainer className="FstoTableContainer-root">
          <Table className="FstoTable-root" size="small">
            <TableHead className="FstoTableHead-root">
              <TableRow className="FstoTableRow-root">
                <TableCell className="FstoTableCell-root FstoTableCell-head">DATE COUNTERED</TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">COUNTER RECEIPT NO.</TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">DATE TRANSACT</TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">RECEIPT TYPE</TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">RECEIPT NO.</TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">SUPPLIER</TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">DEPARTMENT</TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">AMOUNT</TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">MEMO NOTICE</TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head" align="center">STATUS</TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head" align="center">ACTIONS</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <Preloader col={11} row={3} />
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          className="FstoTablePagination-root"
          component="div"
          // count={data ? data.total : 0}
          // page={data ? data.current_page - 1 : 0}
          // rowsPerPage={data ? data.per_page : 10}
          // onPageChange={(e, page) => changePage(page)}
          // onRowsPerPageChange={(e) => changeRows(e.target.value)}
          count={0}
          page={0}
          rowsPerPage={10}
          onPageChange={() => { }}
          onRowsPerPageChange={() => { }}
          rowsPerPageOptions={[10, 20, 50, 100]}
          showFirstButton
          showLastButton
        />
      </Paper>
    </Box>
  )
}

export default DocumentCounterReceiptCreating