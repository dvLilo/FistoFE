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

import {
  LoadingButton,
  DatePicker,
  LocalizationProvider
} from '@mui/lab'

import DateAdapter from '@mui/lab/AdapterDateFns'

import { createFilterOptions } from '@mui/material/Autocomplete';

import useToast from '../../hooks/useToast'
import useConfirm from '../../hooks/useConfirm'


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

const BATCH_LETTERS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z"
]

const PAYROLL_TYPES = [
  "Regular",
  "Farm",
  "Paid Leave",
  "Farm Paid Leave",
  "Cash Advance",
  "Confidential"
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
      from: null,
      to: null,
      date: null,
      amount: null,

      payment_date: null,
      coverage: null,

      category: null,

      company: null,
      department: null,
      location: null,

      supplier: null,

      reference: {
        id: null,
        type: "",
        no: "",
        amount: null
      },

      pcf_batch: {
        name: null,
        letter: null,
        date: null
      },

      utility: {
        receipt_no: "",
        location: null,
        category: null,
        account_no: null,
        consumption: ""
      },

      payroll: {
        type: null,
        category: null,
        clients: []
      },

      remarks: ""
    },

    po_group: []
  })

  const [PO, setPO] = React.useState({
    update: false,
    index: null,
    batch: false,

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

  const [SUPPLIER_LIST, setSupplierList] = React.useState([])
  React.useEffect(() => {
    (async () => {
      let response
      try {
        response = await axios.get(`/api/dropdown/suppliers`, {
          params: {
            status: 1,
            paginate: 0
          }
        })

        const { suppliers } = response.data.result

        setSupplierList(suppliers)
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

  const [PETTYCASHFUND_LIST, setPettyCashFundList] = React.useState([])
  React.useEffect(() => {
    (async () => {
      if (data.document.id === 8) {
        let response
        try {
          response = await axios.get(`http://localhost:5000/stalwart`)

          const { data } = response

          setPettyCashFundList(data)
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
      }
    })()

    // eslint-disable-next-line
  }, [data.document.id])

  const [PAYROLL_CLIENTS, setPayrollClients] = React.useState([])
  React.useEffect(() => {
    (async () => {
      if (data.document.id === 7) {
        let response
        try {
          response = await axios.get(`/api/dropdown/payroll-clients`, {
            params: {
              status: 1,
              paginate: 0
            }
          })

          const { payroll_clients } = response.data.result

          setPayrollClients(payroll_clients)
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
      }
    })()

    // eslint-disable-next-line
  }, [data.document.id])

  const [PAYROLL_CATEGORIES, setPayrollCategories] = React.useState([])
  React.useEffect(() => {
    (async () => {
      if (data.document.id === 7) {
        let response
        try {
          response = await axios.get(`/api/dropdown/payroll-categories`, {
            params: {
              status: 1,
              paginate: 0
            }
          })

          const { payroll_categories } = response.data.result

          setPayrollCategories(payroll_categories)
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
      }
    })()

    // eslint-disable-next-line
  }, [data.document.id])

  const [ACCOUNT_NUMBERS, setAccountNumbers] = React.useState([])
  React.useEffect(() => {
    (async () => {
      if (data.document.id === 6) {
        let response
        try {
          response = await axios.get(`/api/dropdown/account-numbers`, {
            params: {
              status: 1,
              paginate: 0
            }
          })

          const { account_numbers } = response.data.result

          setAccountNumbers(account_numbers)
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
      }
    })()

    // eslint-disable-next-line
  }, [data.document.id])

  const [UTILITY_CATEGORIES, setUtilityCategories] = React.useState([])
  React.useEffect(() => {
    (async () => {
      if (data.document.id === 6) {
        let response
        try {
          response = await axios.get(`/api/dropdown/utility-categories`, {
            params: {
              status: 1,
              paginate: 0
            }
          })

          const { utility_categories } = response.data.result

          setUtilityCategories(utility_categories)
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
      }
    })()

    // eslint-disable-next-line
  }, [data.document.id])

  const [UTILITY_LOCATIONS, setUtilityLocations] = React.useState([])
  React.useEffect(() => {
    (async () => {
      if (data.document.id === 6) {
        let response
        try {
          response = await axios.get(`/api/dropdown/utility-locations`, {
            params: {
              status: 1,
              paginate: 0
            }
          })

          const { utility_locations } = response.data.result

          setUtilityLocations(utility_locations)
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
      }
    })()

    // eslint-disable-next-line
  }, [data.document.id])

  const [REFERENCE_TYPES, setReferenceTypes] = React.useState([])
  React.useEffect(() => {
    (async () => {
      if (data.document.id === 4) {
        let response
        try {
          response = await axios.get(`/api/dropdown/references`, {
            params: {
              status: 1,
              paginate: 0
            }
          })

          const { referrences } = response.data.result

          setReferenceTypes(referrences)
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
      }
    })()

    // eslint-disable-next-line
  }, [data.document.id])




  React.useEffect(() => { // Reference Number Validation
    if (data.document.id === 4
      && data.document.company
    ) checkReferenceNumberHandler()

    // eslint-disable-next-line
  }, [data.document.company])

  React.useEffect(() => { // PO Number Validation
    if ((data.document.id === 1 || data.document.id === 4 || data.document.id === 5)
      && data.document.payment_type
      && data.document.company
    ) checkPurchaseOrderHandler()

    // eslint-disable-next-line
  }, [data.document.payment_type, data.document.company])


  React.useEffect(() => { // Utility Account Number Auto Select
    if (data.document.supplier && data.document.utility.category && data.document.utility.location) {
      const account_numbers = ACCOUNT_NUMBERS.filter(row => row.supplier.id === data.document.supplier.id && row.category.id === data.document.utility.category.id && row.location.id === data.document.utility.location.id)

      if (account_numbers.length === 1)
        setData(currentValue => ({
          ...currentValue,
          document: {
            ...currentValue.document,
            utility: {
              ...currentValue.document.utility,
              account_no: {
                id: account_numbers[0].id,
                no: account_numbers[0].no
              }
            }
          }
        }))
      else
        setData(currentValue => ({
          ...currentValue,
          document: {
            ...currentValue.document,
            utility: {
              ...currentValue.document.utility,
              account_no: null
            }
          }
        }))
    }

    // eslint-disable-next-line
  }, [data.document.supplier, data.document.utility.category, data.document.utility.location])


  // Clear Error
  React.useEffect(() => { // For Payroll Error
    if (data.document.id === 7 && error.status)
      setError(currentValue => ({
        ...currentValue,
        data: {
          ...currentValue.data,
          from_date: undefined,
          to_date: undefined,
          payroll_type: undefined,
          payroll_clients: undefined,
          payroll_category: undefined,
        }
      }))

    // eslint-disable-next-line
  }, [data.document.from, data.document.to, data.document.payroll.type, data.document.payroll.category, data.document.payroll.clients])

  React.useEffect(() => { // For Utility Error
    if (data.document.id === 6 && error.status)
      setError(currentValue => ({
        ...currentValue,
        data: {
          ...currentValue.data,
          from_date: undefined,
          to_date: undefined,
          document_company: undefined,
          document_department: undefined,
          utility_category: undefined,
          utility_location: undefined
        }
      }))

    // eslint-disable-next-line
  }, [data.document.from, data.document.to, data.document.company, data.document.department, data.document.utility.category, data.document.utility.location])


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
          && (!error.status || !Boolean(error.data.po_no))
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

      case 4: // Receipt
        return data.document.payment_type
          && data.document.date
          && data.document.company
          && data.document.department
          && data.document.location
          && data.document.supplier
          && data.document.category
          && data.document.reference.id
          && data.document.reference.type
          && data.document.reference.no
          && data.document.reference.amount
          && data.po_group.length
          && (
            data.document.payment_type === "Partial"
              ? (data.document.reference.amount <= data.po_group.map((po) => po.balance).reduce((a, b) => a + b, 0))
              : (data.document.reference.amount === data.po_group.map((po) => po.balance).reduce((a, b) => a + b, 0))
          )
          && (!error.status || !Boolean(error.data.reference_no))
          && (!error.status || !Boolean(error.data.po_no))
          ? false : true

      case 6:
        return data.document.payment_type
          && data.document.from
          && data.document.to
          && data.document.amount
          && data.document.company
          && data.document.department
          && data.document.location
          && data.document.supplier
          && data.document.utility.category
          && data.document.utility.location
          && data.document.utility.account_no
          && data.document.utility.consumption
          && data.document.utility.receipt_no
          ? false : true

      case 7:
        return data.document.payment_type
          && data.document.from
          && data.document.to
          && data.document.amount
          && data.document.company
          && data.document.department
          && data.document.location
          && data.document.supplier
          && data.document.payroll.clients.length
          && data.document.payroll.category
          && data.document.payroll.type
          ? false : true

      case 8:
        return data.document.payment_type
          && data.document.date
          && data.document.amount
          && data.document.company
          && data.document.department
          && data.document.location
          && data.document.supplier
          && data.document.pcf_batch.name
          && data.document.pcf_batch.letter
          && data.document.pcf_batch.date
          && (!error.status || !Boolean(error.data.pcf_name))
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

  const checkReferenceNumberHandler = async (e) => {
    if (error.status && error.data.reference_no) {
      delete error.data.reference_no
      setError(currentValue => ({
        ...currentValue,
        data: error.data
      }))
    }

    if (!data.document.reference.no || !data.document.company) return

    try {
      await axios.post(`/api/transactions/validate-reference-no`, {
        reference_no: data.document.reference.no,
        company_id: data.document.company.id
      })
    }
    catch (error) {
      if (error.request.status === 422) {
        const { errors } = error.response.data

        setError(currentValue => ({
          status: true,
          data: {
            ...currentValue.data,
            reference_no: errors["document.reference.no"]
          }
        }))
      }
    }
  }

  const checkPettyCashFundNameHandler = async (name) => {
    if (error.status && error.data.pcf_name) {
      delete error.data.pcf_name
      setError(currentValue => ({
        ...currentValue,
        data: error.data
      }))
    }

    try {
      await axios.post(`/api/transactions/validate-pcf-name`, {
        pcf_name: name
      })
    }
    catch (error) {
      if (error.request.status === 422) {
        const { errors } = error.response.data

        setError(currentValue => ({
          status: true,
          data: {
            ...currentValue.data,
            pcf_name: errors["pcf_batch.name"]
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
      rr_no: PO.rr_no,
      batch: PO.batch
    })
    else setData({
      ...data,
      po_group: [
        {
          no: PO.no,
          balance: PO.balance,
          amount: PO.amount,
          rr_no: PO.rr_no,
          batch: PO.batch
        },
        ...data.po_group,
      ]
    })

    setPO({
      update: false,
      index: null,
      batch: false,

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

      const check = data.po_group.some((data) => data.no === PO.no)
      if (check && !PO.update)
        return setError({
          status: true,
          data: {
            ...error.data,
            "po_no": [
              "PO number already in the list."
            ]
          }
        })

      if (response.status === 200 && !PO.update) {
        const { po_group } = response.data.result

        setData(currentValue => ({
          ...currentValue,
          po_group: [
            ...currentValue.po_group,
            ...po_group.map((data) => ({ ...data, batch: true })).reverse()
          ]
        }))

        const PODetails = po_group.map((data) => ({ ...data, batch: true })).find((data) => data.no === PO.no)
        const POIndex = [
          ...data.po_group,
          ...po_group.reverse()
        ].findIndex((data) => data.no === PO.no)

        updatePurchaseOrderHandler(POIndex, PODetails)
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
    const { no, amount, balance, rr_no, batch } = props

    delete error.data.po_no
    setError({
      ...error,
      data: error.data
    })

    setPO({
      update: true,
      index,
      batch,

      no,
      amount,
      balance,
      rr_no
    })
  }

  const removePurchaseOrderHandler = (props) => {
    const { no, batch } = props

    if (batch) setData({
      ...data,
      po_group: data.po_group.filter((data) => data.batch !== true)
    })
    else setData({
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
        return {

        }

      case 4: // Receipt
        return {
          requestor: data.requestor,
          document: {
            id: data.document.id,
            name: data.document.name,
            payment_type: data.document.payment_type,
            date: data.document.date,

            company: data.document.company,
            department: data.document.department,
            location: data.document.location,
            supplier: data.document.supplier,
            reference: data.document.reference,
            category: data.document.category,

            remarks: data.document.remarks
          },
          po_group: data.po_group
        }

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
            from: data.document.from,
            to: data.document.to,

            company: data.document.company,
            department: data.document.department,
            location: data.document.location,
            supplier: data.document.supplier,

            utility: data.document.utility,

            remarks: data.document.remarks
          }
        }

      case 7: // Payroll
        return {
          requestor: data.requestor,
          document: {
            id: data.document.id,
            name: data.document.name,
            payment_type: data.document.payment_type,
            from: data.document.from,
            to: data.document.to,
            amount: data.document.amount,

            company: data.document.company,
            department: data.document.department,
            location: data.document.location,

            supplier: data.document.supplier,

            payroll: data.document.payroll,

            remarks: data.document.remarks
          }
        }

      case 8: // PCF - Petty Cash Fund
        return {
          requestor: data.requestor,
          document: {
            id: data.document.id,
            name: data.document.name,
            payment_type: data.document.payment_type,
            amount: data.document.amount,
            date: data.document.date,

            company: data.document.company,
            department: data.document.department,
            location: data.document.location,

            supplier: data.document.supplier,

            pcf_batch: data.document.pcf_batch,

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
      batch: false,

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
        from: null,
        to: null,
        date: null,
        amount: null,

        payment_date: null,
        coverage: null,

        category: null,

        company: null,
        department: null,
        location: null,

        supplier: null,

        reference: {
          id: null,
          type: "",
          no: "",
          amount: null
        },

        pcf_batch: {
          name: null,
          letter: null,
          date: null
        },

        utility: {
          receipt_no: "",
          location: null,
          category: null,
          account_no: null,
          consumption: ""
        },

        payroll: {
          type: null,
          category: null,
          clients: []
        },

        remarks: ""
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

                po_no: errors["po_group.no"],

                from_date: errors["document.from"],
                to_date: errors["document.to"],

                document_no: errors["document.no"],
                document_company: errors["document.company.id"],
                document_department: errors["document.department.id"],

                pcf_date: errors["document.pcf_batch.date"],
                pcf_letter: errors["document.pcf_batch.letter"],

                payroll_type: errors["document.payroll.type"],
                payroll_clients: errors["document.payroll.clients"],
                payroll_category: errors["document.payroll.category"],

                utility_location: errors["document.utility.location.id"],
                utility_category: errors["document.utility.category.id"]
              }
            }))

            toast({
              open: true,
              severity: "error",
              title: "Error!",
              message: "Transaction failed. Please try again.",
              duration: null
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
                        filterOptions={filterOptions}
                        options={PETTYCASHFUND_LIST}
                        value={PETTYCASHFUND_LIST.find(row => row.name === data.document.pcf_batch.name) || null}
                        renderInput={
                          props =>
                            <TextField
                              {...props}
                              variant="outlined"
                              label="Batch Name"
                              error={
                                error.status
                                && Boolean(error.data.pcf_name)
                              }
                              helperText={
                                error.status
                                && error.data.pcf_name
                                && error.data.pcf_name[0]
                              }
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
                          (option, value) => option.name === value.name
                        }
                        onChange={(e, value) => {
                          setData({
                            ...data,
                            document: {
                              ...data.document,
                              pcf_batch: {
                                name: value.name,
                                letter: value.letter,
                                date: value.date
                              },
                              payment_type: "Full",
                              amount: value.amount,
                            }
                          })
                          checkPettyCashFundNameHandler(value.name)
                        }}
                        fullWidth
                        disablePortal
                        disableClearable
                      />

                      <Autocomplete
                        className="FstoSelectForm-root"
                        size="small"
                        options={BATCH_LETTERS}
                        value={data.document.pcf_batch.letter}
                        renderInput={
                          props =>
                            <TextField
                              {...props}
                              variant="outlined"
                              label="Batch Letter"
                              error={
                                error.status
                                && Boolean(error.data.pcf_letter)
                              }
                              helperText={
                                error.status
                                && error.data.pcf_letter
                                && error.data.pcf_letter[0]
                              }
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
                          option => option
                        }
                        isOptionEqualToValue={
                          (option, value) => option === value
                        }
                        onChange={(e, value) => setData({
                          ...data,
                          document: {
                            ...data.document,
                            pcf_batch: {
                              ...data.document.pcf_batch,
                              letter: value
                            }
                          }
                        })}
                        fullWidth
                        disablePortal
                        disableClearable
                      />

                      <LocalizationProvider dateAdapter={DateAdapter}>
                        <DatePicker
                          views={['year', 'month']}
                          value={data.document.pcf_batch.date}
                          onChange={(value) => setData({
                            ...data,
                            document: {
                              ...data.document,
                              pcf_batch: {
                                ...data.document.pcf_batch,
                                date: new Date(value).toISOString().slice(0, 7)
                              }
                            }
                          })}
                          renderInput={
                            props =>
                              <TextField
                                {...props}
                                className="FstoTextfieldForm-root"
                                variant="outlined"
                                size="small"
                                label="Batch Date"
                                error={
                                  error.status
                                  && Boolean(error.data.pcf_date)
                                }
                                helperText={
                                  error.status
                                  && error.data.pcf_date
                                  && error.data.pcf_date[0]
                                }
                                fullWidth
                              />
                          }
                          showToolbar
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
                                error={
                                  error.status
                                  && Boolean(error.data.from_date)
                                }
                                helperText={
                                  error.status
                                  && error.data.from_date
                                  && error.data.from_date[0]
                                }
                                fullWidth
                              />
                          }
                          showToolbar
                        />
                      </LocalizationProvider>

                      <LocalizationProvider dateAdapter={DateAdapter}>
                        <DatePicker
                          value={data.document.to}
                          minDate={new Date(data.document.from)}
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
                                error={
                                  error.status
                                  && Boolean(error.data.to_date)
                                }
                                helperText={
                                  error.status
                                  && error.data.to_date
                                  && error.data.to_date[0]
                                }
                                fullWidth
                              />
                          }
                          showToolbar
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
                        showToolbar
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
                      disabled={data.document.id === 8}
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
                        error={
                          error.status
                          && Boolean(error.data.document_company)
                        }
                        helperText={
                          error.status
                          && error.data.document_company
                          && error.data.document_company[0]
                        }
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
                        error={
                          error.status
                          && Boolean(error.data.document_department)
                        }
                        helperText={
                          error.status
                          && error.data.document_department
                          && error.data.document_department[0]
                        }
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

                { // Reference Type, Reference Number, Reference Amount
                  (data.document.id === 4) &&
                  (
                    <React.Fragment>
                      <Autocomplete
                        className="FstoSelectForm-root"
                        size="small"
                        options={REFERENCE_TYPES}
                        value={data.document.reference.id ? data.document.reference : null}
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
                            reference: {
                              ...data.document.reference,
                              id: value.id,
                              type: value.type
                            }
                          }
                        })}
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
                        value={data.document.reference.no}
                        error={
                          error.status
                          && Boolean(error.data.reference_no)
                        }
                        helperText={
                          error.status
                          && error.data.reference_no
                          && error.data.reference_no[0]
                        }
                        onChange={(e) => setData({
                          ...data,
                          document: {
                            ...data.document,
                            reference: {
                              ...data.document.reference,
                              no: e.target.value
                            }
                          }
                        })}
                        onBlur={checkReferenceNumberHandler}
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
                        value={data.document.reference.amount}
                        error={
                          Boolean(data.po_group.length) &&
                          Boolean(data.document.reference.amount)
                          && (
                            data.document.payment_type === "Partial"
                              ? (data.document.reference.amount > data.po_group.map((po) => po.balance).reduce((a, b) => a + b, 0))
                              : (data.document.reference.amount === data.po_group.map((po) => po.balance).reduce((a, b) => a + b, 0))
                          )
                        }
                        helperText={
                          Boolean(data.po_group.length) &&
                          Boolean(data.document.reference.amount)
                          && (
                            data.document.payment_type === "Partial"
                              ? (data.document.reference.amount > data.po_group.map((po) => po.balance).reduce((a, b) => a + b, 0))
                              : (data.document.reference.amount === data.po_group.map((po) => po.balance).reduce((a, b) => a + b, 0))
                          )
                          && "Reference amount and PO balance amount is not equal."
                        }
                        onChange={(e) => setData({
                          ...data,
                          document: {
                            ...data.document,
                            reference: {
                              ...data.document.reference,
                              amount: parseFloat(e.target.value)
                            }
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

                <Autocomplete
                  className="FstoSelectForm-root"
                  size="small"
                  filterOptions={filterOptions}
                  options={
                    data.document.id === 4
                      ? data.document.reference.id ? SUPPLIER_LIST.filter(row => row.references.some(ref => ref.id === data.document.reference.id)) : SUPPLIER_LIST
                      : SUPPLIER_LIST
                  }
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
                        filterOptions={filterOptions}
                        options={UTILITY_CATEGORIES}
                        value={data.document.utility.category}
                        renderInput={
                          props =>
                            <TextField
                              {...props}
                              variant="outlined"
                              label="Utility Category"
                              error={
                                error.status
                                && Boolean(error.data.utility_category)
                              }
                              helperText={
                                error.status
                                && error.data.utility_category
                                && error.data.utility_category[0]
                              }
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
                            utility: {
                              ...data.document.utility,
                              category: value,
                              account_no: null
                            }
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
                        options={UTILITY_LOCATIONS}
                        value={data.document.utility.location}
                        renderInput={
                          props =>
                            <TextField
                              {...props}
                              variant="outlined"
                              label="Utility Location"
                              error={
                                error.status
                                && Boolean(error.data.utility_location)
                              }
                              helperText={
                                error.status
                                && error.data.utility_location
                                && error.data.utility_location[0]
                              }
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
                            utility: {
                              ...data.document.utility,
                              location: value,
                              account_no: null
                            }
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
                        options={
                          data.document.supplier && data.document.utility.category && data.document.utility.location
                            ? ACCOUNT_NUMBERS.filter(row => row.supplier.id === data.document.supplier.id && row.category.id === data.document.utility.category.id && row.location.id === data.document.utility.location.id)
                            : data.document.supplier || data.document.utility.category || data.document.utility.location
                              ? ACCOUNT_NUMBERS.filter(row => row.supplier.id === data.document.supplier?.id || row.category.id === data.document.utility.category?.id || row.location.id === data.document.utility.location?.id)
                              : ACCOUNT_NUMBERS
                        }
                        value={data.document.utility.account_no}
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
                        getOptionLabel={
                          option => option.no
                        }
                        isOptionEqualToValue={
                          (option, value) => option.id === value.id
                        }
                        onChange={(e, value) => setData({
                          ...data,
                          document: {
                            ...data.document,
                            utility: {
                              ...data.document.utility,
                              account_no: {
                                id: value.id,
                                no: value.no
                              }
                            }
                          }
                        })}
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
                        value={data.document.utility.consumption}
                        onChange={(e) => setData({
                          ...data,
                          document: {
                            ...data.document,
                            utility: {
                              ...data.document.utility,
                              consumption: e.target.value
                            }
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
                        value={data.document.utility.receipt_no}
                        onChange={(e) => setData({
                          ...data,
                          document: {
                            ...data.document,
                            utility: {
                              ...data.document.utility,
                              receipt_no: e.target.value
                            }
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
                        filterOptions={filterOptions}
                        options={PAYROLL_CLIENTS}
                        value={data.document.payroll.clients}
                        renderInput={
                          props =>
                            <TextField
                              {...props}
                              variant="outlined"
                              label="Payroll Client"
                              error={
                                error.status
                                && Boolean(error.data.payroll_clients)
                              }
                              helperText={
                                error.status
                                && error.data.payroll_clients
                                && error.data.payroll_clients[0]
                              }
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
                            payroll: {
                              ...data.document.payroll,
                              clients: value
                            }
                          }
                        })}
                        fullWidth
                        multiple
                        disablePortal
                        disableClearable
                        disableCloseOnSelect
                      />

                      <Autocomplete
                        className="FstoSelectForm-root"
                        size="small"
                        filterOptions={filterOptions}
                        options={PAYROLL_CATEGORIES}
                        value={data.document.payroll.category}
                        renderInput={
                          props =>
                            <TextField
                              {...props}
                              variant="outlined"
                              label="Payroll Category"
                              error={
                                error.status
                                && Boolean(error.data.payroll_category)
                              }
                              helperText={
                                error.status
                                && error.data.payroll_category
                                && error.data.payroll_category[0]
                              }
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
                            payroll: {
                              ...data.document.payroll,
                              category: value
                            }
                          }
                        })}
                        fullWidth
                        disablePortal
                        disableClearable
                      />

                      <Autocomplete
                        className="FstoSelectForm-root"
                        size="small"
                        options={PAYROLL_TYPES}
                        value={data.document.payroll.type}
                        renderInput={
                          props =>
                            <TextField
                              {...props}
                              variant="outlined"
                              label="Payroll Type"
                              error={
                                error.status
                                && Boolean(error.data.payroll_type)
                              }
                              helperText={
                                error.status
                                && error.data.payroll_type
                                && error.data.payroll_type[0]
                              }
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
                          option => option
                        }
                        isOptionEqualToValue={
                          (option, value) => option === value
                        }
                        onChange={(e, value) => setData({
                          ...data,
                          document: {
                            ...data.document,
                            payroll: {
                              ...data.document.payroll,
                              type: value
                            }
                          }
                        })}
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

            <Box className="FstoBoxForm-attachment">
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
                disabled={PO.batch}
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
                  amount: parseFloat(e.target.value)
                })}
                onBlur={(e) => setPO({
                  ...PO,
                  balance: parseFloat(PO.amount)
                })}
                InputProps={{
                  inputComponent: NumberField,
                }}
                InputLabelProps={{
                  className: "FstoLabelForm-attachment"
                }}
                disabled={PO.batch}
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
                      // className="FstoTextfieldForm-attachment"
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
                startIcon={PO.update ? <Edit /> : <Add />}
                onClick={addPurchaseOrderHandler}
                disabled={
                  (error.status && Boolean(error.data.po_no)) ||
                  !Boolean(PO.no) ||
                  !Boolean(PO.amount) ||
                  // !Boolean(PO.balance) ||
                  !Boolean(PO.rr_no.length)
                }
                disableElevation
              >
                {PO.update ? "Update" : "Add"}
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

                            <Stack direction="column" sx={{ flex: "1 1 100%", minWidth: 0 }}>
                              <Typography variant="subtitle2">R.R. Number</Typography>
                              <Typography variant="h6" sx={{ fontWeight: 700, textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>{data.rr_no.join(", ")}</Typography>
                            </Stack>

                            <Stack direction="row" spacing={1}>
                              <IconButton onClick={() => updatePurchaseOrderHandler(index, data)}>
                                <Edit />
                              </IconButton>
                              <IconButton onClick={() => removePurchaseOrderHandler(data)} disabled={PO.update}>
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