import React from 'react'

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
  Tab,
  Stack
} from '@mui/material'

import {
  Search,
  Close
} from '@mui/icons-material'

import useConfirm from '../../hooks/useConfirm'

import Preloader from '../../components/Preloader'

import DocumentTransmittingFilter from './DocumentTransmittingFilter'
import DocumentTransmittingActions from './DocumentTransmittingActions'
import DocumentTransmittingTransaction from './DocumentTransmittingTransaction'

const data = [
  {
    id: 1,
    date_requested: "2022-05-12 11:46:28",
    transaction_id: "MIS076",
    tagged: {
      no: 92101,
      date: "2022-06-01 11:46:28"
    },
    document_type: "PAD",
    company: "RDF Corporate Services",
    supplier: "1ST ADVENUE ADVERTISING",
    po_total_amount: 10000,
    referrence_total_amount: null,
    referrence_amount: null,
    document_amount: 10000,
    payment_type: "Full",
    status: "Pending"
  }
]

const DocumentTransmitting = () => {

  const confirm = useConfirm()

  const [state, setState] = React.useState("pending")

  const [manage, setManage] = React.useState({
    data: null,
    open: false,
    onBack: undefined,
    onClose: () => setManage(currentValue => ({
      ...currentValue,
      open: false
    }))
  })

  const onReceive = (ID) => {
    confirm({
      open: true,
      onConfirm: () => console.log("Transaction", ID, "has been received.")
    })
  }

  const onManage = (data) => {
    setManage(currentValue => ({
      ...currentValue,
      data,
      open: true,
      onBack: onManage
    }))
  }

  const onView = (data) => {
    setManage(currentValue => ({
      ...currentValue,
      data,
      open: true
    }))
  }

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperTable-root" elevation={1}>
        <Box className="FstoBoxToolbar2-root">
          <Box className="FstoBoxToolbar-left">
            <Typography variant="heading">Transmittal of Document</Typography>
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
              <Tab className="FstoTab-root" label="Pending" value="pending" disableRipple />
              <Tab className="FstoTab-root" label="Received" value="receive" disableRipple />
              <Tab className="FstoTab-root" label="Transmitted" value="transmit" disableRipple />
            </Tabs>

            <Stack className="FstoStackToolbar-root" direction="row">
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

              <DocumentTransmittingFilter />
            </Stack>
          </Box>
        </Box>

        <TableContainer className="FstoTableContainer-root">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell className="FstoTableHead-root">
                  <TableSortLabel>DATE APPROVED</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel>TAG NO.</TableSortLabel>
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
                        {item.tagged.date}
                      </TableCell>

                      <TableCell className="FstoTableData-root">
                        {item.tagged.no}
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
                        <DocumentTransmittingActions
                          data={item}
                          state={state}
                          onReceive={onReceive}
                          onManage={onManage}
                          onView={onView}
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

        <DocumentTransmittingTransaction state={state} {...manage} />
      </Paper>
    </Box>
  )
}

export default DocumentTransmitting