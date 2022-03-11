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

import Toast from '../../components/Toast'
import Confirm from '../../components/Confirm'


const DOCUMENT_TYPES = [
  {
    id: 1,
    name: "PAD"
  },
  {
    id: 2,
    name: "PRM Common"
  },
  {
    id: 3,
    name: "PRM Multiple"
  },
  {
    id: 4,
    name: "Receipt"
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

const COMPANY_CHARGING = [
  {
    "department_name": "Management Information System",
    "company_name": "RDF Corporate Services",
    "location_name": "Head Office"
  },
  {
    "department_name": "Management Information System",
    "company_name": "RDF Corporate Services",
    "location_name": "Common"
  },
  {
    "department_name": "Human Resources Common",
    "company_name": "RDF Corporate Services",
    "location_name": "Head Office"
  },
  {
    "department_name": "Treasury",
    "company_name": "RDF Corporate Services",
    "location_name": "Common"
  },
  {
    "department_name": "Audit",
    "company_name": "RDF Corporate Services",
    "location_name": "Common"
  },
  {
    "department_name": "Finance Common",
    "company_name": "RDF Corporate Services",
    "location_name": "Head Office"
  },
  {
    "department_name": "Boiler Farms",
    "company_name": "Red Dragon Farm",
    "location_name": "BrFarm - Lara 1"
  },
  {
    "department_name": "Boiler Farms - Area 2",
    "company_name": "Red Dragon Farm",
    "location_name": "BrFarm - Nueva Ecija 1"
  },
  {
    "department_name": "Boiler Farms - Area 2",
    "company_name": "Red Dragon Farm",
    "location_name": "BrFarm - Nueva Ecija 2"
  }
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

  // eslint-disable-next-line
  const [isSaving, setIsSaving] = React.useState(false)

  const [toast, setToast] = React.useState({
    show: false,
    title: null,
    message: null
  })

  const [confirm, setConfirm] = React.useState({
    show: false,
    loading: false,
    onConfirm: () => { }
  })

  // const [charging, setCharging] = React.useState([])

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
      id: 1,
      payment_type: "full",
      no: "pad#00-0001",
      date: "2022-03-03",
      amount: 20000.00,

      supplier: {
        id: 1,
        name: "1ST ADVENUE ADVERTISING"
      },

      company: "RDF Corporate Services",
      department: "Management Information System",
      location: "Head Office",

      remarks: undefined
    },

    po_group: [
      // {
      //   no: 10001,
      //   balance: 20000.00,
      //   amount: 20000.00,
      //   rr_no: ["12345", "12346"]
      // }
    ]
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
  //         setToast({
  //           show: true,
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
            fullWidth
            disablePortal
            disableClearable
            className="FstoSelectForm-root"
            size="small"
            options={DOCUMENT_TYPES}
            value={DOCUMENT_TYPES.find(row => row.id === data.document.id)}
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
              option => option.name
            }
            isOptionEqualToValue={
              (option, value) => option.id === value.id
            }
            onChange={(e, value) => setData({
              ...data,
              document: {
                ...data.document,
                id: value.id
              }
            })}
          />

          <Autocomplete
            fullWidth
            disablePortal
            disableClearable
            className="FstoSelectForm-root"
            size="small"
            options={PAYMENT_TYPES}
            value={PAYMENT_TYPES.find(row => row.label.toLowerCase() === data.document.payment_type.toLowerCase())}
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
            // getOptionLabel={
            //   option => option.general_info.full_id_number
            // }
            getOptionDisabled={
              option => {
                if (option.label === "Partial") return true
              }
            }
            isOptionEqualToValue={
              (option, value) => option.label === value.label
            }
          // onChange={userSelectHandler}
          />

          <TextField
            className="FstoTextfieldForm-root"
            label="Document Number"
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

          <LocalizationProvider dateAdapter={DateAdapter}>
            <DatePicker
              value={data.document.date}
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
                    fullWidth
                  />
              }
            />
          </LocalizationProvider>

          <TextField
            className="FstoTextfieldForm-root"
            label="Document Amount"
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

          <Autocomplete
            fullWidth
            disablePortal
            disableClearable
            className="FstoSelectForm-root"
            size="small"
            options={
              COMPANY_CHARGING
                .reduce((unique, o) => {
                  if (!unique.some(obj => obj.company_name === o.company_name)) unique.push(o)
                  return unique
                }, [])
            }
            value={
              Boolean(data.document.company)
                ? COMPANY_CHARGING
                  .reduce((unique, o) => {
                    if (!unique.some(obj => obj.company_name === o.company_name)) unique.push(o)
                    return unique
                  }, [])
                  .find(row => row.company_name === data.document.company)
                : null
            }
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
              option => option.company_name
            }
            isOptionEqualToValue={
              (option, value) => option.company_name === value.company_name
            }
            onChange={(e, value) => setData({
              ...data,
              document: {
                ...data.document,
                company: value.company_name,
                department: "",
                location: ""
              }
            })}
          />

          <Autocomplete
            fullWidth
            disablePortal
            disableClearable
            className="FstoSelectForm-root"
            size="small"
            options={
              COMPANY_CHARGING
                .filter(row => row.company_name === data.document.company)
                .reduce((unique, o) => {
                  if (!unique.some(obj => obj.department_name === o.department_name)) unique.push(o)
                  return unique
                }, [])
            }
            value={
              Boolean(data.document.department)
                ? COMPANY_CHARGING
                  .filter(row => row.company_name === data.document.company)
                  .reduce((unique, o) => {
                    if (!unique.some(obj => obj.department_name === o.department_name)) unique.push(o)
                    return unique
                  }, [])
                  .find(row => row.department_name === data.document.department)
                : null
            }
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
              option => option.department_name
            }
            isOptionEqualToValue={
              (option, value) => option.department_name === value.department_name
            }
            onChange={(e, value) => setData({
              ...data,
              document: {
                ...data.document,
                department: value.department_name,
                location: ""
              }
            })}
          />

          <Autocomplete
            fullWidth
            disablePortal
            disableClearable
            className="FstoSelectForm-root"
            size="small"
            options={
              COMPANY_CHARGING
                .filter(row => row.company_name === data.document.company && row.department_name === data.document.department)
                .reduce((unique, o) => {
                  if (!unique.some(obj => obj.location_name === o.location_name)) unique.push(o)
                  return unique
                }, [])
            }
            value={
              Boolean(data.document.location)
                ? COMPANY_CHARGING
                  .filter(row => row.company_name === data.document.company && row.department_name === data.document.department)
                  .reduce((unique, o) => {
                    if (!unique.some(obj => obj.location_name === o.location_name)) unique.push(o)
                    return unique
                  }, [])
                  .find(row => row.location_name === data.document.location)
                : null
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
              option => option.location_name
            }
            isOptionEqualToValue={
              (option, value) => option.location_name === value.location_name
            }
            onChange={(e, value) => setData({
              ...data,
              document: {
                ...data.document,
                location: value.location_name
              }
            })}
          />

          <Autocomplete
            fullWidth
            disablePortal
            disableClearable
            className="FstoSelectForm-root"
            size="small"
            options={SUPPLIER_LIST}
            value={
              Boolean(data.document.supplier.id) && Boolean(data.document.supplier.name)
                ? SUPPLIER_LIST.find(row => row.id === data.document.supplier.id)
                : null
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
              (option, value) => option.name === value.name
            }
            onChange={(e, value) => setData({
              ...data,
              document: {
                ...data.document,
                supplier: {
                  id: value.id,
                  name: value.name
                }
              }
            })}
          />

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

          <LoadingButton
            className="FstoButtonForm-root"
            type="submit"
            variant="contained"
            loadingPosition="start"
            loading={isSaving}
            startIcon={<></>}
            // disabled={
            //   error.status ||
            //   !Boolean(user.full_id_no) ||
            //   !Boolean(user.id_no) ||
            //   !Boolean(user.last_name) ||
            //   !Boolean(user.first_name) ||
            //   !Boolean(user.middle_name) ||
            //   !Boolean(user.department) ||
            //   !Boolean(user.position) ||
            //   !Boolean(user.username) ||
            //   !Boolean(user.role) ||
            //   !Boolean(user.permissions.length) ||
            //   ((user.permissions.includes(1) || user.permissions.includes(2)) && !Boolean(user.documents.length))
            // }
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

      <Paper className="FstoPaperAttachment-root" elevation={1}>
        <Typography variant="heading" sx={{ display: 'block', marginBottom: 3 }}>Attachment</Typography>

        <Box sx={{ width: "100%", display: "flex", flexDirection: "row", gap: 1, marginBottom: 2 }}>
          <TextField
            className="FstoTextfieldForm-attachment"
            label="P.O. Number"
            variant="outlined"
            autoComplete="off"
            size="small"
            value={PO.no}
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
            freeSolo
            multiple
            fullWidth
            disablePortal
            disableClearable
            className="FstoSelectForm-attachment"
            size="small"
            options={[]}
            value={PO.rr_no}
            renderTags={
              (value, getTagProps) => value.map(
                (option, index) =>
                  <Chip
                    label={option}
                    variant="outlined"
                    size="small"
                    {...getTagProps({ index })}
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
          />

          <Button
            className="FstoButtonForm-attachment"
            variant="contained"
            color="secondary"
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

        {/* <Box className="FstoPurchaseOrderBox-root">
          <div className="FstoPurchaseOrder-root">
            <Stack direction="column" sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2">P.O. Number</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>1001</Typography>
            </Stack>

            <Stack direction="column" sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2">P.O. Amount</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>P20,000</Typography>
            </Stack>

            <Stack direction="column" sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2">P.O. Balance</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>P20,000</Typography>
            </Stack>

            <Stack direction="column" sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2">R.R. Number</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>101, 102</Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <IconButton>
                <Edit />
              </IconButton>
              <IconButton>
                <Delete />
              </IconButton>
            </Stack>
          </div>
        </Box>

        <Divider variant="middle" sx={{ marginTop: 4, marginBottom: 4 }} />

        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: 1, width: "100%" }}>
          <Typography variant="h6">Total P.O. Amount</Typography>
          <Typography variant="h6">P20,000.00</Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: 1, width: "100%" }}>
          <Typography variant="heading">Total P.O. Balance</Typography>
          <Typography variant="heading">P20,000.00</Typography>
        </Box> */}
      </Paper>

      <Toast
        open={toast.show}
        title={toast.title}
        message={toast.message}
        severity={toast.severity}
        onClose={(event, reason) => {
          if (reason === 'clickaway') return

          setToast({
            show: false,
            title: null,
            message: null
          })
        }}
      />

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