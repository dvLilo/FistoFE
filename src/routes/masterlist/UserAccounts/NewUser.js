import React from 'react'

import axios from 'axios'

import { Link, useNavigate } from 'react-router-dom'

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Autocomplete,

  FormControlLabel,
  FormControl,
  FormLabel,
  FormGroup,
  Checkbox
} from '@mui/material'

import { LoadingButton } from '@mui/lab'

import { createFilterOptions } from '@mui/material/Autocomplete'

import Toast from '../../../components/Toast'
import Confirm from '../../../components/Confirm'

const NewUser = () => {

  const navigate = useNavigate()

  const usernameRef = React.useRef()

  const [isSaving, setIsSaving] = React.useState(false)
  const [isFetching, setIsFetching] = React.useState(false)
  const [isValidating, setIsValidating] = React.useState(false)

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
      {
        id: 10,
        name: "Reversal Request"
      },
      {
        id: 11,
        name: "Filing of Voucher"
      },
      {
        id: 12,
        name: "Creation of Voucher"
      },
      {
        id: 19,
        name: "Transmittal of Document"
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
        name: "Monitoring of Counter Receipt"
      }
    ],
    GAS: [
      {
        id: 3,
        name: "Identifying of Receipt"
      }
    ],
    approver: [
      // {
      //   id: 5,
      //   name: "Reversal of Cheque"
      // },
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
      {
        id: 9,
        name: "Creation of Debit Memo"
      }
    ],
    confidential: [
      {
        id: 15,
        name: "Tagging and Vouchering"
      },
      {
        id: 18,
        name: "Approval of Confidential Voucher"
      },
      {
        id: 13,
        name: "Transmittal of Confidential Document"
      },
      {
        id: 16,
        name: "Releasing of Confidential Cheque"
      },
      {
        id: 14,
        name: "Filing of Confidential Voucher"
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
  const [dropdown, setDropdown] = React.useState({
    employees: [],
    departments: [],
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
    documents: null
  })

  // Sedar Dropdown State
  const [userRaw, setUserRaw] = React.useState(null)
  // Form Data State
  const [user, setUser] = React.useState({
    full_id_no: "",
    id_prefix: "",
    id_no: "",
    last_name: "",
    first_name: "",
    middle_name: "",
    suffix_name: "",
    department: [],
    position: "",
    username: "",
    role: null,
    permissions: [],
    documents: []
  })

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    limit: 250
  });

  React.useEffect(() => {

    fetchEmployeesFromSEDAR()
    fetchDocumentTypes()
    fetchDepartments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchEmployeesFromSEDAR = async () => {
    setIsFetching(true)

    let response
    try {
      response = await axios.get(`http://localhost:5000/user`).then(JSON => JSON.data)

      setDropdown(currentValue => ({
        ...currentValue,
        employees: response.length ? response : null
      }))
    }
    catch (error) {
      if (error.request.status !== 404) {
        setToast({
          show: true,
          title: "Error",
          message: "Something went wrong whilst fetching list of employees from Sedar.",
          severity: "error"
        })
      }

      setDropdown({
        ...dropdown,
        employees: []
      })

      console.log("Fisto Error Status", error.request)
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
          message: "Something went wrong whilst fetching Document Types.",
          severity: "error"
        })
      }

      setCheckbox({
        documents: null
      })
    }
  }

  const fetchDepartments = async () => {
    let response
    try {
      response = await axios.get(`/api/admin/dropdown/department?all`)
      const { departments } = response.data.result

      setDropdown(currentValue => ({
        ...currentValue,
        departments
      }))
    }
    catch (error) {
      if (error.request.status !== 404) {
        setToast({
          show: true,
          title: "Error",
          message: "Something went wrong whilst fetching Departments.",
          severity: "error"
        })
      }

      setDropdown(currentValue => ({
        ...currentValue,
        departments: []
      }))

      console.log("Fisto Error Status", error.request)
    }
  }

  const formClearHandler = () => {
    setUserRaw(null)
    setIsValidating(false)
    setError({
      status: false,
      field: "",
      message: ""
    })
    setUser({
      full_id_no: String(),
      id_prefix: String(),
      id_no: String(),
      last_name: String(),
      first_name: String(),
      middle_name: String(),
      suffix_name: String(),
      department: [],
      position: String(),
      username: String(),
      role: null,
      permissions: [],
      documents: []
    })
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
          response = await axios.post(`/api/admin/users`, {
            id_prefix: user.id_prefix,
            id_no: user.id_no,
            role: user.role.name,
            first_name: user.first_name,
            middle_name: user.middle_name,
            last_name: user.last_name,
            suffix: user.suffix_name,
            department: user.department,
            position: user.position,
            username: user.username,
            permissions: user.permissions,
            document_types: user.documents
          })

          setToast({
            show: true,
            title: "Success",
            message: response.data.message
          })
          formClearHandler()
        }
        catch (error) {
          setToast({
            show: true,
            title: "Error",
            message: "Something went wrong whilst saving user account.",
            severity: "error"
          })

          console.log("Fisto Error Details: ", error.request)
        }

        setIsSaving(false)
      }
    })
  }

  const userSelectHandler = async (e, value) => {
    setUserRaw(value)
    setIsValidating(true)
    setError({
      status: false,
      field: null,
      message: null
    })

    if (value === null) {
      formClearHandler()
      return
    }

    const {
      general_info: { full_id_number, prefix_id, id_number, first_name, middle_name, last_name, suffix },
      position_info: { position_name },
      unit_info: { department_name }
    } = value

    try {
      await axios.post(`/api/users/id-validation`, {
        id_prefix: prefix_id,
        id_no: id_number.toString()
      })


      setIsValidating(false)
      setUser({
        ...user,
        full_id_no: full_id_number,
        id_prefix: prefix_id,
        id_no: id_number.toString(),
        last_name,
        first_name,
        middle_name,
        suffix_name: suffix,
        position: position_name,
        username: first_name.charAt(0).toLowerCase() + last_name.toLowerCase()
      })

      departmentChangeHandler(department_name)
    }
    catch (error) {
      setIsValidating(false)

      if (error.request.status === 409) {
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

      if (error.request.status !== 409) {
        setToast({
          show: true,
          title: "Error",
          message: "Something went wrong whilst validating employee ID.",
          severity: "error"
        })
      }
    }
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

      const department = dropdown.departments.filter((department) => department.name === value)
      setUser(currentValue => ({
        ...currentValue,
        department
      }))

      window.setTimeout(() => {
        usernameRef.current.focus()
      }, 50)
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
        setUser(currentValue => ({
          ...currentValue,
          department: [{ name: value }]
        }))
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

  const roleSelectHandler = (e, value) => {

    let permissions = []
    switch (value.id) {
      case 1: permissions = [1]
        break

      case 2: permissions = [6, 4, 20, 22]
        break

      case 3: permissions = [11, 12, 21]
        break

      case 4: permissions = [11, 12, 21]
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

  const usernameBlurHandler = async (e) => {
    setError({
      status: false,
      field: "",
      message: ""
    })

    if (e.target.value) {
      try {
        await axios.post(`/api/users/username-validation`, {
          username: e.target.value
        })
      }
      catch (error) {
        if (error.request.status === 409) {
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

        if (error.request.status !== 409) {
          setToast({
            show: true,
            title: "Error",
            message: "Something went wrong whilst validating username.",
            severity: "error"
          })
        }
      }
    }
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
      const found = user.documents.some(document => document.id === parseInt(e.target.value))

      if (!found) setUser({
        ...user,
        documents: [
          ...user.documents,
          {
            id: parseInt(e.target.value),
            categories: []
          }
        ]
      })
    }
    else {
      const documents = user.documents.filter(document => document.id !== parseInt(e.target.value))
      setUser({
        ...user,
        documents: documents
      })
    }
  }

  const categoriesCheckboxHandler = (e) => {
    const check = e.target.checked

    if (check) {
      const documents = user.documents.map(
        (document, index) => document.document_id === parseInt(e.target.getAttribute('data-document'))
          ? { ...document, categories: [...document.categories, parseInt(e.target.value)] }
          : document
      )
      setUser({
        ...user,
        documents: documents
      })
    }
    else {
      const documents = user.documents.map(
        (document, index) => document.document_id === parseInt(e.target.getAttribute('data-document'))
          ? { ...document, categories: document.categories.filter((category, index) => category !== parseInt(e.target.value)) }
          : document
      )
      setUser({
        ...user,
        documents: documents
      })
    }
  }


  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperForm-root" elevation={1}>
        <Typography variant="heading" sx={{ display: 'block', marginBottom: 3 }}>New User Account</Typography>

        <form onSubmit={formSubmitHandler}>
          <Autocomplete
            className="FstoSelectForm-root"
            size="small"
            options={dropdown.employees}
            value={userRaw}
            filterOptions={filterOptions}
            renderInput={
              props =>
                <TextField
                  {...props}
                  variant="outlined"
                  label="Employee ID No."
                  sx={{
                    textTransform: "none"
                  }}
                  error={
                    (!Boolean(dropdown.employees.length) && !isFetching) ||
                    (error.status && error.field === "id_no")
                  }
                  helperText={
                    (isValidating && "Please wait...") ||
                    (!Boolean(dropdown.employees.length) && !isFetching && "No employees found.") ||
                    (error.status && error.field === "id_no" && error.message)
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
              option => option.general_info.full_id_number
            }
            isOptionEqualToValue={
              (option, value) => option.general_info.full_id_number === value.general_info.full_id_number
            }
            onChange={userSelectHandler}
            fullWidth
            disablePortal
          />

          <TextField
            className="FstoTextfieldForm-root"
            label="Lastname"
            variant="outlined"
            autoComplete="off"
            size="small"
            value={user.last_name.toLowerCase()}
            onChange={(e) => setUser({
              ...user,
              last_name: e.target.value
            })}
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
            label="Firstname"
            variant="outlined"
            autoComplete="off"
            size="small"
            value={user.first_name.toLowerCase()}
            onChange={(e) => setUser({
              ...user,
              first_name: e.target.value
            })}
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
            label="Middlename"
            variant="outlined"
            autoComplete="off"
            size="small"
            value={user.middle_name.toLowerCase()}
            onChange={(e) => setUser({
              ...user,
              middle_name: e.target.value
            })}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            sx={{
              input: { textTransform: "capitalize" }
            }}
            disabled
            fullWidth
          />

          <Autocomplete
            className="FstoSelectForm-root"
            size="small"
            options={dropdown.departments}
            value={user.department}
            disabled={!Boolean(user.full_id_no)}
            filterOptions={filterOptions}
            renderInput={
              props =>
                <TextField
                  {...props}
                  variant="outlined"
                  label="Department"
                  error={error.status && error.field === "department"}
                  helperText={
                    error.status &&
                    error.field === "department" &&
                    <React.Fragment>
                      {error.message} <Link to="/masterlist/departments" state={{ department: user.department[0]?.name }}>Click here</Link> to register.
                    </React.Fragment>
                  }
                  sx={{
                    textTransform: "none"
                  }}
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
            onChange={(e, value) => setUser(currentValue => ({
              ...currentValue,
              department: value
            }))}
            fullWidth
            freeSolo
            multiple
            disablePortal
            disableClearable
            disableCloseOnSelect
          />

          <TextField
            className="FstoTextfieldForm-root"
            label="Position"
            variant="outlined"
            autoComplete="off"
            size="small"
            value={user.position}
            onChange={(e) => setUser({
              ...user,
              position: e.target.value
            })}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            disabled
            fullWidth
          />

          <TextField
            className="FstoTextfieldForm-root"
            label="Username"
            variant="outlined"
            autoComplete="off"
            size="small"
            value={user.username}
            disabled={!Boolean(user.full_id_no) || error.field === "department"}
            error={error.status && error.field === "username"}
            helperText={error.status && error.field === "username" && error.message}
            inputRef={usernameRef}
            onBlur={usernameBlurHandler}
            onChange={(e) => setUser({
              ...user,
              username: e.target.value
            })}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            fullWidth
          />

          <Autocomplete
            className="FstoSelectForm-root"
            size="small"
            options={dropdown.roles}
            value={user.role}
            disabled={!Boolean(user.full_id_no) || error.field === "department"}
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
              !Boolean(user.full_id_no) ||
              !Boolean(user.id_no) ||
              !Boolean(user.last_name) ||
              !Boolean(user.first_name) ||
              !Boolean(user.middle_name) ||
              !Boolean(user.department.length) ||
              !Boolean(user.position) ||
              !Boolean(user.username) ||
              !Boolean(user.role) ||
              !Boolean(user.permissions.length) ||
              ((user.permissions.includes(1) || user.permissions.includes(2)) && !Boolean(user.documents.length))
            }
            disableElevation
          >
            Save
          </LoadingButton>

          {
            userRaw
              ? <Button
                className="FstoButtonForm-root"
                variant="outlined"
                color="error"
                onClick={formClearHandler}
                disableElevation
              >
                Clear
              </Button>
              : <Button
                className="FstoButtonForm-root"
                variant="outlined"
                color="error"
                onClick={() => navigate(-1)}
                disableElevation
              >
                Back
              </Button>
          }


        </form>
      </Paper>

      {
        Boolean(user.role)
        && (
          <Box className="FstoBoxWrapper-root">
            <Paper className="FstoPaperGroup-root" elevation={1}>
              <Typography variant="permission" sx={{ marginLeft: 4, marginBottom: 4, marginTop: 2 }}>Permissions</Typography>

              {
                (user.role.id === 1 || user.role.id === 2 || user.role.id === 3 || user.role.id === 4 || user.role.id === 6 || user.role.id === 7) &&
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
                (user.role.id === 2 || user.role.id === 3 || user.role.id === 4 || user.role.id === 7) &&
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
                (user.role.id === 6 || user.role.id === 7) &&
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
                (user.role.id === 5 || user.role.id === 7) &&
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
                (user.role.id === 6 || user.role.id === 7) &&
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
                (user.role.id === 7) &&
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
              (user.permissions.includes(1) || user.permissions.includes(2))
              && (
                <Paper className="FstoPaperGroup-root" elevation={1}>
                  <Typography variant="permission" sx={{ marginLeft: 4, marginTop: 2 }}>Document Types</Typography>

                  <FormGroup row={true} sx={{ marginBottom: 2, padding: '10px 35px' }}>
                    {
                      checkbox.documents?.map((document, index) => (
                        <FormControlLabel
                          className="FstoCheckboxLabel-root"
                          key={index}
                          label={document.type}
                          sx={{ width: '50%', margin: 0 }}
                          control={
                            <Checkbox size="small" sx={{ padding: '7px' }} value={document.id} onChange={documentsCheckboxHandler} />
                          }
                          disableTypography
                        />
                      ))
                    }
                  </FormGroup>

                  {
                    checkbox.documents?.map((document, index) => (
                      Boolean(document.categories.length)
                      && (
                        user.documents.some(check => check.id === document.id)
                        && (
                          <FormControl component="fieldset" variant="standard" sx={{ marginX: 4, marginBottom: 4, border: '2px solid #dee2e6', borderRadius: '5px', textTransform: 'capitalize' }} key={index}>
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
                                      <Checkbox size="small" sx={{ padding: '7px' }} value={category.id} inputProps={{ 'data-document': document.id }} onChange={categoriesCheckboxHandler} />
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
          </Box>
        )
      }

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

export default NewUser
