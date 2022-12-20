import React, { useEffect } from 'react'

import moment from 'moment'

import { useDispatch, useSelector } from 'react-redux'
import { RESET_PO } from '../../actions'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Autocomplete,
  // Chip,
  // Stack,
  // IconButton,
  // Divider,
  // InputAdornment,
  // TableContainer,
  // Table,
  // TableHead,
  // TableBody,
  // TableRow,
  // TableCell
} from '@mui/material'

import {
  LoadingButton,

  DatePicker,
  LocalizationProvider
} from '@mui/lab'

import DateAdapter from '@mui/lab/AdapterMoment'

import NumberFormat from 'react-number-format'

// Hooks helper
import useRequestor from '../../hooks/useRequestor'
import useCompanies from '../../hooks/useCompanies'
import useDepartments from '../../hooks/useDepartments'
import useLocations from '../../hooks/useLocations'
import useSuppliers from '../../hooks/useSuppliers'
import TransactionAttachment from './TransactionAttachment'

const TransactionRequest = () => {

  const attachment = useSelector((state) => state.po)

  const {
    watch,
    reset,
    register,
    control,
    setValue,
    handleSubmit,
    // formState: { errors }
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
    defaultValues: {
      document: null,
      payment: null,
      no: undefined,
      company: null,
      department: null,
      location: null,
      supplier: null,
      category: null,
      date: null,
      amount: undefined,
      remarks: null,
      attachment: []
    }
  })

  // console.log(errors)
  // console.log(watch("document"))
  // console.log(watch())
  console.log(watch("attachment"))

  const dispatch = useDispatch()

  const {
    status: REQUESTOR_STATUS,
    documents: DOCUMENT_LIST = []
  } = useRequestor()

  const {
    status: COMPANY_STATUS,
    data: COMPANY_LIST = []
  } = useCompanies()

  const {
    status: DEPARTMENT_STATUS,
    data: DEPARTMENT_LIST = []
  } = useDepartments()

  const {
    status: LOCATION_STATUS,
    data: LOCATION_LIST = []
  } = useLocations()

  const {
    status: SUPPLIER_STATUS,
    data: SUPPLIER_LIST = []
  } = useSuppliers()

  useEffect(() => {
    setValue("attachment", attachment)

    // eslint-disable-next-line
  }, [attachment])

  useEffect(() => {
    return () => {
      console.log("Clearing PO...")
      dispatch(RESET_PO())
    }

    // eslint-disable-next-line
  }, [])



  const submitTransactionHandler = (data) => {
    console.log(data)
    reset()
  }

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperForm-root" elevation={1}>
        <Typography variant="heading" sx={{ display: 'block', marginBottom: 3 }}>Request for Tagging</Typography>

        <form onSubmit={handleSubmit(submitTransactionHandler)}>
          <Controller
            name="document"
            control={control}
            render={({ field }) => {
              const { value = null, onChange } = field

              return (
                <Autocomplete
                  className="FstoSelectForm-root"
                  size="small"
                  value={value}
                  options={DOCUMENT_LIST}
                  loading={REQUESTOR_STATUS === "loading"}
                  disabled={false}
                  renderInput={
                    (props) => <TextField {...props} label="Select Document Type" variant="outlined" />
                  }
                  getOptionLabel={
                    (option) => option.name
                  }
                  isOptionEqualToValue={
                    (option, value) => option.id === value.id
                  }
                  onChange={(_, value) => {
                    // reset category
                    setValue("category", null)

                    onChange(value)
                  }}
                  fullWidth
                  disablePortal
                  disableClearable
                />
              )
            }}
          />

          {
            !!watch("document") &&
            (
              <React.Fragment>
                <Controller
                  name="payment"
                  control={control}
                  render={({ field }) => {
                    const { value = null, onChange } = field

                    return (
                      <Autocomplete
                        className="FstoSelectForm-root"
                        size="small"
                        value={value}
                        options={["Full", "Partial"]}
                        renderInput={
                          (props) => <TextField {...props} label="Payment Type" variant="outlined" />
                        }
                        isOptionEqualToValue={
                          (option, value) => option === value
                        }
                        onChange={(_, value) => onChange(value)}
                        fullWidth
                        disablePortal
                        disableClearable
                      />
                    )
                  }}
                />

                <TextField
                  {...register("no")}
                  className="FstoTextfieldForm-root"
                  label="Document Number"
                  variant="outlined"
                  size="small"
                  InputProps={{
                    inputComponent: NumberField,
                    inputProps: {
                      prefix: "PAD#",
                      keepPrefix: true
                    }
                  }}
                  fullWidth
                />

                <LocalizationProvider dateAdapter={DateAdapter}>
                  <DatePicker
                    value={moment()}
                    onChange={() => { }}
                    renderInput={
                      (props) =>
                        <TextField
                          {...props}
                          className="FstoTextfieldForm-root"
                          label="Request Date"
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                    }
                    readOnly
                  />
                </LocalizationProvider>

                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => {
                    const { value = null, onChange } = field

                    return (
                      <LocalizationProvider dateAdapter={DateAdapter}>
                        <DatePicker
                          value={value}
                          maxDate={moment()}
                          onChange={(value) => {
                            if (!moment(value).isValid()) return

                            onChange(moment(value).format())
                          }}
                          renderInput={
                            (props) =>
                              <TextField
                                {...props}
                                className="FstoTextfieldForm-root"
                                label="Document Date"
                                variant="outlined"
                                size="small"
                                fullWidth
                              />
                          }
                          showToolbar
                          showTodayButton
                        />
                      </LocalizationProvider>
                    )
                  }}
                />

                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => {
                    const { value = null, onChange } = field

                    return (
                      <NumberFormat
                        customInput={TextField}
                        className="FstoTextfieldForm-root"
                        label="Document Amount"
                        variant="outlined"
                        size="small"
                        prefix="₱"
                        value={value}
                        onValueChange={(data) => {
                          if (!data.value) return onChange(null);

                          onChange(Number(data.value));
                        }}
                        fullWidth
                        thousandSeparator
                      />
                    )
                  }}
                />

                <Controller
                  name="company"
                  control={control}
                  render={({ field }) => {
                    const { value = null, onChange } = field

                    return (
                      <Autocomplete
                        className="FstoSelectForm-root"
                        size="small"
                        value={value}
                        options={COMPANY_LIST}
                        loading={COMPANY_STATUS === "loading"}
                        renderInput={
                          (props) => <TextField {...props} label="Company" variant="outlined" />
                        }
                        getOptionLabel={
                          (option) => option.name
                        }
                        isOptionEqualToValue={
                          (option, value) => option.id === value.id
                        }
                        onChange={(_, value) => onChange(value)}
                        fullWidth
                        disablePortal
                        disableClearable
                      />
                    )
                  }}
                />

                <Controller
                  name="department"
                  control={control}
                  render={({ field }) => {
                    const { value = null, onChange } = field

                    return (
                      <Autocomplete
                        className="FstoSelectForm-root"
                        size="small"
                        value={value}
                        options={DEPARTMENT_LIST}
                        loading={DEPARTMENT_STATUS === "loading"}
                        renderInput={
                          (props) => <TextField {...props} label="Department" variant="outlined" />
                        }
                        getOptionLabel={
                          (option) => option.name
                        }
                        isOptionEqualToValue={
                          (option, value) => option.id === value.id
                        }
                        onChange={(_, value) => onChange(value)}
                        fullWidth
                        disablePortal
                        disableClearable
                      />
                    )
                  }}
                />

                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => {
                    const { value = null, onChange } = field

                    return (
                      <Autocomplete
                        className="FstoSelectForm-root"
                        size="small"
                        value={value}
                        options={LOCATION_LIST}
                        loading={LOCATION_STATUS === "loading"}
                        renderInput={
                          (props) => <TextField {...props} label="Location" variant="outlined" />
                        }
                        getOptionLabel={
                          (option) => option.name
                        }
                        isOptionEqualToValue={
                          (option, value) => option.id === value.id
                        }
                        onChange={(_, value) => onChange(value)}
                        fullWidth
                        disablePortal
                        disableClearable
                      />
                    )
                  }}
                />

                <Controller
                  name="supplier"
                  control={control}
                  render={({ field }) => {
                    const { value = null, onChange } = field

                    return (
                      <Autocomplete
                        className="FstoSelectForm-root"
                        size="small"
                        value={value}
                        options={SUPPLIER_LIST}
                        loading={SUPPLIER_STATUS === "loading"}
                        renderInput={
                          (props) => <TextField {...props} label="Supplier" variant="outlined" />
                        }
                        getOptionLabel={
                          (option) => option.name
                        }
                        isOptionEqualToValue={
                          (option, value) => option.id === value.id
                        }
                        onChange={(_, value) => onChange(value)}
                        fullWidth
                        disablePortal
                        disableClearable
                      />
                    )
                  }}
                />

                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => {
                    const { value = null, onChange } = field

                    return (
                      <Autocomplete
                        className="FstoSelectForm-root"
                        size="small"
                        value={value}
                        options={watch("document")?.categories || []}
                        renderInput={
                          (props) => <TextField {...props} label="Category" variant="outlined" />
                        }
                        getOptionLabel={
                          (option) => option.name
                        }
                        isOptionEqualToValue={
                          (option, value) => option.id === value.id
                        }
                        onChange={(_, value) => onChange(value)}
                        fullWidth
                        disablePortal
                        disableClearable
                      />
                    )
                  }}
                />

                <TextField
                  {...register("remarks")}
                  className="FstoTextfieldForm-root"
                  label="Remarks (Optional)"
                  variant="outlined"
                  size="small"
                  rows={3}
                  fullWidth
                  multiline
                />
              </React.Fragment>
            )
          }

          <LoadingButton
            className="FstoButtonForm-root"
            variant="contained"
            type="submit"
            loadingPosition="start"
            // loading={isSaving}
            startIcon={<></>}
            disableElevation
          > Save
          </LoadingButton>

          <Button
            className="FstoButtonForm-root"
            variant="outlined"
            color="error"
            onClick={() => reset()}
            disableElevation
          > Clear
          </Button>
        </form>
      </Paper>

      <Paper className="FstoPaperAttachment-root" elevation={1}>
        <TransactionAttachment />
      </Paper>
    </Box>
  )
}

