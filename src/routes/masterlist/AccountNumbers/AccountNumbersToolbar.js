import React from 'react'

import axios from 'axios'

import * as XLSX from 'xlsx'

import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material'

import { LoadingButton } from '@mui/lab'

import UploadFileIcon from '@mui/icons-material/UploadFile'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'

import ErrorDialog from '../../../components/ErrorDialog'

const AccountNumbersToolbar = (props) => {

  const {
    fetching,
    toast,
    refetchData,
    searchData, // Handler
    searchClear, // Handler
    statusChange // Handler
  } = props

  const searchRef = React.useRef()

  const [isImporting, setIsImporting] = React.useState(false)

  const [status, setStatus] = React.useState(true)

  const [error, setError] = React.useState({
    open: false,
    data: []
  })

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

          const data = XLSX.utils.sheet_to_json(worksheet, { raw: true, defval: "" })

          if (Boolean(data.length)) {
            data.forEach((row) => {
              Object.keys(row).forEach((key) => {
                let newKey = key.trim().toLowerCase().replace(/ /g, "_")
                if (key !== newKey) {
                  row[newKey] = row[key]
                  delete row[key]
                }
              })
            })

            let response
            try {
              response = await axios.post(`/api/admin/account-number/import`, data)

              toast({
                show: true,
                title: "Success",
                message: response.data.message
              })

              refetchData() // refresh the table data
            }
            catch (error) {
              const { status, data } = error.response

              if (status === 409) {
                setError({
                  open: true,
                  data: data
                })
              }
              else if (status === 406) {
                toast({
                  show: true,
                  title: "Error",
                  message: data.message,
                  severity: "error"
                })
              }
              else {
                toast({
                  show: true,
                  title: "Error",
                  message: "Something went wrong whilst importing account numbers masterlist.",
                  severity: "error"
                })
              }
            }
          }
          else {
            toast({
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
        toast({
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

  const errorCloseHandler = () => {
    setError(currentValue => ({
      ...currentValue,
      open: false
    }))
  }

  return (
    <React.Fragment>
      <Box className="FstoBoxToolbar-left">
        <Typography variant="heading">Account Numbers</Typography>

        <LoadingButton
          className="FstoButtonImport-root"
          variant="contained"
          component="label"
          loadingPosition="start"
          loading={isImporting}
          startIcon={<UploadFileIcon />}
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
          onClick={() => {
            if (fetching) return

            setStatus(currentValue => (
              !currentValue
            ))
            statusChange()
          }}
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

        <TextField
          variant="outlined"
          size="small"
          autoComplete="off"
          placeholder="Search"
          InputProps={{
            className: "FstoTextfieldSearch-root",
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => {
                    if (fetching || !searchRef.current.value) return

                    searchRef.current.value = null
                    searchClear()
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
          inputRef={searchRef}
          onKeyPress={searchData}
        />
      </Box>

      <ErrorDialog
        open={error.open}
        data={error.data}
        onClose={errorCloseHandler}
      />
    </React.Fragment>
  )
}

export default AccountNumbersToolbar