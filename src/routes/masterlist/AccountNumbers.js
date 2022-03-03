import React from 'react'

import axios from 'axios'

import * as XLSX from 'xlsx'

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
  Dialog
} from '@mui/material'

import { 
  Search, 
  Close, 
  Error, 
  UploadFile
} from '@mui/icons-material'

import { LoadingButton } from '@mui/lab'

import { createFilterOptions } from '@mui/material/Autocomplete';

import Toast from '../../components/Toast'
import Confirm from '../../components/Confirm'
import Preloader from '../../components/Preloader'
import ActionMenu from '../../components/ActionMenu'

const AccountNumbers = () => {

  const [isSaving, setIsSaving] = React.useState(false)
  const [isFetching, setIsFetching] = React.useState(false)
  // eslint-disable-next-line
  const [isImporting, setIsImporting] = React.useState(false)
  
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

  const [dialog, setDialog] = React.useState({
    show: false,
    data: []
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
    locations: [],
    categories: [],
    suppliers: []
  })
  // Account Numbers Array
  const [accountNumbers, setAccountNumbers] = React.useState(null)
  // Pagination Object
  const [pagination, setPagination] = React.useState(null)


  // Form Data State
  const [accountNumber, setAccountNumber] = React.useState({
    number: "",
    location: null,
    category: null,
    supplier: null
  })

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    limit: 100
  });

  React.useEffect(() => {

    if (mode) fetchAccountNumbers(true)
    else  fetchAccountNumbers(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {

    fetchAccountNumbersDropdown()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchAccountNumbers = async (status) => {
    setIsFetching(true)

    let response
    try {
      response = await axios.get(`/api/account-number/${status ? 1 : 0}/${pagination ? pagination.per_page : 10}/`).then(json => json.data)
      const { data, ...paginate } = response.result

      setAccountNumbers(data)
      setPagination(paginate)
    }
    catch(error) {
      if (error.request.status !== 404) {
        setToast({
          show: true,
          title: "Error",
          message: "Something went wrong whilst fetching account mumbers.",
          severity: "error"
        })
      }

      setAccountNumbers(null)
      setPagination(null)

      console.log("Fisto Error Details: ", error.request)
    }

    setIsFetching(false)
  }

  const fetchAccountNumbersDropdown = async () => {
    setDropdown({
      ...dropdown,
      isFetching: true
    })
    let response
    try {
      response = await axios.get(`/api/account-number/dropdown/1`).then(json => json.data)
      const { locations, categories, suppliers } = response.result

      setDropdown({
        isFetching: false,
        locations: locations.length ? locations : null,
        categories: categories.length ? categories : null,
        suppliers: suppliers.length ? suppliers : null
      })
    }
    catch(error) {
      if (error.request.status !== 404) {
        setToast({
          show: true,
          title: "Error",
          message: "Something went wrong whilst fetching account numbers dropdown.",
          severity: "error"
        })
      }

      setDropdown({
        isFetching: false,
        locations: [],
        categories: [],
        suppliers: []
      })

      console.log("Fisto Error Details: ", error.request)
    }
  }

  const modeChangeHandler = () => {
    if (isFetching) return

    if (mode) {
      setMode(false)
      fetchAccountNumbers(false)
    }
    else {
      setMode(true)
      fetchAccountNumbers(true)
    }
  }

  const importChangeHandler = (e) => {
    setIsImporting(true)

    const file = e.target.files[0]

    if (file) {
      const types = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]

      if (types.includes(file.type)) {
        const reader = new FileReader()

        reader.readAsArrayBuffer(file)
        reader.onload = async (r) => {
          const excelFile = r.target.result

          const workbook = XLSX.read(excelFile, { type: 'buffer' })
          const sheetname = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetname]

          const data = XLSX.utils.sheet_to_json(worksheet, {raw: false, defval: ""})

          if (Boolean(data.length)) {
            data.forEach((row) => {
              Object.keys(row).forEach((key) => {
                let newKey = key.trim().toLowerCase().replace(/ /g,"_")
                if (key !== newKey) {
                  row[newKey] = row[key]
                  delete row[key]
                }
              })
            })

            let response
            try {
              response = await axios.post(`/api/account-number/import`, data).then(res => res.data)

              setToast({
                show: true,
                title: "Success",
                message: response.message
              })

              fetchAccountNumbers(true)
            }
            catch (error) {
              const { status, data } = error.response

              if (status === 409) {
                setDialog({
                  show: true,
                  data: data
                })
              }
              else if(status === 406) {
                setToast({
                  show: true,
                  title: "Error",
                  message: data.message,
                  severity: "error"
                })
              }
              else {
                setToast({
                  show: true,
                  title: "Error",
                  message: "Something went wrong whilst importing account number masterlist.",
                  severity: "error"
                })
              }
            }
          }
          else {
            setToast({
              show: true,
              title: "Error",
              message: "The excel file is empty.",
              severity: "error"
            })
          }
          setIsImporting(false)
        }
      }
      else {
        setToast({
          show: true,
          title: "Error",
          message: "Please select only excel file types.",
          severity: "error"
        })
        setIsImporting(false)
      }
    }

    // reset the import button
    e.target.value = null
  }

  const searchCloseHandler = () => {
    if (mode) fetchAccountNumbers(true)
    else fetchAccountNumbers(false)

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
          response = await axios.post(`/api/account-number/search/1/${pagination ? pagination.per_page : 10}/`, {
            value: isSearching.keyword
          })
          .then(res => res.data)
        }
        else {
          response = await axios.post(`/api/account-number/search/0/${pagination ? pagination.per_page : 10}/`, {
            value: isSearching.keyword
          })
          .then(res => res.data)
        }

        const { data, ...paginate } = response.result

        setAccountNumbers(data)
        setPagination(paginate)
      }
      catch (error) {
        if (error.request.status !== 404) {
          setToast({
            show: true,
            title: "Error",
            message: "Something went wrong whilst fetching account mumbers.",
            severity: "error"
          })
        }
  
        setAccountNumbers(null)
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
    setAccountNumber({
      number: String(),
      location: null,
      category: null,
      supplier: null
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
          onConfirm: () => {}
        })
        setIsSaving(true)

        let response
        try {
          if (isUpdating.status) {
            response = await axios.put(`/api/account-number/${isUpdating.data}/`, {
              account_no: accountNumber.number,
              location_id: accountNumber.location.location_id,
              category_id: accountNumber.category.category_id,
              supplier_id: accountNumber.supplier.supplier_id
            })
            .then(res => res.data)
          }
          else {
            response = await axios.post(`/api/account-number/`, {
              account_no: accountNumber.number,
              location_id: accountNumber.location.location_id,
              category_id: accountNumber.category.category_id,
              supplier_id: accountNumber.supplier.supplier_id
            })
            .then(res => res.data)
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
          setAccountNumber({
            number: String(),
            location: null,
            category: null,
            supplier: null
          })

          fetchAccountNumbers(true)
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
          else
            setToast({
              show: true,
              title: "Error",
              message: "Something went wrong whilst saving account number.",
              severity: "error"
            })
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
        response = await axios.post(`/api/account-number/search/1/${pagination ? pagination.per_page : 10}?page=${++page}`, {
          value: isSearching.keyword
        })
        .then(res => res.data)
      }
      else if (!mode && isSearching.status) {
        response = await axios.post(`/api/account-number/search/0/${pagination ? pagination.per_page : 10}?page=${++page}`, {
          value: isSearching.keyword
        })
        .then(res => res.data)
      }
      else if (mode) {
        response = await axios.get(`api/account-number/1/${pagination ? pagination.per_page : 10}?page=${++page}`).then(res => res.data)
      }
      else if (!mode) {
        response = await axios.get(`api/account-number/0/${pagination ? pagination.per_page : 10}?page=${++page}`).then(res => res.data)
      }

      const { data, ...paginate } = response.result

      setAccountNumbers(data)
      setPagination(paginate)
    }
    catch (error) {
      if (error.request.status !== 404) {
        setToast({
          show: true,
          title: "Error",
          message: "Something went wrong whilst fetching account mumbers.",
          severity: "error"
        })
      }

      setAccountNumbers(null)
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
        response = await axios.post(`/api/account-number/search/1/${e.target.value}/`, {
          value: isSearching.keyword
        })
        .then(res => res.data)
      }
      else if (!mode && isSearching.status) {
        response = await axios.post(`/api/account-number/search/0/${e.target.value}/`, {
          value: isSearching.keyword
        })
        .then(res => res.data)
      }
      else if (mode) {
        response = await axios.get(`/api/account-number/1/${e.target.value}/`).then(res => res.data)
      }
      else if (!mode)  {
        response = await axios.get(`/api/account-number/0/${e.target.value}/`).then(res => res.data)
      }

      const { data, ...paginate } = response.result
      
      setAccountNumbers(data)
      setPagination(paginate)
    }
    catch (error) {
      if (error.request.status !== 404) {
        setToast({
          show: true,
          title: "Error",
          message: "Something went wrong whilst fetching account mumbers.",
          severity: "error"
        })
      }

      setAccountNumbers(null)
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
          response = await axios.post(`/api/account-number/archive/${id}/`).then(res => res.data)
    
          setConfirm({
            ...confirm,
            loading: false,
          })
          setToast({
            show: true,
            title: "Success",
            message: response.message
          })
          fetchAccountNumbers(true)
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
          response = await axios.post(`/api/account-number/restore/${id}/`).then(res => res.data)
          
          setConfirm({
            ...confirm,
            loading: false
          })
          setToast({
            show: true,
            title: "Success",
            message: response.message
          })
          fetchAccountNumbers(false)
        }
        catch (error) {
          console.log("Fisto Error Details: ", error.request)
        }
      }
    })
  }

  const actionUpdateHandler = (data) => {
    const { id, account_no, location_id, category_id, supplier_id } = data

    setIsUpdating({
      status: true,
      data: id
    })
    setAccountNumber({
      number: account_no,
      location: dropdown.locations.find( location => location.location_id === location_id ),
      category: dropdown.categories.find( category => category.category_id === category_id ),
      supplier: dropdown.suppliers.find( supplier => supplier.supplier_id === supplier_id )
    })

    window.scrollTo(0, 0)
  }

  const TableData = ({ data }) => {
    return (
      <TableRow>
        <TableCell className="FstoTableData-root" align="center">
          {data.id}
        </TableCell>
        
        <TableCell className="FstoTableData-root">
          {data.account_no}
        </TableCell>
        
        <TableCell className="FstoTableData-root" sx={{ textTransform: "capitalize" }}>
          {data.category_name}
        </TableCell>
        
        <TableCell className="FstoTableData-root">
          {data.supplier_name}
        </TableCell>
        
        <TableCell className="FstoTableData-root">
          {data.location_name}
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
          <ActionMenu
            data={data}
            view={mode}
            onEdit={actionUpdateHandler}
            onArchive={actionArchiveHandler}
            onRestore={actionRestoreHandler}
          />
        </TableCell>
      </TableRow>
    )
  }

  const TableDialog = ({ open, data }) => {
    return (
      <Dialog
        open={open}
        maxWidth="sm"
        fullWidth={true}
        disablePortal={true}
        PaperProps={{
          className: "FstoPaperImport-root"
        }}
      >
        <Typography className="FstoPaperImport-title" variant="h5" color="error"><Error sx={{ fontSize: 38, marginRight: 1 }} /> {data.message}</Typography>
        <TableContainer>
          <Table size="small" stickyHeader={true}>
            <TableHead>
              <TableRow>
                <TableCell>Error</TableCell>
                <TableCell>Row</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              {
                data.result?.map((error, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ color: "#D32F2F", fontWeight: 500, textTransform: "capitalize" }}>{error.error_type}</TableCell>
                    <TableCell>{error.line}</TableCell>
                    <TableCell>{error.description}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 3, paddingY: 1 }}>
          <Button
            variant="text"
            color="error"
            sx={{ marginRight: 2, textTransform: "capitalize" }}
            onClick={() => setDialog({
              ...dialog,
              show: false
            })}
            disableElevation
          >
            Close
          </Button>
        </Box>
      </Dialog>
    )
  }

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperForm-root" elevation={1}>
        <form onSubmit={formSubmitHandler}>
          <TextField
            className="FstoTextfieldForm-root"
            label="Account Number"
            variant="outlined"
            autoComplete="off"
            size="small"
            value={accountNumber.number}
            helperText={error.status && error.message}
            error={error.status}
            onBlur={() => setError({
              status: false,
              message: ""
            })}
            onChange={(e) => setAccountNumber({
              ...accountNumber,
              number: e.target.value
            })}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            fullWidth
          />

          <Autocomplete
            fullWidth
            disablePortal
            size="small"
            options={dropdown.locations}
            value={accountNumber.location}
            filterOptions={filterOptions}
            renderInput={
              props =>
                <TextField
                  {...props}
                  className="FstoTextfieldForm-root"
                  variant="outlined"
                  label="Location"
                  error={!Boolean(dropdown.locations.length) && !dropdown.isFetching}
                  helperText={!Boolean(dropdown.locations.length) && !dropdown.isFetching && "No locations found."}
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
              (option, value) => option.location_id === value.location_id
            }
            onChange={
              (e, value) => {
                setAccountNumber({
                  ...accountNumber,
                  location: value
                })
              }
            }
          />

          <Autocomplete
            fullWidth
            disablePortal
            className="FstoSelectForm-root"
            size="small"
            options={dropdown.categories}
            value={accountNumber.category}
            filterOptions={filterOptions}
            renderInput={
              props =>
                <TextField
                  {...props}
                  variant="outlined"
                  label="Type"
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
                setAccountNumber({
                  ...accountNumber,
                  category: value
                })
              }
            }
          />

          <Autocomplete
            fullWidth
            disablePortal
            size="small"
            options={dropdown.suppliers}
            value={accountNumber.supplier}
            filterOptions={filterOptions}
            renderInput={
              props =>
                <TextField
                  {...props}
                  className="FstoTextfieldForm-root"
                  variant="outlined"
                  label="Supplier"
                  error={!Boolean(dropdown.suppliers.length) && !dropdown.isFetching}
                  helperText={!Boolean(dropdown.suppliers.length) && !dropdown.isFetching && "No suppliers found."}
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
              option => option.supplier_name
            }
            isOptionEqualToValue={
              (option, value) => option.supplier_id === value.supplier_id
            }
            onChange={
              (e, value) => {
                setAccountNumber({
                  ...accountNumber,
                  supplier: value
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
            disabled={
              !Boolean(accountNumber.number) ||
              !Boolean(accountNumber.location) ||
              !Boolean(accountNumber.category) ||
              !Boolean(accountNumber.supplier)
            }
            disableElevation
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
            <Typography variant="heading">Account Numbers</Typography>
            
            <LoadingButton
              className="FstoButtonImport-root"
              variant="contained"
              component="label"
              loadingPosition="start"
              loading={isImporting}
              startIcon={<UploadFile />}
              disableElevation
            >
              Import
              <input type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={importChangeHandler} hidden />
            </LoadingButton>
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
                  <TableSortLabel active={false}>ID NO.</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={false}>ACCOUNT NO.</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={false}>TYPE</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={false}>SUPPLIER</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={false}>LOCATION</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">STATUS</TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={false}>LAST MODIFIED</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root" align="center">ACTIONS</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {
                isFetching
                ? <Preloader row={5} col={8} />
                : accountNumbers
                  ? accountNumbers.map((data, index) => <TableData key={index} data={data} />)
                  : (
                      <TableRow>
                        <TableCell align="center" colSpan={9}>NO RECORDS FOUND</TableCell>
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

        <TableDialog
          open={dialog.show}
          data={dialog.data}
        />
      </Paper>
    </Box>
  )
}

export default AccountNumbers
