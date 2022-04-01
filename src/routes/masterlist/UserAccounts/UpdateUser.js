import React from 'react'

import axios from 'axios'

import { Link, useParams } from 'react-router-dom'

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

import Toast from '../../../components/Toast'
import Confirm from '../../../components/Confirm'

const UpdateUser = () => {

  const { id } = useParams()

  const [isSaving, setIsSaving] = React.useState(false)
  // eslint-disable-next-line
  const [isFetching, setIsFetching] = React.useState(false)
  // eslint-disable-next-line
  const [isValidating, setIsValidating] = React.useState(false)

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
    AP: [
      {
        id: 1,
        name: "Tagging of Request"
      },
      {
        id: 4,
        name: "Received Receipt Report"
      },
      {
        id: 5,
        name: "Edited Tag Approval"
      },
      {
        id: 6,
        name: "Releasing of Cheque"
      },
      {
        id: 9,
        name: "Tagged Document Reports"
      },
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
      {
        id: 10,
        name: "Cheque Reports"
      }
    ],
    confidential: [
      {
        id: 2,
        name: "Tagging of Confidential Request"
      },
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
        id: 101,
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
        name: "Treasury Custodian"
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
          setToast({
            show: true,
            title: "Error",
            message: "Something went wrong whilst creating user account.",
            severity: "error"
          })

          console.log("Fisto Error Details: ", error.request)
        }

        setIsSaving(false)
      }
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
          <Autocomplete
            className="FstoSelectForm-root"
            size="small"
            options={[]}
            value={{
              label: user.full_id_no
            }}
            renderInput={
              props =>
                <TextField
                  {...props}
                  variant="outlined"
                  label="Employee ID No."
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
            fullWidth
            disabled
            disablePortal
          />

          <TextField
            className="FstoTextfieldForm-root"
            label="Lastname"
            variant="outlined"
            autoComplete="off"
            size="small"
            value={user.last_name.toLowerCase()}
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
            label="Department"
            variant="outlined"
            autoComplete="off"
            size="small"
            value={user.department}
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
            onChange={
              (e, value) => {
                setUser({
                  ...user,
                  role: value
                })
              }
            }
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
            to="/dashboard"
            component={Link}
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

      <Box className="FstoBoxWrapper-root">
        <Paper className="FstoPaperGroup-root" elevation={1}>
          <Typography variant="permission" sx={{ marginLeft: 4, marginBottom: 4, marginTop: 2 }}>Permissions</Typography>

          <FormControl component="fieldset" variant="standard" sx={{ marginX: 4, marginBottom: 4, border: '2px solid #dee2e6', borderRadius: '5px' }} disabled={isFetching}>
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
                      <Checkbox size="small" sx={{ padding: '7px' }} value={perm.id} onChange={permissionsCheckboxHandler} checked={user.permissions.includes(perm.id)} />
                    }
                    disableTypography
                  />
                ))
              }
            </FormGroup>
          </FormControl>

          <FormControl component="fieldset" variant="standard" sx={{ marginX: 4, marginBottom: 4, border: '2px solid #dee2e6', borderRadius: '5px' }} disabled={isFetching}>
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
                      <Checkbox size="small" sx={{ padding: '7px' }} value={perm.id} onChange={permissionsCheckboxHandler} checked={user.permissions.includes(perm.id)} />
                    }
                    disableTypography
                  />
                ))
              }
            </FormGroup>
          </FormControl>

          <FormControl component="fieldset" variant="standard" sx={{ marginX: 4, marginBottom: 4, border: '2px solid #dee2e6', borderRadius: '5px' }} disabled={isFetching}>
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
                      <Checkbox size="small" sx={{ padding: '7px' }} value={perm.id} onChange={permissionsCheckboxHandler} checked={user.permissions.includes(perm.id)} />
                    }
                    disableTypography
                  />
                ))
              }
            </FormGroup>
          </FormControl>

          <FormControl component="fieldset" variant="standard" sx={{ marginX: 4, marginBottom: 4, border: '2px solid #dee2e6', borderRadius: '5px' }} disabled={isFetching}>
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
                      <Checkbox size="small" sx={{ padding: '7px' }} value={perm.id} onChange={permissionsCheckboxHandler} checked={user.permissions.includes(perm.id)} />
                    }
                    disableTypography
                  />
                ))
              }
            </FormGroup>
          </FormControl>

          <FormControl component="fieldset" variant="standard" sx={{ marginX: 4, marginBottom: 4, border: '2px solid #dee2e6', borderRadius: '5px' }} disabled={isFetching}>
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
                      <Checkbox size="small" sx={{ padding: '7px' }} value={perm.id} onChange={permissionsCheckboxHandler} checked={user.permissions.includes(perm.id)} />
                    }
                    disableTypography
                  />
                ))
              }
            </FormGroup>
          </FormControl>
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
      </Box>

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