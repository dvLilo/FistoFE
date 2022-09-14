import React from 'react'

import axios from 'axios'

import * as XLSX from 'xlsx'

import { useNavigate } from 'react-router-dom'

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
  InputAdornment,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material'

import {
  Add,
  Edit,
  Delete,
  UploadFile
} from '@mui/icons-material'

import {
  LoadingButton,
  DatePicker,
  LocalizationProvider
} from '@mui/lab'

import DateAdapter from '@mui/lab/AdapterDateFns'

import { createFilterOptions } from '@mui/material/Autocomplete'

import useToast from '../../hooks/useToast'
import useConfirm from '../../hooks/useConfirm'

import useSuppliers from '../../hooks/useSuppliers'
import useCompanies from '../../hooks/useCompanies'
import useDepartments from '../../hooks/useDepartments'
import useLocations from '../../hooks/useLocations'
import usePayrollClents from '../../hooks/usePayrollClents'
import usePayrollCategories from '../../hooks/usePayrollCategories'
import useAccountNumbers from '../../hooks/useAccountNumbers'
import useUtilityCategories from '../../hooks/useUtilityCategories'
import useUtilityLocations from '../../hooks/useUtilityLocations'

import ErrorDialog from '../../components/ErrorDialog'

const REQUEST_TYPES = [
  {
    id: 1,
    label: "Regular"
  },
  {
    id: 2,
    label: "Confidential"
  }
]

