import React, { useEffect, useState } from 'react'

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

import TableData from './TableData'
import Form from './Form'
import Confirm from '../../../components/Confirm'
import Toast from '../../../components/Toast'


const CategoriesComponent = () => {
  const [categories, setCategories] = useState([])
  const [update, setUpdate] = useState({
    status: false,
    data: []
  })
  const [status, setStatus] = useState(true)
  const [confirm, setConfirm] = useState({
    show: false,
    loading: false,
    onConfirm: () => { }
  })
  const [toast, setToast] = useState({
    show: false,
    title: null,
    message: null
  })


  useEffect(() => {


    fetchData()
  }, [])

  const fetchData = async (status, rows) => {
    const result = await axios.get(`/api/categories/${status ? 1 : 0}/${rows}/ `)

    if (result) setCategories(result.data.result.data)
  }

  const actionUpdateHandler = (data) => {
    setUpdate({
      status: true,
      data: data
    })
  }

  const statusChangeHandler = () => {

  }

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperForm-root" elevation={1}>
        <Form update={update} setConfirm={setConfirm} setToast={setToast} setUpdate={setUpdate} />
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
              onClick={statusChangeHandler}
              sx={{
                color:
                  status
                    ? "#ef5350"
                    : "#4caf50"
              }}
            >
              {
                status
                  ? "View Archived"
                  : "View Active"
              }
            </Button>

            {/* <TextField
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
            /> */}
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
                  <TableSortLabel active={true}>NAME</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root">STATUS</TableCell>

                <TableCell className="FstoTableHead-root">
                  <TableSortLabel active={true}>LAST MODIFIED</TableSortLabel>
                </TableCell>

                <TableCell className="FstoTableHead-root" align="center">ACTIONS</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {categories?.map((data, index) => <TableData key={index} data={data} actionUpdate={actionUpdateHandler} />)}
            </TableBody>
          </Table>
        </TableContainer>


      </Paper>


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
    </Box >
  )
}


export default CategoriesComponent
