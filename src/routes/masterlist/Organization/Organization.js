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

import OrganizationToolbar from './OrganizationToolbar'
import OrganizationTable from './OrganizationTable'

const Organization = () => {

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
  } = useFistoHook("/api/admin/organization")

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

  const dataSyncHandler = () => {
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
          response = await axios.get(`http://rdfsedar.com/api/data/departments`, {
            withCredentials: false,
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_SEDAR_KEY}`
            }
          })

          dataSubmitHandler(response.data.data)

          setConfirm({
            ...confirm,
            loading: false,
          })
        }
        catch (error) {
          if (error.request.status !== 404) {
            setToast({
              show: true,
              title: "Error",
              message: "Something went wrong whilst fetching list of departments from Sedar.",
              severity: "error"
            })
          }

          console.log("Fisto Error Details: ", error.request)
        }
      }
    })
  }

  const dataSubmitHandler = async (data) => {
    const departments = data.map((item) => {
      return {
        id: item.id,
        name: item.department_name,
        status: item.status
      }
    })

    let response
    try {
      response = await axios.put(`/api/admin/organization`, {
        organization: departments
      })

      setToast({
        show: true,
        title: "Success",
        message: response.data.message
      })

      refetchData() // refresh the table data
    }
    catch (error) {
      if (error.request.status !== 404) {
        setToast({
          show: true,
          title: "Error",
          message: "Something went wrong whilst saving synched departments.",
          severity: "error"
        })
      }

      console.log("Fisto Error Details: ", error.request)
    }
  }

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperTable-root" elevation={1}>
        <Box className="FstoBoxToolbar-root">
          <OrganizationToolbar
            fetching={fetching}
            syncData={dataSyncHandler}
            searchData={searchData}
            searchClear={searchClear}
            statusChange={statusChange}
          />
        </Box>

        <TableContainer className="FstoTableContainerMasterlist-root">
          <OrganizationTable data={data} fetching={fetching} />
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

export default Organization