import React from 'react'

import axios from 'axios'

import useFistoHook from '../../../hooks/useFistoHook'

import {
  Box,
  Paper,
  TableContainer,
  TablePagination,
} from '@mui/material'

import Toast from '../../../components/Toast'
import Confirm from '../../../components/Confirm'

import LocationsForm from './LocationsForm'
import LocationsTable from './LocationsTable'
import LocationsToolbar from './LocationsToolbar'

const Locations = () => {

  const {
    fetching,
    data,
    paginate,
    refetchData,
    searchData,
    searchClear,
    statusChange,
    pageChange,
    rowChange
  } = useFistoHook("/api/admin/locations")

  const [update, setUpdate] = React.useState(null)

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

  const dataStatusHandler = (data) => {
    const { id, deleted_at } = data

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
          response = await axios.patch(`/api/admin/locations/${id}`, {
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

          refetchData() // refresh the table data
        }
        catch (error) {
          console.log("Fisto Error Details: ", error.request)
        }
      }
    })
  }

  const dataUpdateHandler = (data) => {
    const {
      id,
      code,
      location,
      departments
    } = data

    setUpdate({
      id,
      code,
      location,
      departments
    })
    window.scrollTo(0, 0)
  }

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperForm-root" elevation={1}>
        <LocationsForm
          data={update}
          refetchData={refetchData}
          toast={setToast}
          confirm={setConfirm}
        />
      </Paper>

      <Paper className="FstoPaperTable-root" elevation={1}>
        <Box className="FstoBoxToolbar-root">
          <LocationsToolbar
            fetching={fetching}
            toast={setToast}
            refetchData={refetchData}
            searchData={searchData}
            searchClear={searchClear}
            statusChange={statusChange}
          />
        </Box>

        <TableContainer className="FstoTableContainer-root">
          <LocationsTable
            fetching={fetching}
            data={data}
            onStatusChange={dataStatusHandler}
            onUpdateChange={dataUpdateHandler}
          />
        </TableContainer>

        <TablePagination
          component="div"
          count={paginate ? paginate.total : 0}
          page={paginate ? paginate.current_page - 1 : 0}
          rowsPerPage={paginate ? paginate.per_page : 10}
          onPageChange={pageChange}
          onRowsPerPageChange={rowChange}
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

export default Locations