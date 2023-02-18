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
  TextField,
  Typography
} from '@mui/material'

import {
  DatePicker,
  LocalizationProvider
} from '@mui/lab'

import CloseIcon from '@mui/icons-material/Close'
import DownloadIcon from '@mui/icons-material/Download';

import EmptyImage from '../../assets/img/empty.svg'

import Preloader from '../../components/Preloader'

import useToast from '../../hooks/useToast'
import useSuppliers from '../../hooks/useSuppliers'
import useDepartments from '../../hooks/useDepartments'
import useCounterReceipts from '../../hooks/useCounterReceipts'

import DocumentCounterReceiptReceiver from './DocumentCounterReceiptReceiver'

const DocumentCounterReceiptExport = (props) => {

  const {
    open = false,
    onClose = () => { }
  } = props

  const [enabled, setEnabled] = React.useState(false)

  const {
    status,
    data: counterReceiptsData,
    generateData
  } = useCounterReceipts("/api/counter-receipts", null, {
    enabled: enabled
  })

  console.log(status)

  const toast = useToast()

  const {
    status: SUPPLIER_STATUS,
    data: SUPPLIER_LIST = []
  } = useSuppliers()

  const {
    status: DEPARTMENT_STATUS,
    data: DEPARTMENT_LIST = []
  } = useDepartments()

  const [data, setData] = React.useState([])

  const [notice, setNotice] = React.useState(0)
  const [filter, setFilter] = React.useState({
    state: "Processed",
    departments: [],
    suppliers: [],
    to: moment().format("YYYY-MM-DD"),
    from: moment().format("YYYY-MM-DD")
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

  const generateCounterReceiptHandler = () => {
    setEnabled(true)

    generateData(filter)
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

  React.useEffect(() => {
    if (status === `success` && counterReceiptsData !== undefined) setData(counterReceiptsData)

  }, [status, counterReceiptsData])

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
              disabled={
                status === `loading`
              }
              disableElevation
            >
              Generate
            </Button>
          </Stack>

          <Divider className="FstoDividerExport-root" />

          <TableContainer className="FstoTableContainer-root FstoTableContainerCounter-root">
            <Table className="FstoTableCounter-root">
              <TableHead className="FstoTableHeadCounter-root">
                <TableRow className="FstoTableRowCounter-root">
                  <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-head">
                    COUNTER RECEIPT NO.
                  </TableCell>

                  <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-head">
                    DATE TRANSACT
                  </TableCell>

                  <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-head">
                    RECEIPT TYPE
                  </TableCell>

                  <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-head">
                    RECEIPT NO.
                  </TableCell>

                  <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-head" align="right">
                    AMOUNT
                  </TableCell>

                  <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-head">
                    SUPPLIER
                  </TableCell>

                  <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-head">
                    DEPARTMENT
                  </TableCell>

                  <TableCell className="FstoTableCellCounter-root FstoTableCellCounter-head">
                    RECEIVER
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {
                  status === 'loading'
                  && <Preloader col={10} row={5} />}

                {
                  status === 'success'
                  && data.map((item, index) => (
                    <TableRow className="FstoTableRowCounter-root" key={index}>
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
                  ))}
              </TableBody>
            </Table>

            {
              (status === 'error' || status === 'idle') &&
              <React.Fragment>
                <Divider variant="fullWidth" />

                <Box className="FstoTableBox-root">
                  <img alt="No Data" src={EmptyImage} />
                  <Typography variant="body1">NO RECORDS FOUND</Typography>
                </Box>
              </React.Fragment>}
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