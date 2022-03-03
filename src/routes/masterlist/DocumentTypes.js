import React from 'react'

import axios from 'axios'

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
  Autocomplete,
  Popover,
  List,
  ListItem
} from '@mui/material'

import { 
  Search, 
  Close,
  MoreRounded
} from '@mui/icons-material'

import { LoadingButton } from '@mui/lab'

import Toast from '../../components/Toast'
import Confirm from '../../components/Confirm'
import ActionMenu from '../../components/ActionMenu'
import Preloader from '../../components/Preloader'

const ShowMore = ({data}) => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  return (
    Boolean(data.length)
    && (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, textTransform: 'capitalize' }}>
        {
          data.slice(0,2).map(category => category.category_name).join(', ')
        }
        {
          data.length > 2
          && (
            <React.Fragment>
              <MoreRounded sx={{ color: 'rgba(0,0,0,0.35)', fontSize: '1.55em', cursor: 'pointer', '&:hover': { color: 'rgba(0,0,0,0.65)' } }} onClick={(e) => setAnchorEl(e.currentTarget)} />
              <Popover
                open={Boolean(anchorEl)}
                elevation={2}
                anchorEl={anchorEl}
                disablePortal={true}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                  horizontal: "left",
                  vertical: "bottom"
                }}
                PaperProps={{
                  sx: {
                    maxWidth: 260,
                    maxHeight: 210
                  }
                }}
              >
                <List dense disablePadding>
                  {
                    data.slice(2,data.length).map((category, index) => (
                      <ListItem dense key={index}>
                        {category.category_name}
                      </ListItem>
                    ))
                  }
                </List>
              </Popover>
            </React.Fragment>
          )
        }
      </Box>
    )
  )
}

