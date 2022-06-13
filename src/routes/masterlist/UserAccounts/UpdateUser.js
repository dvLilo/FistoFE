import React from 'react'

import axios from 'axios'

import { Link, useNavigate, useParams } from 'react-router-dom'

import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Autocomplete,

  FormControlLabel,
  FormControl,
  FormLabel,
  FormGroup,
  Checkbox,
} from '@mui/material'

import SyncIcon from '@mui/icons-material/Sync'

import { LoadingButton } from '@mui/lab'

import Toast from '../../../components/Toast'
import Confirm from '../../../components/Confirm'

const UpdateUser = () => {

  const { id } = useParams()
  const navigate = useNavigate()

  const [isSaving, setIsSaving] = React.useState(false)
  // eslint-disable-next-line
  const [isFetching, setIsFetching] = React.useState(false)
  // eslint-disable-next-line
  const [isValidating, setIsValidating] = React.useState(false)

  const [update, setUpdate] = React.useState({
    last_name: true,
    first_name: true,
    middle_name: true,
    suffix_name: true,
    department: true,
    position: true
  })

  const [error, setError] = React.useState({
    status: false,
    field: "",
    message: ""
  })

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

  // Permissions Array *Fixed
  const permissions = {
    requestor: [
      {
        id: 1,
        name: "Creation of Request"
      },
      {
        id: 2,
        name: "Creation of Confidential Request"
      }
    ],
    AP: [
      {
        id: 4,
        name: "Received Receipt Report"
      },
      // {
      //   id: 5,
      //   name: "Edited Tag Approval"
      // },
      {
        id: 6,
        name: "Releasing of Cheque"
      },
      // {
      //   id: 9,
      //   name: "Tagged Document Reports"
      // },
      {
        id: 12,
        name: "Creation of Voucher"
      },
      {
        id: 20,
        name: "Tagging of Document"
      },
      {
        id: 21,
        name: "Creation of Counter Receipt"
      },
      {
        id: 22,
        name: "Counter Receipt Report"
      }
    ],
    GAS: [
      {
        id: 3,
        name: "Identifying of Receipt"
      },
      {
        id: 11,
        name: "Matching of Voucher"
      }
    ],
    approver: [
      {
        id: 17,
        name: "Approval of Voucher"
      }
    ],
    treasury: [
      {
        id: 7,
        name: "Creation of Cheque"
      },
      {
        id: 8,
        name: "Clearing of Cheque"
      },
      // {
      //   id: 10,
      //   name: "Cheque Reports"
      // }
    ],
    confidential: [
      {
        id: 13,
        name: "Creation of Confidential Voucher"
      },
      {
        id: 15,
        name: "Tagging and Vouchering"
      },
      {
        id: 16,
        name: "Releasing of Confidential Cheque"
      },
      {
        id: 18,
        name: "Approval of Confidential Voucher"
      }
    ],
    administrator: [
      {
        id: 0,
        name: "Activity Logs"
      }
    ]
  }

  // Dropdown Array
  // eslint-disable-next-line
  const [dropdown, setDropdown] = React.useState({
    employees: [],
    roles: [
      {
        id: 1,
        name: "Requestor"
      },
      {
        id: 2,
        name: "AP Tagging"
      },
      {
        id: 3,
        name: "AP Associate"
      },
      {
        id: 4,
        name: "AP Specialist"
      },
      {
        id: 5,
        name: "Treasury Associate"
      },
      {
        id: 6,
        name: "Approver"
      },
      {
        id: 7,
        name: "Administrator"
      }
    ]
  })

  // Checkbox Array
  const [checkbox, setCheckbox] = React.useState({
    documents: []
  })

  // Form Data State
  const [user, setUser] = React.useState({
    full_id_no: "",
    id_prefix: "",
    id_no: "",
    last_name: "",
    first_name: "",
    middle_name: "",
    suffix_name: "",
    department: "",
    position: "",
    username: "",
    role: null,
    permissions: [],
    document_types: []
  })

  React.useEffect(() => {

    fetchSingleEmployee()
    fetchDocumentTypes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchSingleEmployee = async () => {
    setIsFetching(true)

    let response
    try {
      response = await axios.get(`/api/admin/users/${id}`)

      const {
        id_prefix,
        id_no,
        last_name,
        first_name,
        middle_name,
        suffix,
        department,
        position,
        username,
        role,
        permissions,
        document_types
      } = response.data.result

      setUser({
        full_id_no: `${id_prefix}-${id_no}`,
        id_prefix,
        id_no,
        last_name,
        first_name,
        middle_name,
        suffix_name: suffix,
        department,
        position,
        username,
        role: dropdown.roles.find(check => check.name === role),
        permissions,
        document_types
      })
    }
    catch (error) {
      if (error.request.status === 404) {
        setToast({
          show: true,
          title: "Error",
          message: "The user you're trying to update doesn't exist.",
          severity: "error"
        })
      }
      else {
        setToast({
          show: true,
          title: "Error",
          message: "Something went wrong whilst fetching user data.",
          severity: "error"
        })
      }

      return
    }

    setIsFetching(false)
  }

  const fetchDocumentTypes = async () => {
    let response
    try {
      response = await axios.get(`/api/admin/dropdown/document`)
      const { documents } = response.data.result

      setCheckbox({
        documents: documents
      })
    }
    catch (error) {
      if (error.request.status !== 404) {
        setToast({
          show: true,
          title: "Error",
          message: "Something went wrong whilst fetching document types.",
          severity: "error"
        })
      }

      setCheckbox({
        documents: []
      })
    }
  }

  const sedarSyncHandler = (ID) => {
    setConfirm({
      show: true,
      loading: false,
      onConfirm: async () => {
        setConfirm(currentValue => ({
          ...currentValue,
          loading: true,
          onConfirm: () => { }
        }))

        let response
        try {
          response = await axios.get(`http://localhost:5000/user/${ID}`)

          const {
            general_info: { first_name, middle_name, last_name, suffix },
            position_info: { position_name },
            unit_info: { department_name }
          } = response.data

          if (
            user.first_name === first_name &&
            user.middle_name === middle_name &&
            user.last_name === last_name &&
            user.position === position_name &&
            user.department === department_name &&
            (user.suffix_name === null && suffix === "")
          ) {
            setToast({
              show: true,
              title: "Info",
              message: "Nothing has changed.",
              severity: "info"
            })
            setConfirm(currentValue => ({
              ...currentValue,
              show: false,
              loading: false
            }))

            return
          }

          departmentChangeHandler(department_name)

          setUser(currentValue => ({
            ...currentValue,
            last_name: last_name,
            first_name: first_name,
            middle_name: middle_name,
            suffix_name: suffix,
            department: department_name,
            position: position_name
          }))
          setUpdate({
            last_name: user.last_name === last_name,
            first_name: user.first_name === first_name,
            middle_name: user.middle_name === middle_name,
            suffix_name: user.suffix_name === null && suffix === "",
            department: user.department === department_name,
            position: user.position === position_name
          })
          setToast({
            show: true,
            title: "Sync Successfully",
            message: "Employee details has been fetched from Sedar.",
            severity: "info"
          })
          setConfirm(currentValue => ({
            ...currentValue,
            show: false,
            loading: false
          }))
        }
        catch (error) {
          if (error.request.status !== 404) {
            setToast({
              show: true,
              title: "Error",
              message: "Something went wrong whilst fetching employee details from Sedar.",
              severity: "error"
            })
          }

          setConfirm({
            show: false,
            loading: false,
            onConfirm: () => { }
          })

          console.log("Fisto Error Status", error.request)
        }
      }
    })
  }

  const departmentChangeHandler = async (value) => {
    setError({
      status: false,
      field: "",
      message: ""
    })

    try {
      await axios.post(`/api/users/department-validation`, {
        department: value
      })
    }
    catch (error) {
      if (error.request.status === 404) {
        const {
          message,
          result: { error_field }
        } = error.response.data

        setError({
          status: true,
          field: error_field,
          message: message
        })
      }

      if (error.request.status !== 404) {
        setToast({
          show: true,
          title: "Error",
          message: "Something went wrong whilst validating department.",
          severity: "error"
        })
      }
    }
  }

  const formSubmitHandler = (e) => {
    e.preventDefault()

    setConfirm({
      show: true,
      loading: false,
      onConfirm: async () => {
        setConfirm({
          show: false,
          loading: false,
          onConfirm: () => { }
        })
        setIsSaving(true)

        let response
        try {
          response = await axios.put(`/api/admin/users/${id}`, {
            first_name: user.first_name,
            middle_name: user.middle_name,
            last_name: user.last_name,
            suffix: user.suffix_name,
            department: user.department,
            position: user.position,
            role: user.role.name,
            permissions: user.permissions,
            document_types: user.document_types
          })

          setToast({
            show: true,
            title: "Success",
            message: response.data.message
          })
        }
        catch (error) {
          switch (error.request.status) {
            case 409:
              setToast({
                show: true,
                title: "Error",
                message: error.response.data.message,
                severity: "error"
              })
              break;

            case 304:
              setToast({
                show: true,
                title: "Info",
                message: "Nothing has changed.",
                severity: "info"
              })
              break;

            default:
              setToast({
                show: true,
                title: "Error",
                message: "Something went wrong whilst saving user account.",
                severity: "error"
              })
          }

          console.log("Fisto Error Details: ", error.request)
        }

        setIsSaving(false)
      }
    })
  }

  const roleSelectHandler = (e, value) => {

    let permissions = []
    switch (value.id) {
      case 1: permissions = [1]
        break

      case 2: permissions = [6, 4, 20, 22]
        break

      case 3: permissions = [12, 21]
        break

      case 4: permissions = [12, 21]
        break

      case 5: permissions = [7, 8]
        break

      case 6: permissions = [17]
        break

      default:
        permissions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
    }

    setUser({
      ...user,
      role: value,
      permissions
    })
  }

  const permissionsCheckboxHandler = (e) => {
    const check = e.target.checked

    if (check)
      setUser({
        ...user,
        permissions: [
          ...user.permissions, parseInt(e.target.value)
        ]
      })
    else {
      const index = user.permissions.indexOf(parseInt(e.target.value))
      user.permissions.splice(index, 1)
      setUser({
        ...user,
        permissions: user.permissions
      })
    }
  }

  const documentsCheckboxHandler = (e) => {
    const check = e.target.checked

    if (check) {
      const found = user.document_types.some(document => document.id === parseInt(e.target.value))

      if (!found) setUser({
        ...user,
        document_types: [
          ...user.document_types,
          {
            id: parseInt(e.target.value),
            categories: []
          }
        ]
      })
    }
    else {
      const document_types = user.document_types.filter(document => document.id !== parseInt(e.target.value))
      setUser({
        ...user,
        document_types: document_types
      })
    }
  }

  const categoriesCheckboxHandler = (e) => {
    const check = e.target.checked

    if (check) {
      const document_types = user.document_types.map(
        (document, index) => document.id === parseInt(e.target.getAttribute('data-document'))
          ? { ...document, categories: [...document.categories, parseInt(e.target.value)] }
          : document
      )
      setUser({
        ...user,
        document_types: document_types
      })
    }
    else {
      const document_types = user.document_types.map(
        (document, index) => document.id === parseInt(e.target.getAttribute('data-document'))
          ? { ...document, categories: document.categories.filter((category, index) => category !== parseInt(e.target.value)) }
          : document
      )
      setUser({
        ...user,
        document_types: document_types
      })
    }
  }

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperForm-root" elevation={1}>
        <Typography variant="heading" sx={{ display: 'block', marginBottom: 3 }}>Update User Account</Typography>

        <form onSubmit={formSubmitHandler}>
          <TextField
            className="FstoTextfieldForm-root"
            label="Employee ID No."
            variant="outlined"
            autoComplete="off"
            size="small"
            value={user.full_id_no}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button size="small" startIcon={<SyncIcon fontSize="small" />} onClick={() => sedarSyncHandler(user.id_no)}>
                    Sync with Sedar
                  </Button>
                </InputAdornment>
              )
            }}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            sx={{
              input: { textTransform: "capitalize" }
            }}
            disabled
            fullWidth
          />

          <TextField
            className="FstoTextfieldForm-root"
            label="Lastname"
            variant="outlined"
            autoComplete="off"
            size="small"
            color="info"
            value={user.last_name.toLowerCase()}
            InputProps={{
              readOnly: !update.last_name
            }}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            sx={{
              input: { textTransform: "capitalize" }
            }}
            focused={!update.last_name}
            disabled={update.last_name}
            fullWidth
          />

          <TextField
            className="FstoTextfieldForm-root"
            label="Firstname"
            variant="outlined"
            autoComplete="off"
            size="small"
            color="info"
            value={user.first_name.toLowerCase()}
            InputProps={{
              readOnly: !update.first_name
            }}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            sx={{
              input: { textTransform: "capitalize" }
            }}
            focused={!update.first_name}
            disabled={update.first_name}
            fullWidth
          />

          <TextField
            className="FstoTextfieldForm-root"
            label="Middlename"
            variant="outlined"
            autoComplete="off"
            size="small"
            color="info"
            value={user.middle_name.toLowerCase()}
            InputProps={{
              readOnly: !update.middle_name
            }}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            sx={{
              input: { textTransform: "capitalize" }
            }}
            focused={!update.middle_name}
            disabled={update.middle_name}
            fullWidth
          />

          <TextField
            className="FstoTextfieldForm-root"
            label="Department"
            variant="outlined"
            autoComplete="off"
            size="small"
            color="info"
            value={user.department}
            error={error.status && error.field === "department"}
            helperText={
              error.status &&
              error.field === "department" &&
              <React.Fragment>
                {error.message} <Link to="/dashboard/departments" state={{ department: user.department }}>Click here</Link> to register.
              </React.Fragment>
            }
            InputProps={{
              readOnly: !update.department
            }}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            focused={!update.department}
            disabled={update.department}
            fullWidth
          />

          <TextField
            className="FstoTextfieldForm-root"
            label="Position"
            variant="outlined"
            autoComplete="off"
            size="small"
            color="info"
            value={user.position}
            InputProps={{
              readOnly: !update.position
            }}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            focused={!update.position}
            disabled={update.position}
            fullWidth
          />

          <TextField
            className="FstoTextfieldForm-root"
            label="Username"
            variant="outlined"
            autoComplete="off"
            size="small"
            value={user.username}
            InputProps={{
              readOnly: true
            }}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            disabled
            fullWidth
          />

          <Autocomplete
            className="FstoSelectForm-root"
            size="small"
            disabled={isFetching}
            options={dropdown.roles}
            value={user.role}
            renderInput={
              props =>
                <TextField
                  {...props}
                  variant="outlined"
                  label="Role"
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
            onChange={roleSelectHandler}
            fullWidth
            disablePortal
            disableClearable
          />

          <LoadingButton
            className="FstoButtonForm-root"
            type="submit"
            variant="contained"
            loadingPosition="start"
            loading={isSaving}
            startIcon={<></>}
            disabled={
              error.status ||
              !Boolean(user.id_no) ||
              !Boolean(user.last_name) ||
              !Boolean(user.first_name) ||
              !Boolean(user.middle_name) ||
              !Boolean(user.department) ||
              !Boolean(user.position) ||
              !Boolean(user.username) ||
              !Boolean(user.role) ||
              !Boolean(user.permissions.length) ||
              ((user.permissions.includes(1) || user.permissions.includes(2)) && !Boolean(user.document_types.length))
            }
            disableElevation
          >
            Update
          </LoadingButton>

          <Button
            className="FstoButtonForm-root"
            variant="outlined"
            color="error"
            onClick={() => navigate(-1)}
            disableElevation
          >
            {
              user.full_id_no
                ? "Cancel"
                : "Back"
            }
          </Button>
        </form>
      </Paper>

      {
        user.role &&
        <Box className="FstoBoxWrapper-root">
          <Paper className="FstoPaperGroup-root" elevation={1}>
            <Typography variant="permission" sx={{ marginLeft: 4, marginBottom: 4, marginTop: 2 }}>Permissions</Typography>

            {
              (user.role?.id === 1 || user.role?.id === 2 || user.role?.id === 3 || user.role?.id === 4 || user.role?.id === 6 || user.role?.id === 7) &&
              <FormControl component="fieldset" variant="standard" sx={{ marginX: 4, marginBottom: 4, border: '2px solid #dee2e6', borderRadius: '5px' }}>
                <FormLabel component="legend" sx={{ background: '#eee', marginLeft: 2, paddingLeft: 3, paddingRight: 3, borderRadius: '5px', color: '#000', fontWeight: 500 }}>Requestor</FormLabel>
                <FormGroup row={true} sx={{ padding: '10px 35px' }}>
                  {
                    permissions.requestor.map((perm, index) => (
                      <FormControlLabel
                        className="FstoCheckboxLabel-root"
                        key={index}
                        label={perm.name}
                        sx={{ width: '50%', margin: 0 }}
                        control={
                          <Checkbox size="small" sx={{ padding: '7px' }} value={perm.id} checked={user.permissions.includes(perm.id)} onChange={permissionsCheckboxHandler} />
                        }
                        disableTypography
                      />
                    ))}
                </FormGroup>
              </FormControl>}

            {
              (user.role?.id === 2 || user.role?.id === 3 || user.role?.id === 4 || user.role?.id === 7) &&
              <FormControl component="fieldset" variant="standard" sx={{ marginX: 4, marginBottom: 4, border: '2px solid #dee2e6', borderRadius: '5px' }}>
                <FormLabel component="legend" sx={{ background: '#eee', marginLeft: 2, paddingLeft: 3, paddingRight: 3, borderRadius: '5px', color: '#000', fontWeight: 500 }}>Accounts Payable</FormLabel>
                <FormGroup row={true} sx={{ padding: '10px 35px' }}>
                  {
                    permissions.AP.map((perm, index) => (
                      <FormControlLabel
                        className="FstoCheckboxLabel-root"
                        key={index}
                        label={perm.name}
                        sx={{ width: '50%', margin: 0 }}
                        control={
                          <Checkbox size="small" sx={{ padding: '7px' }} value={perm.id} checked={user.permissions.includes(perm.id)} onChange={permissionsCheckboxHandler} />
                        }
                        disableTypography
                      />
                    ))
                  }
                </FormGroup>
              </FormControl>}

            {
              (user.role?.id === 6 || user.role?.id === 7) &&
              <FormControl component="fieldset" variant="standard" sx={{ marginX: 4, marginBottom: 4, border: '2px solid #dee2e6', borderRadius: '5px' }}>
                <FormLabel component="legend" sx={{ background: '#eee', marginLeft: 2, paddingLeft: 3, paddingRight: 3, borderRadius: '5px', color: '#000', fontWeight: 500 }}>Approver</FormLabel>
                <FormGroup row={true} sx={{ padding: '10px 35px' }}>
                  {
                    permissions.approver.map((perm, index) => (
                      <FormControlLabel
                        className="FstoCheckboxLabel-root"
                        key={index}
                        label={perm.name}
                        sx={{ width: '50%', margin: 0 }}
                        control={
                          <Checkbox size="small" sx={{ padding: '7px' }} value={perm.id} checked={user.permissions.includes(perm.id)} onChange={permissionsCheckboxHandler} />
                        }
                        disableTypography
                      />
                    ))
                  }
                </FormGroup>
              </FormControl>}

            {
              (user.role?.id === 5 || user.role?.id === 7) &&
              <FormControl component="fieldset" variant="standard" sx={{ marginX: 4, marginBottom: 4, border: '2px solid #dee2e6', borderRadius: '5px' }}>
                <FormLabel component="legend" sx={{ background: '#eee', marginLeft: 2, paddingLeft: 3, paddingRight: 3, borderRadius: '5px', color: '#000', fontWeight: 500 }}>Treasury</FormLabel>
                <FormGroup row={true} sx={{ padding: '10px 35px' }}>
                  {
                    permissions.treasury.map((perm, index) => (
                      <FormControlLabel
                        className="FstoCheckboxLabel-root"
                        key={index}
                        label={perm.name}
                        sx={{ width: '50%', margin: 0 }}
                        control={
                          <Checkbox size="small" sx={{ padding: '7px' }} value={perm.id} checked={user.permissions.includes(perm.id)} onChange={permissionsCheckboxHandler} />
                        }
                        disableTypography
                      />
                    ))
                  }
                </FormGroup>
              </FormControl>}

            {
              (user.role?.id === 6 || user.role?.id === 7) &&
              <FormControl component="fieldset" variant="standard" sx={{ marginX: 4, marginBottom: 4, border: '2px solid #dee2e6', borderRadius: '5px' }}>
                <FormLabel component="legend" sx={{ background: '#eee', marginLeft: 2, paddingLeft: 3, paddingRight: 3, borderRadius: '5px', color: '#000', fontWeight: 500 }}>Confidential</FormLabel>
                <FormGroup row={true} sx={{ padding: '10px 35px' }}>
                  {
                    permissions.confidential.map((perm, index) => (
                      <FormControlLabel
                        className="FstoCheckboxLabel-root"
                        key={index}
                        label={perm.name}
                        sx={{ width: '50%', margin: 0 }}
                        control={
                          <Checkbox size="small" sx={{ padding: '7px' }} value={perm.id} checked={user.permissions.includes(perm.id)} onChange={permissionsCheckboxHandler} />
                        }
                        disableTypography
                      />
                    ))
                  }
                </FormGroup>
              </FormControl>}

            {
              (user.role?.id === 7) &&
              <FormControl component="fieldset" variant="standard" sx={{ marginX: 4, marginBottom: 4, border: '2px solid #dee2e6', borderRadius: '5px' }}>
                <FormLabel component="legend" sx={{ background: '#eee', marginLeft: 2, paddingLeft: 3, paddingRight: 3, borderRadius: '5px', color: '#000', fontWeight: 500 }}>Administrator</FormLabel>
                <FormGroup row={true} sx={{ padding: '10px 35px' }}>
                  {
                    permissions.administrator.map((perm, index) => (
                      <FormControlLabel
                        className="FstoCheckboxLabel-root"
                        key={index}
                        label={perm.name}
                        sx={{ width: '50%', margin: 0 }}
                        control={
                          <Checkbox size="small" sx={{ padding: '7px' }} value={perm.id} checked={user.permissions.includes(perm.id)} onChange={permissionsCheckboxHandler} />
                        }
                        disableTypography
                      />
                    ))
                  }
                </FormGroup>
              </FormControl>}
          </Paper>

          {
            // hardcoded, 1 is for Tagging of Request and 2 is for Tagging of Confidential Request
            Boolean(checkbox.documents.length)
            && (user.permissions.includes(1) || user.permissions.includes(2))
            && (
              <Paper className="FstoPaperGroup-root" elevation={1}>
                <Typography variant="permission" sx={{ marginLeft: 4, marginTop: 2 }}>Document Types</Typography>

                <FormGroup row={true} sx={{ marginBottom: 2, padding: '10px 35px' }}>
                  {
                    checkbox.documents.map((document, index) => (
                      <FormControlLabel
                        className="FstoCheckboxLabel-root"
                        key={index}
                        label={document.type}
                        sx={{ width: '50%', margin: 0 }}
                        control={
                          <Checkbox size="small" sx={{ padding: '7px' }} value={document.id} onChange={documentsCheckboxHandler} checked={user.document_types.some(check => check.id === document.id)} />
                        }
                        disableTypography
                      />
                    ))
                  }
                </FormGroup>

                {
                  checkbox.documents.map((document, index) => (
                    Boolean(document.categories.length)
                    && (
                      user.document_types.some(check => check.id === document.id)
                      && (
                        <FormControl component="fieldset" variant="standard" sx={{ marginX: 4, marginBottom: 4, border: '2px solid #dee2e6', borderRadius: '5px' }} key={index}>
                          <FormLabel component="legend" sx={{ background: '#eee', marginLeft: 2, paddingLeft: 3, paddingRight: 3, borderRadius: '5px', color: '#000', fontWeight: 500 }}>{document.type}</FormLabel>

                          <FormGroup row={true} sx={{ padding: '10px 35px' }}>
                            {
                              document.categories.map((category, key) => (
                                <FormControlLabel
                                  className="FstoCheckboxLabel-root"
                                  key={key}
                                  label={category.name}
                                  sx={{ width: '50%', margin: 0 }}
                                  control={
                                    <Checkbox
                                      size="small"
                                      sx={{ padding: '7px' }}
                                      value={category.id}
                                      inputProps={{ 'data-document': document.id }}
                                      onChange={categoriesCheckboxHandler}
                                      checked={
                                        user.document_types.find(check => check.id === document.id).categories.includes(category.id)
                                      }
                                    />
                                  }
                                  disableTypography
                                />
                              ))
                            }
                          </FormGroup>
                        </FormControl>
                      )

                    )
                  ))
                }
              </Paper>
            )
          }
        </Box>}

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

export default UpdateUser