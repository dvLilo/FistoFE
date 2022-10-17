import React from 'react'

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
  ButtonGroup,
  Button,
  OutlinedInput,
  Menu,
  MenuItem,
} from '@mui/material'

import {
  Search,
  Close,
  UploadFile,
  ExpandMore
} from '@mui/icons-material'

import Preloader from '../../../components/Preloader'
import FilterPopover from '../../../components/FilterPopover'

const ReportReceiveReceipt = () => {

  const importRef = React.useRef(null)
  const anchorRef = React.useRef(null)

  const [search, setSearch] = React.useState("")
  const [open, setOpen] = React.useState(false)

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperTable-root" elevation={1}>
        <Stack className="FstoStackToolbar-root" justifyContent="space-between" gap={2}>
          <Stack className="FstoStackToolbar-item" direction="row" justifyContent="center" gap={2}>
            <Typography variant="heading">
              Received Receipt Report
            </Typography>

            <ButtonGroup variant="contained" ref={anchorRef} disableElevation>
              <Button startIcon={<UploadFile />} onClick={() => importRef.current && importRef.current.click()}>
                Import
              </Button>

              <input ref={importRef} type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" hidden />

              <Button size="small" onClick={() => setOpen(currentValue => !currentValue)}>
                <ExpandMore />
              </Button>
            </ButtonGroup>
          </Stack>

          <Stack className="FstoStackToolbar-item" direction="column" alignItems="center" justifyContent="center" gap={1}>
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
        </Stack>

        <Menu
          open={open}
          anchorEl={anchorRef.current}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          elevation={1}
          onClose={() => setOpen(false)}
          disablePortal
        >
          <MenuItem dense>
            Export processed
          </MenuItem>

          <MenuItem dense>
            Export unprocessed
          </MenuItem>
        </Menu>

        <TableContainer className="FstoTableContainer-root">
          <Table className="FstoTable-root" size="small">
            <TableHead className="FstoTableHead-root">
              <TableRow className="FstoTableRow-root">
                <TableCell className="FstoTableCell-root FstoTableCell-head">DATE OF RR</TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">PO NUMBER</TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">RR NUMBER</TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">CR NUMBER</TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">DEPARTMENT</TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">SUPPLIER</TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head">AMOUNT</TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head" align="center">STATUS</TableCell>

                <TableCell className="FstoTableCell-root FstoTableCell-head" align="center">ACTIONS</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <Preloader col={9} row={20} />
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

export default ReportReceiveReceipt