const DocumentTypes = () => {

  const [isSaving, setIsSaving] = React.useState(false)
  const [isFetching, setIsFetching] = React.useState(true)
  const [isSearching, setIsSearching] = React.useState({
    status: false,
    keyword: ""
  })
  const [isUpdating, setIsUpdating] = React.useState({
    status: false,
    data: ""
  })

  const [error, setError] = React.useState({
    status: false,
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
    onConfirm: () => {}
  })

  // true = active, false = inactive
  const [mode, setMode] = React.useState(true)

  // Dropdown Array
  const [dropdown, setDropdown] = React.useState({
    isFetching: false,
    categories: []
  })
  // Document Types Array
  const [documents, setDocuments] = React.useState(null)
  // Pagination Object
  const [pagination, setPagination] = React.useState(null)

  
  // Form Data State
  const [document, setDocument] = React.useState({
    type: "",
    description: "",
    categories: []
  })

  React.useEffect(() => {

    if (mode) fetchDocumentTypes(true)
    else  fetchDocumentTypes(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {

    fetchDocumentCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchDocumentTypes = async (status) => {
    setIsFetching(true)

    let response
    try {
      response = await axios.get(`/api/documents/${status ? 1 : 0}/${pagination ? pagination.per_page : 10}/`).then(res => res.data)
      const { data, ...paginate } = response.result

      setDocuments(data)
      setPagination(paginate)
    }
    catch(error) {
      if (error.request.status !== 404) {
        setToast({
          show: true,
          title: "Error",
          message: "Something went wrong whilst fetching Document Types.",
          severity: "error"
        })
      }

      setDocuments(null)
      setPagination(null)

      console.log("Fisto Error Details: ", error.request)
    }

    setIsFetching(false)
  }

  const fetchDocumentCategories = async () => {
    setDropdown({
      ...dropdown,
      isFetching: true
    })
    let response
    try {
      response = await axios.get(`/api/documents/dropdown/1/`).then(res => res.data)
      const { categories } = response.result

      setDropdown({
        isFetching: false,
        categories: categories.length ? categories : []
      })
    }
    catch(error) {
      if (error.request.status !== 404) {
        setToast({
          show: true,
          title: "Error",
          message: "Something went wrong whilst fetching Categories.",
          severity: "error"
        })
      }

      setDropdown({
        isFetching: false,
        categories: []
      })

      console.log("Fisto Error Status", error.request)
    }
  }

  const modeChangeHandler = () => {
    if (isFetching) return

    if (mode) {
      setMode(false)
      fetchDocumentTypes(false)
    }
    else {
      setMode(true)
      fetchDocumentTypes(true)
    }
  }

  const searchCloseHandler = () => {
    if (mode) fetchDocumentTypes(true)
    else  fetchDocumentTypes(false)

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
          response = await axios.post(`/api/documents/search/1/${pagination ? pagination.per_page : 10}/`, {
            value: isSearching.keyword
          })
          .then(res => res.data)
        }
        else {
          response = await axios.post(`/api/documents/search/0/${pagination ? pagination.per_page : 10}/`, {
            value: isSearching.keyword
          })
          .then(res => res.data)
        }

        const { data, ...paginate } = response.result

        setDocuments(data)
        setPagination(paginate)
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

        setDocuments(null)
        setPagination(null)

        console.log("Fisto Error Details: ", error.request)
      }
      
      setIsFetching(false)
    }
  }

  const formClearHandler = () => {
    setIsUpdating({
      status: false,
      data: ""
    })
    setError({
      status: false,
      message: ""
    })
    setDocument({
      type: String(),
      description: String(),
      categories: []
    })
  }

  const formSubmitHandler = (event) => {
    event.preventDefault()

    setConfirm({
      show: true,
      loading: false,
      onConfirm: async () => {
        setConfirm({
          show: false,
          loading: false,
          onConfirm: () => {}
        })
        setIsSaving(true)

        let response
        try {
          if (isUpdating.status) {
            response = await axios.put(`/api/documents/${isUpdating.data}/`, {
              type: document.type,
              description: document.description,
              categories: document.categories.map(data => data.category_id)
            }).then(res => res.data)
          }
          else {
            response = await axios.post(`/api/documents/`, {
              type: document.type,
              description: document.description,
              categories: document.categories.map(data => data.category_id)
            }).then(res => res.data)
          }

          setToast({
            show: true,
            title: "Success",
            message: response.message
          })
          setIsUpdating({
            status: false,
            data: ""
          })
          setDocument({
            type: String(),
            description: String(),
            categories: []
          })

          fetchDocumentTypes(true)
        }
        catch (error) {
          const { status } = error.request

          if (status === 409) {
            const { data } = error.response

            setError({
              status: true,
              message: data.message
            })
          }
          else {
            setToast({
              show: true,
              title: "Error",
              message: "Something went wrong whilst creating Document Type.",
              severity: "error"
            })
          }
        }

        setIsSaving(false)
      }
    })
  }

  const pageChangeHandler = async (e, page) => {
    setIsFetching(true)

    let response
    try {
      if (mode && isSearching.status) {
        response = await axios.post(`/api/documents/search/1/${pagination ? pagination.per_page : 10}?page=${++page}`, {
          value: isSearching.keyword
        })
        .then(res => res.data)
      }
      else if (!mode && isSearching.status) {
        response = await axios.post(`/api/documents/search/0/${pagination ? pagination.per_page : 10}?page=${++page}`, {
          value: isSearching.keyword
        })
        .then(res => res.data)
      }
      else if (mode) {
        response = await axios.get(`api/documents/1/${pagination ? pagination.per_page : 10}?page=${++page}`).then(res => res.data)
      }
      else if (!mode) {
        response = await axios.get(`api/documents/0/${pagination ? pagination.per_page : 10}?page=${++page}`).then(res => res.data)
      }

      const { data, ...paginate } = response.result

      setDocuments(data)
      setPagination(paginate)
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

      setDocuments(null)
      setPagination(null)
      
      console.log("Fisto Error Details: ", error.request)
    }

    setIsFetching(false)
  }

  const rowChangeHandler = async (event) => {
    setIsFetching(true)

    let response
    try {
      if (mode && isSearching.status) {
        response = await axios.post(`/api/documents/search/1/${event.target.value}/`, {
          value: isSearching.keyword
        })
        .then(res => res.data)
      }
      else if (!mode && isSearching.status) {
        response = await axios.post(`/api/documents/search/0/${event.target.value}/`, {
          value: isSearching.keyword
        })
        .then(res => res.data)
      }
      else if (mode) {
        response = await axios.get(`/api/documents/1/${event.target.value}/`).then(res => res.data)
      }
      else if (!mode)  {
        response = await axios.get(`/api/documents/0/${event.target.value}/`).then(res => res.data)
      }

      const { data, ...paginate } = response.result

      setDocuments(data)
      setPagination(paginate)
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

      setDocuments(null)
      setPagination(null)
      
      console.log("Fisto Error Details: ", error.request)
    }
    
    setIsFetching(false)
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
          response = await axios.post(`/api/documents/archive/${id}/`).then(res => res.data)
    
          setConfirm({
            ...confirm,
            loading: false,
          })
          setToast({
            show: true,
            title: "Success",
            message: response.message
          })

          fetchDocumentTypes(true)
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
          response = await axios.post(`/api/documents/restore/${id}/`).then(res => res.data)
    
          setConfirm({
            ...confirm,
            loading: false
          })
          setToast({
            show: true,
            title: "Success",
            message: response.message
          })

          fetchDocumentTypes(false)
        }
        catch (error) {
          console.log("Fisto Error Details: ", error.request)
        }
      }
    })
  }

  const actionUpdateHandler = (data) => {
    const { id, type, description, categories } = data

    setIsUpdating({
      status: true,
      data: id
    })
    setDocument({
      type,
      description,
      categories
    })

    window.scrollTo(0, 0)
  }

  const TableData = ({ document }) => {
    return (
      <TableRow>
        <TableCell className="FstoTableData-root" align="center">
          {document.id}
        </TableCell>

        <TableCell className="FstoTableData-root">
          {document.type}
        </TableCell>

        <TableCell className="FstoTableData-root">
          {document.description}
        </TableCell>

        <TableCell className="FstoTableData-root">
          <ShowMore data={document.categories} />
        </TableCell>

        <TableCell className="FstoTableData-root">
          {
            Boolean(document.deleted_at)
            ? "Inactive"
            : "Active"
          }
        </TableCell>

        <TableCell className="FstoTableData-root">
          {
            new Date(document.updated_at).toLocaleString("default", {
              month: "long",
              day: "numeric",
              year: "numeric"
            })
          }
        </TableCell>

        <TableCell align="center">
          <ActionMenu
            data={document}
            view={mode}
            onEdit={actionUpdateHandler}
            onArchive={actionArchiveHandler}
            onRestore={actionRestoreHandler}
          />
        </TableCell>
    </TableRow>
    )
  }

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperForm-root" elevation={1}>
        <form onSubmit={formSubmitHandler}>
          <TextField
            className="FstoTextfieldForm-root"
            label="Document Type"
            size="small"
            variant="outlined"
            autoComplete="off"
            value={document.type}
            error={error.status}
            helperText={error.status && error.message}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            onBlur={() => setError({
              status: false,
              message: ""
            })}
            onChange={(e) => setDocument({
              ...document,
              type: e.target.value
            })}
            fullWidth
          />
          
          <TextField
            className="FstoTextfieldForm-root"
            label="Description"
            size="small"
            variant="outlined"
            autoComplete="off"
            value={document.description}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            onChange={(e) => setDocument({
              ...document,
              description: e.target.value
            })}
            fullWidth
          />

          <Autocomplete
            fullWidth
            multiple
            disablePortal
            disableCloseOnSelect
            className="FstoSelectForm-root"
            size="small"
            options={dropdown.categories}
            value={document.categories}
            renderInput={
              props =>
                <TextField
                  {...props}
                  variant="outlined"
                  label="Category (Optional)"
                  error={!Boolean(dropdown.categories.length) && !dropdown.isFetching}
                  helperText={!Boolean(dropdown.categories.length) && !dropdown.isFetching && "No categories found."}
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
              option => option.category_name
            }
            isOptionEqualToValue={
              (option, value) => option.category_id === value.category_id
            }
            onChange={
              (e, value) => {
                setDocument({
                  ...document,
                  categories: value
                })
              }
            }

          />
          
          <LoadingButton
            className="FstoButtonForm-root"
            type="submit"
            variant="contained"
            loadingPosition="start"
            loading={isSaving}
            startIcon={<></>}
            disableElevation
            disabled={
              !Boolean(document.type) ||
              !Boolean(document.description)
            }
          >
            {
              isUpdating.status
              ? "Update"
              : "Save"
            }
          </LoadingButton>

          <Button
            className="FstoButtonForm-root"
            variant="outlined"
            color="error"
            onClick={formClearHandler}
            disableElevation
          >
            {
              isUpdating.status
              ? "Cancel"
              : "Clear"
            }
          </Button>
        </form>
      </Paper>

      <Paper className="FstoPaperTable-root" elevation={1}>
        <Box className="FstoBoxToolbar-root">
          <Box className="FstoBoxToolbar-left">
            <Typography variant="heading">Document Types</Typography>
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
                sx: ({
                  borderRadius: 10
                }),
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" size="small" onClick={searchCloseHandler} disabled={!isSearching.status}>
                      <Close fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              onChange={(event) => {
                setIsSearching({
                  status: true,
                  keyword: event.target.value
                })
              }}
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
                  <TableSortLabel active={true}>DOCUMENT TYPE</TableSortLabel>
                </TableCell>
                
                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={true}>DESCRIPTION</TableSortLabel>
                </TableCell>
                
                <TableCell className="FstoTableHead-root">CATEGORIES</TableCell>
                
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
                ? <Preloader row={5} col={7} />
                : (
                  documents
                  ? documents.map((document, index) => <TableData key={index} document={document} />)
                  : <TableRow><TableCell align="center" colSpan={7}>NO RECORDS FOUND</TableCell></TableRow>
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
      </Paper>
    </Box>
  )
}

export default DocumentTypes
