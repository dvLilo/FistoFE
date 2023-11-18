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

import BanksForm from './BanksForm'
import BanksTable from './BanksTable'
import BanksToolbar from './BanksToolbar'

const Banks = () => {

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
  } = useFistoHook("/api/admin/banks")

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
          response = await axios.patch(`/api/admin/banks/${id}`, {
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
      name,
      branch,
      account_no,
      location,

      account_title_one,
      company_one,
      business_unit_one,
      department_one,
      sub_unit_one,
      location_one,

      account_title_two,
      company_two,
      business_unit_two,
      department_two,
      sub_unit_two,
      location_two
    } = data

    setUpdate({
      id,
      code,
      name,
      branch,
      account_no,
      location,

      account_title_1: account_title_one,
      company_1: company_one,
      business_unit_1: business_unit_one,
      department_1: department_one,
      sub_unit_1: sub_unit_one,
      location_1: location_one,

      account_title_2: account_title_two,
      company_2: company_two,
      business_unit_2: business_unit_two,
      department_2: department_two,
      sub_unit_2: sub_unit_two,
      location_2: location_two
    })
    window.scrollTo(0, 0)
  }

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperForm-root" elevation={1}>
        <BanksForm
          data={update}
          refetchData={refetchData}
          toast={setToast}
          confirm={setConfirm}
        />
      </Paper>

      <Paper className="FstoPaperTable-root" elevation={1}>
        <Box className="FstoBoxToolbar-root">
          <BanksToolbar
            fetching={fetching}
            toast={setToast}
            refetchData={refetchData}
            searchData={searchData}
            searchClear={searchClear}
            statusChange={statusChange}
          />
        </Box>

        <TableContainer className="FstoTableContainerMasterlist-root">
          <BanksTable
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

export default Banks