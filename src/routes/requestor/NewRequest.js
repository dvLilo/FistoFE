import React from 'react'

import axios from 'axios'

import { Link } from 'react-router-dom'

import NumberFormat from 'react-number-format'

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Autocomplete,
  Chip,
  Stack,
  IconButton,
  Divider
} from '@mui/material'

import {
  Add,
  Edit,
  Delete
} from '@mui/icons-material'

import { LoadingButton, DatePicker, LocalizationProvider } from '@mui/lab'
import DateAdapter from '@mui/lab/AdapterDateFns'
// eslint-disable-next-line
import { createFilterOptions } from '@mui/material/Autocomplete';

import useToast from '../../hooks/useToast'
import useConfirm from '../../hooks/useConfirm'

// const DOCUMENT_TYPES = [
//   {
//     id: 1,
//     type: "PAD"
//   },
//   {
//     id: 2,
//     type: "PRM Common"
//   },
//   {
//     id: 3,
//     type: "PRM Multiple"
//   },
//   {
//     id: 4,
//     type: "Receipt"
//   },
//   {
//     id: 5,
//     type: "Contractor's Billing"
//   },
//   {
//     id: 6,
//     type: "Utilities"
//   },
//   {
//     id: 7,
//     type: "Payroll"
//   },
//   {
//     id: 8,
//     type: "PCF"
//   },
// ]

// const COMPANY_CHARGING = [
//   {
//     "department_name": "Management Information System",
//     "company_name": "RDF Corporate Services",
//     "location_name": "Head Office"
//   },
//   {
//     "department_name": "Management Information System",
//     "company_name": "RDF Corporate Services",
//     "location_name": "Common"
//   },
//   {
//     "department_name": "Human Resources Common",
//     "company_name": "RDF Corporate Services",
//     "location_name": "Head Office"
//   },
//   {
//     "department_name": "Treasury",
//     "company_name": "RDF Corporate Services",
//     "location_name": "Common"
//   },
//   {
//     "department_name": "Audit",
//     "company_name": "RDF Corporate Services",
//     "location_name": "Common"
//   },
//   {
//     "department_name": "Finance Common",
//     "company_name": "RDF Corporate Services",
//     "location_name": "Head Office"
//   },
//   {
//     "department_name": "Boiler Farms",
//     "company_name": "Red Dragon Farm",
//     "location_name": "BrFarm - Lara 1"
//   },
//   {
//     "department_name": "Boiler Farms - Area 2",
//     "company_name": "Red Dragon Farm",
//     "location_name": "BrFarm - Nueva Ecija 1"
//   },
//   {
//     "department_name": "Boiler Farms - Area 2",
//     "company_name": "Red Dragon Farm",
//     "location_name": "BrFarm - Nueva Ecija 2"
//   }
// ]

// const COMPANY_LIST = [
//   {
//     id: 1,
//     name: "RDF Corporate Services"
//   },
//   {
//     id: 2,
//     name: "Fresh Option"
//   },
// ]

// const DEPARTMENT_LIST = [
//   {
//     id: 1,
//     name: "Management Information System Common"
//   },
//   {
//     id: 2,
//     name: "Human Resources Common"
//   }
// ]

// const LOCATION_LIST = [
//   {
//     id: 1,
//     name: "Common"
//   },
//   {
//     id: 2,
//     name: "Head Office"
//   },
// ]

// const SUPPLIER_LIST = [
//   {
//     id: 1,
//     name: "1ST ADVENUE ADVERTISING"
//   },
//   {
//     id: 2,
//     name: "PELCO I"
//   },
//   {
//     id: 3,
//     name: "PELCO II"
//   },
//   {
//     id: 4,
//     name: "PELCO III"
//   },
// ]

// const CATEGORY_LIST = [
//   {
//     id: 1,
//     name: "general"
//   },
//   {
//     id: 2,
//     name: "rentals"
//   },
//   {
//     id: 3,
//     name: "loans"
//   },
//   {
//     id: 4,
//     name: "leasings"
//   },
// ]

const PAYMENT_TYPES = [
  {
    id: 1,
    label: "Full"
  },
  {
    id: 2,
    label: "Partial"
  },
]

const COVERAGE_MONTH = [
  {
    id: 1,
    label: "3 Months",
    value: 3.0
  },
  {
    id: 2,
    label: "6 Months",
    value: 6.0
  },
  {
    id: 3,
    label: "12 Months",
    value: 12.0
  },
  {
    id: 4,
    label: "24 Months",
    value: 24.0
  },
  {
    id: 5,
    label: "36 Months",
    value: 36.0
  },
]

const NumberField = React.forwardRef(function NumberField(props, ref) {
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
      // allowNegative={false}
      // decimalScale={2}
      // fixedDecimalScale
      thousandSeparator
      isNumericString
    />
  )
})

