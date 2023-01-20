import React from 'react'

import axios from 'axios'

import moment from 'moment'

import * as XLSX from 'xlsx'

import DateAdapter from '@mui/lab/AdapterDateFns'

import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
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
import DownloadIcon from '@mui/icons-material/Download';

import useToast from '../../hooks/useToast'
import useSuppliers from '../../hooks/useSuppliers'
import useDepartments from '../../hooks/useDepartments'

import DocumentCounterReceiptReceiver from './DocumentCounterReceiptReceiver'

const DocumentCounterReceiptExport = (props) => {

  const {
    open = false,
    onClose = () => { }
  } = props

  const toast = useToast()

  const {
    status: SUPPLIER_STATUS,
    data: SUPPLIER_LIST = []
  } = useSuppliers()

  const {
    status: DEPARTMENT_STATUS,
    data: DEPARTMENT_LIST = []
  } = useDepartments()

  const [notice, setNotice] = React.useState(0)
  const [data, setData] = React.useState([])

  const [filter, setFilter] = React.useState({
    state: null,
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

  const generateCounterReceiptHandler = async () => {
    let response
    try {
      response = await axios.get(`/api/counter-receipts`, {
        params: {
          paginate: 0,
          state: filter.state,
          from: filter.from,
          to: filter.to,
          departments: JSON.stringify(filter.departments.map((item) => item.id)),
          suppliers: JSON.stringify(filter.suppliers.map((item) => item.id))
        }
      })

      setData(response.data.result)
    } catch (error) {
      if (error.request.status === 404)
        return setData([])

      toast({
        open: true,
        severity: "error",
        title: "Error!",
        message: `Something went wrong whilst trying to void this transaction. Please try again later.`
      })
    }
  }

  const exportCounterReceiptHandler = async () => {
    let response
    try {
      response = await axios.post(`/api/counter-receipts/download`, {
        with_memo: notice,
        counter_receipts: data
      })

      if (response.status) {
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
            "Counter Receipt No.": item.counter_receipt_no,
            "Date Transact": item.date_transaction,
            "Receipt Type": item.receipt_type,
            "Receipt No.": item.receipt_no,
            "Amount": item.amount,
            "Supplier": item.supplier,
            "Department": item.department,
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
          { wpx: 90 },
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
    } catch (error) {
      toast({
        open: true,
        severity: "error",
        title: "Error!",
        message: `Something went wrong whilst trying to void this transaction. Please try again later.`
      })
    }
  }

  const closeHandler = () => {
    setData([])
    setNotice(false)

    onClose()
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
          <IconButton size="large" onClick={closeHandler}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent className="FstoDialogExport-content">
          <Stack className="FstoStackExport-root" direction="row" gap={1}>
            <Autocomplete
              size="small"
              options={["Processed", "Unprocessed"]}
              value={filter.state}
              renderInput={
                (props) => <TextField {...props} label="Status" variant="outlined" />
              }
              isOptionEqualToValue={
                (option, value) => option === value
              }
              onChange={(e, value) => setFilter(currentValue => ({
                ...currentValue,
                state: value
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
                  from: moment(value).format("YYYY-MM-DD")
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
                  to: moment(value).format("YYYY-MM-DD")
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
              onClick={generateCounterReceiptHandler}
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
                        {item.counter_receipt_no}
                      </TableCell>

                      <TableCell>
                        {item.date_transaction}
                      </TableCell>

                      <TableCell>
                        {item.receipt_type}
                      </TableCell>

                      <TableCell>
                        {item.receipt_no}
                      </TableCell>

                      <TableCell align="right">
                        {
                          item.amount.toLocaleString("default", {
                            style: "currency",
                            currency: "PHP",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                      </TableCell>

                      <TableCell>
                        {item.supplier}
                      </TableCell>

                      <TableCell>
                        {item.department}
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
          <FormControlLabel
            label="Issued Memo"
            checked={Boolean(notice)}
            onChange={(e) => setNotice(e.target.checked ? 1 : 0)}
            control={<Checkbox size="medium" />}
          />

          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={exportCounterReceiptHandler}
            disableElevation
          > Download
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default DocumentCounterReceiptExport