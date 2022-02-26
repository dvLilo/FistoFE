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

import { createFilterOptions } from '@mui/material/Autocomplete';

import Toast from '../../components/Toast'
import Confirm from '../../components/Confirm'
import Preloader from '../../components/Preloader'
import ActionMenu from '../../components/ActionMenu'

const ShowMore = ({data}) => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {
        data.slice(0,2).map(location => location.location_name).join(', ')
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
                  data.slice(2,data.length).map((location, index) => (
                    <ListItem dense key={index}>
                      {location.location_name}
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
}

const CreditCards = () => {

  const [isSaving, setIsSaving] = React.useState(false)
  const [isFetching, setIsFetching] = React.useState(false)
  
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
    locations: [],
    categories: []
  })
  // Credit Card Array
  const [creditCards, setCreditCards] = React.useState(null)
  // Pagination Object
  const [pagination, setPagination] = React.useState(null)


  // Form Data State
  const [creditCard, setCreditCard] = React.useState({
    name: "",
    account_no: "",
    locations: [],
    categories: []
  })

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    limit: 100
  });

  React.useEffect(() => {

    if (mode) fetchCreditCards(true)
    else  fetchCreditCards(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {

    fetchCreditCardsDropdown()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchCreditCards = async (status) => {
    setIsFetching(true)

    let response
    try {
      response = await axios.get(`/api/credit-card/${status ? 1 : 0}/${pagination ? pagination.per_page : 10}/`).then(json => json.data)
      const { data, ...paginate } = response.result

      setCreditCards(data)
      setPagination(paginate)
    }
    catch(error) {
      if (error.request.status !== 404) {
        setToast({
          show: true,
          title: "Error",
          message: "Something went wrong whilst fetching credit cards.",
          severity: "error"
        })
      }

      setCreditCards(null)
      setPagination(null)

      console.log("Fisto Error Details: ", error.request)
    }

    setIsFetching(false)
  }

  const fetchCreditCardsDropdown = async () => {
    setDropdown({
      ...dropdown,
      isFetching: true
    })

    let response
    try {
      response = await axios.get(`/api/credit-card/dropdown/1`).then(json => json.data)
      const { locations, categories } = response.result

      setDropdown({
        isFetching: false,
        locations: locations.length ? locations : null,
        categories: categories.length ? categories : null
      })
    }
    catch(error) {
      if (error.request.status !== 404) {
        setToast({
          show: true,
          title: "Error",
          message: "Something went wrong whilst fetching locations and categories dropdown.",
          severity: "error"
        })
      }

      setDropdown({
        isFetching: false,
        locations: [],
        categories: []
      })

      console.log("Fisto Error Status", error.request)
    }
  }

  const modeChangeHandler = () => {
    if (isFetching) return

    if (mode) {
      setMode(false)
      fetchCreditCards(false)
    }
    else {
      setMode(true)
      fetchCreditCards(true)
    }
  }

  const searchCloseHandler = () => {
    if (mode) fetchCreditCards(true)
    else fetchCreditCards(false)

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
          response = await axios.post(`/api/credit-card/search/1/${pagination ? pagination.per_page : 10}/`, {
            value: isSearching.keyword
          })
          .then(res => res.data)
        }
        else {
          response = await axios.post(`/api/credit-card/search/0/${pagination ? pagination.per_page : 10}/`, {
            value: isSearching.keyword
          })
          .then(res => res.data)
        }

        const { data, ...paginate } = response.result

        setCreditCards(data)
        setPagination(paginate)
      }
      catch (error) {
        if (error.request.status !== 404) {
          setToast({
            show: true,
            title: "Error",
            message: "Something went wrong whilst fetching credit cards.",
            severity: "error"
          })
        }
  
        setCreditCards(null)
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
    setCreditCard({
      name: String(),
      account_no: String(),
      locations: [],
      categories: []
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
            response = await axios.put(`/api/credit-card/${isUpdating.data}/`, {
              name: creditCard.name,
              account_no: creditCard.account_no,
              categories: creditCard.categories.map(data => data.category_id),
              locations: creditCard.locations.map(data => data.location_id)
            })
            .then(res => res.data)
          }
          else {
            response = await axios.post(`/api/credit-card/`, {
              name: creditCard.name,
              account_no: creditCard.account_no,
              categories: creditCard.categories.map(data => data.category_id),
              locations: creditCard.locations.map(data => data.location_id)
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
          setCreditCard({
            name: String(),
            account_no: String(),
            locations: [],
            categories: []
          })

          fetchCreditCards(true)
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
              message: "Something went wrong whilst saving credit card.",
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
        response = await axios.post(`/api/credit-card/search/1/${pagination ? pagination.per_page : 10}?page=${++page}`, {
          value: isSearching.keyword
        })
        .then(res => res.data)
      }
      else if (!mode && isSearching.status) {
        response = await axios.post(`/api/credit-card/search/0/${pagination ? pagination.per_page : 10}?page=${++page}`, {
          value: isSearching.keyword
        })
        .then(res => res.data)
      }
      else if (mode) {
        response = await axios.get(`api/credit-card/1/${pagination ? pagination.per_page : 10}?page=${++page}`).then(res => res.data)
      }
      else if (!mode) {
        response = await axios.get(`api/credit-card/0/${pagination ? pagination.per_page : 10}?page=${++page}`).then(res => res.data)
      }

      const { data, ...paginate } = response.result

      setCreditCards(data)
      setPagination(paginate)
    }
    catch (error) {
      if (error.request.status !== 404) {
        setToast({
          show: true,
          title: "Error",
          message: "Something went wrong whilst fetching credit cards.",
          severity: "error"
        })
      }

      setCreditCards(null)
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
        response = await axios.post(`/api/credit-card/search/1/${e.target.value}/`, {
          value: isSearching.keyword
        })
        .then(res => res.data)
      }
      else if (!mode && isSearching.status) {
        response = await axios.post(`/api/credit-card/search/0/${e.target.value}/`, {
          value: isSearching.keyword
        })
        .then(res => res.data)
      }
      else if (mode) {
        response = await axios.get(`/api/credit-card/1/${e.target.value}/`).then(res => res.data)
      }
      else if (!mode)  {
        response = await axios.get(`/api/credit-card/0/${e.target.value}/`).then(res => res.data)
      }

      const { data, ...paginate } = response.result
      
      setCreditCards(data)
      setPagination(paginate)
    }
    catch (error) {
      if (error.request.status !== 404) {
        setToast({
          show: true,
          title: "Error",
          message: "Something went wrong whilst fetching credit cards.",
          severity: "error"
        })
      }

      setCreditCards(null)
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
          response = await axios.post(`/api/credit-card/archive/${id}/`).then(res => res.data)
    
          setConfirm({
            ...confirm,
            loading: false,
          })
          setToast({
            show: true,
            title: "Success",
            message: response.message
          })
          fetchCreditCards(true)
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
          response = await axios.post(`/api/credit-card/restore/${id}/`).then(res => res.data)
          
          setConfirm({
            ...confirm,
            loading: false
          })
          setToast({
            show: true,
            title: "Success",
            message: response.message
          })
          fetchCreditCards(false)
        }
        catch (error) {
          console.log("Fisto Error Details: ", error.request)
        }
      }
    })
  }

  const actionUpdateHandler = (data) => {
    const { id, name, account_no, utility_locations, utility_categories } = data

    setIsUpdating({
      status: true,
      data: id
    })
    setCreditCard({
      name: name,
      account_no: account_no,
      locations: utility_locations,
      categories: utility_categories
    })

    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  }

  const TableData = ({ data }) => {
    return (
      <TableRow>
        <TableCell className="FstoTableData-root" align="center">
          {data.id}
        </TableCell>
        
        <TableCell className="FstoTableData-root" sx={{ textTransform: "capitalize" }}>
          {data.name}
        </TableCell>
        
        <TableCell className="FstoTableData-root">
          {data.account_no}
        </TableCell>
        
        <TableCell className="FstoTableData-root" sx={{ textTransform: "capitalize" }}>
          {
            data.utility_categories.map(data => data.category_name).join(', ')
          }
        </TableCell>
        
        <TableCell className="FstoTableData-root">
          <ShowMore data={data.utility_locations} />
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

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperForm-root" elevation={1}>
        <form onSubmit={formSubmitHandler}>
          <TextField
            className="FstoTextfieldForm-root"
            label="Credit Card Name"
            variant="outlined"
            autoComplete="off"
            size="small"
            value={creditCard.name}
            helperText={error.status && error.message}
            error={error.status}
            onBlur={() => setError({
              status: false,
              message: ""
            })}
            onChange={(e) => setCreditCard({
              ...creditCard,
              name: e.target.value
            })}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            fullWidth
          />
          
          <TextField
            className="FstoTextfieldForm-root"
            label="Credit Card Number"
            variant="outlined"
            autoComplete="off"
            size="small"
            value={creditCard.account_no}
            helperText={error.status && error.message}
            error={error.status}
            onBlur={() => setError({
              status: false,
              message: ""
            })}
            onChange={(e) => setCreditCard({
              ...creditCard,
              account_no: e.target.value
            })}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
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
            value={creditCard.categories}
            filterOptions={filterOptions}
            renderInput={
              props =>
                <TextField
                  {...props}
                  variant="outlined"
                  label="Utility Category"
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
                setCreditCard({
                  ...creditCard,
                  categories: value
                })
              }
            }
          />

          <Autocomplete
            fullWidth
            multiple
            disablePortal
            disableCloseOnSelect
            size="small"
            options={dropdown.locations}
            value={creditCard.locations}
            filterOptions={filterOptions}
            renderInput={
              props =>
                <TextField
                  {...props}
                  className="FstoTextfieldForm-root"
                  variant="outlined"
                  label="Utility Location"
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
                setCreditCard({
                  ...creditCard,
                  locations: value
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
              !Boolean(creditCard.name) ||
              !Boolean(creditCard.account_no) ||
              !Boolean(creditCard.categories.length) ||
              !Boolean(creditCard.locations.length)
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
            <Typography variant="heading">Credit Card</Typography>
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
                  <TableSortLabel active={true}>BANK NAME</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={true}>ACCOUNT NO.</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={true}>CATEGORY</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={true}>LOCATION</TableSortLabel>
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
                : creditCards
                  ? creditCards.map((data, index) => <TableData key={index} data={data} />)
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
      </Paper>
    </Box>
  )
}

export default CreditCards
