import React from 'react'

import axios from 'axios'

import { Link, useNavigate, useLocation } from 'react-router-dom'

import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  InputAdornment, 
  Button, 
  IconButton, 
  TableContainer, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  TableSortLabel, 
  TablePagination,

  Menu,
  MenuItem,

  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Divider,
  Chip,

  List,
  ListItem,
  ListItemText
} from '@mui/material'

import {
  Search, 
  Close,
  Add,
  MoreHoriz as More,
  VisibilityOutlined as Visibility,
  EditOutlined as Edit,
  ArchiveOutlined as Archive,
  RestoreOutlined as Restore,

  WarningAmberRounded as Caution
} from '@mui/icons-material'

import Toast from '../../components/Toast'
import Confirm from '../../components/Confirm'
import Preloader from '../../components/Preloader'

const UserPassword = () => {

  const { 
    state
  } = useLocation()

  const [open, setOpen] = React.useState(Boolean(state) ? state.default_password : false)
  

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      disablePortal
    >
      <DialogTitle>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Password Change</Typography>
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "row", alignItems: "center", paddingX: 4 }}>
        <Caution sx={{ marginRight: 2, fontSize: "3.25em" }} />
        <Typography variant="body1">This acocunt is using the default password. It is strongly recommended that you change your password.</Typography>
      </DialogContent>

      <DialogActions>
        <Button sx={{ marginRight: 1, textTransform: "capitalize" }} onClick={() => setOpen(false)} disableElevation>Later</Button>
        <Button variant="contained" color="primary" to="change-password" component={Link} sx={{ textTransform: "capitalize" }} disableElevation>Change Password</Button>
      </DialogActions>
    </Dialog>
  )
}

