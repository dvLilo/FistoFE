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

const Banks = () => {

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
    onConfirm: () => { }
  })

  // true = active, false = inactive
  const [mode, setMode] = React.useState(true)

  // Dropdown Array
  const [dropdown, setDropdown] = React.useState({
    isFetching: false,
    account_titles: null
  })
  // Banks Array
  const [banks, setBanks] = React.useState(null)
  // Pagination Object
  const [pagination, setPagination] = React.useState(null)


  // Form Data State
  const [bank, setBank] = React.useState({
    code: "",
    name: "",
    branch: "",
    account_no: "",
    location: "",
    account_title_1: null,
    account_title_2: null
  })

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    limit: 100
  });

  React.useEffect(() => {

    if (mode) fetchBanks(true)
    else  fetchBanks(false)

    fetchBanksDropdown()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchBanks = async (status) => {
    setIsFetching(true)

    let response
    try {
      response = await axios.get(`/api/banks/${status ? 1 : 0}/${pagination ? pagination.per_page : 10}/`).then(json => json.data)
      const { data, ...paginate } = response.result

      setBanks(data)
      setPagination(paginate)
    }
    catch(error) {
      if (error.request.status !== 404) {
        setToast({
          show: true,
          title: "Error",
          message: "Something went wrong whilst fetching banks.",
          severity: "error"
        })
      }

      setBanks(null)
      setPagination(null)

      console.log("Fisto Error Details: ", error.request)
    }

    setIsFetching(false)
  }

  const fetchBanksDropdown = async () => {
    setDropdown({
      ...dropdown,
      isFetching: true
    })

    let response
    try {
      response = await axios.get(`/api/banks/dropdown/1`).then(json => json.data)
      const { account_titles } = response.result

      setDropdown({
        isFetching: false,
        account_titles: account_titles.length ? account_titles : null
      })
    }
    catch(error) {
      if (error.request.status !== 404) {
        setToast({
          show: true,
          title: "Error",
          message: "Something went wrong whilst fetching banks dropdown.",
          severity: "error"
        })
      }

      setDropdown({
        isFetching: false,
        account_titles: null
      })

      console.log("Fisto Error Details: ", error.request)
    }
  }

  const modeChangeHandler = () => {
    if (isFetching) return

    if (mode) {
      setMode(false)
      fetchBanks(false)
    }
    else {
      setMode(true)
      fetchBanks(true)
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
              response = await axios.post(`/api/account-title/import`, data).then(res => res.data)

              setToast({
                show: true,
                title: "Success",
                message: response.message
              })

              fetchBanks(true)
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
                  message: "Something went wrong whilst importing bank masterlist.",
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
    if (mode) fetchBanks(true)
    else fetchBanks(false)

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
          response = await axios.post(`/api/banks/search/1/${pagination ? pagination.per_page : 10}/`, {
            value: isSearching.keyword
          })
          .then(res => res.data)
        }
        else {
          response = await axios.post(`/api/banks/search/0/${pagination ? pagination.per_page : 10}/`, {
            value: isSearching.keyword
          })
          .then(res => res.data)
        }

        const { data, ...paginate } = response.result

        setBanks(data)
        setPagination(paginate)
      }
      catch (error) {
        if (error.request.status !== 404) {
          setToast({
            show: true,
            title: "Error",
            message: "Something went wrong whilst fetching banks.",
            severity: "error"
          })
        }
  
        setBanks(null)
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
    setBank({
      code: String(),
      name: String(),
      branch: String(),
      account_no: String(),
      location: String(),
      account_title_1: null,
      account_title_2: null
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
            response = await axios.put(`/api/banks/${isUpdating.data}/`, {
              code: bank.code,
              name: bank.name,
              branch: bank.branch,
              account_no: bank.account_no,
              location: bank.location,
              account_title_1: bank.account_title_1.account_title_id,
              account_title_2: bank.account_title_2.account_title_id
            }).then(res => res.data)
          }
          else {
            response = await axios.post(`/api/banks/`, {
              code: bank.code,
              name: bank.name,
              branch: bank.branch,
              account_no: bank.account_no,
              location: bank.location,
              account_title_1: bank.account_title_1.account_title_id,
              account_title_2: bank.account_title_2.account_title_id
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
          setBank({
            code: String(),
            name: String(),
            branch: String(),
            account_no: String(),
            location: String(),
            account_title_1: null,
            account_title_2: null
          })

          fetchBanks(true)
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
              message: "Something went wrong whilst saving bank.",
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
        response = await axios.post(`/api/banks/search/1/${pagination ? pagination.per_page : 10}?page=${++page}`, {
          value: isSearching.keyword
        })
        .then(res => res.data)
      }
      else if (!mode && isSearching.status) {
        response = await axios.post(`/api/banks/search/0/${pagination ? pagination.per_page : 10}?page=${++page}`, {
          value: isSearching.keyword
        })
        .then(res => res.data)
      }
      else if (mode) {
        response = await axios.get(`api/banks/1/${pagination ? pagination.per_page : 10}?page=${++page}`).then(res => res.data)
      }
      else if (!mode) {
        response = await axios.get(`api/banks/0/${pagination ? pagination.per_page : 10}?page=${++page}`).then(res => res.data)
      }

      const { data, ...paginate } = response.result

      setBanks(data)
      setPagination(paginate)
    }
    catch (error) {
      if (error.request.status !== 404) {
        setToast({
          show: true,
          title: "Error",
          message: "Something went wrong whilst fetching banks.",
          severity: "error"
        })
      }

      setBanks(null)
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
        response = await axios.post(`/api/banks/search/1/${e.target.value}/`, {
          value: isSearching.keyword
        })
        .then(res => res.data)
      }
      else if (!mode && isSearching.status) {
        response = await axios.post(`/api/banks/search/0/${e.target.value}/`, {
          value: isSearching.keyword
        })
        .then(res => res.data)
      }
      else if (mode) {
        response = await axios.get(`/api/banks/1/${e.target.value}/`).then(res => res.data)
      }
      else if (!mode)  {
        response = await axios.get(`/api/banks/0/${e.target.value}/`).then(res => res.data)
      }

      const { data, ...paginate } = response.result
      
      setBanks(data)
      setPagination(paginate)
    }
    catch (error) {
      if (error.request.status !== 404) {
        setToast({
          show: true,
          title: "Error",
          message: "Something went wrong whilst fetching banks.",
          severity: "error"
        })
      }

      setBanks(null)
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
          response = await axios.post(`/api/banks/archive/${id}/`).then(res => res.data)
    
          setConfirm({
            ...confirm,
            loading: false,
          })
          setToast({
            show: true,
            title: "Success",
            message: response.message
          })
          fetchBanks(true)
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
          response = await axios.post(`/api/banks/restore/${id}/`).then(res => res.data)
    
          setConfirm({
            ...confirm,
            loading: false,
          })
          setToast({
            show: true,
            title: "Success",
            message: response.message
          })
          fetchBanks(false)
        }
        catch (error) {
          console.log("Fisto Error Details: ", error.request)
        }
      }
    })
  }

  const actionUpdateHandler = (data) => {
    const { id, code, name, branch, account_no, location, account_title_1_id, account_title_2_id } = data

    setIsUpdating({
      status: true,
      data: id
    })
    setBank({
      code,
      name,
      branch,
      account_no,
      location,
      account_title_1: dropdown.account_titles.find(check => check.account_title_id === account_title_1_id),
      account_title_2: dropdown.account_titles.find(check => check.account_title_id === account_title_2_id)
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
          {data.branch}
        </TableCell>
        
        <TableCell className="FstoTableData-root">
          {data.account_no}
        </TableCell>
        
        <TableCell className="FstoTableData-root">
          {data.account_title_1}
        </TableCell>
        
        <TableCell className="FstoTableData-root">
          {data.account_title_2}
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
            label="Bank Code"
            variant="outlined"
            autoComplete="off"
            size="small"
            value={bank.code}
            helperText={error.status && error.message}
            error={error.status}
            onBlur={() => setError({
              status: false,
              message: ""
            })}
            onChange={(e) => setBank({
              ...bank,
              code: e.target.value
            })}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            fullWidth
          />
          
          <TextField
            className="FstoTextfieldForm-root"
            label="Bank Name"
            variant="outlined"
            autoComplete="off"
            size="small"
            value={bank.name}
            helperText={error.status && error.message}
            error={error.status}
            onBlur={() => setError({
              status: false,
              message: ""
            })}
            onChange={(e) => setBank({
              ...bank,
              name: e.target.value
            })}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            fullWidth
          />
          
          <TextField
            className="FstoTextfieldForm-root"
            label="Branch Code"
            variant="outlined"
            autoComplete="off"
            size="small"
            value={bank.branch}
            helperText={error.status && error.message}
            error={error.status}
            onBlur={() => setError({
              status: false,
              message: ""
            })}
            onChange={(e) => setBank({
              ...bank,
              branch: e.target.value
            })}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            fullWidth
          />
          
          <TextField
            className="FstoTextfieldForm-root"
            label="Account Number"
            variant="outlined"
            autoComplete="off"
            size="small"
            value={bank.account_no}
            helperText={error.status && error.message}
            error={error.status}
            onBlur={() => setError({
              status: false,
              message: ""
            })}
            onChange={(e) => setBank({
              ...bank,
              account_no: e.target.value
            })}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            fullWidth
          />
          
          <TextField
            className="FstoTextfieldForm-root"
            label="Location"
            variant="outlined"
            autoComplete="off"
            size="small"
            value={bank.location}
            helperText={error.status && error.message}
            error={error.status}
            onBlur={() => setError({
              status: false,
              message: ""
            })}
            onChange={(e) => setBank({
              ...bank,
              location: e.target.value
            })}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            fullWidth
          />

          

          <Autocomplete
            fullWidth
            disablePortal
            className="FstoSelectForm-root"
            size="small"
            options={dropdown.account_titles}
            value={bank.account_title_1}
            filterOptions={filterOptions}
            renderInput={
              props =>
                <TextField
                  {...props}
                  className="FstoTextfieldForm-root"
                  variant="outlined"
                  label="Cheque Clearing"
                  error={!Boolean(dropdown.account_titles) && !dropdown.isFetching}
                  helperText={!Boolean(dropdown.account_titles) && !dropdown.isFetching && "No account titles found."}
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
              option => option.account_title
            }
            isOptionEqualToValue={
              (option, value) => option.account_title_id === value.account_title_id
            }
            onChange={
              (e, value) => {
                setBank({
                  ...bank,
                  account_title_1: value
                })
              }
            }
          />

          <Autocomplete
            fullWidth
            disablePortal
            className="FstoSelectForm-root"
            size="small"
            options={dropdown.account_titles}
            value={bank.account_title_2}
            filterOptions={filterOptions}
            renderInput={
              props =>
                <TextField
                  {...props}
                  className="FstoTextfieldForm-root"
                  variant="outlined"
                  label="Cheque Clearing"
                  error={!Boolean(dropdown.account_titles) && !dropdown.isFetching}
                  helperText={!Boolean(dropdown.account_titles) && !dropdown.isFetching && "No account titles found."}
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
              option => option.account_title
            }
            isOptionEqualToValue={
              (option, value) => option.account_title_id === value.account_title_id
            }
            onChange={
              (e, value) => {
                setBank({
                  ...bank,
                  account_title_2: value
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
              !Boolean(bank.code.trim()) ||
              !Boolean(bank.name.trim()) ||
              !Boolean(bank.branch.trim()) ||
              !Boolean(bank.account_no.trim()) ||
              !Boolean(bank.location.trim()) ||
              !Boolean(bank.account_title_1) ||
              !Boolean(bank.account_title_2)
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
            <Typography variant="heading">Banks</Typography>

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
                  <TableSortLabel active={true}>BRANCH</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={true}>ACCOUNT NO.</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={true}>CHEQUE CREATION</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={true}>CHEQUE CLEARING</TableSortLabel>
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
                ? <Preloader row={5} col={9} />
                : banks
                  ? banks.map((data, index) => <TableData key={index} data={data} />)
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

export default Banks
