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
} from '@mui/material'

import {
  Search,
  Close
} from '@mui/icons-material'

import { LoadingButton } from '@mui/lab'

import Toast from '../../components/Toast'
import Confirm from '../../components/Confirm'
import Preloader from '../../components/Preloader'
import ActionMenu from '../../components/ActionMenu'

const Categories = () => {

  const searchRef = React.useRef(null)

  const [params, setParams] = React.useState({
    status: 1,
    page: 1,
    rows: 10,
    search: null
  })
  const [isFetching, setIsFetching] = React.useState(false)
  // Categories Array
  const [categories, setCategories] = React.useState(null)
  // Pagination Object
  const [pagination, setPagination] = React.useState(null)

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

  const [forUpdate, setForUpdate] = React.useState(null)

  React.useEffect(() => {
    (async () => {
      setIsFetching(true)

      let response
      try {
        response = await axios.get(`/api/admin/categories/`, {
          params: {
            status: params.status,
            page: params.page,
            rows: params.rows,
            search: params.search
          }
        })
        const { data, ...paginate } = response.data.result

        setCategories(data)
        setPagination(paginate)
      }
      catch (error) {
        if (error.request.status !== 404) {
          setToast({
            show: true,
            title: "Error",
            message: "Something went wrong whilst fetching Categories.",
            severity: "error"
          })
        }

        setCategories(null)
        setPagination(null)

        console.log("Fisto Error Details: ", error.request)
      }

      setIsFetching(false)
    })()
  }, [params])

  const modeChangeHandler = () => {
    if (isFetching) return

    setParams({
      ...params,
      status: params.status ? 0 : 1
    })
  }

  const searchCloseHandler = () => {
    setParams({
      ...params,
      search: null
    })
    searchRef.current.value = null
  }

  const searchSubmitHandler = async (e) => {
    if (e.key === "Enter") {
      setParams({
        ...params,
        search: e.target.value
      })
    }
  }

  const pageChangeHandler = async (e, page) => {
    setParams({
      ...params,
      page: page + 1
    })
  }

  const rowChangeHandler = async (e) => {
    setParams({
      ...params,
      rows: e.target.value
    })
  }

  const actionStatusHandler = (props) => {
    const { id, deleted_at } = props

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
          response = await axios.patch(`/api/admin/categories/${id}`, {
            status: Boolean(deleted_at) ? 0 : 1
          })

          setConfirm({
            ...confirm,
            loading: false,
          })
          setToast({
            show: true,
            title: "Success",
            message: response.data.message
          })
          setParams({
            ...params,
            status: Boolean(deleted_at) ? 0 : 1
          })
        }
        catch (error) {
          console.log("Fisto Error Details: ", error.request)
        }
      }
    })
  }

  const actionUpdateHandler = (data) => {
    setForUpdate(data)

    window.scrollTo(0, 0)
  }

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperForm-root" elevation={1}>
        <FormComponent forUpdate={forUpdate} setForUpdate={setForUpdate} setParams={setParams} setConfirm={setConfirm} setToast={setToast} />
      </Paper>

      <Paper className="FstoPaperTable-root" elevation={1}>
        <Box className="FstoBoxToolbar-root">
          <Box className="FstoBoxToolbar-left">
            <Typography variant="heading">Categories</Typography>
          </Box>

          <Box className="FstoBoxToolbar-right">
            <Button
              className="FstoButtonMode-root"
              variant="text"
              size="small"
              onClick={modeChangeHandler}
              sx={{
                color:
                  params.status
                    ? "#ef5350"
                    : "#4caf50"
              }}
            >
              {
                params.status
                  ? "View Archived"
                  : "View Active"
              }
            </Button>

            <TextField
              variant="outlined"
              size="small"
              autoComplete="off"
              placeholder="Search"
              inputRef={searchRef}
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
                      onClick={searchCloseHandler}
                      disabled={!Boolean(params.search)}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
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
                  <TableSortLabel active={false}>ID NO.</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={false}>NAME</TableSortLabel>
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
                  ? <Preloader row={5} col={5} />
                  : categories
                    ? categories.map((data, index) => <TableData key={index} data={data} onStatusChange={actionStatusHandler} onUpdateChange={actionUpdateHandler} />)
                    : (
                      <TableRow>
                        <TableCell align="center" colSpan={5}>NO RECORDS FOUND</TableCell>
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
          rowsPerPageOptions={[10, 20, 50, 100]}
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
            onConfirm: () => { }
          })}
        />
      </Paper>
    </Box>
  )
}

const FormComponent = ({ forUpdate, setParams, setConfirm, setToast }) => {

  const [isSaving, setIsSaving] = React.useState(false)
  const [isUpdating, setIsUpdating] = React.useState(false)

  const [error, setError] = React.useState({
    status: false,
    message: ""
  })

  const [category, setCategory] = React.useState({
    name: ""
  })

  React.useEffect(() => {
    if (forUpdate) {
      setIsUpdating(true)
      setCategory({
        name: forUpdate.name
      })
    }
  }, [forUpdate])

  const formClearHandler = () => {
    setIsUpdating(false)
    setError({
      status: false,
      message: ""
    })
    setCategory({
      name: String()
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
          if (forUpdate) response = await axios.put(`/api/admin/categories/${forUpdate.id}`, category)
          else response = await axios.post(`/api/admin/categories/`, category)

          setToast({
            show: true,
            title: "Success",
            message: response.data.message
          })
          setParams(prev => ({
            ...prev,
            status: 1
          }))
          formClearHandler()
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
              message: "Something went wrong whilst creating Category.",
              severity: "error"
            })
          }
        }

        setIsSaving(false)
      }
    })
  }

  return (
    <form onSubmit={formSubmitHandler}>
      <TextField
        className="FstoTextfieldForm-root"
        label="Category Name"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={category.name}
        helperText={error.status && error.message}
        error={error.status}
        onBlur={() => setError({
          status: false,
          message: ""
        })}
        onChange={(e) => setCategory({
          name: e.target.value
        })}
        InputLabelProps={{
          className: "FstoLabelForm-root"
        }}
        fullWidth
      />

      <LoadingButton
        className="FstoButtonForm-root"
        type="submit"
        variant="contained"
        loadingPosition="start"
        loading={isSaving}
        startIcon={<></>}
        disabled={!Boolean(category.name.trim())}
        disableElevation
      >
        {
          isUpdating
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
          isUpdating
            ? "Cancel"
            : "Clear"
        }
      </Button>
    </form>
  )
}

const TableData = ({ data, onUpdateChange, onStatusChange }) => {
  return (
    <TableRow>
      <TableCell className="FstoTableData-root" align="center">
        {data.id}
      </TableCell>

      <TableCell className="FstoTableData-root" sx={{ textTransform: "capitalize" }}>
        {data.name}
      </TableCell>

      <TableCell className="FstoTableData-root">
        {Boolean(data.deleted_at) ? "Inactive" : "Active"}
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
          onUpdateChange={onUpdateChange}
          onStatusChange={onStatusChange}
        />
      </TableCell>
    </TableRow>
  )
}

export default Categories