const schema = yup.object().shape({
  document: yup.object({
    id: yup.number().required(),
    name: yup.string().required()
  }).noUnknown(true).required().label("Document type"),
  payment: yup.string().nullable().required().label("Payment type"),
  no: yup.string().typeError("Document number is invalid.").required().label("Document number"),
  date: yup.date().typeError("Document date is invalid.").required("Document date is required.").label("Document date"),
  amount: yup.number().typeError("Document amount is invalid.").required("Document amount is required.").label("Document amount"),
  company: yup.object({
    id: yup.number().required(),
    name: yup.string().required()
  }).noUnknown(true).required().label("Company"),
  department: yup.object({
    id: yup.number().required(),
    name: yup.string().required()
  }).noUnknown(true).required().label("Department"),
  location: yup.object({
    id: yup.number().required(),
    name: yup.string().required()
  }).noUnknown(true).required().label("Location"),
  supplier: yup.object().shape({
    id: yup.number().required(),
    name: yup.string().required()
  }).noUnknown(true).required().label("Supplier"),
  category: yup.object({
    id: yup.number().required(),
    name: yup.string().required()
  }).required().label("Category"),
  remarks: yup.string().label("Remarks"),
  attachment: yup.array().of(
    yup.object().shape({
      no: yup.string().typeError("PO number is invalid.").required().label("PO number"),
      amount: yup.number().typeError("PO amount is invalid.").required("PO amount is required.").label("PO amount"),
      rr: yup.array().label("RR number"),
    }).noUnknown()
  ),
}).required()

const NumberField = React.forwardRef((props, ref) => {
  const { onChange, keepPrefix = false, ...rest } = props

  return (
    <NumberFormat
      {...rest}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: keepPrefix ? values.formattedValue : values.value,
          },
        })
      }}
    />
  )
})

export default TransactionRequest