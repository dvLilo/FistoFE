import React from 'react'

import axios from 'axios'

import moment from 'moment'

import {
  useParams,
  useNavigate
} from 'react-router-dom'

import NumberFormat from 'react-number-format'

import DateAdapter from '@mui/lab/AdapterDateFns'

import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material'

import {
  DatePicker,
  LoadingButton,
  LocalizationProvider
} from '@mui/lab'

import {
  Add,
  Check,
  Delete,
  Edit
} from '@mui/icons-material'

import { createFilterOptions } from '@mui/material/Autocomplete'

import useToast from '../../hooks/useToast'
import useConfirm from '../../hooks/useConfirm'

import useSuppliers from '../../hooks/useSuppliers'
import useDepartments from '../../hooks/useDepartments'

const UpdateCounterReceipt = () => {

  const toast = useToast()
  const confirm = useConfirm()
  const navigate = useNavigate()

  const { id } = useParams()

  const {
    status: SUPPLIER_STATUS,
    data: SUPPLIER_LIST = []
  } = useSuppliers()

  const {
    status: DEPARTMENT_STATUS,
    data: DEPARTMENT_LIST = []
  } = useDepartments()

  const [isSaving, setIsSaving] = React.useState(false)

  const [error, setError] = React.useState({
    status: false,
    data: []
  })

  const [validate, setValidate] = React.useState({
    status: false,
    data: []
  })

  const [data, setData] = React.useState({
    transaction: null,
    supplier: null,
    remarks: ""
  })

  const [CR, setCR] = React.useState({
    receipt_no: "",
    receipt_type: null,
    date_transaction: null,
    amount: null,
    department: null,

    index: null,
    update: false
  })

  const [crGroup, setCrGroup] = React.useState([])


  React.useEffect(() => { // Fetch Counter Receipt
    (async () => {
      let response
      try {
        response = await axios.get(`/api/counter-receipts/${id}`)

        const {
          transaction,
          supplier,
          remarks,
          counter_receipt
        } = response.data.result

        setCrGroup([...counter_receipt])
        setData({ transaction, supplier, remarks })
      }
      catch (error) {
        console.log("Fisto Error Status", error.request)

        toast({
          open: true,
          severity: "error",
          title: "Error!",
          message: "Something went wrong whilst trying to connect to the server. Please try again later."
        })
      }
    })()

    // eslint-disable-next-line
  }, [])

  React.useEffect(() => { // Receipt Number Validation
    if (CR.receipt_no)
      checkCounterReceiptHandler()

    // eslint-disable-next-line
  }, [data.supplier])


  const addCounterReceiptHandler = () => {

    if (CR.update)
      setCrGroup(currentValue => {
        return [
          ...currentValue.map((item, index) => {
            if (CR.index === index)
              return {
                receipt_no: CR.receipt_no,
                receipt_type: CR.receipt_type,
                date_transaction: CR.date_transaction,
                amount: CR.amount,
                department: CR.department,
              }

            return item
          })
        ]
      })
    else
      setCrGroup(currentValue => {
        return [
          {
            department: CR.department,
            receipt_type: CR.receipt_type,
            receipt_no: CR.receipt_no,
            date_transaction: CR.date_transaction,
            amount: CR.amount
          },
          ...currentValue,
        ]
      })

    setCR({
      receipt_no: "",
      receipt_type: null,
      date_transaction: null,
      amount: NaN,
      department: null,

      index: null,
      update: false
    })
  }

  const checkCounterReceiptHandler = async () => {
    if (!CR.receipt_no) return

    if (error.status && error.data.cr_no) {
      delete error.data.cr_no
      setError(currentValue => ({
        ...currentValue,
        data: error.data
      }))
    }

    if (CR.receipt_no && !data.supplier) {
      return setError({
        status: true,
        data: {
          ...error.data,
          "cr_no": [
            "Supplier is required to validate receipt number."
          ]
        }
      })
    }

    const exist = crGroup.some((item) => item.no === CR.receipt_no)
    if (exist && !CR.update) {
      return setError({
        status: true,
        data: {
          ...error.data,
          "cr_no": [
            "Receipt number already in the list."
          ]
        }
      })
    }

    try {
      setValidate(currentValue => ({
        status: true,
        data: [
          ...currentValue.data, 'cr_no'
        ]
      }))

      await axios.post(`/api/counter-receipts/validate-receipt-no`, {
        receipt_no: CR.receipt_no,
        transaction_id: data.transaction.id,
        supplier_id: data.supplier.id
      })
    }
    catch (error) {
      if (error.request.status === 422) {
        const { errors } = error.response.data

        setError(currentValue => ({
          status: true,
          data: {
            ...currentValue.data,
            cr_no: errors["counter_receipt.receipt_no"]
          }
        }))
      }
    }

    setValidate(currentValue => ({
      ...currentValue,
      data: currentValue.data.filter((item) => item !== 'cr_no')
    }))
  }

  const updateCounterReceiptHandler = (data, index) => {
    setCR({
      update: true,
      index, ...data
    })
  }

  const removeCounterReceiptHandler = (data) => {
    setCrGroup(currentValue => {
      return [
        ...currentValue.filter((item) => {
          return item.no !== data.no
        })
      ]
    })
  }

  const submitCounterReceiptHandler = (e) => {
    e.preventDefault()

    confirm({
      open: true,
      onConfirm: async () => {
        setIsSaving(true)

        let response
        try {
          response = await axios.put(`/api/counter-receipts/${id}`, {
            ...data,
            counter_receipt: [...crGroup]
          })

          const { message } = response.data

          navigate(-1)
          toast({
            message,
            title: "Success!"
          })
        }
        catch (error) {
          if (error.request.status === 422) {
            const { errors } = error.response.data

            setError(currentValue => ({
              status: true,
              data: {
                ...currentValue.data,

                cr_no: errors["cr_group.no"]
              }
            }))

            return toast({
              duration: null,
              severity: "error",
              title: "Error!",
              message: "Transaction failed. Please try again."
            })
          }

          toast({
            severity: "error",
            title: "Error!",
            message: "Something went wrong whilst trying to connect to the server. Please try again later."
          })
        }

        setIsSaving(false)
      }
    })
  }

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    limit: 100
  })

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperForm-root" elevation={1}>
        <Typography variant="heading" sx={{ display: 'block', marginBottom: 3 }}>Counter Receipt</Typography>

        <Stack component="form" onSubmit={submitCounterReceiptHandler} gap={2}>
          <Autocomplete
            size="small"
            filterOptions={filterOptions}
            options={SUPPLIER_LIST}
            value={data.supplier}
            loading={
              SUPPLIER_STATUS === 'loading'
            }
            renderInput={
              (props) => <TextField {...props} label="Supplier" variant="outlined" />
            }
            PaperComponent={
              (props) => <Paper {...props} sx={{ textTransform: 'capitalize' }} />
            }
            getOptionLabel={
              (option) => option.name
            }
            getOptionDisabled={
              (option) => !crGroup.every((item) => option.references.map((a) => a.id).includes(item.receipt_type.id))
            }
            isOptionEqualToValue={
              (option, value) => option.id === value.id
            }
            onChange={(e, value) => setData(currentValue => ({
              ...currentValue,
              supplier: value
            }))}
            disabled={false}
            fullWidth
            disablePortal
            disableClearable
          />

          <TextField
            label="Remarks (Optional)"
            variant="outlined"
            autoComplete="off"
            size="small"
            rows={3}
            value={data.remarks}
            onChange={(e) => setData(currentValue => ({
              ...currentValue,
              remarks: e.target.value
            }))}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            fullWidth
            multiline
          />

          <Stack direction="row" gap={1}>
            <LoadingButton
              type="submit"
              variant="contained"
              loadingPosition="start"
              loading={isSaving}
              startIcon={<Check />}
              disabled={
                !Boolean(data.supplier) ||
                !Boolean(crGroup.length) ||
                (error.status && Boolean(error.data.cr_no)) ||
                (validate.status && validate.data.includes('cr_no'))
              }
              disableElevation
            > Update
            </LoadingButton>

            <Button
              variant="outlined"
              color="error"
              onClick={() => navigate(-1)}
              disableElevation
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Paper className="FstoPaperAttachment-root" elevation={1}>
        <Typography variant="heading" sx={{ display: 'block', marginBottom: 3 }}>Attachment</Typography>

        <Stack direction="row" alignItems="flex-start" gap={1}>
          <Autocomplete
            size="small"
            filterOptions={filterOptions}
            options={DEPARTMENT_LIST}
            value={CR.department}
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
            onChange={(e, value) => setCR(currentValue => ({
              ...currentValue,
              department: value
            }))}
            disabled={false}
            fullWidth
            disablePortal
            disableClearable
          />

          <Autocomplete
            size="small"
            // options={data.supplier?.references || []}
            options={
              SUPPLIER_LIST?.find((item) => item.id === data.supplier?.id)?.references || []
            }
            value={CR.receipt_type}
            renderInput={
              (props) => <TextField {...props} label="Type" variant="outlined" />
            }
            getOptionLabel={
              (option) => option.type
            }
            isOptionEqualToValue={
              (option, value) => option.id === value.id
            }
            onChange={(e, value) => setCR(currentValue => ({
              ...currentValue,
              receipt_type: value
            }))}
            sx={{
              minWidth: 128
            }}
            disabled={false}
            disablePortal
            disableClearable
          />

          <TextField
            label="Receipt No."
            variant="outlined"
            autoComplete="off"
            size="small"
            value={CR.receipt_no}
            error={
              error.status
              && Boolean(error.data.cr_no)
            }
            helperText={
              (error.status
                && error.data.cr_no
                && error.data.cr_no[0])
              ||
              (validate.status
                && validate.data.includes('cr_no')
                && "Please wait...")
            }
            onChange={(e) => setCR(currentValue => ({
              ...currentValue,
              receipt_no: e.target.value
            }))}
            onBlur={checkCounterReceiptHandler}
            disabled={false}
            fullWidth
          />

          <LocalizationProvider dateAdapter={DateAdapter}>
            <DatePicker
              value={CR.date_transaction}
              onChange={(value) => setCR(currentValue => ({
                ...currentValue,
                date_transaction: moment(value).format("YYYY-MM-DD")
              }))}
              renderInput={
                (props) => <TextField {...props} label="Date" variant="outlined" size="small" onKeyPress={(e) => e.preventDefault()} fullWidth />
              }
              showToolbar
              showTodayButton
            />
          </LocalizationProvider>

          <TextField
            label="Amount"
            variant="outlined"
            autoComplete="off"
            size="small"
            value={CR.amount}
            InputProps={{
              inputComponent: NumberField,
            }}
            onChange={(e) => setCR(currentValue => ({
              ...currentValue,
              amount: parseFloat(e.target.value)
            }))}
            disabled={false}
            fullWidth
          />

          <Button
            variant="contained"
            startIcon={
              CR.update ? <Edit /> : <Add />
            }
            onClick={addCounterReceiptHandler}
            sx={{
              fontSize: 'inherit',
              minWidth: 96
            }}
            disabled={
              !Boolean(CR.receipt_no) ||
              !Boolean(CR.receipt_type) ||
              !Boolean(CR.date_transaction) ||
              !Boolean(CR.amount) ||
              !Boolean(CR.department) ||
              (error.status && Boolean(error.data.cr_no))
            }
            disableElevation
          >
            {CR.update ? "Save" : "Add"}
          </Button>
        </Stack>

        <Box className="FstoBoxCounterReceipts-root">
          {
            crGroup.map((item, index) => (
              <Box className="FstoBoxCounterReceipt-root" key={index}>
                <Stack className="FstoStackCounterReceipt-root" direction="column">
                  <Typography variant="subtitle2">Departnemt</Typography>
                  <Typography className="FstoTypographyCounterReceipts-root" variant="h6">
                    {item.department.name}
                  </Typography>
                </Stack>

                <Stack className="FstoStackCounterReceipt-root short" direction="column">
                  <Typography variant="subtitle2">Type</Typography>
                  <Typography className="FstoTypographyCounterReceipts-root" variant="h6">
                    {item.receipt_type.type}
                  </Typography>
                </Stack>

                <Stack className="FstoStackCounterReceipt-root" direction="column">
                  <Typography variant="subtitle2">Receipt No.</Typography>
                  <Typography className="FstoTypographyCounterReceipts-root" variant="h6">
                    {item.receipt_no}
                  </Typography>
                </Stack>

                <Stack className="FstoStackCounterReceipt-root short" direction="column">
                  <Typography variant="subtitle2">Date</Typography>
                  <Typography className="FstoTypographyCounterReceipts-root" variant="h6">
                    {moment(item.date_transaction).format("MM/DD/YYYY")}
                  </Typography>
                </Stack>

                <Stack className="FstoStackCounterReceipt-root" direction="column">
                  <Typography variant="subtitle2">Amount</Typography>
                  <Typography className="FstoTypographyCounterReceipts-root" variant="h6">
                    {
                      item.amount.toLocaleString("default", {
                        style: "currency",
                        currency: "PHP",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })
                    }
                  </Typography>
                </Stack>

                <Stack direction="row" gap={1}>
                  <IconButton onClick={() => updateCounterReceiptHandler(item, index)} disabled={CR.update}>
                    <Edit fontSize="small" />
                  </IconButton>

                  <IconButton onClick={() => removeCounterReceiptHandler(item)} disabled={CR.update}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
            ))
          }
        </Box>
      </Paper>
    </Box >
  )
}

const NumberField = React.forwardRef((props, ref) => {
  const { onChange, ...rest } = props

  return (
    <NumberFormat
      {...rest}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        })
      }}
      prefix="₱"
      allowNegative={false}
      thousandSeparator
      isNumericString
    />
  )
})

export default UpdateCounterReceipt