const NewRequest = () => {

  const toast = useToast()
  const confirm = useConfirm()

  const [isSaving, setIsSaving] = React.useState(false)

  const [error, setError] = React.useState({
    status: false,
    data: []
  })

  const [data, setData] = React.useState({
    requestor: {
      id: null,
      id_prefix: null,
      id_no: null,
      first_name: null,
      middle_name: null,
      last_name: null,
      suffix: null,
      role: null,
      position: null,
      department: null,
    },

    document: {
      id: null,
      name: "",
      payment_type: "",
      no: "",
      date: null,
      amount: null,

      payment_date: null,
      coverage: null,

      category: null,

      company: null,
      department: null,
      location: null,

      supplier: null,

      utility_category: null,
      utility_location: null,

      from: null,
      to: null,

      receipt_no: "",
      account_no: null,
      consumption: "",

      remarks: undefined
    },

    po_group: []
  })

  const [PO, setPO] = React.useState({
    update: false,
    index: null,

    no: "",
    balance: null,
    amount: null,
    rr_no: []
  })

  const [DOCUMENT_TYPES, setDocumentTypes] = React.useState([])
  React.useEffect(() => {
    (async () => {
      let response
      try {
        response = await axios.get(`/api/dropdown/current-user`)

        const { id, id_prefix, id_no, first_name, middle_name, last_name, suffix, role, position, department, document_types } = response.data.result

        setDocumentTypes(document_types)
        setData(currentValue => ({
          ...currentValue,
          requestor: {
            id,
            id_prefix,
            id_no,
            first_name,
            middle_name,
            last_name,
            suffix,
            role,
            position,
            department
          }
        }))
      }
      catch (error) {
        console.log("Fisto Error Status", error.request)
      }
    })()
  }, [])

  const [COMPANY_CHARGING, setCompanyCharging] = React.useState([])
  React.useEffect(() => {
    (async () => {
      let response
      try {
        response = await axios.get(`/api/dropdown/charging`)

        const { companies } = response.data.result

        setCompanyCharging(companies)
      }
      catch (error) {
        console.log("Fisto Error Status", error.request)
      }
    })()
  }, [])

  const [SUPPLIER_LIST, setSupplierList] = React.useState([])
  React.useEffect(() => {
    (async () => {
      let response
      try {
        response = await axios.get(`/api/dropdown/supplier?status=1&paginate=0`)

        const { suppliers } = response.data.result

        setSupplierList(suppliers)
      }
      catch (error) {
        console.log("Fisto Error Status", error.request)
      }
    })()
  }, [])


  React.useEffect(() => {
    checkPurchaseOrderHandler()

    // eslint-disable-next-line
  }, [data.document.payment_type, data.document.company])

  const isDisabled = () => {
    switch (data.document.id) {
      case 1:
      case 5:
        return data.document.payment_type
          && data.document.no
          && data.document.date
          && data.document.amount
          && data.document.company
          && data.document.department
          && data.document.location
          && data.document.supplier
          && data.document.category
          && data.po_group.length
          && (data.document.amount === data.po_group.map((po) => po.balance).reduce((a, b) => a + b, 0))
          && (!error.status || !Boolean(error.data.document_no))
          ? false : true

      case 2: // PRM Common - Payment Request Memo Common
        return data.document.payment_type
          && data.document.no
          && data.document.date
          && data.document.amount
          && data.document.company
          && data.document.department
          && data.document.location
          && data.document.supplier
          && data.document.category
          && (!error.status || !Boolean(error.data.document_no))
          ? false : true

      case 3:
        return data.document.payment_type
          && data.document.no
          && data.document.date
          && data.document.amount
          && data.document.company
          && data.document.department
          && data.document.location
          && data.document.supplier
          && data.document.category
          ? false : true

      default:
        return true
    }
  }

  const checkDocumentNumberHandler = async (e) => {
    if (error.status && error.data.document_no) {
      delete error.data.document_no
      setError(currentValue => ({
        ...currentValue,
        data: error.data
      }))
    }

    if (!data.document.no) return

    try {
      await axios.post(`/api/transactions/validate-document-no`, {
        document_no: data.document.no
      })
    }
    catch (error) {
      if (error.request.status === 422) {
        const { errors } = error.response.data

        setError(currentValue => ({
          status: true,
          data: {
            ...currentValue.data,
            document_no: errors["document.no"]
          }
        }))
      }
    }
  }

  const addPurchaseOrderHandler = () => {
    const check = data.po_group.some((data) => data.no === PO.no)
    if (check && !PO.update) return

    if (PO.update) data.po_group.splice(PO.index, 1, {
      no: PO.no,
      balance: PO.balance,
      amount: PO.amount,
      rr_no: PO.rr_no
    })
    else setData({
      ...data,
      po_group: [
        ...data.po_group,
        {
          no: PO.no,
          balance: PO.balance,
          amount: PO.amount,
          rr_no: PO.rr_no
        }
      ]
    })

    setPO({
      index: null,
      update: false,

      no: "",
      balance: NaN,
      amount: NaN,
      rr_no: []
    })
  }

  const checkPurchaseOrderHandler = async (e) => {
    if (error.status && error.data.po_no) {
      delete error.data.po_no
      setError(currentValue => ({
        ...currentValue,
        data: error.data
      }))
    }

    if (PO.no && (!data.document.payment_type || !data.document.company))
      setError({
        status: true,
        data: {
          ...error.data,
          "po_no": [
            "Payment type and company is required."
          ]
        }
      })

    if (!PO.no || !data.document.payment_type || !data.document.company) return

    let response
    try {
      response = await axios.post(`/api/transactions/validate-po-no`, {
        payment_type: data.document.payment_type,
        company_id: data.document.company.id,
        po_no: PO.no
      })

      if (response.status === 204) {
        const check = data.po_group.some((data) => data.no === PO.no)
        if (check && !PO.update)
          setError({
            status: true,
            data: {
              ...error.data,
              "po_no": [
                "PO number already in the list."
              ]
            }
          })
      }
    }
    catch (error) {
      if (error.request.status === 422) {
        const { errors } = error.response.data

        setError(currentValue => ({
          status: true,
          data: {
            ...currentValue.data,
            po_no: errors["po_group.no"]
          }
        }))
      }
    }
  }

  const updatePurchaseOrderHandler = (index, props) => {
    const { no, amount, balance, rr_no } = props

    delete error.data.po_no
    setError({
      ...error,
      data: error.data
    })

    setPO({
      update: true,
      index,

      no,
      amount,
      balance,
      rr_no
    })
  }

  const removePurchaseOrderHandler = (props) => {
    const { no } = props

    setData({
      ...data,
      po_group: data.po_group.filter((data) => data.no !== no)
    })
  }

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    limit: 100
  })

  const transformData = (ID) => {
    switch (ID) {
      case 1: // PAD - Post Acquisition Delivery
        return {
          requestor: data.requestor,
          document: {
            id: data.document.id,
            no: data.document.no,
            name: data.document.name,
            payment_type: data.document.payment_type,
            amount: data.document.amount,
            date: data.document.date,

            company: data.document.company,
            department: data.document.department,
            location: data.document.location,
            supplier: data.document.supplier,
            category: data.document.category,

            remarks: data.document.remarks
          },
          po_group: data.po_group
        }

      case 2: // PRM Common - Payment Request Memo Common
        return {
          requestor: data.requestor,
          document: {
            id: data.document.id,
            no: data.document.no,
            name: data.document.name,
            payment_type: data.document.payment_type,
            amount: data.document.amount,
            date: data.document.date,

            company: data.document.company,
            department: data.document.department,
            location: data.document.location,
            supplier: data.document.supplier,
            category: data.document.category,

            remarks: data.document.remarks
          }
        }

      case 3: // PRM Multiple - Payment Request Memo Multiple
        return {}

      case 4: // Receipt
        return {}

      case 5: // Contractor's Billing
        return {
          requestor: data.requestor,
          document: {
            id: data.document.id,
            no: data.document.no,
            name: data.document.name,
            payment_type: data.document.payment_type,
            amount: data.document.amount,
            date: data.document.date,

            company: data.document.company,
            department: data.document.department,
            location: data.document.location,
            supplier: data.document.supplier,
            category: data.document.category,

            remarks: data.document.remarks
          },
          po_group: data.po_group
        }

      case 6: // Utilities
        return {
          requestor: data.requestor,
          document: {
            id: data.document.id,
            name: data.document.name,
            payment_type: data.document.payment_type,
            amount: data.document.amount,

            company: data.document.company,
            department: data.document.department,
            location: data.document.location,

            supplier: data.document.supplier,

            from: data.document.from,
            to: data.document.to,

            utility_category: data.document.utility_category,
            utility_location: data.document.utility_location,
            account_no: data.document.account_no,

            receipt_no: data.document.receipt_no,
            consumption: data.document.consumption,

            remarks: data.document.remarks
          }
        }

      default:
        return {}
    }
  }

  const truncateData = () => {
    setError({
      status: false,
      data: []
    })

    setPO({
      update: false,
      index: null,

      no: "",
      balance: null,
      amount: null,
      rr_no: []
    })

    setData(currentValue => ({
      ...currentValue,

      document: {
        id: null,
        name: "",
        payment_type: "",
        no: "",
        date: null,
        amount: null,

        payment_date: null,
        coverage: null,

        category: null,

        company: null,
        department: null,
        location: null,

        supplier: null,

        utility_category: null,
        utility_location: null,

        from: null,
        to: null,

        receipt_no: "",
        account_no: null,
        consumption: "",

        remarks: undefined
      },

      po_group: []
    }))
  }

  const submitTransactionHandler = (e) => {
    e.preventDefault()

    confirm({
      open: true,
      onConfirm: async () => {
        setIsSaving(true)

        let response
        try {
          response = await axios.post(`/api/transactions`, transformData(data.document.id))

          const { message } = response.data

          truncateData()
          toast({
            message,
            open: true,
            severity: "success",
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
                document_no: errors["document.no"]
              }
            }))

            toast({
              open: true,
              severity: "error",
              title: "Error!",
              message: "Transaction failed. Please try again."
            })
          }
        }

        setIsSaving(false)
      }
    })
  }

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperForm-root" elevation={1}>
        <Typography variant="heading" sx={{ display: 'block', marginBottom: 3 }}>Request for Tagging</Typography>

        <form onSubmit={submitTransactionHandler}>
          <Autocomplete
            className="FstoSelectForm-root"
            size="small"
            options={DOCUMENT_TYPES}
            value={DOCUMENT_TYPES.find(row => row.id === data.document.id) || null}
            renderInput={
              props =>
                <TextField
                  {...props}
                  variant="outlined"
                  label="Select Document Type"
                />
            }
            PaperComponent={
              props =>
                <Paper
                  {...props}
                  sx={{ textTransform: 'capitalize' }}
                />
            }
            getOptionLabel={
              option => option.type
            }
            isOptionEqualToValue={
              (option, value) => option.id === value.id
            }
            onChange={(e, value) => setData({
              ...data,
              document: {
                ...data.document,
                id: value.id,
                name: value.type,
                payment_type: ""
              }
            })}
            fullWidth
            disablePortal
            disableClearable
          />

          {
            data.document.id &&
            (
              <React.Fragment>
                { // Batch Name, Batch Letter, Batch Date
                  (data.document.id === 8) &&
                  (
                    <React.Fragment>
                      <Autocomplete
                        className="FstoSelectForm-root"
                        size="small"
                        options={[]}
                        value={null}
                        renderInput={
                          props =>
                            <TextField
                              {...props}
                              variant="outlined"
                              label="Batch Name"
                            />
                        }
                        PaperComponent={
                          props =>
                            <Paper
                              {...props}
                              sx={{ textTransform: 'capitalize' }}
                            />
                        }
                        fullWidth
                        disablePortal
                        disableClearable
                      />

                      <Autocomplete
                        className="FstoSelectForm-root"
                        size="small"
                        options={[]}
                        value={null}
                        renderInput={
                          props =>
                            <TextField
                              {...props}
                              variant="outlined"
                              label="Batch Letter"
                            />
                        }
                        PaperComponent={
                          props =>
                            <Paper
                              {...props}
                              sx={{ textTransform: 'capitalize' }}
                            />
                        }
                        fullWidth
                        disablePortal
                        disableClearable
                      />

                      <LocalizationProvider dateAdapter={DateAdapter}>
                        <DatePicker
                          value={null}
                          onChange={(value) => { }}
                          renderInput={
                            props =>
                              <TextField
                                {...props}
                                className="FstoTextfieldForm-root"
                                variant="outlined"
                                size="small"
                                label="Batch Date"
                                fullWidth
                              />
                          }
                        />
                      </LocalizationProvider>
                    </React.Fragment>
                  )}

                <Autocomplete
                  className="FstoSelectForm-root"
                  size="small"
                  options={PAYMENT_TYPES}
                  value={PAYMENT_TYPES.find(row => row.label === data.document.payment_type) || null}
                  renderInput={
                    props =>
                      <TextField
                        {...props}
                        variant="outlined"
                        label="Payment Type"
                      />
                  }
                  PaperComponent={
                    props =>
                      <Paper
                        {...props}
                        sx={{ textTransform: 'capitalize' }}
                      />
                  }
                  getOptionDisabled={
                    option => {
                      if (data.document.id !== 4 && option.label === "Partial") return true
                    }
                  }
                  isOptionEqualToValue={
                    (option, value) => option.label === value.label
                  }
                  onChange={(e, value) => setData({
                    ...data,
                    document: {
                      ...data.document,
                      payment_type: value.label
                    }
                  })}
                  fullWidth
                  disablePortal
                  disableClearable
                />

                { // From Date, To Date
                  (data.document.id === 7 || data.document.id === 6) &&
                  (
                    <React.Fragment>
                      <LocalizationProvider dateAdapter={DateAdapter}>
                        <DatePicker
                          value={data.document.from}
                          onChange={(value) => setData({
                            ...data,
                            document: {
                              ...data.document,
                              from: new Date(value).toISOString().slice(0, 10)
                            }
                          })}
                          renderInput={
                            props =>
                              <TextField
                                {...props}
                                className="FstoTextfieldForm-root"
                                variant="outlined"
                                size="small"
                                label="From Date"
                                fullWidth
                              />
                          }
                        />
                      </LocalizationProvider>

                      <LocalizationProvider dateAdapter={DateAdapter}>
                        <DatePicker
                          value={data.document.to}
                          onChange={(value) => setData({
                            ...data,
                            document: {
                              ...data.document,
                              to: new Date(value).toISOString().slice(0, 10)
                            }
                          })}
                          renderInput={
                            props =>
                              <TextField
                                {...props}
                                className="FstoTextfieldForm-root"
                                variant="outlined"
                                size="small"
                                label="To Date"
                                fullWidth
                              />
                          }
                        />
                      </LocalizationProvider>
                    </React.Fragment>
                  )}

                { // Document Number
                  (data.document.id === 1 || data.document.id === 2 || data.document.id === 3 || data.document.id === 5) &&
                  (
                    <TextField
                      className="FstoTextfieldForm-root"
                      label="Document Number"
                      variant="outlined"
                      autoComplete="off"
                      size="small"
                      value={data.document.no}
                      error={
                        error.status
                        && Boolean(error.data.document_no)
                      }
                      helperText={
                        error.status
                        && error.data.document_no
                        && error.data.document_no[0]
                      }
                      onChange={(e) => setData({
                        ...data,
                        document: {
                          ...data.document,
                          no: e.target.value
                        }
                      })}
                      onBlur={checkDocumentNumberHandler}
                      InputLabelProps={{
                        className: "FstoLabelForm-root"
                      }}
                      fullWidth
                    />
                  )}

                { //Document Date
                  (data.document.id === 1 || data.document.id === 2 || data.document.id === 3 || data.document.id === 4 || data.document.id === 5 || data.document.id === 8) &&
                  (
                    <LocalizationProvider dateAdapter={DateAdapter}>
                      <DatePicker
                        value={data.document.date}
                        onChange={(value) => setData({
                          ...data,
                          document: {
                            ...data.document,
                            date: new Date(value).toISOString().slice(0, 10)
                          }
                        })}
                        renderInput={
                          props =>
                            <TextField
                              {...props}
                              className="FstoTextfieldForm-root"
                              variant="outlined"
                              size="small"
                              label="Document Date"
                              autoComplete="off"
                              fullWidth
                            />
                        }
                      />
                    </LocalizationProvider>
                  )}

                { //Document Amount
                  (data.document.id === 1 || data.document.id === 2 || data.document.id === 3 || data.document.id === 5 || data.document.id === 6 || data.document.id === 7 || data.document.id === 8) &&
                  (
                    <TextField
                      className="FstoTextfieldForm-root"
                      label="Document Amount"
                      variant="outlined"
                      autoComplete="off"
                      size="small"
                      value={data.document.amount}
                      error={
                        Boolean(data.po_group.length) &&
                        Boolean(data.document.amount)
                        && data.document.amount !== data.po_group.map((po) => po.balance).reduce((a, b) => a + b, 0)
                      }
                      helperText={
                        Boolean(data.po_group.length) &&
                        Boolean(data.document.amount)
                        && data.document.amount !== data.po_group.map((po) => po.balance).reduce((a, b) => a + b, 0)
                        && "Document amount and PO balance amount is not equal."
                      }
                      onChange={(e) => setData({
                        ...data,
                        document: {
                          ...data.document,
                          amount: parseFloat(e.target.value)
                        }
                      })}
                      InputProps={{
                        inputComponent: NumberField,
                      }}
                      InputLabelProps={{
                        className: "FstoLabelForm-root"
                      }}
                      fullWidth
                    />
                  )}

                <Autocomplete
                  className="FstoSelectForm-root"
                  size="small"
                  options={COMPANY_CHARGING}
                  value={data.document.company}
                  renderInput={
                    props =>
                      <TextField
                        {...props}
                        variant="outlined"
                        label="Company"
                      />
                  }
                  PaperComponent={
                    props =>
                      <Paper
                        {...props}
                        sx={{ textTransform: 'capitalize' }}
                      />
                  }
                  getOptionLabel={
                    option => option.name
                  }
                  isOptionEqualToValue={
                    (option, value) => option.id === value.id
                  }
                  onChange={(e, value) => setData({
                    ...data,
                    document: {
                      ...data.document,
                      company: { id: value.id, name: value.name },
                      department: null,
                      location: null
                    }
                  })}
                  fullWidth
                  disablePortal
                  disableClearable
                />

                <Autocomplete
                  className="FstoSelectForm-root"
                  size="small"
                  filterOptions={filterOptions}
                  options={data.document.company ? COMPANY_CHARGING.find(row => row.id === data.document.company.id).departments : []}
                  value={data.document.department}
                  renderInput={
                    props =>
                      <TextField
                        {...props}
                        variant="outlined"
                        label="Department"
                      />
                  }
                  PaperComponent={
                    props =>
                      <Paper
                        {...props}
                        sx={{ textTransform: 'capitalize' }}
                      />
                  }
                  getOptionLabel={
                    option => option.name
                  }
                  isOptionEqualToValue={
                    (option, value) => option.id === value.id
                  }
                  onChange={(e, value) => setData({
                    ...data,
                    document: {
                      ...data.document,
                      department: value
                    }
                  })}
                  fullWidth
                  disablePortal
                  disableClearable
                />

                <Autocomplete
                  className="FstoSelectForm-root"
                  size="small"
                  filterOptions={filterOptions}
                  options={data.document.company ? COMPANY_CHARGING.find(row => row.id === data.document.company.id).locations : []}
                  value={data.document.location}
                  renderInput={
                    props =>
                      <TextField
                        {...props}
                        variant="outlined"
                        label="Location"
                      />
                  }
                  PaperComponent={
                    props =>
                      <Paper
                        {...props}
                        sx={{ textTransform: 'capitalize' }}
                      />
                  }
                  getOptionLabel={
                    option => option.name
                  }
                  isOptionEqualToValue={
                    (option, value) => option.id === value.id
                  }
                  onChange={(e, value) => setData({
                    ...data,
                    document: {
                      ...data.document,
                      location: value
                    }
                  })}
                  fullWidth
                  disablePortal
                  disableClearable
                />

                <Autocomplete
                  className="FstoSelectForm-root"
                  size="small"
                  filterOptions={filterOptions}
                  options={SUPPLIER_LIST}
                  value={data.document.supplier}
                  renderInput={
                    props =>
                      <TextField
                        {...props}
                        variant="outlined"
                        label="Supplier"
                      />
                  }
                  PaperComponent={
                    props =>
                      <Paper
                        {...props}
                        sx={{ textTransform: 'capitalize' }}
                      />
                  }
                  getOptionLabel={
                    option => option.name
                  }
                  isOptionEqualToValue={
                    (option, value) => option.id === value.id
                  }
                  onChange={(e, value) => setData({
                    ...data,
                    document: {
                      ...data.document,
                      supplier: value
                    }
                  })}
                  fullWidth
                  disablePortal
                  disableClearable
                />

                { // Reference Type, Reference Number, Reference Amount
                  (data.document.id === 4) &&
                  (
                    <React.Fragment>
                      <Autocomplete
                        className="FstoSelectForm-root"
                        size="small"
                        options={[]}
                        value={null}
                        renderInput={
                          props =>
                            <TextField
                              {...props}
                              variant="outlined"
                              label="Reference Type"
                            />
                        }
                        PaperComponent={
                          props =>
                            <Paper
                              {...props}
                              sx={{ textTransform: 'capitalize' }}
                            />
                        }
                        fullWidth
                        disablePortal
                        disableClearable
                      />

                      <TextField
                        className="FstoTextfieldForm-root"
                        label="Reference Number"
                        variant="outlined"
                        autoComplete="off"
                        size="small"
                        value={data.document.no}
                        onChange={(e) => setData({
                          ...data,
                          document: {
                            ...data.document,
                            no: e.target.value
                          }
                        })}
                        InputLabelProps={{
                          className: "FstoLabelForm-root"
                        }}
                        fullWidth
                      />

                      <TextField
                        className="FstoTextfieldForm-root"
                        label="Reference Amount"
                        variant="outlined"
                        autoComplete="off"
                        size="small"
                        value={data.document.amount}
                        onChange={(e) => setData({
                          ...data,
                          document: {
                            ...data.document,
                            amount: parseFloat(e.target.value)
                          }
                        })}
                        InputProps={{
                          inputComponent: NumberField,
                        }}
                        InputLabelProps={{
                          className: "FstoLabelForm-root"
                        }}
                        fullWidth
                      />
                    </React.Fragment>
                  )
                }

                { // Category
                  (data.document.id === 1 || data.document.id === 2 || data.document.id === 3 || data.document.id === 4 || data.document.id === 5) &&
                  (
                    <Autocomplete
                      className="FstoSelectForm-root"
                      size="small"
                      filterOptions={filterOptions}
                      options={DOCUMENT_TYPES.find(type => type.id === data.document.id).categories}
                      value={data.document.category}
                      renderInput={
                        props =>
                          <TextField
                            {...props}
                            variant="outlined"
                            label="Category"
                          />
                      }
                      PaperComponent={
                        props =>
                          <Paper
                            {...props}
                            sx={{ textTransform: 'capitalize' }}
                          />
                      }
                      getOptionLabel={
                        option => option.name
                      }
                      isOptionEqualToValue={
                        (option, value) => option.id === value.id
                      }
                      onChange={(e, value) => setData({
                        ...data,
                        document: {
                          ...data.document,
                          category: value
                        }
                      })}
                      fullWidth
                      disablePortal
                      disableClearable
                    />
                  )}

                { // Payment Date, Coverage Month
                  (data.document.id === 3) &&
                  (
                    <React.Fragment>
                      <LocalizationProvider dateAdapter={DateAdapter}>
                        <DatePicker
                          value={data.document.payment_date}
                          onChange={(value) => setData({
                            ...data,
                            document: {
                              ...data.document,
                              payment_date: value
                            }
                          })}
                          renderInput={
                            props =>
                              <TextField
                                {...props}
                                className="FstoTextfieldForm-root"
                                variant="outlined"
                                size="small"
                                label="Payment Date"
                                fullWidth
                              />
                          }
                        />
                      </LocalizationProvider>

                      <Autocomplete
                        className="FstoSelectForm-root"
                        size="small"
                        options={COVERAGE_MONTH}
                        value={COVERAGE_MONTH.find(row => row.value === data.document.coverage) || null}
                        renderInput={
                          props =>
                            <TextField
                              {...props}
                              variant="outlined"
                              label="Coverage Month"
                            />
                        }
                        PaperComponent={
                          props =>
                            <Paper
                              {...props}
                              sx={{ textTransform: 'capitalize' }}
                            />
                        }
                        isOptionEqualToValue={
                          (option, value) => option.id === value.id
                        }
                        onChange={(e, value) => setData({
                          ...data,
                          document: {
                            ...data.document,
                            coverage: value.value
                          }
                        })}
                        fullWidth
                        disablePortal
                        disableClearable
                      />
                    </React.Fragment>
                  )}

                { // Utility Category, Utility Location, Account Number, Consumption, SOA Number
                  (data.document.id === 6) &&
                  (
                    <React.Fragment>
                      <Autocomplete
                        className="FstoSelectForm-root"
                        size="small"
                        options={[]}
                        value={data.document.utility_category}
                        renderInput={
                          props =>
                            <TextField
                              {...props}
                              variant="outlined"
                              label="Utility Category"
                            />
                        }
                        PaperComponent={
                          props =>
                            <Paper
                              {...props}
                              sx={{ textTransform: 'capitalize' }}
                            />
                        }
                        fullWidth
                        disablePortal
                        disableClearable
                      />

                      <Autocomplete
                        className="FstoSelectForm-root"
                        size="small"
                        options={[]}
                        value={null}
                        renderInput={
                          props =>
                            <TextField
                              {...props}
                              variant="outlined"
                              label="Utility Location"
                            />
                        }
                        PaperComponent={
                          props =>
                            <Paper
                              {...props}
                              sx={{ textTransform: 'capitalize' }}
                            />
                        }
                        fullWidth
                        disablePortal
                        disableClearable
                      />

                      <Autocomplete
                        className="FstoSelectForm-root"
                        size="small"
                        options={[]}
                        value={null}
                        renderInput={
                          props =>
                            <TextField
                              {...props}
                              variant="outlined"
                              label="Account Number"
                            />
                        }
                        PaperComponent={
                          props =>
                            <Paper
                              {...props}
                              sx={{ textTransform: 'capitalize' }}
                            />
                        }
                        fullWidth
                        disablePortal
                        disableClearable
                      />

                      <TextField
                        className="FstoTextfieldForm-root"
                        label="Consumption"
                        variant="outlined"
                        autoComplete="off"
                        size="small"
                        value={data.document.consumption}
                        onChange={(e) => setData({
                          ...data,
                          document: {
                            ...data.document,
                            consumption: e.target.value
                          }
                        })}
                        InputLabelProps={{
                          className: "FstoLabelForm-root"
                        }}
                        fullWidth
                      />

                      <TextField
                        className="FstoTextfieldForm-root"
                        label="SOA Number"
                        variant="outlined"
                        autoComplete="off"
                        size="small"
                        value={data.document.receipt_no}
                        onChange={(e) => setData({
                          ...data,
                          document: {
                            ...data.document,
                            receipt_no: e.target.value
                          }
                        })}
                        InputLabelProps={{
                          className: "FstoLabelForm-root"
                        }}
                        fullWidth
                      />
                    </React.Fragment>
                  )}

                { // Payroll Client, Payroll Category, Payroll Type
                  (data.document.id === 7) &&
                  (
                    <React.Fragment>
                      <Autocomplete
                        className="FstoSelectForm-root"
                        size="small"
                        options={[]}
                        value={null}
                        renderInput={
                          props =>
                            <TextField
                              {...props}
                              variant="outlined"
                              label="Payroll Client"
                            />
                        }
                        PaperComponent={
                          props =>
                            <Paper
                              {...props}
                              sx={{ textTransform: 'capitalize' }}
                            />
                        }
                        fullWidth
                        disablePortal
                        disableClearable
                      />

                      <Autocomplete
                        className="FstoSelectForm-root"
                        size="small"
                        options={[]}
                        value={null}
                        renderInput={
                          props =>
                            <TextField
                              {...props}
                              variant="outlined"
                              label="Payroll Category"
                            />
                        }
                        PaperComponent={
                          props =>
                            <Paper
                              {...props}
                              sx={{ textTransform: 'capitalize' }}
                            />
                        }
                        fullWidth
                        disablePortal
                        disableClearable
                      />

                      <Autocomplete
                        className="FstoSelectForm-root"
                        size="small"
                        options={[]}
                        value={null}
                        renderInput={
                          props =>
                            <TextField
                              {...props}
                              variant="outlined"
                              label="Payroll Type"
                            />
                        }
                        PaperComponent={
                          props =>
                            <Paper
                              {...props}
                              sx={{ textTransform: 'capitalize' }}
                            />
                        }
                        fullWidth
                        disablePortal
                        disableClearable
                      />
                    </React.Fragment>
                  )}

                <TextField
                  className="FstoTextfieldForm-root"
                  label="Remarks (Optional)"
                  variant="outlined"
                  autoComplete="off"
                  size="small"
                  rows={3}
                  value={data.document.remarks}
                  onChange={(e) => setData({
                    ...data,
                    document: {
                      ...data.document,
                      remarks: e.target.value
                    }
                  })}
                  InputLabelProps={{
                    className: "FstoLabelForm-root"
                  }}
                  fullWidth
                  multiline
                />
              </React.Fragment>
            )
          }

          <LoadingButton
            className="FstoButtonForm-root"
            type="submit"
            variant="contained"
            loadingPosition="start"
            loading={isSaving}
            startIcon={<></>}
            disabled={isDisabled()}
            disableElevation
          >
            Save
          </LoadingButton>

          {
            data.document.id
              ? <Button
                className="FstoButtonForm-root"
                variant="outlined"
                color="error"
                onClick={truncateData}
                disableElevation
              >
                Clear
              </Button>
              : <Button
                className="FstoButtonForm-root"
                variant="outlined"
                color="error"
                to="/requestor"
                component={Link}
                disableElevation
              >
                Back
              </Button>
          }
        </form>
      </Paper>

      {
        (data.document.id === 1 || data.document.id === 4 || data.document.id === 5) &&
        (
          <Paper className="FstoPaperAttachment-root" elevation={1}>
            <Typography variant="heading" sx={{ display: 'block', marginBottom: 3 }}>Attachment</Typography>

            <Box sx={{ width: "100%", display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 1, marginBottom: 2 }}>
              <TextField
                className="FstoTextfieldForm-attachment"
                label="P.O. Number"
                variant="outlined"
                autoComplete="off"
                size="small"
                value={PO.no}
                error={
                  error.status
                  && Boolean(error.data.po_no)
                }
                helperText={
                  error.status
                  && error.data.po_no
                  && error.data.po_no[0]
                }
                onBlur={checkPurchaseOrderHandler}
                onChange={(e) => setPO({
                  ...PO,
                  no: e.target.value
                })}
                InputLabelProps={{
                  className: "FstoLabelForm-attachment"
                }}
                sx={{
                  minWidth: 230
                }}
              />

              <TextField
                className="FstoTextfieldForm-attachment"
                label="P.O. Amount"
                variant="outlined"
                autoComplete="off"
                size="small"
                value={PO.amount}
                onChange={(e) => setPO({
                  ...PO,
                  amount: parseFloat(e.target.value),
                  balance: parseFloat(e.target.value)
                })}
                InputProps={{
                  inputComponent: NumberField,
                }}
                InputLabelProps={{
                  className: "FstoLabelForm-attachment"
                }}
                sx={{
                  minWidth: 230
                }}
              />

              <Autocomplete
                className="FstoSelectForm-attachment"
                size="small"
                options={[]}
                value={PO.rr_no}
                renderTags={
                  (value, getTagProps) => value.map(
                    (option, index) =>
                      <Chip
                        {...getTagProps({ index })}
                        className="FstoChipForm-attachment"
                        label={option}
                        variant="outlined"
                        size="small"
                      />
                  )
                }
                renderInput={
                  props =>
                    <TextField
                      {...props}
                      className="FstoTextfieldForm-attachment"
                      variant="outlined"
                      label="R.R. Numbers"
                      InputLabelProps={{
                        className: "FstoLabelForm-attachment"
                      }}
                    />
                }
                onChange={(e, value) => setPO({
                  ...PO,
                  rr_no: value
                })}
                freeSolo
                multiple
                fullWidth
                disablePortal
                disableClearable
              />

              <Button
                className="FstoButtonForm-attachment"
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<Add />}
                onClick={addPurchaseOrderHandler}
                disabled={
                  (error.status && Boolean(error.data.po_no)) ||
                  !Boolean(PO.no) ||
                  !Boolean(PO.amount) ||
                  !Boolean(PO.balance) ||
                  !Boolean(PO.rr_no.length)
                }
                disableElevation
              >
                Add
              </Button>
            </Box>

            {
              Boolean(data.po_group.length) &&
              (
                <React.Fragment>
                  <Box className="FstoPurchaseOrderBox-root">
                    {
                      data.po_group?.map(
                        (data, index) =>
                          <div className="FstoPurchaseOrder-root" key={index}>
                            <Stack direction="column" sx={{ flex: "1 1 100%" }}>
                              <Typography variant="subtitle2">P.O. Number</Typography>
                              <Typography variant="h6" sx={{ fontWeight: 700 }}>{data.no}</Typography>
                            </Stack>

                            <Stack direction="column" sx={{ flex: "1 1 100%" }}>
                              <Typography variant="subtitle2">P.O. Amount</Typography>
                              <Typography variant="h6" sx={{ fontWeight: 700 }}>&#8369;{data.amount.toLocaleString()}</Typography>
                            </Stack>

                            <Stack direction="column" sx={{ flex: "1 1 100%" }}>
                              <Typography variant="subtitle2">P.O. Balance</Typography>
                              <Typography variant="h6" sx={{ fontWeight: 700 }}>&#8369;{data.balance.toLocaleString()}</Typography>
                            </Stack>

                            <Stack direction="column" sx={{ flex: "1 1 100%" }}>
                              <Typography variant="subtitle2">R.R. Number</Typography>
                              <Typography variant="h6" sx={{ fontWeight: 700 }}>{data.rr_no.join(", ")}</Typography>
                            </Stack>

                            <Stack direction="row" spacing={1}>
                              <IconButton onClick={() => updatePurchaseOrderHandler(index, data)}>
                                <Edit />
                              </IconButton>
                              <IconButton onClick={() => removePurchaseOrderHandler(data)}>
                                <Delete />
                              </IconButton>
                            </Stack>
                          </div>
                      )
                    }
                  </Box>

                  <Divider variant="middle" sx={{ marginTop: 4, marginBottom: 4 }} />

                  <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: 1, width: "100%" }}>
                    <Typography variant="h6">Total P.O. Amount</Typography>
                    <Typography variant="h6">&#8369;{data.po_group.map((data) => data.amount).reduce((a, b) => a + b).toLocaleString()}</Typography>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: 1, width: "100%" }}>
                    <Typography variant="heading">Total P.O. Balance</Typography>
                    <Typography variant="heading">&#8369;{data.po_group.map((data) => data.balance).reduce((a, b) => a + b).toLocaleString()}</Typography>
                  </Box>
                </React.Fragment>
              )
            }
          </Paper>
        )
      }
    </Box>
  )
}

export default NewRequest