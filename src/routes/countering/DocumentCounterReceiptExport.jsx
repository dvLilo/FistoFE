import React from 'react'

import moment from 'moment'

import * as XLSX from 'xlsx'

import DateAdapter from '@mui/lab/AdapterDateFns'

import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material'

import {
  DatePicker,
  LocalizationProvider
} from '@mui/lab'

import CloseIcon from '@mui/icons-material/Close'

import useSuppliers from '../../hooks/useSuppliers'
import useDepartments from '../../hooks/useDepartments'
import DocumentCounterReceiptReceiver from './DocumentCounterReceiptReceiver'

const DocumentCounterReceiptExport = (props) => {

  const {
    open = false,
    onClose = () => { }
  } = props

  const {
    status: SUPPLIER_STATUS,
    data: SUPPLIER_LIST = []
  } = useSuppliers()

  const {
    status: DEPARTMENT_STATUS,
    data: DEPARTMENT_LIST = []
  } = useDepartments()

  const [data, setData] = React.useState([
    {
      id: 1,
      no: 1001,
      receipt: {
        type: "SI",
        no: "REF#10001",
        amount: 10000,
        date: "10/03/2022"
      },
      supplier: {
        id: 38,
        name: "8 SOURCES, INC."
      },
      department: {
        id: 12,
        name: "Management Information System Common"
      },
      receiver: null
    },
    {
      id: 2,
      no: 1001,
      receipt: {
        type: "SI",
        no: "REF#10002",
        amount: 13000,
        date: "10/03/2022"
      },
      supplier: {
        id: 38,
        name: "8 SOURCES, INC."
      },
      department: {
        id: 12,
        name: "Management Information System Common"
      },
      receiver: null
    }
  ])

  const [filter, setFilter] = React.useState({
    status: null,
    departments: [],
    suppliers: [],
    to: null,
    from: null
  })

  const submitReceiverHandler = (name, index) => {
    setData(currentValue => {
      return currentValue.map((item, itemIndex) => {
        if (itemIndex === index) {
          return {
            ...item,
            receiver: name
          }
        }

        return item
      })
    })
  }

  const clearReceiverHandler = (index) => {
    setData(currentValue => {
      return currentValue.map((item, itemIndex) => {
        if (itemIndex === index) {
          return {
            ...item,
            receiver: null
          }
        }

        return item
      })
    })
  }

  const exportCounterReceiptHandler = () => {
    const excelHeader = {
      header: [
        "Counter Receipt No.",
        "Date Transact",
        "Receipt Type",
        "Receipt No.",
        "Amount",
        "Supplier",
        "Department",
        "Receiver"
      ]
    }
    const excelData = data.map((item) => {
      return {
        "Counter Receipt No.": item.no,
        "Date Transact": item.receipt.date,
        "Receipt Type": item.receipt.type,
        "Receipt No.": item.receipt.no,
        "Amount": item.receipt.amount,
        "Supplier": item.supplier.name,
        "Department": item.department.name,
        "Receiver": item.receiver
      }
    })

    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(excelData, excelHeader)

    worksheet['!cols'] = [
      { wpx: 140 },
      { wpx: 105 },
      { wpx: 100 },
      { wpx: 120 },
      { wpx: 120 },
      { wpx: 300 },
      { wpx: 300 },
      { wpx: 300 }
    ]

    worksheet['A1'].alignment = {
      vertical: 'center',
      horizontal: 'center'
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, "Counter Receipt")
    XLSX.writeFile(workbook, "Counter Receipt.xlsx")
  }

  return (
    <Dialog
      className="FstoDialogExport-root"
      open={open}
      scroll="body"
      maxWidth="xl"
      PaperProps={{
        className: "FstoPaperExport-root"
      }}
      fullWidth
      disablePortal
    >
      <Box className="FstoBoxExport-root">
        <DialogTitle className="FstoDialogExport-title">
          Counter Receipt Memo
          <IconButton size="large" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent className="FstoDialogExport-content">
          <Stack className="FstoStackExport-root" direction="row" gap={1}>
            <Autocomplete
              size="small"
              options={["Processed", "Unprocessed"]}
              value={filter.status}
              renderInput={
                (props) => <TextField {...props} label="Status" variant="outlined" />
              }
              isOptionEqualToValue={
                (option, value) => option === value
              }
              onChange={(e, value) => setFilter(currentValue => ({
                ...currentValue,
                status: value
              }))}
              fullWidth
              disableClearable
            />

            <Autocomplete
              size="small"
              options={DEPARTMENT_LIST}
              value={filter.departments}
              loading={
                DEPARTMENT_STATUS === 'loading'
              }
              renderInput={
                (props) => <TextField {...props} label="Department" variant="outlined" />
              }
              getOptionLabel={
                (option) => option.name
              }
              isOptionEqualToValue={
                (option, value) => option.id === value.id
              }
              ChipProps={{
                sx: {
                  height: 20
                }
              }}
              limitTags={1}
              onChange={(e, value) => setFilter(currentValue => ({
                ...currentValue,
                departments: value
              }))}
              multiple
              fullWidth
              disableCloseOnSelect
            />

            <Autocomplete
              size="small"
              options={SUPPLIER_LIST}
              value={filter.suppliers}
              loading={
                SUPPLIER_STATUS === 'loading'
              }
              renderInput={
                (props) => <TextField {...props} label="Supplier" variant="outlined" />
              }
              getOptionLabel={
                (option) => option.name
              }
              isOptionEqualToValue={
                (option, value) => option.id === value.id
              }
              ChipProps={{
                sx: {
                  height: 20
                }
              }}
              limitTags={1}
              onChange={(e, value) => setFilter(currentValue => ({
                ...currentValue,
                suppliers: value
              }))}
              multiple
              fullWidth
              disableCloseOnSelect
            />

            <LocalizationProvider dateAdapter={DateAdapter}>
              <DatePicker
                value={filter.from}
                onChange={(value) => setFilter(currentValue => ({
                  ...currentValue,
                  from: moment(value).format("MM/DD/YYYY")
                }))}
                renderInput={
                  (props) => <TextField {...props} label="From Date" variant="outlined" size="small" fullWidth />
                }
                showToolbar
                showTodayButton
              />

              <DatePicker
                value={filter.to}
                onChange={(value) => setFilter(currentValue => ({
                  ...currentValue,
                  to: moment(value).format("MM/DD/YYYY")
                }))}
                renderInput={
                  (props) => <TextField {...props} label="To Date" variant="outlined" size="small" fullWidth />
                }
                showToolbar
                showTodayButton
              />
            </LocalizationProvider>

            <Button
              variant="contained"
              sx={{
                fontSize: 'inherit',
                minWidth: 96
              }}
              disableElevation
            >
              Generate
            </Button>
          </Stack>

          <Divider className="FstoDividerExport-root" />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>COUNTER RECEIPT NO.</TableCell>

                  <TableCell>DATE TRANSACT</TableCell>

                  <TableCell>RECEIPT TYPE</TableCell>

                  <TableCell>RECEIPT NO.</TableCell>

                  <TableCell align="right">AMOUNT</TableCell>

                  <TableCell>SUPPLIER</TableCell>

                  <TableCell>DEPARTMENT</TableCell>

                  <TableCell>RECEIVER</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {
                  data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {item.no}
                      </TableCell>

                      <TableCell>
                        {item.receipt.date}
                      </TableCell>

                      <TableCell>
                        {item.receipt.type}
                      </TableCell>

                      <TableCell>
                        {item.receipt.no}
                      </TableCell>

                      <TableCell align="right">
                        {
                          item.receipt.amount.toLocaleString("default", {
                            style: "currency",
                            currency: "PHP",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                      </TableCell>

                      <TableCell>
                        {item.supplier.name}
                      </TableCell>

                      <TableCell>
                        {item.department.name}
                      </TableCell>

                      <TableCell>
                        <DocumentCounterReceiptReceiver
                          index={index}
                          receiver={item.receiver}
                          data={data}
                          onSubmit={submitReceiverHandler}
                          onClear={clearReceiverHandler}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>

        <DialogActions className="FstoDialogExport-actions">
          <Button variant="contained" onClick={exportCounterReceiptHandler} disableElevation>Download</Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default DocumentCounterReceiptExport