import React from 'react'

import {
  Autocomplete,
  Button,
  Divider,
  IconButton,
  Paper,
  Popover,
  TextField,
  Typography
} from '@mui/material'

import {
  FilterList as FilterIcon
} from '@mui/icons-material'

import {
  DatePicker,
  LocalizationProvider
} from '@mui/lab'

import DateAdapter from '@mui/lab/AdapterDateFns'

import { createFilterOptions } from '@mui/material/Autocomplete'

import useSuppliers from '../../hooks/useSuppliers'
import useDepartments from '../../hooks/useDepartments'

const DocumentCounterReceiptFilter = (props) => {

  const {
    onFilter = () => { }
  } = props

  const {
    status: SUPPLIER_STATUS,
    data: SUPPLIER_LIST = []
  } = useSuppliers()

  const {
    status: DEPARTMENT_STATUS,
    data: DEPARTMENT_LIST = []
  } = useDepartments()

  const [anchor, setAnchor] = React.useState(null)
  const open = Boolean(anchor)

  const [filter, setFilter] = React.useState({
    from: new Date(),
    to: new Date(),
    suppliers: [],
    departments: []
  })

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    limit: 100
  })

  const filterOpenHandler = (e) => {
    setAnchor(e.currentTarget)
  }

  const filterCloseHandler = () => {
    setAnchor(null)
  }

  const filterSubmitHandler = () => {
    onFilter({
      from: filter.from,
      to: filter.to,
      suppliers: filter.suppliers.length ? filter.suppliers.map((item) => item.id) : null,
      departments: filter.departments.length ? filter.departments.map((item) => item.id) : null
    })

    filterCloseHandler()
  }

  const filterClearHandler = () => {
    setFilter({
      from: new Date(),
      to: new Date(),
      suppliers: [],
      departments: []
    })

    onFilter({
      from: null,
      to: null,
      suppliers: null,
      departments: null
    })
  }

  return (
    <React.Fragment>
      <IconButton className="FstoIconButtonFilter-root" onClick={filterOpenHandler}>
        <FilterIcon />
      </IconButton>

      <Popover
        className="FstoPopoverFilter-root"
        open={open}
        anchorEl={anchor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          className: "FstoPaperFilter-root"
        }}
        elevation={3}
        onClose={filterCloseHandler}
        disablePortal
      >
        <Typography className="FstoTypographyFilter-root">Transaction Date:</Typography>
        <LocalizationProvider dateAdapter={DateAdapter}>
          <DatePicker
            value={filter.from}
            onChange={(value) => setFilter(currentValue => ({
              ...currentValue,
              from: value
            }))}
            renderInput={
              (props) => <TextField {...props} className="FstoTextfieldFilter-root" label="From Date" variant="outlined" size="small" sx={{ marginBottom: 2 }} fullWidth />
            }
            PopperProps={{
              placement: "left",
              modifiers: [
                {
                  name: 'flip',
                  enabled: true,
                  options: {
                    altBoundary: true,
                    rootBoundary: 'document',
                    padding: 8,
                  },
                },
                {
                  name: 'preventOverflow',
                  enabled: true,
                  options: {
                    altAxis: false,
                    altBoundary: false,
                    tether: false,
                    rootBoundary: 'document',
                    padding: 8,
                  },
                }
              ]
            }}
            showToolbar
          />

          <DatePicker
            value={filter.to}
            onChange={(value) => setFilter(currentValue => ({
              ...currentValue,
              to: value
            }))}
            renderInput={
              (props) => <TextField {...props} className="FstoTextfieldFilter-root" label="To Date" variant="outlined" size="small" sx={{ marginBottom: 2 }} fullWidth />
            }
            PopperProps={{
              placement: "left",
              modifiers: [
                {
                  name: 'flip',
                  enabled: true,
                  options: {
                    altBoundary: true,
                    rootBoundary: 'document',
                    padding: 8,
                  },
                },
                {
                  name: 'preventOverflow',
                  enabled: true,
                  options: {
                    altAxis: false,
                    altBoundary: false,
                    tether: false,
                    rootBoundary: 'document',
                    padding: 8,
                  },
                }
              ]
            }}
            showToolbar
          />
        </LocalizationProvider>

        <Divider className="FstoDividerFilter-root" variant="middle" />

        <Typography className="FstoTypographyFilter-root">Supplier:</Typography>
        <Autocomplete
          className="FstoSelectForm-root"
          size="small"
          limitTags={5}
          filterOptions={filterOptions}
          options={SUPPLIER_LIST}
          value={filter.suppliers}
          loading={
            SUPPLIER_STATUS === 'loading'
          }
          sx={{
            width: '95%',
            marginLeft: '2.5%',
            marginRight: '2.5%'
          }}
          renderInput={
            (props) => <TextField {...props} label="Supplier" variant="outlined" />
          }
          PaperComponent={
            (props) => <Paper {...props} sx={{ textTransform: 'capitalize' }} />
          }
          getOptionLabel={
            (option) => option.name
          }
          isOptionEqualToValue={
            (option, value) => option.id === value.id
          }
          onChange={(e, value) => setFilter(currentValue => ({
            ...currentValue,
            suppliers: value
          }))}
          fullWidth
          multiple
          disableCloseOnSelect
        />

        <Divider className="FstoDividerFilter-root" variant="middle" />

        <Typography className="FstoTypographyFilter-root">Department:</Typography>
        <Autocomplete
          className="FstoSelectForm-root"
          size="small"
          limitTags={5}
          filterOptions={filterOptions}
          options={DEPARTMENT_LIST}
          value={filter.departments}
          loading={
            DEPARTMENT_STATUS === 'loading'
          }
          sx={{
            width: '95%',
            marginLeft: '2.5%',
            marginRight: '2.5%'
          }}
          renderInput={
            (props) => <TextField {...props} label="Department" variant="outlined" />
          }
          PaperComponent={
            (props) => <Paper {...props} sx={{ textTransform: 'capitalize' }} />
          }
          getOptionLabel={
            (option) => option.name
          }
          isOptionEqualToValue={
            (option, value) => option.id === value.id
          }
          onChange={(e, value) => setFilter(currentValue => ({
            ...currentValue,
            departments: value
          }))}
          fullWidth
          multiple
          disableCloseOnSelect
        />

        <Divider className="FstoDividerFilter-root" variant="middle" />

        <Button
          className="FstoButtonFilter-root"
          variant="contained"
          color="primary"
          size="small"
          onClick={filterSubmitHandler}
          disableElevation
        >
          Apply
        </Button>

        <Button
          className="FstoButtonFilter-root"
          variant="text"
          size="small"
          onClick={filterClearHandler}
        >
          Clear All Filters
        </Button>
      </Popover>
    </React.Fragment>
  )
}

export default DocumentCounterReceiptFilter