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

import UtilityLocationsForm from './UtilityLocationsForm'
import UtilityLocationsTable from './UtilityLocationsTable'
import UtilityLocationsToolbar from './UtilityLocationsToolbar'

const UtilityLocations = () => {

  const {
    fetching,
    error,
    data,
    paginate,
    refetchData,
    searchData,
    searchClear,
    statusChange,
    pageChange,
    rowChange
  } = useFistoHook("/api/admin/utility-location")

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

  React.useEffect(() => {
    if (error) {
      if (error.status !== 404) setToast({
        show: true,
        title: "Success",
        message: "Something went wrong whilst fetching utility locations."
      })
    }
  }, [error])

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
          response = await axios.patch(`/api/admin/utility-location/${id}`, {
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
    const { id, location } = data
    setUpdate({
      id,
      location
    })
    window.scrollTo(0, 0)
  }

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperForm-root" elevation={1}>
        <UtilityLocationsForm
          data={update}
          refetchData={refetchData}
          toast={setToast}
          confirm={setConfirm}
        />
      </Paper>

      <Paper className="FstoPaperTable-root" elevation={1}>
        <Box className="FstoBoxToolbar-root">
          <UtilityLocationsToolbar
            fetching={fetching}
            searchData={searchData}
            searchClear={searchClear}
            statusChange={statusChange}
          />
        </Box>

        <TableContainer className="FstoTableContainer-root">
          <UtilityLocationsTable
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

export default UtilityLocations