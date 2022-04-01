import React from 'react'
// eslint-disable-next-line
import axios from 'axios'

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
  Divider,

  // FormControlLabel,
  // FormControl,
  // FormLabel,
  // FormGroup,
  // Checkbox
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

import Confirm from '../../components/Confirm'

// import useToast from '../../hooks/useToast'


const DOCUMENT_TYPES = [
  {
    id: 1,
    type: "PAD"
  },
  {
    id: 2,
    type: "PRM Common"
  },
  {
    id: 3,
    type: "PRM Multiple"
  },
  {
    id: 4,
    type: "Receipt"
  },
  {
    id: 5,
    type: "Contractor's Billing"
  },
  {
    id: 6,
    type: "Utilities"
  },
  {
    id: 7,
    type: "Payroll"
  },
  {
    id: 8,
    type: "PCF"
  },
]

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

const COMPANY_LIST = [
  {
    id: 1,
    name: "RDF Corporate Services"
  },
  {
    id: 2,
    name: "Fresh Option"
  },
]

const DEPARTMENT_LIST = [
  {
    id: 1,
    name: "Management Information System Common"
  },
  {
    id: 2,
    name: "Human Resources Common"
  }
]

const LOCATION_LIST = [
  {
    id: 1,
    name: "Common"
  },
  {
    id: 2,
    name: "Head Office"
  },
]

const SUPPLIER_LIST = [
  {
    id: 1,
    name: "1ST ADVENUE ADVERTISING"
  },
  {
    id: 2,
    name: "PELCO I"
  },
  {
    id: 3,
    name: "PELCO II"
  },
  {
    id: 4,
    name: "PELCO III"
  },
]

const CATEGORY_LIST = [
  {
    id: 1,
    name: "general"
  },
  {
    id: 2,
    name: "rentals"
  },
  {
    id: 3,
    name: "loans"
  },
  {
    id: 4,
    name: "leasings"
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

  // const toast = useToast()

  // eslint-disable-next-line
  const [isSaving, setIsSaving] = React.useState(false)

  const [confirm, setConfirm] = React.useState({
    show: false,
    loading: false,
    onConfirm: () => { }
  })

  // const [charging, setCharging] = React.useState([])



  const isDisabled = () => {
    switch (data.document.id) {
      case 1:
        return data.document.payment_type
          && data.document.no
          && data.document.date
          && data.document.amount
          && data.document.company
          && data.document.department
          && data.document.location
          && data.document.supplier
          && data.document.category
          // && data.po_group.length
          && data.document.amount === data.po_group.map((po) => po.balance).reduce((a, b) => a + b, 0)
          ? false : true

      case 2:
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
  // eslint-disable-next-line
  const [error, setError] = React.useState({
    status: true,
    data: {
      "po_group.no": [
        "PO number already exist."
      ]
    }
  })

  const [data, setData] = React.useState({
    requestor: {
      id: 1,
      id_prefix: "RDFFLFI",
      id_no: 10791,
      first_name: "Limay Louie",
      middle_name: "Ocampo",
      last_name: "Ducut",
      suffix: null,
      role: "Administrator",
      position: "System Developer",
      department: "Management Information System",
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

      remarks: undefined
    },

    po_group: []
  })

  const [PO, setPO] = React.useState({
    no: "",
    balance: null,
    amount: null,
    rr_no: []
  })

  // React.useEffect(() => {
  //   (async () => {
  //     let response
  //     try {
  //       response = await axios.get(`http://localhost:5000/charging`).then(JSON => JSON.data)

  //       setCharging(response.length ? response : [])
  //     }
  //     catch (error) {
  //       if (error.request.status !== 404) {
  //         toast({
  //           open: true,
  //           title: "Error",
  //           message: "Something went wrong whilst fetching list of companies, departments and locations from Sedar.",
  //           severity: "error"
  //         })
  //       }

  //       console.log("Fisto Error Status", error.request)
  //     }
  //   })()
  // }, [])

  const addPurchaseOrderHandler = () => {
    const check = data.po_group.some((data) => data.no === PO.no)
    if (check) return

    // ask if posible bang marepeat ang rr no to diff po no


    setData({
      ...data,
      po_group: [
        ...data.po_group, PO
      ]
    })
    setPO({
      no: "",
      balance: NaN,
      amount: NaN,
      rr_no: []
    })
  }

  const updatePurchaseOrderHandler = (props) => {
    const { no, amount, balance, rr_no } = props

    setPO({
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

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperForm-root" elevation={1}>
        <Typography variant="heading" sx={{ display: 'block', marginBottom: 3 }}>Request for Tagging</Typography>

        <form>
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
                                label="From Date"
                                fullWidth
                              />
                          }
                        />
                      </LocalizationProvider>

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
                        && Boolean(error.data["document.no"])
                      }
                      helperText={
                        error.status
                        && error.data["document.no"]
                        && error.data["document.no"][0]
                      }
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
                  options={COMPANY_LIST}
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
                      company: value
                    }
                  })}
                  fullWidth
                  disablePortal
                  disableClearable
                />

                <Autocomplete
                  className="FstoSelectForm-root"
                  size="small"
                  options={DEPARTMENT_LIST}
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
                  options={LOCATION_LIST}
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
                  (data.document.id === 1 || data.document.id === 2 || data.document.id === 3 || data.document.id === 4) &&
                  (
                    <Autocomplete
                      className="FstoSelectForm-root"
                      size="small"
                      options={CATEGORY_LIST}
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
                        value={null}
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
                        value={null}
                        InputProps={{
                          inputComponent: NumberField,
                        }}
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
                        value={null}
                        InputProps={{
                          inputComponent: NumberField,
                        }}
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

          <Button
            className="FstoButtonForm-root"
            variant="outlined"
            color="error"
            // onClick={formClearHandler}
            disableElevation
          >
            Clear
          </Button>
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
                  && Boolean(error.data["po_group.no"])
                }
                helperText={
                  error.status
                  && error.data["po_group.no"]
                  && error.data["po_group.no"][0]
                }
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
                              <IconButton onClick={() => updatePurchaseOrderHandler(data)}>
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


      <Confirm
        open={confirm.show}
        isLoading={confirm.loading}
        onConfirm={confirm.onConfirm}
        onClose={() => setConfirm({
          show: false,
          loading: false,
          onConfirm: () => { }
        })}
      />
    </Box>
  )
}

export default NewRequest