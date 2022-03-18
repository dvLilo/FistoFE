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

import SuppliersForm from './SuppliersForm'
import SuppliersTable from './SuppliersTable'
import SuppliersToolbar from './SuppliersToolbar'

const Suppliers = () => {

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
  } = useFistoHook("/api/admin/suppliers")

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
        message: "Something went wrong whilst fetching suppliers."
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
          response = await axios.patch(`/api/admin/suppliers/${id}`, {
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
    const { id, code, name, terms, supplier_type, referrences } = data
    setUpdate({
      id,
      code,
      name,
      terms,
      supplier_type,
      referrences
    })
    window.scrollTo(0, 0)
  }

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperForm-root" elevation={1}>
        <SuppliersForm
          data={update}
          refetchData={refetchData}
          toast={setToast}
          confirm={setConfirm}
        />
      </Paper>

      <Paper className="FstoPaperTable-root" elevation={1}>
        <Box className="FstoBoxToolbar-root">
          <SuppliersToolbar
            fetching={fetching}
            toast={setToast}
            refetchData={refetchData}
            searchData={searchData}
            searchClear={searchClear}
            statusChange={statusChange}
          />
        </Box>

        <TableContainer className="FstoTableContainer-root">
          <SuppliersTable
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

export default Suppliers