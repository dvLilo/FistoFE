import React from 'react'

import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material'

import {
  Add,
  Close,
  Delete,
  Edit
} from '@mui/icons-material'

import useAccountTitleCOA from "../../../hooks/useAccountTitleCOA"
import useCompanyCOA from "../../../hooks/useCompanyCOA"
import useDepartmentCOA from "../../../hooks/useDepartmentCOA"
import useLocationCOA from "../../../hooks/useLocationCOA"

const ENTRY_LIST = ["Debit", "Credit"]

const TransactionTypesDialog = ({
  open = false,
  onClose = () => { },

  accounts = [],
  onInsert = () => { },
  onUpdate = () => { },
  onRemove = () => { }
}) => {

  const [chartAccount, setChartAccount] = React.useState({
    update: false,
    index: null,

    entry: null,
    account_title: null,
    company: null,
    department: null,
    location: null
  })

  const {
    data: ACCOUNT_TITLE_LIST,
    status: ACCOUNT_TITLE_STATUS
  } = useAccountTitleCOA({ enabled: open })

  const {
    data: COMPANY_LIST,
    status: COMPANY_STATUS
  } = useCompanyCOA({ enabled: open })

  const {
    data: DEPARTMENT_LIST,
    status: DEPARTMENT_STATUS
  } = useDepartmentCOA({
    enabled: !!chartAccount.company,
    company: chartAccount.company?.id
  })

  const {
    data: LOCATION_LIST,
    status: LOCATION_STATUS
  } = useLocationCOA({
    enabled: !!chartAccount.department,
    department: chartAccount.department?.id
  })


  const onAccountClearHandler = () => {
    setChartAccount({
      update: false,
      index: null,

      entry: null,
      account_title: null,
      company: null,
      department: null,
      location: null
    })
  }

  const onAccountCloseHandler = () => {
    onAccountClearHandler()
    onClose()
  }

  const onAccountSubmitHandler = () => {
    if (chartAccount.update) {
      const { update, index, ...data } = chartAccount

      onUpdate(data, index)
    }

    if (!chartAccount.update) {
      const { update, index, ...data } = chartAccount

      onInsert(data)
    }

    onAccountClearHandler()
  }

  const onAccountUpdateHandler = (data, index) => {
    setChartAccount((currentValue) => ({
      ...currentValue,
      update: true,
      index: index,

      ...data
    }))
  }

  const onAccountRemoveHandler = (index) => {
    onRemove(index)
  }

  return (
    <Dialog
      className="FstoDialogChartAccount-root"
      open={open}
      PaperProps={{
        className: "FstoPaperChartAccount-root"
      }}
      fullWidth
      disablePortal
    >
      <DialogTitle className="FstoDialogChartAccount-title">
        Setup Default COA
        <IconButton size="large" onClick={onAccountCloseHandler}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent className="FstoDialogChartAccount-content">
        <Box className="FstoBoxChartAccount-root" sx={{ marginBottom: 5 }}>
          <Autocomplete
            className="FstoSelectForm-root"
            size="small"
            options={ENTRY_LIST}
            value={chartAccount.entry}
            renderInput={
              (props) => <TextField {...props} name="entry" label="Entry" variant="outlined" />
            }
            componentsProps={{
              paper: {
                sx: { textTransform: 'capitalize' }
              },
              popper: {
                placement: 'bottom-start'
              }
            }}
            isOptionEqualToValue={
              (option, value) => option === value
            }
            onChange={(e, value) => setChartAccount((currentValue) => ({
              ...currentValue,
              entry: value
            }))}
            disablePortal
            disableClearable
          />

          <Autocomplete
            className="FstoSelectForm-root"
            size="small"
            options={ACCOUNT_TITLE_LIST}
            value={chartAccount.account_title}
            loading={
              ACCOUNT_TITLE_STATUS === 'loading'
            }
            renderInput={
              (props) => <TextField {...props} label="Account Title" variant="outlined" />
            }
            componentsProps={{
              paper: {
                sx: { textTransform: 'capitalize' }
              },
              popper: {
                placement: 'bottom-start'
              }
            }}
            getOptionLabel={
              (option) => `${option.code} - ${option.name}`
            }
            isOptionEqualToValue={
              (option, value) => option.id === value.id
            }
            onChange={(e, value) => setChartAccount((currentValue) => ({
              ...currentValue,
              account_title: value
            }))}
            // disablePortal
            disableClearable
          />

          <Autocomplete
            className="FstoSelectForm-root"
            size="small"
            options={COMPANY_LIST}
            value={chartAccount.company}
            loading={
              COMPANY_STATUS === 'loading'
            }
            renderInput={
              (props) => <TextField {...props} label="Company" variant="outlined" />
            }
            componentsProps={{
              paper: {
                sx: { textTransform: 'capitalize' }
              },
              popper: {
                placement: 'bottom-start'
              }
            }}
            getOptionLabel={
              (option) => option.name
            }
            isOptionEqualToValue={
              (option, value) => option.id === value.id
            }
            onChange={(e, value) => setChartAccount((currentValue) => ({
              ...currentValue,
              company: value
            }))}
            // disablePortal
            disableClearable
          />

          <Autocomplete
            className="FstoSelectForm-root"
            size="small"
            options={DEPARTMENT_LIST}
            value={chartAccount.department}
            loading={
              DEPARTMENT_STATUS === 'loading'
            }
            renderInput={
              (props) => <TextField {...props} label="Department" variant="outlined" />
            }
            componentsProps={{
              paper: {
                sx: { textTransform: 'capitalize' }
              },
              popper: {
                placement: 'bottom-start'
              }
            }}
            getOptionLabel={
              (option) => option.name
            }
            isOptionEqualToValue={
              (option, value) => option.id === value.id
            }
            onChange={(e, value) => setChartAccount((currentValue) => ({
              ...currentValue,
              department: value
            }))}
            // disablePortal
            disableClearable
          />

          <Autocomplete
            className="FstoSelectForm-root"
            size="small"
            options={LOCATION_LIST}
            value={chartAccount.location}
            loading={
              LOCATION_STATUS === 'loading'
            }
            renderInput={
              (props) => <TextField {...props} label="Location" variant="outlined" />
            }
            componentsProps={{
              paper: {
                sx: { textTransform: 'capitalize' }
              },
              popper: {
                placement: "bottom"
              }
            }}
            getOptionLabel={
              (option) => option.name
            }
            isOptionEqualToValue={
              (option, value) => option.id === value.id
            }
            onChange={(e, value) => setChartAccount((currentValue) => ({
              ...currentValue,
              location: value
            }))}
            // disablePortal
            disableClearable
          />

          <Button
            className="FstoButtonForm-root"
            variant="contained"
            onClick={onAccountSubmitHandler}
            startIcon={
              chartAccount.update ? <Edit /> : <Add />
            }
            disabled={
              !chartAccount.entry ||
              !chartAccount.account_title ||
              !chartAccount.company ||
              !chartAccount.department ||
              !chartAccount.location
            }
            disableElevation
          >
            {chartAccount.update ? "Update" : "Add"}
          </Button>
        </Box>

        <TableContainer>
          {
            !!accounts.length &&
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Entry</TableCell>
                  <TableCell>Account Title</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {
                  accounts.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.entry}</TableCell>
                      <TableCell>{item.account_title.name}</TableCell>
                      <TableCell>{item.company.name}</TableCell>
                      <TableCell>{item.department.name}</TableCell>
                      <TableCell>{item.location.name}</TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => onAccountUpdateHandler(item, index)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => onAccountRemoveHandler(index)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          }
        </TableContainer>
      </DialogContent>

      <DialogActions className="FstoDialogChartAccount-actions">
        <Button
          variant="contained"
          onClick={onAccountCloseHandler}
          disabled={
            !accounts.length
          }
          disableElevation
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TransactionTypesDialog