const UserViewer = (props) => {

  const {
    open = true,
    data = [],
    onClose
  } = props

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disablePortal
    >
      <DialogContent>
        <Typography variant="h6" sx={{ fontWeight: 700, textTransform: "uppercase" }}>{data?.last_name}, {data?.first_name} {data?.middle_name}</Typography>
        <Typography variant="subtitle2" sx={{ marginBottom: 2 }}>{data?.role}</Typography>

        <Typography variant="subtitle2">Employee ID: {data?.id_prefix}-{data?.id_no}</Typography>
        <Typography variant="subtitle2">Position: {data?.position}</Typography>
        <Typography variant="subtitle2">Department: {data?.department}</Typography>

        <Divider variant="middle" sx={{ marginY: 3 }} />

        <Typography variant="subtitle2">Permissions:</Typography>
        <Box>
          {
            data?.permissions.map((permission, index) => (
              <Chip size="small" color="secondary" variant="outlined" key={index} label={permission.permission_name} sx={{ margin: "2px" }} />
            ))
          }
        </Box>
        
        {
          Boolean(data?.documents.length)
          && (
            <React.Fragment>
              <Divider variant="middle" sx={{ marginY: 3 }} />

              <Typography variant="subtitle2">Document Types:</Typography>
              <List dense disablePadding>
                {
                  data?.documents.map((document, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemText
                        primary={
                          <Chip size="small" color="info" variant="outlined" label={document.document_name} />
                        }
                        primaryTypographyProps={{
                          sx: { fontWeight: 500 }
                        }}
                        secondary={
                          Boolean(document.categories.length)
                          && document.categories.map(category => category.category_name).join(", ")
                        }
                        secondaryTypographyProps={{
                          sx: { marginLeft: 1, textTransform: "capitalize" }
                        }}
                      />
                    </ListItem>
                  ))
                }
              </List>
            </React.Fragment>
          )
        }
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          sx={{ textTransform: "capitalize" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const TableAction = (props) => {
  const {
    data,
    status = true,
    onView,
    onEdit,
    onArchive,
    onRestore,
    onReset
  } = props

  const [anchorEl, setAnchorEl] = React.useState(null)

  const actionOpenHandler = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const actionCloseHandler = () => {
    setAnchorEl(null)
  }

  return (
    <React.Fragment>
      <IconButton size="small" onClick={actionOpenHandler}>
        <More />
      </IconButton>

      <Menu
        open={Boolean(anchorEl)}
        elevation={2}
        disablePortal={true}
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: -75,
          vertical: 'bottom'
        }}
        MenuListProps={{
          sx: { py: "6px" }
        }}
        onClose={actionCloseHandler}
      >
        {
          status
          ? [
              <MenuItem dense key={0} onClick={() => onView(data)}><Visibility sx={{ marginRight: 1 }} />View</MenuItem>,
              <MenuItem dense key={1} onClick={() => onEdit(data)}><Edit sx={{ marginRight: 1 }} />Edit</MenuItem>,
              <MenuItem dense key={2} onClick={() => onArchive(data)}><Archive sx={{ marginRight: 1 }} />Archive</MenuItem>,
              <MenuItem dense key={3} onClick={() => onReset(data)}><Restore sx={{ marginRight: 1 }} />Reset</MenuItem>,
            ]
          : <MenuItem dense onClick={() => onRestore(data)}><Restore sx={{ marginRight: 1 }} />Restore</MenuItem>
        }
      </Menu>
    </React.Fragment>
  )
}

const UserAccounts = () => {

  const navigate = useNavigate()

  const [isFetching, setIsFetching] = React.useState(false)
  
  const [isSearching, setIsSearching] = React.useState({
    status: false,
    keyword: ""
  })
  
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

  // true = active, false = inactive
  const [mode, setMode] = React.useState(true)

  // Users Array
  const [users, setUsers] = React.useState(null)
  // User Modal Object
  const [user, setUser] = React.useState({
    show: false,
    data: null
  })
  // Pagination Object
  const [pagination, setPagination] = React.useState(null)

  React.useEffect(() => {

    if (mode) fetchUsers(true)
    else  fetchUsers(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchUsers = async (status) => {
    setIsFetching(true)

    let response
    try {
      response = await axios.get(`/api/users/${status ? 1 : 0}/${pagination ? pagination.per_page : 10}/`).then(json => json.data)
      const { data, ...paginate } = response.result

      setUsers(data)
      setPagination(paginate)
    }
    catch(error) {
      if (error.request.status !== 404) {
        setToast({
          show: true,
          title: "Error",
          message: "Something went wrong whilst fetching User Accounts.",
          severity: "error"
        })
      }

      setUsers(null)
      setPagination(null)

      console.log("Fisto Error Details: ", error.request)
    }

    setIsFetching(false)
  }

  const modeChangeHandler = () => {
    if (isFetching) return

    if (mode) {
      setMode(false)
      fetchUsers(false)
    }
    else {
      setMode(true)
      fetchUsers(true)
    }
  }

  const searchCloseHandler = () => {
    if (mode) fetchUsers(true)
    else fetchUsers(false)

    setIsSearching({
      status: false,
      keyword: ""
    })
  }

  const searchSubmitHandler = async (e) => {
    if (e.key === "Enter")
    {
      setIsFetching(true)

      let response
      try {
        if (mode) {
          response = await axios.post(`/api/users/search/1/${pagination ? pagination.per_page : 10}/`, {
            value: isSearching.keyword
          })
          .then(res => res.data)
        }
        else {
          response = await axios.post(`/api/users/search/0/${pagination ? pagination.per_page : 10}/`, {
            value: isSearching.keyword
          })
          .then(res => res.data)
        }

        const { data, ...paginate } = response.result

        setUsers(data)
        setPagination(paginate)
      }
      catch (error) {
        if (error.request.status !== 404) {
          setToast({
            show: true,
            title: "Error",
            message: "Something went wrong whilst fetching User Accounts.",
            severity: "error"
          })
        }
  
        setUsers(null)
        setPagination(null)

        console.log("Fisto Error Details: ", error.request)
      }
      
      setIsFetching(false)
    }
  }

  const pageChangeHandler = async (e, page) => {
    setIsFetching(true)

    let response
    try {
      if (mode && isSearching.status) {
        response = await axios.post(`/api/users/search/1/${pagination ? pagination.per_page : 10}?page=${++page}`, {
          value: isSearching.keyword
        })
        .then(res => res.data)
      }
      else if (!mode && isSearching.status) {
        response = await axios.post(`/api/users/search/0/${pagination ? pagination.per_page : 10}?page=${++page}`, {
          value: isSearching.keyword
        })
        .then(res => res.data)
      }
      else if (mode) {
        response = await axios.get(`api/users/1/${pagination ? pagination.per_page : 10}?page=${++page}`).then(res => res.data)
      }
      else if (!mode) {
        response = await axios.get(`api/users/0/${pagination ? pagination.per_page : 10}?page=${++page}`).then(res => res.data)
      }

      const { data, ...paginate } = response.result

      setUsers(data)
      setPagination(paginate)
    }
    catch (error) {
      if (error.request.status !== 404) {
        setToast({
          show: true,
          title: "Error",
          message: "Something went wrong whilst fetching Credit Cards.",
          severity: "error"
        })
      }

      setUsers(null)
      setPagination(null)

      console.log("Fisto Error Details: ", error.request)
    }

    setIsFetching(false)
  }

  const rowChangeHandler = async (e) => {
    setIsFetching(true)

    let response
    try {
      if (mode && isSearching.status) {
        response = await axios.post(`/api/users/search/1/${e.target.value}/`, {
          value: isSearching.keyword
        })
        .then(res => res.data)
      }
      else if (!mode && isSearching.status) {
        response = await axios.post(`/api/users/search/0/${e.target.value}/`, {
          value: isSearching.keyword
        })
        .then(res => res.data)
      }
      else if (mode) {
        response = await axios.get(`/api/users/1/${e.target.value}/`).then(res => res.data)
      }
      else if (!mode)  {
        response = await axios.get(`/api/users/0/${e.target.value}/`).then(res => res.data)
      }

      const { data, ...paginate } = response.result
      
      setUsers(data)
      setPagination(paginate)
    }
    catch (error) {
      if (error.request.status !== 404) {
        setToast({
          show: true,
          title: "Error",
          message: "Something went wrong whilst fetching Credit Cards.",
          severity: "error"
        })
      }

      setUsers(null)
      setPagination(null)

      console.log("Fisto Error Details: ", error.request)
    }

    setIsFetching(false)
  }

  const actionViewHandler = (data) => {
    setUser({
      show: true,
      data: data
    })
  }

  const actionEditHandler = ({ id }) => {
    navigate(`update-user/${id}`)
  }

  const actionArchiveHandler = ({ id }) => {
    setConfirm({
      show: true,
      loading: false,
      onConfirm: async () => {
        setConfirm({
          ...confirm,
          show: true,
          loading: true
        })

        let response
        try {
          response = await axios.post(`/api/users/archive/${id}/`).then(res => res.data)
    
          setConfirm({
            show: false,
            loading: false,
            onConfirm: () => {}
          })
          setToast({
            show: true,
            title: "Success",
            message: response.message
          })
          fetchUsers(true)
        }
        catch (error) {
          console.log("Fisto Error Details: ", error.request)
        }
      }
    })
  }

  const actionRestoreHandler = ({ id }) => {
    setConfirm({
      show: true,
      loading: false,
      onConfirm: async () => {
        setConfirm({
          ...confirm,
          show: true,
          loading: true
        })

        let response
        try {
          response = await axios.post(`/api/users/restore/${id}/`).then(res => res.data)
          
          setConfirm({
            ...confirm,
            loading: false
          })
          setToast({
            show: true,
            title: "Success",
            message: response.message
          })
          fetchUsers(false)
        }
        catch (error) {
          console.log("Fisto Error Details: ", error.request)
        }
      }
    })
  }

  const actionResetHandler = ({ id }) => {
    setConfirm({
      show: true,
      loading: false,
      onConfirm: async () => {
        setConfirm({
          ...confirm,
          show: true,
          loading: true
        })

        let response
        try {
          response = await axios.post(`/api/users/reset/${id}/`).then(res => res.data)
          
          setConfirm({
            ...confirm,
            loading: false
          })
          setToast({
            show: true,
            title: "Success",
            message: response.message
          })
        }
        catch (error) {
          console.log("Fisto Error Details: ", error.request)
        }
      }
    })
  }

  const TableData = ({ data }) => {
    return (
      <TableRow hover>
        <TableCell className="FstoTableData-root" align="center">
          {data.id}
        </TableCell>
        
        <TableCell className="FstoTableData-root">
          {data.username}
        </TableCell>
        
        <TableCell className="FstoTableData-root" sx={{ textTransform: "uppercase" }}>
          {data.last_name}, {data.first_name} {data.middle_name.charAt(0)}.
        </TableCell>
        
        <TableCell className="FstoTableData-root" sx={{ textTransform: "capitalize" }}>
          {data.role}
        </TableCell>
        
        <TableCell className="FstoTableData-root" sx={{ textTransform: "capitalize" }}>
          {data.department}
        </TableCell>
        
        <TableCell className="FstoTableData-root">
          {
            Boolean(data.deleted_at)
            ? "Inactive"
            : "Active"
          }
        </TableCell>
        
        <TableCell className="FstoTableData-root">
          {
            new Date(data.updated_at).toLocaleString("default", {
              month: "long",
              day: "numeric",
              year: "numeric"
            })
          }
        </TableCell>
        
        <TableCell align="center">
          <TableAction
            data={data}
            status={mode}
            onView={actionViewHandler}
            onEdit={actionEditHandler}
            onArchive={actionArchiveHandler}
            onRestore={actionRestoreHandler}
            onReset={actionResetHandler}
          />
        </TableCell>
      </TableRow>
    )
  }

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperTable-root" elevation={1}>
        <Box className="FstoBoxToolbar-root">
          <Box className="FstoBoxToolbar-left">
            <Typography variant="heading">User Accounts</Typography>

            <Button
              className="FstoButtonNew-root"
              variant="contained"
              component={Link}
              startIcon={<Add />}
              to="new-user"
              disableElevation
            >
              New
            </Button>
          </Box>

          <Box className="FstoBoxToolbar-right">
            <Button
              className="FstoButtonMode-root"
              variant="text"
              size="small"
              onClick={modeChangeHandler}
              sx={{
                color:
                  mode
                  ? "#ef5350"
                  : "#4caf50"
              }}
            >
              {
                mode
                ? "View Archived"
                : "View Active"
              }
            </Button>

            <TextField
              variant="outlined"
              size="small"
              autoComplete="off"
              placeholder="Search"
              value={isSearching.keyword}
              InputProps={{
                className: "FstoTextfieldSearch-root",
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      size="small"
                      disabled={!isSearching.status}
                      onClick={searchCloseHandler}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              onChange={(e) => setIsSearching({
                status: true,
                keyword: e.target.value
              })}
              onKeyPress={searchSubmitHandler}
            />
          </Box>
        </Box>
        
        <TableContainer className="FstoTableContainer-root">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell className="FstoTableHead-root" align="center">
                  <TableSortLabel active={true}>ID NO.</TableSortLabel>
                </TableCell>
                
                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={true}>USERNAME</TableSortLabel>
                </TableCell>
                
                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={true}>FULLNAME</TableSortLabel>
                </TableCell>
                
                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={true}>ROLE</TableSortLabel>
                </TableCell>
                
                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={true}>DEPARTMENT</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">STATUS</TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={true}>LAST MODIFIED</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root" align="center">ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              {
                isFetching
                ? <Preloader row={5} col={8} />
                : users
                  ? users.map((data, index) => <TableData key={index} data={data} />)
                  : (
                      <TableRow>
                        <TableCell align="center" colSpan={8}>NO RECORDS FOUND</TableCell>
                      </TableRow>
                    )
              }
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={pagination ? pagination.total : 0}
          page={pagination ? pagination.current_page - 1 : 0}
          rowsPerPage={pagination ? pagination.per_page : 10}
          onPageChange={pageChangeHandler}
          onRowsPerPageChange={rowChangeHandler}
          rowsPerPageOptions={[10,20,50,100]}
        />

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

        <UserViewer
          open={user.show}
          data={user.data}
          onClose={() => setUser({
            ...user,
            show: false
          })}
        />

        <UserPassword />
      </Paper>
    </Box>
  )
}

export default UserAccounts