const PAYMENT_TYPES = [
  {
    id: 1,
    label: "Full"
  },
  {
    id: 2,
    label: "Partial"
  }
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
      allowNegative={false}
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
  const navigate = useNavigate()

  const [isSaving, setIsSaving] = React.useState(false)

  const [validate, setValidate] = React.useState({
    status: false,
    data: []
  })

  const [errorImport, setErrorImport] = React.useState({
    open: false,
    data: [],
    onClose: () => setErrorImport(currentValue => ({
      ...currentValue,
      open: false
    }))
  })

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
      request_type: "",
      payment_type: "Full",
      no: "",
      capex_no: "",
      from: null,
      to: null,
      date: null,
      amount: null,

      needed_date: null,
      release_date: null,
      batch_no: "",

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

  // eslint-disable-next-line
  const [prmGroup, setPrmGroup] = React.useState([])
  // eslint-disable-next-line
  const [poGroup, setPoGroup] = React.useState([])

  const [PO, setPO] = React.useState({
    update: false,
    index: null,
    batch: false,

    no: "",
    balance: null,
    amount: null,
    rr_no: []
  })

  const [DOCUMENT_TYPES, setDocumentTypes] = React.useState({ fetching: true, disabled: false, data: [] })
  React.useEffect(() => {
    (async () => {
      let response
      try {
        response = await axios.get(`/api/dropdown/current-user`)

        const { id, id_prefix, id_no, first_name, middle_name, last_name, suffix, role, position, department, document_types } = response.data.result

        setDocumentTypes({ fetching: false, data: document_types })
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
            department: department[0]["name"]
          }
        }))
      }
      catch (error) {
        console.log("Fisto Error Status", error.request)

        setDocumentTypes({ fetching: false, data: [] })
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
  React.useEffect(() => { // User Department Validation
    (async () => {
      try {
        await axios.post(`/api/users/department-validation`)

        setDocumentTypes(currentValue => ({
          ...currentValue,
          disabled: false
        }))
      }
      catch (error) {
        if (error.request.status === 404) {
          setDocumentTypes(currentValue => ({
            ...currentValue,
            disabled: true
          }))

          toast({
            title: "Error!",
            message: "Your department is not registered. Please inform the technical support.",
            severity: "error",
            duration: null
          })
        }

        if (error.request.status !== 404)
          toast({
            title: "Error!",
            message: "Something went wrong whilst validating user department."
          })
      }
    })()
    // eslint-disable-next-line
  }, [])

  const {
    status: SUPPLIER_STATUS,
    data: SUPPLIER_LIST
  } = useSuppliers()

  const {
    status: COMPANY_STATUS,
    data: COMPANY_LIST
  } = useCompanies()

  const {
    status: DEPARTMENT_STATUS,
    data: DEPARTMENT_LIST
  } = useDepartments(data.document.company?.id)

  const {
    status: LOCATION_STATUS,
    data: LOCATION_LIST
  } = useLocations(data.document.department?.id)

  const {
    refetch: fetchPayrollClients,
    status: PAYROLL_CLIENTS_STATUS,
    data: PAYROLL_CLIENTS_LIST
  } = usePayrollClents()
  React.useEffect(() => {
    if (data.document.id === 7) fetchPayrollClients()
    // eslint-disable-next-line 
  }, [data.document.id])

  const {
    refetch: fetchAccountNumbers,
    status: ACCOUNT_NUMBERS_STATUS,
    data: ACCOUNT_NUMBERS_LIST
  } = useAccountNumbers()
  React.useEffect(() => {
    if (data.document.id === 6) fetchAccountNumbers()
    // eslint-disable-next-line 
  }, [data.document.id])

  const {
    refetch: fetchUtilityCategories,
    status: UTILITY_CATEGORIES_STATUS,
    data: UTILITY_CATEGORIES_LIST
  } = useUtilityCategories()
  React.useEffect(() => {
    if (data.document.id === 6) fetchUtilityCategories()
    // eslint-disable-next-line 
  }, [data.document.id])

  const {
    refetch: fetchUtilityLocations,
    status: UTILITY_LOCATIONS_STATUS,
    data: UTILITY_LOCATIONS_LIST
  } = useUtilityLocations()
  React.useEffect(() => {
    if (data.document.id === 6) fetchUtilityLocations()
    // eslint-disable-next-line 
  }, [data.document.id])

  const {
    refetch: fetchPayrollCategories,
    status: PAYROLL_CATEGORIES_STATUS,
    data: PAYROLL_CATEGORIES_LIST
  } = usePayrollCategories()
  React.useEffect(() => {
    if (data.document.id === 7) fetchPayrollCategories()
    // eslint-disable-next-line 
  }, [data.document.id])

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
      const account_numbers = ACCOUNT_NUMBERS_LIST.filter(row => row.supplier.id === data.document.supplier.id && row.category.id === data.document.utility.category.id && row.location.id === data.document.utility.location.id)

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


  // Clear PRM Import
  React.useEffect(() => {
    if (data.document.id === 3 && prmGroup.length)
      setPrmGroup([])

    // eslint-disable-next-line
  }, [data.document.category])


  React.useEffect(() => {
    const unload = (e) => {
      e = e || window.event

      if (e) e.returnValue = 'Are you sure you want to proceed?'
      return 'Are you sure you want to proceed?'
    }

    window.addEventListener("beforeunload", unload)
    return () => window.removeEventListener("beforeunload", unload)
  }, [])


  const isDisabled = () => {
    switch (data.document.id) {
      case 1: // PAD - Post Acquisition Delivery
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
          && (
            Math.abs(data.document.amount - data.po_group.map((po) => po.balance).reduce((a, b) => a + b, 0)) >= 0.00 &&
            Math.abs(data.document.amount - data.po_group.map((po) => po.balance).reduce((a, b) => a + b, 0)) <= 1.00
          )
          && (!error.status || !Boolean(error.data.document_no))
          && (!error.status || !Boolean(error.data.po_no))
          && (!validate.status || !validate.data.includes('document_no'))
          && (!validate.status || !validate.data.includes('po_no'))
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
          && (!validate.status || !validate.data.includes('document_no'))
          ? false : true

      case 3: // PRM Multiple - Payment Request Memo Multiple
        return data.document.payment_type
          && data.document.no
          && data.document.amount
          && data.document.company
          && data.document.department
          && data.document.location
          && data.document.supplier
          && data.document.category
          && (
            data.document.category.name.match(/rental/i) || (data.document.category.name.match(/loans|leasing/i) && data.document.release_date && data.document.batch_no)
          )
          && prmGroup.length
          && (
            (data.document.category.name.match(/rental/i) && Math.abs(data.document.amount - prmGroup.map((prm) => prm.gross_amount).reduce((a, b) => a + b, 0)) >= 0.00 && Math.abs(data.document.amount - prmGroup.map((prm) => prm.gross_amount).reduce((a, b) => a + b, 0)) <= 1.00) ||
            (data.document.category.name.match(/loans|leasing/i) && Math.abs(data.document.amount - prmGroup.map((prm) => prm.principal).reduce((a, b) => a + b, 0)) >= 0.00 && Math.abs(data.document.amount - prmGroup.map((prm) => prm.principal).reduce((a, b) => a + b, 0)) <= 1.00)
          )
          && (!error.status || !Boolean(error.data.document_no))
          && (!validate.status || !validate.data.includes('document_no'))
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
              ? data.document.reference.amount <= data.po_group.map((po) => po.balance).reduce((a, b) => a + b, 0)
              : (
                Math.abs(data.document.reference.amount - data.po_group.map((po) => po.balance).reduce((a, b) => a + b, 0)) >= 0.00 &&
                Math.abs(data.document.reference.amount - data.po_group.map((po) => po.balance).reduce((a, b) => a + b, 0)) <= 1.00
              )
          )
          && (!error.status || !Boolean(error.data.reference_no))
          && (!error.status || !Boolean(error.data.po_no))
          && (!validate.status || !validate.data.includes('reference_no'))
          && (!validate.status || !validate.data.includes('po_no'))
          ? false : true

      case 5: // Contractor's Billing
        return data.document.payment_type
          && data.document.no
          && data.document.date
          && data.document.amount
          && data.document.company
          && data.document.department
          && data.document.location
          && data.document.supplier
          && data.document.category
          && data.document.capex_no
          && data.po_group.length
          && (
            Math.abs(data.document.amount - data.po_group.map((po) => po.balance).reduce((a, b) => a + b, 0)) >= 0.00 &&
            Math.abs(data.document.amount - data.po_group.map((po) => po.balance).reduce((a, b) => a + b, 0)) <= 1.00
          )
          && (!error.status || !Boolean(error.data.document_no))
          && (!error.status || !Boolean(error.data.po_no))
          && (!validate.status || !validate.data.includes('document_no'))
          && (!validate.status || !validate.data.includes('po_no'))
          ? false : true

      case 6: // Utilities
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

      case 7: // Payroll
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

      case 8: // PCF - Petty Cash Fund
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

    setValidate(currentValue => ({
      status: true,
      data: [
        ...currentValue.data, 'document_no'
      ]
    }))

    let document_prefix
    switch (data.document.id) {
      case 1:
        document_prefix = "pad#"
        break
      case 2:
        document_prefix = "prmc#"
        break
      case 3:
        document_prefix = "prmm#"
        break
      case 5:
        document_prefix = "cb#"
        break
      default:
        document_prefix = null
    }

    try {
      await axios.post(`/api/transactions/validate-document-no`, {
        document_no: `${document_prefix}${data.document.no}`
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

    setValidate(currentValue => ({
      ...currentValue,
      data: currentValue.data.filter((data) => data !== 'document_no')
    }))
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

    setValidate(currentValue => ({
      status: true,
      data: [
        ...currentValue.data, 'reference_no'
      ]
    }))

    try {
      await axios.post(`/api/transactions/validate-reference-no`, {
        company_id: data.document.company.id,
        reference_no: `ref#${data.document.reference.no}`
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

    setValidate(currentValue => ({
      ...currentValue,
      data: currentValue.data.filter((data) => data !== 'reference_no')
    }))
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
    const check = data.po_group.some((data) => data.no === `PO#${PO.no}`)
    if (check && !PO.update) return

    if (PO.update) data.po_group.splice(PO.index, 1, {
      no: `PO#${PO.no}`,
      balance: PO.balance,
      amount: PO.amount,
      rr_no: PO.rr_no,
      batch: PO.batch
    })
    else setData(currentValue => ({
      ...currentValue,
      po_group: [
        {
          no: `PO#${PO.no}`,
          balance: PO.balance,
          amount: PO.amount,
          rr_no: PO.rr_no,
          batch: PO.batch
        },
        ...currentValue.po_group
      ]
    }))

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

    setValidate(currentValue => ({
      status: true,
      data: [
        ...currentValue.data, 'po_no'
      ]
    }))

    let response
    try {
      response = await axios.post(`/api/transactions/validate-po-no`, {
        payment_type: data.document.payment_type,
        company_id: data.document.company.id,
        po_no: `PO#${PO.no}`
      })

      const check = data.po_group.some((data) => data.no === `PO#${PO.no}`)
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

        const PODetails = po_group.map((data) => ({ ...data, batch: true })).find((data) => data.no === `PO#${PO.no}`)
        const POIndex = [
          ...data.po_group,
          ...po_group.reverse()
        ].findIndex((data) => data.no === `PO#${PO.no}`)

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

    setValidate(currentValue => ({
      ...currentValue,
      data: currentValue.data.filter((data) => data !== 'po_no')
    }))
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

      no: no.replace(/PO#/g, ""),
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

  const importPaymentRequestMemoHandler = (e) => {

    const file = e.target.files[0]
    const types = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]

    if (!!file) {
      if (!types.includes(file.type))
        return toast({
          open: true,
          severity: "error",
          title: "Error!",
          message: "Please select only excel file types and try again."
        })

      const reader = new FileReader()

      reader.readAsArrayBuffer(file)
      reader.onload = async (response) => {
        const excelFile = response.target.result

        const workbook = XLSX.read(excelFile, { type: 'buffer' })

        const sheetname = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetname]

        const excelJson = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: "" })

        if (!excelJson.length)
          return toast({
            open: true,
            severity: "error",
            title: "Error!",
            message: "Excel file is empty, please check your excel file and try again."
          })

        // Transaform headers
        excelJson.forEach((row) => {
          Object.keys(row).forEach((key) => {
            let newKey = key.trim().toLowerCase().replace(/[ ]/g, "_")
            if (key !== newKey) {
              row[newKey] = row[key]
              delete row[key]
            }
          })
        })

        if (data.document.category.name.toLowerCase() === `rental`) {
          const errors = []
          const header = ["period_covered", "gross_amount", "wht", "net_of_amount", "cheque_date"]

          // Check headers
          if (!Object.keys(excelJson[0]).every((item) => header.includes(item)))
            return toast({
              open: true,
              severity: "error",
              title: "Error!",
              message: "Invalid excel template for rental category, please check your excel file and try again."
            })

          // Check for empty cell
          excelJson.forEach((item, itemIndex) => {
            Object.entries(item).forEach((entry) => {
              const [key, value] = entry

              if (value === "")
                errors.push({
                  line: itemIndex + 2,
                  error_type: "empty",
                  description: `${key.replace(/[_]/g, " ")} is empty.`
                })
            })
          })

          // Check if cheque date is valid
          excelJson.forEach((item, itemIndex) => {
            const timestamp = new Date(item.cheque_date)

            if (!(timestamp instanceof Date && !isNaN(timestamp)))
              errors.push({
                line: itemIndex + 2,
                error_type: "invalid",
                description: `Cheque date is invalid.`
              })
          })

          // Check if gross, wht and net of amount is valid
          excelJson.map((item) => {
            const { gross_amount, wht, net_of_amount } = item

            return {
              gross_amount,
              wht,
              net_of_amount
            }
          }).forEach((item, itemIndex) => {
            Object.entries(item).forEach((entry) => {
              const [key, value] = entry

              if (isNaN(Number(value.replace(/[,]/gi, ''))))
                errors.push({
                  line: itemIndex + 2,
                  error_type: "invalid",
                  description: `${key.replace(/[_]/g, " ")} is invalid.`
                })
            })
          })

          if (errors.length)
            return setErrorImport(currentValue => ({
              ...currentValue,
              open: true,
              data: {
                message: "Import failed. Kindly check the errors.",
                result: errors
              }
            }))

          // Transforming data
          const excelTransformed = excelJson.map((item) => ({
            ...item,
            wht: parseFloat(item.wht.replace(/[,]/gi, '')),
            gross_amount: parseFloat(item.gross_amount.replace(/[,]/gi, '')),
            net_of_amount: parseFloat(item.net_of_amount.replace(/[,]/gi, ''))
          }))

          setPrmGroup(excelTransformed)
        }

        if (data.document.category.name.toLowerCase() === `loans`) {
          const errors = []
          const header = ["principal", "interest", "cwt", "net_of_amount", "cheque_date"]

          // Check headers
          if (!Object.keys(excelJson[0]).every((item) => header.includes(item)))
            return toast({
              open: true,
              severity: "error",
              title: "Error!",
              message: "Invalid excel template for loans category, please check your excel file and try again."
            })

          // Check for empty cell
          excelJson.forEach((item, itemIndex) => {
            Object.entries(item).forEach((entry) => {
              const [key, value] = entry

              if (value === "")
                errors.push({
                  line: itemIndex + 2,
                  error_type: "empty",
                  description: `${key} is empty.`
                })
            })
          })

          // Check if cheque date is valid
          excelJson.forEach((item, itemIndex) => {
            const timestamp = new Date(item.cheque_date)

            if (!(timestamp instanceof Date && !isNaN(timestamp)))
              errors.push({
                line: itemIndex + 2,
                error_type: "invalid",
                description: `Cheque date is invalid.`
              })
          })

          // Check if principal, interest, cwt and net of amount is valid
          excelJson.map((item) => {
            const { principal, interest, cwt, net_of_amount } = item

            return {
              principal,
              interest,
              cwt,
              net_of_amount
            }
          }).forEach((item, itemIndex) => {
            Object.entries(item).forEach((entry) => {
              const [key, value] = entry

              if (isNaN(Number(value.replace(/[,]/gi, ''))))
                errors.push({
                  line: itemIndex + 2,
                  error_type: "invalid",
                  description: `${key.replace(/[_]/g, " ")} is invalid.`
                })
            })
          })

          if (errors.length)
            return setErrorImport(currentValue => ({
              ...currentValue,
              open: true,
              data: {
                message: "Import failed. Kindly check the errors.",
                result: errors
              }
            }))

          // Transforming data
          const excelTransformed = excelJson.map((item) => ({
            ...item,
            cwt: parseFloat(item.cwt.replace(/[,]/gi, '')),
            principal: parseFloat(item.principal.replace(/[,]/gi, '')),
            interest: parseFloat(item.interest.replace(/[,]/gi, '')),
            net_of_amount: parseFloat(item.net_of_amount.replace(/[,]/gi, ''))
          }))

          setPrmGroup(excelTransformed)
        }

        if (data.document.category.name.toLowerCase() === `leasing`) {
          const errors = []
          const header = ["amortization", "interest", "cwt", "principal", "net_of_amount", "cheque_date"]

          // Check headers
          if (!Object.keys(excelJson[0]).every((item) => header.includes(item)))
            return toast({
              open: true,
              severity: "error",
              title: "Error!",
              message: "Invalid excel template for leasing category, please check your excel file and try again."
            })

          // Check for empty cell
          excelJson.forEach((item, itemIndex) => {
            Object.entries(item).forEach((entry) => {
              const [key, value] = entry

              if (value === "")
                errors.push({
                  line: itemIndex + 2,
                  error_type: "empty",
                  description: `${key.replace(/[_]/g, " ")} is empty.`
                })
            })
          })

          // Check if cheque date is valid
          excelJson.forEach((item, itemIndex) => {
            const timestamp = new Date(item.cheque_date)

            if (!(timestamp instanceof Date && !isNaN(timestamp)))
              errors.push({
                line: itemIndex + 2,
                error_type: "invalid",
                description: `Cheque date is invalid.`
              })
          })

          // Check if gross, wht and net of amount is valid
          excelJson.map((item) => {
            const { amortization, interest, cwt, principal, net_of_amount } = item

            return {
              amortization,
              interest,
              cwt,
              principal,
              net_of_amount
            }
          }).forEach((item, itemIndex) => {
            Object.entries(item).forEach((entry) => {
              const [key, value] = entry

              if (isNaN(Number(value.replace(/[,]/gi, ''))))
                errors.push({
                  line: itemIndex + 2,
                  error_type: "invalid",
                  description: `${key.replace(/[_]/g, " ")} is invalid.`
                })
            })
          })

          if (errors.length)
            return setErrorImport(currentValue => ({
              ...currentValue,
              open: true,
              data: {
                message: "Import failed. Kindly check the errors.",
                result: errors
              }
            }))

          // Transforming data
          const excelTransformed = excelJson.map((item) => {
            const parseAmount = (amount) => {
              const sanitizeAmount = amount.replace(/[a-z,]/gi, '')

              if (sanitizeAmount) return parseFloat(sanitizeAmount)
              else return 0.00
            }

            return {
              ...item,
              amortization: parseAmount(item.amortization),
              interest: parseAmount(item.interest),
              cwt: parseAmount(item.cwt),
              principal: parseAmount(item.principal),
              net_of_amount: parseAmount(item.net_of_amount)
            }
          })

          setPrmGroup(excelTransformed)
        }

      }
    }

    // reset the import button
    e.target.value = null
  }

  const transformData = (ID) => {
    switch (ID) {
      case 1: // PAD - Post Acquisition Delivery
        return {
          requestor: data.requestor,
          document: {
            id: data.document.id,
            no: `pad#${data.document.no}`,
            name: data.document.name,
            payment_type: data.document.payment_type,
            amount: data.document.amount,
            date: new Date(data.document.date).toISOString().slice(0, 10),

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
            no: `prmc#${data.document.no}`,
            name: data.document.name,
            payment_type: data.document.payment_type,
            amount: data.document.amount,
            date: new Date(data.document.date).toISOString().slice(0, 10),

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
          requestor: data.requestor,
          document: {
            id: data.document.id,
            no: `prmm#${data.document.no}`,
            name: data.document.name,
            payment_type: data.document.payment_type,
            amount: data.document.amount,
            date: new Date(data.document.date).toISOString().slice(0, 10),

            batch_no: data.document.batch_no,
            release_date: new Date(data.document.release_date).toISOString().slice(0, 10),

            company: data.document.company,
            department: data.document.department,
            location: data.document.location,
            supplier: data.document.supplier,
            category: data.document.category,

            remarks: data.document.remarks
          },
          prm_group: prmGroup
        }

      case 4: // Receipt
        return {
          requestor: data.requestor,
          document: {
            id: data.document.id,
            name: data.document.name,
            payment_type: data.document.payment_type,
            date: new Date(data.document.date).toISOString().slice(0, 10),

            company: data.document.company,
            department: data.document.department,
            location: data.document.location,
            supplier: data.document.supplier,

            reference: {
              ...data.document.reference,
              no: `ref#${data.document.reference.no}`
            },

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
            no: `cb#${data.document.no}`,
            capex_no: data.document.capex_no,
            name: data.document.name,
            payment_type: data.document.payment_type,
            amount: data.document.amount,
            date: new Date(data.document.date).toISOString().slice(0, 10),

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
            from: new Date(data.document.from).toISOString().slice(0, 10),
            to: new Date(data.document.to).toISOString().slice(0, 10),

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
            from: new Date(data.document.from).toISOString().slice(0, 10),
            to: new Date(data.document.to).toISOString().slice(0, 10),
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
            date: new Date(data.document.date).toISOString().slice(0, 10),

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
    setPrmGroup([])

    setPoGroup([])

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
        capex_no: "",
        from: null,
        to: null,
        date: null,
        amount: null,

        needed_date: null,
        release_date: null,
        batch_no: "",

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

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    limit: 100
  })

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperForm-root" elevation={1}>
        <Typography variant="heading" sx={{ display: 'block', marginBottom: 3 }}>Request for Tagging</Typography>

        <form onSubmit={submitTransactionHandler}>
          <Autocomplete
            className="FstoSelectForm-root"
            size="small"
            options={DOCUMENT_TYPES.data}
            value={DOCUMENT_TYPES.data.find(row => row.id === data.document.id) || null}
            loading={DOCUMENT_TYPES.fetching}
            disabled={DOCUMENT_TYPES.disabled}
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
                payment_type: value.id === 4 ? null : "Full"
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
                { // Request Types
                  (data.document.id === `confi`) &&
                  (
                    <Autocomplete
                      className="FstoSelectForm-root"
                      size="small"
                      options={REQUEST_TYPES}
                      value={REQUEST_TYPES.find(row => row.label === data.document.request_type) || null}
                      renderInput={
                        props =>
                          <TextField
                            {...props}
                            variant="outlined"
                            label="Request Type"
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
                        (option, value) => option.label === value.label
                      }
                      onChange={(e, value) => setData({
                        ...data,
                        document: {
                          ...data.document,
                          request_type: value.label
                        }
                      })}
                      fullWidth
                      disablePortal
                      disableClearable
                    />
                  )}

                <Autocomplete // Payment Types
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
                              date: new Date(value.date_created).toISOString().slice(0, 10),
                              payment_type: "Full",
                              amount: value.amount,
                              pcf_batch: {
                                name: value.name,
                                letter: value.letter,
                                date: value.date
                              },
                              supplier: SUPPLIER_LIST.find(row => row.name.replace(/\s|-/g, '').toLowerCase() === value.branch.replace(/\s|-/g, '').toLowerCase()) || null
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
                        disabled
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
                          disabled
                        />
                      </LocalizationProvider>
                    </React.Fragment>
                  )}

                { // From Date, To Date
                  (data.document.id === 7 || data.document.id === 6) &&
                  (
                    <LocalizationProvider dateAdapter={DateAdapter}>
                      <DatePicker
                        value={data.document.from}
                        maxDate={data.document.to ? new Date(data.document.to) : null}
                        onChange={(value) => setData({
                          ...data,
                          document: {
                            ...data.document,
                            from: value
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
                              onKeyPress={(e) => e.preventDefault()}
                              fullWidth
                            />
                        }
                        showToolbar
                      />

                      <DatePicker
                        value={data.document.to}
                        minDate={new Date(data.document.from)}
                        onChange={(value) => setData({
                          ...data,
                          document: {
                            ...data.document,
                            to: value
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
                              onKeyPress={(e) => e.preventDefault()}
                              fullWidth
                            />
                        }
                        showToolbar
                      />
                    </LocalizationProvider>
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
                      type="number"
                      value={data.document.no}
                      error={
                        error.status
                        && Boolean(error.data.document_no)
                      }
                      helperText={
                        (error.status
                          && error.data.document_no
                          && error.data.document_no[0])
                        ||
                        (validate.status
                          && validate.data.includes('document_no')
                          && "Please wait...")
                      }
                      onKeyDown={(e) => ["E", "e", ".", "+", "-"].includes(e.key) && e.preventDefault()}
                      onChange={(e) => setData({
                        ...data,
                        document: {
                          ...data.document,
                          no: e.target.value
                        }
                      })}
                      onBlur={checkDocumentNumberHandler}
                      InputProps={{
                        startAdornment: data.document.no &&
                          <InputAdornment className="FstoAdrmentForm-root" position="start">
                            {data.document.id === 1 && "pad#"}
                            {data.document.id === 2 && "prmc#"}
                            {data.document.id === 3 && "prmm#"}
                            {data.document.id === 5 && "cb#"}
                          </InputAdornment>
                      }}
                      InputLabelProps={{
                        className: "FstoLabelForm-root"
                      }}
                      fullWidth
                    />
                  )}

                { // Request Date
                  (data.document.id === 1 || data.document.id === 2 || data.document.id === 3 || data.document.id === 4 || data.document.id === 5 || data.document.id === 8) &&
                  (
                    <LocalizationProvider dateAdapter={DateAdapter}>
                      <DatePicker
                        value={new Date()}
                        onChange={(value) => { }}
                        renderInput={
                          props =>
                            <TextField
                              {...props}
                              className="FstoTextfieldForm-root"
                              variant="outlined"
                              size="small"
                              label="Request Date"
                              autoComplete="off"
                              fullWidth
                            />
                        }
                        readOnly
                      />
                    </LocalizationProvider>
                  )}

                { // Document Date
                  (data.document.id === 1 || data.document.id === 2 || data.document.id === 4 || data.document.id === 5 || data.document.id === 8) &&
                  (
                    <LocalizationProvider dateAdapter={DateAdapter}>
                      <DatePicker
                        value={data.document.date}
                        disabled={data.document.id === 8}
                        maxDate={new Date()}
                        onChange={(value) => setData({
                          ...data,
                          document: {
                            ...data.document,
                            date: value
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
                              onKeyPress={(e) => e.preventDefault()}
                              fullWidth
                            />
                        }
                        showToolbar
                        showTodayButton
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
                        (
                          Boolean(data.po_group.length) &&
                          Boolean(data.document.amount)
                          && !(
                            Math.abs(data.document.amount - data.po_group.map((po) => po.balance).reduce((a, b) => a + b, 0)) >= 0.00 &&
                            Math.abs(data.document.amount - data.po_group.map((po) => po.balance).reduce((a, b) => a + b, 0)) <= 1.00
                          )) ||
                        (
                          Boolean(prmGroup.length) &&
                          Boolean(data.document.category) &&
                          Boolean(data.document.category.name.match(/rental/i)) &&
                          Boolean(data.document.amount)
                          && !(
                            Math.abs(data.document.amount - prmGroup.map((prm) => prm.gross_amount).reduce((a, b) => a + b, 0)) >= 0.00 &&
                            Math.abs(data.document.amount - prmGroup.map((prm) => prm.gross_amount).reduce((a, b) => a + b, 0)) <= 1.00
                          )) ||
                        (
                          Boolean(prmGroup.length) &&
                          Boolean(data.document.category) &&
                          Boolean(data.document.category.name.match(/loans|leasing/i)) &&
                          Boolean(data.document.amount)
                          && !(
                            Math.abs(data.document.amount - prmGroup.map((prm) => prm.principal).reduce((a, b) => a + b, 0)) >= 0.00 &&
                            Math.abs(data.document.amount - prmGroup.map((prm) => prm.principal).reduce((a, b) => a + b, 0)) <= 1.00
                          ))
                      }
                      helperText={
                        (
                          Boolean(data.po_group.length) &&
                          Boolean(data.document.amount)
                          && !(
                            Math.abs(data.document.amount - data.po_group.map((po) => po.balance).reduce((a, b) => a + b, 0)) >= 0.00 &&
                            Math.abs(data.document.amount - data.po_group.map((po) => po.balance).reduce((a, b) => a + b, 0)) <= 1.00
                          )
                          && "Document amount and PO balance amount is not equal.") ||
                        (
                          Boolean(prmGroup.length) &&
                          Boolean(data.document.category) &&
                          Boolean(data.document.category.name.match(/rental/i)) &&
                          Boolean(data.document.amount)
                          && !(
                            Math.abs(data.document.amount - prmGroup.map((prm) => prm.gross_amount).reduce((a, b) => a + b, 0)) >= 0.00 &&
                            Math.abs(data.document.amount - prmGroup.map((prm) => prm.gross_amount).reduce((a, b) => a + b, 0)) <= 1.00
                          )
                          && "Document amount and gross amount is not equal.") ||
                        (
                          Boolean(prmGroup.length) &&
                          Boolean(data.document.category) &&
                          Boolean(data.document.category.name.match(/loans|leasing/i)) &&
                          Boolean(data.document.amount)
                          && !(
                            Math.abs(data.document.amount - prmGroup.map((prm) => prm.principal).reduce((a, b) => a + b, 0)) >= 0.00 &&
                            Math.abs(data.document.amount - prmGroup.map((prm) => prm.principal).reduce((a, b) => a + b, 0)) <= 1.00
                          )
                          && "Document amount and principal amount is not equal.")
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

                <Autocomplete // Company Charging
                  className="FstoSelectForm-root"
                  size="small"
                  options={COMPANY_LIST || []}
                  value={data.document.company}
                  loading={
                    COMPANY_STATUS === 'loading'
                  }
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

                <Autocomplete // Department Charging
                  className="FstoSelectForm-root"
                  size="small"
                  filterOptions={filterOptions}
                  options={DEPARTMENT_LIST || []}
                  value={data.document.department}
                  loading={
                    DEPARTMENT_STATUS === 'loading'
                  }
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
                      department: value,
                      location: null
                    }
                  })}
                  fullWidth
                  disablePortal
                  disableClearable
                />

                <Autocomplete // Location Charging
                  className="FstoSelectForm-root"
                  size="small"
                  filterOptions={filterOptions}
                  options={LOCATION_LIST || []}
                  value={data.document.location}
                  loading={
                    LOCATION_STATUS === 'loading'
                  }
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

                <Autocomplete // Supplier
                  className="FstoSelectForm-root"
                  size="small"
                  filterOptions={filterOptions}
                  options={
                    Boolean(SUPPLIER_LIST.length)
                      ? data.document.id === 8
                        ? SUPPLIER_LIST.filter(row => row.name.match(/PCF.*/) ? row : null)
                        : SUPPLIER_LIST
                      : []
                  }
                  value={data.document.supplier}
                  loading={
                    SUPPLIER_STATUS === 'loading'
                  }
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
                      supplier: value,
                      ...(
                        value.references.length === 1 ?
                          {
                            reference: {
                              ...data.document.reference,
                              id: value.references[0].id,
                              type: value.references[0].type
                            }
                          } : {
                            reference: {
                              ...data.document.reference,
                              id: null,
                              type: ""
                            }
                          }
                      )
                    }
                  })}
                  disabled={
                    data.document.id === 8 && Boolean(data.document.supplier)
                  }
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
                        options={data.document.supplier?.references || []}
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
                        type="number"
                        value={data.document.reference.no}
                        error={
                          error.status
                          && Boolean(error.data.reference_no)
                        }
                        helperText={
                          (error.status
                            && error.data.reference_no
                            && error.data.reference_no[0])
                          ||
                          (validate.status
                            && validate.data.includes('reference_no')
                            && "Please wait...")
                        }
                        onKeyDown={(e) => ["E", "e", ".", "+", "-"].includes(e.key) && e.preventDefault()}
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
                        InputProps={{
                          startAdornment: data.document.reference.no &&
                            <InputAdornment className="FstoAdrmentForm-root" position="start">ref#</InputAdornment>
                        }}
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
                              ? data.document.reference.amount > data.po_group.map((po) => po.balance).reduce((a, b) => a + b, 0)
                              : !(
                                Math.abs(data.document.reference.amount - data.po_group.map((po) => po.balance).reduce((a, b) => a + b, 0)) >= 0.00 &&
                                Math.abs(data.document.reference.amount - data.po_group.map((po) => po.balance).reduce((a, b) => a + b, 0)) <= 1.00
                              )
                          )
                        }
                        helperText={
                          Boolean(data.po_group.length) &&
                          Boolean(data.document.reference.amount)
                          && (
                            data.document.payment_type === "Partial"
                              ? data.document.reference.amount > data.po_group.map((po) => po.balance).reduce((a, b) => a + b, 0)
                              : !(
                                Math.abs(data.document.reference.amount - data.po_group.map((po) => po.balance).reduce((a, b) => a + b, 0)) >= 0.00 &&
                                Math.abs(data.document.reference.amount - data.po_group.map((po) => po.balance).reduce((a, b) => a + b, 0)) <= 1.00
                              )
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
                  )}

                { // Category
                  (data.document.id === 1 || data.document.id === 2 || data.document.id === 3 || data.document.id === 4 || data.document.id === 5) &&
                  (
                    <Autocomplete
                      className="FstoSelectForm-root"
                      size="small"
                      filterOptions={filterOptions}
                      options={DOCUMENT_TYPES.data.find(type => type.id === data.document.id).categories}
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

                { // Release Date, Batch Number
                  (data.document.id === 3 && data.document.category && data.document.category.name.toLowerCase().match(/loans|leasing/i)) &&
                  (
                    <React.Fragment>
                      <LocalizationProvider dateAdapter={DateAdapter}>
                        <DatePicker
                          value={data.document.release_date}
                          onChange={(value) => setData({
                            ...data,
                            document: {
                              ...data.document,
                              release_date: value
                            }
                          })}
                          renderInput={
                            props =>
                              <TextField
                                {...props}
                                className="FstoTextfieldForm-root"
                                variant="outlined"
                                size="small"
                                label="Release Date"
                                autoComplete="off"
                                onKeyPress={(e) => e.preventDefault()}
                                fullWidth
                              />
                          }
                          showToolbar
                          showTodayButton
                        />
                      </LocalizationProvider>

                      <TextField
                        className="FstoTextfieldForm-root"
                        label="Batch Number"
                        variant="outlined"
                        autoComplete="off"
                        size="small"
                        type="number"
                        value={data.document.batch_no}
                        onKeyDown={(e) => ["E", "e", ".", "+", "-"].includes(e.key) && e.preventDefault()}
                        onChange={(e) => setData({
                          ...data,
                          document: {
                            ...data.document,
                            batch_no: parseFloat(e.target.value)
                          }
                        })}
                        InputProps={{
                          startAdornment: data.document.batch_no &&
                            <InputAdornment className="FstoAdrmentForm-root" position="start">batch#</InputAdornment>
                        }}
                        InputLabelProps={{
                          className: "FstoLabelForm-root"
                        }}
                        fullWidth
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
                        options={UTILITY_CATEGORIES_LIST || []}
                        value={data.document.utility.category}
                        loading={
                          UTILITY_CATEGORIES_STATUS === 'loading'
                        }
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
                        options={UTILITY_LOCATIONS_LIST || []}
                        value={data.document.utility.location}
                        loading={
                          UTILITY_LOCATIONS_STATUS === 'loading'
                        }
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
                          Boolean(ACCOUNT_NUMBERS_LIST?.length)
                            ? data.document.supplier && data.document.utility.category && data.document.utility.location
                              ? ACCOUNT_NUMBERS_LIST.filter(row => row.supplier.id === data.document.supplier.id && row.category.id === data.document.utility.category.id && row.location.id === data.document.utility.location.id)
                              : data.document.supplier || data.document.utility.category || data.document.utility.location
                                ? ACCOUNT_NUMBERS_LIST.filter(row => row.supplier.id === data.document.supplier?.id || row.category.id === data.document.utility.category?.id || row.location.id === data.document.utility.location?.id)
                                : ACCOUNT_NUMBERS_LIST
                            : []
                        }
                        value={data.document.utility.account_no}
                        loading={
                          ACCOUNT_NUMBERS_STATUS === 'loading'
                        }
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
                        options={PAYROLL_CLIENTS_LIST || []}
                        value={data.document.payroll.clients}
                        loading={
                          PAYROLL_CLIENTS_STATUS === 'loading'
                        }
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
                        options={PAYROLL_CATEGORIES_LIST || []}
                        value={data.document.payroll.category}
                        loading={
                          PAYROLL_CATEGORIES_STATUS === 'loading'
                        }
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

                { // CAPEX Number
                  (data.document.id === 5) &&
                  (
                    <TextField
                      className="FstoTextfieldForm-root"
                      label="CAPEX"
                      variant="outlined"
                      autoComplete="off"
                      size="small"
                      value={data.document.capex_no}
                      onChange={(e) => setData({
                        ...data,
                        document: {
                          ...data.document,
                          capex_no: e.target.value
                        }
                      })}
                      InputLabelProps={{
                        className: "FstoLabelForm-root"
                      }}
                      fullWidth
                    />
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
          > Save
          </LoadingButton>

          {
            data.document.id
              ?
              <Button
                className="FstoButtonForm-root"
                variant="outlined"
                color="error"
                onClick={truncateData}
                disableElevation
              > Clear
              </Button>
              :
              <Button
                className="FstoButtonForm-root"
                variant="outlined"
                color="error"
                onClick={() => navigate(-1)}
                disableElevation
              > Back
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
                type="number"
                value={PO.no}
                error={
                  error.status
                  && Boolean(error.data.po_no)
                }
                helperText={
                  (error.status
                    && error.data.po_no
                    && error.data.po_no[0])
                  ||
                  (validate.status
                    && validate.data.includes('po_no')
                    && "Please wait...")
                }
                onKeyPress={(e) => {
                  ["E", "e", ".", "+", "-"].includes(e.key) && e.preventDefault()

                  if (e.key === "Enter")
                    checkPurchaseOrderHandler(e)
                }}
                onChange={(e) => setPO({
                  ...PO,
                  no: e.target.value
                })}
                onBlur={checkPurchaseOrderHandler}
                InputProps={{
                  startAdornment: PO.no &&
                    <InputAdornment className="FstoAdrmentForm-root" position="start">PO#</InputAdornment>
                }}
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
                limitTags={3}
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
                  (validate.status && validate.data.includes('po_no')) ||
                  !Boolean(PO.no) ||
                  !Boolean(PO.amount) ||
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
                          <Box className="FstoPurchaseOrder-root" key={index}>
                            <Stack className="FstoPurchaseOrderStack-root" direction="row">
                              <Typography variant="subtitle2">P.O. Number</Typography>
                              <Typography className="FstoPurchaseOrderTypography-root" variant="h6">{data.no}</Typography>
                            </Stack>

                            <Stack className="FstoPurchaseOrderStack-root" direction="row">
                              <Typography variant="subtitle2">P.O. Amount</Typography>
                              <Typography className="FstoPurchaseOrderTypography-root" variant="h6">&#8369;{data.amount.toLocaleString()}</Typography>
                            </Stack>

                            <Stack className="FstoPurchaseOrderStack-root" direction="row">
                              <Typography variant="subtitle2">P.O. Balance</Typography>
                              <Typography className="FstoPurchaseOrderTypography-root" variant="h6">&#8369;{data.balance.toLocaleString()}</Typography>
                            </Stack>

                            <Stack className="FstoPurchaseOrderStack-root" direction="row">
                              <Typography variant="subtitle2">R.R. Number</Typography>
                              <Typography className="FstoPurchaseOrderTypography-root" variant="h6">{data.rr_no.join(", ")}</Typography>
                            </Stack>

                            <Stack direction="row" spacing={1}>
                              <IconButton onClick={() => updatePurchaseOrderHandler(index, data)}>
                                <Edit />
                              </IconButton>
                              <IconButton onClick={() => removePurchaseOrderHandler(data)} disabled={PO.update}>
                                <Delete />
                              </IconButton>
                            </Stack>
                          </Box>
                      )
                    }
                  </Box>

                  <Divider variant="middle" sx={{ marginTop: 4, marginBottom: 4 }} />

                  <Box className="FstoPurchaseOrderBox-variance">
                    <Typography sx={{ fontSize: '1em' }}>Total P.O. Balance</Typography>
                    <Typography variant="heading">&#8369;{data.po_group.map((data) => data.balance).reduce((a, b) => a + b).toLocaleString()}</Typography>
                  </Box>

                  {
                    data.document.amount && (data.document.id === 1 || data.document.id === 5)
                    &&
                    <Box className="FstoPurchaseOrderBox-variance">
                      <Typography sx={{ fontSize: '1em' }}>Document Amount</Typography>
                      <Typography variant="heading">&#8369;{data.document.amount.toLocaleString()}</Typography>
                    </Box>
                  }

                  {
                    data.document.reference.amount && data.document.id === 4
                    &&
                    <Box className="FstoPurchaseOrderBox-variance">
                      <Typography sx={{ fontSize: '1em' }}>Reference Amount</Typography>
                      <Typography variant="heading">&#8369;{data.document.reference.amount.toLocaleString()}</Typography>
                    </Box>
                  }

                  <Divider sx={{ marginTop: 2, marginBottom: 2 }} />

                  {
                    data.document.amount && (data.document.id === 1 || data.document.id === 5)
                    &&
                    <Box className="FstoPurchaseOrderBox-variance">
                      <Typography variant="heading">Variance</Typography>
                      <Typography variant="heading">
                        &#8369;{(data.po_group.map((data) => data.balance).reduce((a, b) => a + b) - data.document.amount).toLocaleString()}
                      </Typography>
                    </Box>
                  }

                  {
                    data.document.reference.amount && data.document.id === 4
                    &&
                    <Box className="FstoPurchaseOrderBox-variance">
                      <Typography variant="heading">Variance</Typography>
                      <Typography variant="heading">
                        &#8369;{(data.po_group.map((data) => data.balance).reduce((a, b) => a + b) - data.document.reference.amount).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                </React.Fragment>
              )
            }
          </Paper>
        )
      }


      {
        (data.document.id === 3) &&
        (
          <Paper className="FstoPaperImport-root" elevation={1}>
            <Stack direction="row" spacing={2}>
              <Typography variant="heading">Attachment</Typography>

              <Button
                className="FstoButtonImport-root"
                component="label"
                variant="contained"
                startIcon={<UploadFile />}
                disabled={
                  !Boolean(data.document.category)
                }
                disableElevation
              > Import
                <input type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={importPaymentRequestMemoHandler} hidden />
              </Button>
            </Stack>

            { // Table for Rental Import
              Boolean(prmGroup.length) && Boolean(data.document.category) && Boolean(data.document.category.name.match(/rental/i)) &&
              (
                <React.Fragment>
                  <TableContainer className="FstoTableContainerImport-root">
                    <Table className="FstoTableImport-root">
                      <TableHead className="FstoTableHeadImport-root">
                        <TableRow className="FstoTableRowImport-root">
                          <TableCell className="FstoTableCellImport-root">Period Covered</TableCell>
                          <TableCell className="FstoTableCellImport-root">Cheque Date</TableCell>
                          <TableCell className="FstoTableCellImport-root" align="right" sx={{ borderRight: '1px solid #e0e0e0' }}>Gross Amount</TableCell>
                          <TableCell className="FstoTableCellImport-root" align="right" sx={{ borderRight: '1px solid #e0e0e0' }}>Withholding Tax</TableCell>
                          <TableCell className="FstoTableCellImport-root" align="right">Net of Amount</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody className="FstoTableBodyImport-root" sx={{ borderBottom: '3px solid #e0e0e0' }}>
                        {
                          prmGroup.map((data, index) => (
                            <TableRow className="FstoTableRowImport-root" key={index}>
                              <TableCell className="FstoTableCellImport-root">
                                {data.period_covered}
                              </TableCell>

                              <TableCell className="FstoTableCellImport-root">
                                {data.cheque_date}
                              </TableCell>

                              <TableCell className="FstoTableCellImport-root" align="right" sx={{ borderRight: '1px solid #e0e0e0' }}>
                                {
                                  data.gross_amount?.toLocaleString('default', {
                                    currency: 'PHP',
                                    style: 'currency'
                                  })}
                              </TableCell>

                              <TableCell className="FstoTableCellImport-root" align="right" sx={{ borderRight: '1px solid #e0e0e0' }}>
                                {
                                  data.wht?.toLocaleString('default', {
                                    currency: 'PHP',
                                    style: 'currency'
                                  })}
                              </TableCell>

                              <TableCell className="FstoTableCellImport-root" align="right">
                                {
                                  data.net_of_amount?.toLocaleString('default', {
                                    currency: 'PHP',
                                    style: 'currency'
                                  })}
                              </TableCell>
                            </TableRow>
                          ))
                        }
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box className="FstoBoxImport-variance">
                    <Typography sx={{ fontSize: '1em' }}>Total Gross Amount</Typography>
                    <Typography variant="heading">
                      {
                        prmGroup.map((data) => data.gross_amount).reduce((a, b) => a + b).toLocaleString('default', {
                          currency: 'PHP',
                          style: 'currency'
                        })}
                    </Typography>
                  </Box>

                  <Box className="FstoBoxImport-variance">
                    <Typography sx={{ fontSize: '1em' }}>Total CWT</Typography>
                    <Typography variant="heading">
                      {
                        prmGroup.map((data) => data.wht).reduce((a, b) => a + b).toLocaleString('default', {
                          currency: 'PHP',
                          style: 'currency'
                        })}
                    </Typography>
                  </Box>

                  <Box className="FstoBoxImport-variance">
                    <Typography sx={{ fontSize: '1em' }}>Total Net Amount</Typography>
                    <Typography variant="heading">
                      {
                        prmGroup.map((data) => data.net_of_amount).reduce((a, b) => a + b).toLocaleString('default', {
                          currency: 'PHP',
                          style: 'currency'
                        })}
                    </Typography>
                  </Box>
                </React.Fragment>
              )}

            { // Table for Loans Import
              Boolean(prmGroup.length) && Boolean(data.document.category) && Boolean(data.document.category.name.match(/loans/i)) &&
              (
                <React.Fragment>
                  <TableContainer className="FstoTableContainerImport-root">
                    <Table className="FstoTableImport-root">
                      <TableHead className="FstoTableHeadImport-root">
                        <TableRow className="FstoTableRowImport-root">
                          <TableCell className="FstoTableCellImport-root">Cheque Date</TableCell>
                          <TableCell className="FstoTableCellImport-root" align="right" sx={{ borderRight: '1px solid #e0e0e0' }}>Principal</TableCell>
                          <TableCell className="FstoTableCellImport-root" align="right" sx={{ borderRight: '1px solid #e0e0e0' }}>interest</TableCell>
                          <TableCell className="FstoTableCellImport-root" align="right" sx={{ borderRight: '1px solid #e0e0e0' }}>Withholding Tax</TableCell>
                          <TableCell className="FstoTableCellImport-root" align="right">Net of Amount</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody className="FstoTableBodyImport-root" sx={{ borderBottom: '3px solid #e0e0e0' }}>
                        {
                          prmGroup.map((data, index) => (
                            <TableRow className="FstoTableRowImport-root" key={index}>
                              <TableCell className="FstoTableCellImport-root">
                                {data.cheque_date}
                              </TableCell>

                              <TableCell className="FstoTableCellImport-root" align="right" sx={{ borderRight: '1px solid #e0e0e0' }}>
                                {
                                  data.principal?.toLocaleString('default', {
                                    currency: 'PHP',
                                    style: 'currency'
                                  })}
                              </TableCell>

                              <TableCell className="FstoTableCellImport-root" align="right" sx={{ borderRight: '1px solid #e0e0e0' }}>
                                {
                                  data.interest?.toLocaleString('default', {
                                    currency: 'PHP',
                                    style: 'currency'
                                  })}
                              </TableCell>

                              <TableCell className="FstoTableCellImport-root" align="right" sx={{ borderRight: '1px solid #e0e0e0' }}>
                                {
                                  data.cwt?.toLocaleString('default', {
                                    currency: 'PHP',
                                    style: 'currency'
                                  })}
                              </TableCell>

                              <TableCell className="FstoTableCellImport-root" align="right">
                                {
                                  data.net_of_amount?.toLocaleString('default', {
                                    currency: 'PHP',
                                    style: 'currency'
                                  })}
                              </TableCell>
                            </TableRow>
                          ))
                        }
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box className="FstoBoxImport-variance">
                    <Typography sx={{ fontSize: '1em' }}>Total Principal Amount</Typography>
                    <Typography variant="heading">
                      {
                        prmGroup.map((data) => data.principal).reduce((a, b) => a + b).toLocaleString('default', {
                          currency: 'PHP',
                          style: 'currency'
                        })}
                    </Typography>
                  </Box>

                  <Box className="FstoBoxImport-variance">
                    <Typography sx={{ fontSize: '1em' }}>Total Interest</Typography>
                    <Typography variant="heading">
                      {
                        prmGroup.map((data) => data.interest).reduce((a, b) => a + b).toLocaleString('default', {
                          currency: 'PHP',
                          style: 'currency'
                        })}
                    </Typography>
                  </Box>

                  <Box className="FstoBoxImport-variance">
                    <Typography sx={{ fontSize: '1em' }}>Total CWT</Typography>
                    <Typography variant="heading">
                      {
                        prmGroup.map((data) => data.cwt).reduce((a, b) => a + b).toLocaleString('default', {
                          currency: 'PHP',
                          style: 'currency'
                        })}
                    </Typography>
                  </Box>

                  <Box className="FstoBoxImport-variance">
                    <Typography sx={{ fontSize: '1em' }}>Total Net Amount</Typography>
                    <Typography variant="heading">
                      {
                        prmGroup.map((data) => data.net_of_amount).reduce((a, b) => a + b).toLocaleString('default', {
                          currency: 'PHP',
                          style: 'currency'
                        })}
                    </Typography>
                  </Box>
                </React.Fragment>
              )}

            { // Table for Loans Import
              Boolean(prmGroup.length) && Boolean(data.document.category) && Boolean(data.document.category.name.match(/leasing/i)) &&
              (
                <React.Fragment>
                  <TableContainer className="FstoTableContainerImport-root">
                    <Table className="FstoTableImport-root">
                      <TableHead className="FstoTableHeadImport-root">
                        <TableRow className="FstoTableRowImport-root">
                          <TableCell className="FstoTableCellImport-root">Cheque Date</TableCell>
                          <TableCell className="FstoTableCellImport-root" align="right" sx={{ borderRight: '1px solid #e0e0e0' }}>Amortization</TableCell>
                          <TableCell className="FstoTableCellImport-root" align="right" sx={{ borderRight: '1px solid #e0e0e0' }}>Interest</TableCell>
                          <TableCell className="FstoTableCellImport-root" align="right" sx={{ borderRight: '1px solid #e0e0e0' }}>Withholding Tax</TableCell>
                          <TableCell className="FstoTableCellImport-root" align="right" sx={{ borderRight: '1px solid #e0e0e0' }}>Principal</TableCell>
                          <TableCell className="FstoTableCellImport-root" align="right">Net of Amount</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody className="FstoTableBodyImport-root" sx={{ borderBottom: '3px solid #e0e0e0' }}>
                        {
                          prmGroup.map((data, index) => (
                            <TableRow className="FstoTableRowImport-root" key={index}>
                              <TableCell className="FstoTableCellImport-root">
                                {data.cheque_date}
                              </TableCell>

                              <TableCell className="FstoTableCellImport-root" align="right" sx={{ borderRight: '1px solid #e0e0e0' }}>
                                {
                                  data.amortization?.toLocaleString('default', {
                                    currency: 'PHP',
                                    style: 'currency'
                                  })}
                              </TableCell>

                              <TableCell className="FstoTableCellImport-root" align="right" sx={{ borderRight: '1px solid #e0e0e0' }}>
                                {
                                  data.interest?.toLocaleString('default', {
                                    currency: 'PHP',
                                    style: 'currency'
                                  })}
                              </TableCell>

                              <TableCell className="FstoTableCellImport-root" align="right" sx={{ borderRight: '1px solid #e0e0e0' }}>
                                {
                                  data.cwt?.toLocaleString('default', {
                                    currency: 'PHP',
                                    style: 'currency'
                                  })}
                              </TableCell>

                              <TableCell className="FstoTableCellImport-root" align="right" sx={{ borderRight: '1px solid #e0e0e0' }}>
                                {
                                  data.principal?.toLocaleString('default', {
                                    currency: 'PHP',
                                    style: 'currency'
                                  })}
                              </TableCell>

                              <TableCell className="FstoTableCellImport-root" align="right">
                                {
                                  data.net_of_amount?.toLocaleString('default', {
                                    currency: 'PHP',
                                    style: 'currency'
                                  })}
                              </TableCell>
                            </TableRow>
                          ))
                        }
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box className="FstoBoxImport-variance">
                    <Typography sx={{ fontSize: '1em' }}>Total Principal Amount</Typography>
                    <Typography variant="heading">
                      {
                        prmGroup.map((data) => data.principal).reduce((a, b) => a + b).toLocaleString('default', {
                          currency: 'PHP',
                          style: 'currency'
                        })}
                    </Typography>
                  </Box>

                  <Box className="FstoBoxImport-variance">
                    <Typography sx={{ fontSize: '1em' }}>Total Interest</Typography>
                    <Typography variant="heading">
                      {
                        prmGroup.map((data) => data.interest).reduce((a, b) => a + b).toLocaleString('default', {
                          currency: 'PHP',
                          style: 'currency'
                        })}
                    </Typography>
                  </Box>

                  <Box className="FstoBoxImport-variance">
                    <Typography sx={{ fontSize: '1em' }}>Total CWT</Typography>
                    <Typography variant="heading">
                      {
                        prmGroup.map((data) => data.cwt).reduce((a, b) => a + b).toLocaleString('default', {
                          currency: 'PHP',
                          style: 'currency'
                        })}
                    </Typography>
                  </Box>

                  <Box className="FstoBoxImport-variance">
                    <Typography sx={{ fontSize: '1em' }}>Total Net Amount</Typography>
                    <Typography variant="heading">
                      {
                        prmGroup.map((data) => data.net_of_amount).reduce((a, b) => a + b).toLocaleString('default', {
                          currency: 'PHP',
                          style: 'currency'
                        })}
                    </Typography>
                  </Box>
                </React.Fragment>
              )}

            <ErrorDialog {...errorImport} />
          </Paper>
        )
      }
    </Box>
  )
}

export default NewRequest