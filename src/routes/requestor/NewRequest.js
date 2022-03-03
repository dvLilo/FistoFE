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

  // FormControlLabel,
  // FormControl,
  // FormLabel,
  // FormGroup,
  // Checkbox
} from '@mui/material'

import { LoadingButton, DatePicker, LocalizationProvider } from '@mui/lab'
import DateAdapter from '@mui/lab/AdapterMoment'
// eslint-disable-next-line
import { createFilterOptions } from '@mui/material/Autocomplete';

import Toast from '../../components/Toast'
import Confirm from '../../components/Confirm'


const DOCUMENT_TYPES = [
  {
    id: 1,
    label: "PAD"
  },
  {
    id: 2,
    label: "PRM Common"
  },
  {
    id: 3,
    label: "PRM Multiple"
  },
  {
    id: 4,
    label: "Receipt"
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
      // decimalScale={2}
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
    onConfirm: () => {}
  })

  // const [padRequest, setPadRequest] = useState([])
  // const [prmcRequest, setPrmcRequest] = useState([])
  // const [prmmRequest, setPrmmRequest] = useState([])
  // const [receiptRequest, setReceiptRequest] = useState([])
  // const [contractorRequest, setContractorRequest] = useState([])
  // const [utilitiesRequest, setUtilitiesRequest] = useState([])
  // const [payrollRequest, setPayrollRequest] = useState([])
  // const [pcfRequest, setPcfRequest] = useState([])

  // eslint-disable-next-line
  const [data, setData] = React.useState({
    user_id: 1,
    id_prefix: "RDFFLFI",
    id_no: 10791,
    first_name: "Limay Louie",
    middle_name: "Ocampo",
    last_name: "Ducut",
    suffix: null,
    role: "Administrator",
    position: "System Developer",
    department: "Management Information System",


    document_id: 1,
    document_type: "PAD",

    payment_type: "full",

    document_no: "pad#000-0001",
    document_date: "2022-03-03",
    document_amount: 2000.55936,


    company_id: 1,
    company_name: "RDF Corporate Services",
    department_id: 1,
    department_name: "Management Information System",
    location_id: 1,
    location_name: "Head Office",

    supplier_id: 1,
    supplier: "1ST ADVENUE ADVERTISING",

    po_group: [
      {
        po_no: 10001,
        po_quantity: 1,
        po_amount: 2000.55936,
        unit_price: 2000.55936,
        rr_no: [10001,10002]
      }
    ],


    remarks: null
  })

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperForm-root" elevation={1}>
        <Typography variant="heading" sx={{ display: 'block', marginBottom: 3 }}>Request for Tagging</Typography>

        <form>
          <Autocomplete
            fullWidth
            disablePortal
            className="FstoSelectForm-root"
            size="small"
            options={DOCUMENT_TYPES}
            // value={userRaw}
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
            // getOptionLabel={
            //   option => option.general_info.full_id_number
            // }
            // isOptionEqualToValue={
            //   (option, value) => option.general_info.full_id_number === value.general_info.full_id_number
            // }
            // onChange={userSelectHandler}
          />
          


          <Autocomplete
            fullWidth
            disablePortal
            className="FstoSelectForm-root"
            size="small"
            options={PAYMENT_TYPES}
            // value={userRaw}
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
            // isOptionEqualToValue={
            //   (option, value) => option.general_info.full_id_number === value.general_info.full_id_number
            // }
            // onChange={userSelectHandler}
          />

          <TextField
            className="FstoTextfieldForm-root"
            label="Document Number"
            variant="outlined"
            autoComplete="off"
            size="small"
            // value={user.last_name.toLowerCase()}
            // onChange={(e) => setUser({
            //   ...user,
            //   last_name: e.target.value
            // })}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            sx={{
              input: { textTransform: "capitalize" }
            }}
            fullWidth
          />

          <LocalizationProvider dateAdapter={DateAdapter}>
            <DatePicker
              value={null}
              onChange={() => {}}
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
            // value={user.last_name.toLowerCase()}
            // onChange={(e) => setUser({
            //   ...user,
            //   last_name: e.target.value
            // })}
            InputProps={{
              inputComponent: NumberField,
            }}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            sx={{
              input: { textTransform: "capitalize" }
            }}
            fullWidth
          />
          
          <Autocomplete
            fullWidth
            disablePortal
            className="FstoSelectForm-root"
            size="small"
            options={[]}
            // value={userRaw}
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
            // getOptionLabel={
            //   option => option.general_info.full_id_number
            // }
            // isOptionEqualToValue={
            //   (option, value) => option.general_info.full_id_number === value.general_info.full_id_number
            // }
            // onChange={userSelectHandler}
          />
          
          <Autocomplete
            fullWidth
            disablePortal
            className="FstoSelectForm-root"
            size="small"
            options={[]}
            // value={userRaw}
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
            // getOptionLabel={
            //   option => option.general_info.full_id_number
            // }
            // isOptionEqualToValue={
            //   (option, value) => option.general_info.full_id_number === value.general_info.full_id_number
            // }
            // onChange={userSelectHandler}
          />
          
          <Autocomplete
            fullWidth
            disablePortal
            className="FstoSelectForm-root"
            size="small"
            options={[]}
            // value={userRaw}
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
            // getOptionLabel={
            //   option => option.general_info.full_id_number
            // }
            // isOptionEqualToValue={
            //   (option, value) => option.general_info.full_id_number === value.general_info.full_id_number
            // }
            // onChange={userSelectHandler}
          />
          
          <Autocomplete
            fullWidth
            disablePortal
            className="FstoSelectForm-root"
            size="small"
            options={[]}
            // value={userRaw}
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
            // getOptionLabel={
            //   option => option.general_info.full_id_number
            // }
            // isOptionEqualToValue={
            //   (option, value) => option.general_info.full_id_number === value.general_info.full_id_number
            // }
            // onChange={userSelectHandler}
          />

          <TextField
            className="FstoTextfieldForm-root"
            label="Remarks (Optional)"
            variant="outlined"
            autoComplete="off"
            size="small"
            rows={3}
            // value={user.last_name.toLowerCase()}
            // onChange={(e) => setUser({
            //   ...user,
            //   last_name: e.target.value
            // })}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            sx={{
              input: { textTransform: "capitalize" }
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
        <Typography variant="h1">Hello PAD</Typography>
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
          onConfirm: () => {}
        })}
      />
    </Box>
  )
}

export default NewRequest