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

const Suppliers = () => {

  const [isSaving, setIsSaving] = React.useState(false)
  const [isFetching, setIsFetching] = React.useState(false)
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
    field: "",
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
    supplier_types: [],
    references: []
  })

  // Supplier Array
  const [suppliers, setSuppliers] = React.useState(null)
  // Pagination Object
  const [pagination, setPagination] = React.useState(null)


  // Form Data State
  const [supplier, setSupplier] = React.useState({
    code: "",
    name: "",
    terms: "",
    type: null,
    references: []
  })

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    limit: 100
  });

  React.useEffect(() => {

    if (mode) fetchSuppliers(true)
    else  fetchSuppliers(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {

    fetchSuppliersDropdown()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchSuppliers = async (status) => {
    setIsFetching(true)

    let response
    try {
      response = await axios.get(`/api/suppliers/${status ? 1 : 0}/${pagination ? pagination.per_page : 10}/`).then(json => json.data)
      const { data, ...paginate } = response.result

      setSuppliers(data)
      setPagination(paginate)
    }
    catch(error) {
      if (error.request.status !== 404) {
        setToast({
          show: true,
          title: "Error",
          message: "Something went wrong whilst fetching Suppliers.",
          severity: "error"
        })
      }

      setSuppliers(null)
      setPagination(null)
      
      console.log("Fisto Error Details: ", error.request)
    }

    setIsFetching(false)
  }

  const fetchSuppliersDropdown = async () => {
    setDropdown({
      ...dropdown,
      isFetching: true
    })
    let response
    try {
      response = await axios.get(`/api/suppliers/dropdown/1`).then(json => json.data)
      const { supplier_types, references } = response.result

      setDropdown({
        isFetching: false,
        supplier_types: supplier_types.length ? supplier_types : [],
        references: references.length ? references : []
      })
    }
    catch(error) {
      if (error.request.status !== 404) {
        setToast({
          show: true,
          title: "Error",
          message: "Something went wrong whilst fetching Suppliers Dropdown.",
          severity: "error"
        })
      }

      setDropdown({
        isFetching: false,
        supplier_types: [],
        references: []
      })

      console.log("Fisto Error Details: ", error.request)
    }
  }

  const modeChangeHandler = () => {
    if (isFetching) return

    if (mode) {
      setMode(false)
      fetchSuppliers(false)
    }
    else {
      setMode(true)
      fetchSuppliers(true)
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

          const data = XLSX.utils.sheet_to_json(worksheet, {raw: true, defval: ""})

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
              response = await axios.post(`/api/suppliers/import`, data).then(res => res.data)

              setToast({
                show: true,
                title: "Success",
                message: response.message
              })

              fetchSuppliers(true)
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
                  message: "Something went wrong whilst importing supplier masterlist.",
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
    if (mode) fetchSuppliers(true)
    else fetchSuppliers(false)

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
          response = await axios.post(`/api/suppliers/search/1/${pagination ? pagination.per_page : 10}/`, {
            value: isSearching.keyword
          })
          .then(res => res.data)
        }
        else {
          response = await axios.post(`/api/suppliers/search/0/${pagination ? pagination.per_page : 10}/`, {
            value: isSearching.keyword
          })
          .then(res => res.data)
        }

        const { data, ...paginate } = response.result

        setSuppliers(data)
        setPagination(paginate)
      }
      catch (error) {
        if (error.request.status !== 404) {
          setToast({
            show: true,
            title: "Error",
            message: "Something went wrong whilst fetching Suppliers.",
            severity: "error"
          })
        }
  
        setSuppliers(null)
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
    setSupplier({
      code: String(),
      name: String(),
      terms: String(),
      type: null,
      references: []
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
            response = await axios.put(`/api/suppliers/${isUpdating.data}/`, {
              supplier_code: supplier.code,
              supplier_name: supplier.name,
              terms: supplier.terms,
              supplier_type_id: supplier.type.supplier_type_id,
              references: supplier.references.map(reference => reference.referrence_id)
            })
            .then(res => res.data)
          }
          else {
            response = await axios.post(`/api/suppliers/`, {
              supplier_code: supplier.code,
              supplier_name: supplier.name,
              terms: supplier.terms,
              supplier_type_id: supplier.type.supplier_type_id,
              references: supplier.references.map(reference => reference.referrence_id)
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
          setSupplier({
            code: String(),
            name: String(),
            terms: String(),
            type: null,
            references: []
          })

          fetchSuppliers(true)
        }
        catch (error) {
          const { status } = error.request

          if (status === 409) {
            const { data } = error.response

            setError({
              status: true,
              field: data.result.error_field,
              message: data.message
            })
          }
          else
            setToast({
              show: true,
              title: "Error",
              message: "Something went wrong whilst saving supplier.",
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
        response = await axios.post(`/api/suppliers/search/1/${pagination ? pagination.per_page : 10}?page=${++page}`, {
          value: isSearching.keyword
        })
        .then(res => res.data)
      }
      else if (!mode && isSearching.status) {
        response = await axios.post(`/api/suppliers/search/0/${pagination ? pagination.per_page : 10}?page=${++page}`, {
          value: isSearching.keyword
        })
        .then(res => res.data)
      }
      else if (mode) {
        response = await axios.get(`api/suppliers/1/${pagination ? pagination.per_page : 10}?page=${++page}`).then(res => res.data)
      }
      else if (!mode) {
        response = await axios.get(`api/suppliers/0/${pagination ? pagination.per_page : 10}?page=${++page}`).then(res => res.data)
      }

      const { data, ...paginate } = response.result

      setSuppliers(data)
      setPagination(paginate)
    }
    catch (error) {
      if (error.request.status !== 404) {
        setToast({
          show: true,
          title: "Error",
          message: "Something went wrong whilst fetching supplier.",
          severity: "error"
        })
      }

      setSuppliers(null)
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
        response = await axios.post(`/api/suppliers/search/1/${e.target.value}/`, {
          value: isSearching.keyword
        })
        .then(res => res.data)
      }
      else if (!mode && isSearching.status) {
        response = await axios.post(`/api/suppliers/search/0/${e.target.value}/`, {
          value: isSearching.keyword
        })
        .then(res => res.data)
      }
      else if (mode) {
        response = await axios.get(`/api/suppliers/1/${e.target.value}/`).then(res => res.data)
      }
      else if (!mode)  {
        response = await axios.get(`/api/suppliers/0/${e.target.value}/`).then(res => res.data)
      }

      const { data, ...paginate } = response.result
      
      setSuppliers(data)
      setPagination(paginate)
    }
    catch (error) {
      if (error.request.status !== 404) {
        setToast({
          show: true,
          title: "Error",
          message: "Something went wrong whilst fetching suppliers.",
          severity: "error"
        })
      }

      setSuppliers(null)
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
          response = await axios.post(`/api/suppliers/archive/${id}/`).then(res => res.data)
    
          setConfirm({
            ...confirm,
            loading: false,
          })
          setToast({
            show: true,
            title: "Success",
            message: response.message
          })
          fetchSuppliers(true)
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
          show: true,
          loading: true,
          onConfirm: () => {}
        })

        let response
        try {
          response = await axios.post(`/api/suppliers/restore/${id}/`).then(res => res.data)
          
          setConfirm({
            ...confirm,
            loading: false,
          })
          setToast({
            show: true,
            title: "Success",
            message: response.message
          })
          fetchSuppliers(false)
        }
        catch (error) {
          console.log("Fisto Error Details: ", error.request)
        }
      }
    })
  }

  const actionUpdateHandler = (data) => {
    const { id, terms, referrences, code, name, supplier_type_id } = data

    setIsUpdating({
      status: true,
      data: id
    })
    setSupplier({
      code,
      name,
      terms,
      type: dropdown.supplier_types.find(check => check.supplier_type_id === supplier_type_id),
      references: referrences
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
          {data.code}
        </TableCell>
        
        <TableCell className="FstoTableData-root">
          {data.name}
        </TableCell>
        
        <TableCell className="FstoTableData-root">
          {data.terms}
        </TableCell>
        
        <TableCell className="FstoTableData-root" sx={{ textTransform: "capitalize" }}>
          {data.supplier_type}
        </TableCell>
        
        <TableCell className="FstoTableData-root" sx={{ textTransform: "uppercase" }}>
          {data.referrences.map(r => r.referrence_type).join(', ')}
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
            label="Supplier Code"
            variant="outlined"
            autoComplete="off"
            size="small"
            value={supplier.code}
            helperText={error.status && error.field === "code" && error.message}
            error={error.status && error.field === "code"}
            onBlur={() => setError({
              status: false,
              field: "",
              message: ""
            })}
            onChange={(e) => setSupplier({
              ...supplier,
              code: e.target.value
            })}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            fullWidth
          />

          <TextField
            className="FstoTextfieldForm-root"
            label="Supplier Name"
            variant="outlined"
            autoComplete="off"
            size="small"
            value={supplier.name}
            helperText={error.status && error.field === "name" && error.message}
            error={error.status && error.field === "name"}
            onBlur={() => setError({
              status: false,
              field: "",
              message: ""
            })}
            onChange={(e) => setSupplier({
              ...supplier,
              name: e.target.value
            })}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            fullWidth
          />

          <TextField
            className="FstoTextfieldForm-root"
            label="Terms"
            variant="outlined"
            autoComplete="off"
            size="small"
            value={supplier.terms}
            onChange={(e) => setSupplier({
              ...supplier,
              terms: e.target.value
            })}
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
            options={dropdown.supplier_types}
            value={supplier.type}
            filterOptions={filterOptions}
            renderInput={
              props =>
                <TextField
                  {...props}
                  variant="outlined"
                  label="Type"
                  error={!Boolean(dropdown.supplier_types) && !dropdown.isFetching}
                  helperText={!Boolean(dropdown.supplier_types) && !dropdown.isFetching && "No supplier types found."}
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
              option => option.supplier_type
            }
            isOptionEqualToValue={
              (option, value) => option.supplier_type_id === value.supplier_type_id
            }
            onChange={
              (e, value) => {
                setSupplier({
                  ...supplier,
                  type: value
                })
              }
            }
          />

          <Autocomplete
            fullWidth
            multiple
            disablePortal
            disableCloseOnSelect
            className="FstoSelectForm-root"
            size="small"
            options={dropdown.references}
            value={supplier.references}
            filterOptions={filterOptions}
            renderInput={
              props =>
                <TextField
                  {...props}
                  variant="outlined"
                  label="References"
                  error={!Boolean(dropdown.references) && !dropdown.isFetching}
                  helperText={!Boolean(dropdown.references) && !dropdown.isFetching && "No references found."}
                />
            }
            PaperComponent={
              props =>
                <Paper
                  {...props}
                  sx={{ textTransform: 'uppercase' }}
                />
            }
            ChipProps={{
              sx: { textTransform: 'uppercase' }
            }}
            getOptionLabel={
              option => option.referrence_type
            }
            isOptionEqualToValue={
              (option, value) => option.referrence_id === value.referrence_id
            }
            onChange={
              (e, value) => {
                setSupplier({
                  ...supplier,
                  references: value
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
              !Boolean(supplier.code.trim()) ||
              !Boolean(supplier.name.trim()) ||
              !Boolean(supplier.terms.trim()) ||
              !Boolean(supplier.type) ||
              !Boolean(supplier.references.length)
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
            <Typography variant="heading">Suppliers</Typography>
            
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
                  <TableSortLabel active={true}>ID NO.</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={true}>CODE</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={true}>SUPPLIER</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={true}>TERMS</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={true}>TYPE</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">REFERENCES</TableCell>

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
                ? <Preloader row={5} col={9} />
                : suppliers
                  ? suppliers.map((data, index) => <TableData key={index} data={data} />)
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

export default Suppliers
