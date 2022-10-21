import React from 'react'

import {
  Autocomplete,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
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
import useUserDepartment from '../../hooks/useUserDepartment'

const DOCUMENT_TYPES = [
  {
    id: 1,
    type: "PAD"
  },
  {
    id: 2,
    type: "PRM Common"
  },
  {
    id: 3,
    type: "PRM Multiple"
  },
  {
    id: 4,
    type: "Receipt"
  },
  {
    id: 5,
    type: "Contractor's Billing"
  },
  {
    id: 6,
    type: "Utilities"
  },
  {
    id: 7,
    type: "Payroll"
  },
  {
    id: 8,
    type: "PCF"
  }
]

const DocumentRequestingFilter = (props) => {

  const { filterData } = props

  const {
    status: SUPPLIER_STATUS,
    data: SUPPLIER_LIST
  } = useSuppliers()

  const {
    status: USERDEPARTMENT_STATUS,
    data: USERDEPARTMENT_LIST
  } = useUserDepartment()

  const [filter, setFilter] = React.useState({
    from: null,
    to: null,
    types: [1, 2, 3, 4, 5, 6, 7, 8],
    suppliers: [],
    departments: []
  })

  const [anchor, setAnchor] = React.useState(null)
  const open = Boolean(anchor)

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    limit: 100
  })

  const filterOpenHandler = (event) => {
    setAnchor(event.currentTarget)
  }

  const filterCloseHandler = () => {
    setAnchor(null)
  }

  const filterSubmitHandler = () => {
    filterData({
      from: filter.from,
      to: filter.to,
      types: filter.types,
      suppliers: filter.suppliers.length ? filter.suppliers.map((item) => item.id) : null,
      department: filter.departments.length ? filter.departments.map((item) => item.name) : null
    })

    filterCloseHandler()
  }

  const filterClearHandler = () => {
    setFilter({
      from: null,
      to: null,
      types: [1, 2, 3, 4, 5, 6, 7, 8],
      suppliers: [],
      departments: []
    })

    filterData({
      filter: 0,
      from: null,
      to: null,
      types: null,
      suppliers: null,
      department: null
    })
  }

  const filterCheckHandler = (e) => {
    const check = e.target.checked

    if (check)
      setFilter(currentValue => ({
        ...currentValue,
        types: [...currentValue.types, parseInt(e.target.value)]
      }))
    else
      setFilter(currentValue => ({
        ...currentValue,
        types: [...currentValue.types.filter(type => type !== parseInt(e.target.value))]
      }))
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
        <Typography className="FstoTypographyFilter-root" marginTop={2}>Document Types:</Typography>
        <FormGroup row>
          {
            DOCUMENT_TYPES.map((item) => (
              <FormControlLabel
                className="FstoCheckboxFilter-root"
                key={item.id}
                label={item.type}
                control={
                  <Checkbox
                    size="small"
                    value={item.id}
                    checked={filter.types.includes(item.id)}
                    onChange={filterCheckHandler}
                  />
                }
                disableTypography
              />
            ))}
        </FormGroup>

        <Divider className="FstoDividerFilter-root" variant="middle" />

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
              placement: "left"
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
              (props) => <TextField {...props} className="FstoTextfieldFilter-root" label="To Date" variant="outlined" size="small" fullWidth />
            }
            PopperProps={{
              placement: "left"
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
          options={SUPPLIER_LIST || []}
          value={filter.suppliers}
          loading={
            SUPPLIER_STATUS === 'loading'
          }
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

        {
          USERDEPARTMENT_LIST && USERDEPARTMENT_LIST.length >= 2 &&
          <React.Fragment>
            <Divider className="FstoDividerFilter-root" variant="middle" />

            <Typography className="FstoTypographyFilter-root">Department:</Typography>
            <Autocomplete
              className="FstoSelectForm-root"
              size="small"
              limitTags={5}
              filterOptions={filterOptions}
              options={USERDEPARTMENT_LIST || []}
              value={filter.departments}
              loading={
                USERDEPARTMENT_STATUS === 'loading'
              }
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
          </React.Fragment>
        }

        <Divider className="FstoDividerFilter-root" variant="middle" />

        <Button
          className="FstoButtonFilter-root"
          variant="contained"
          color="primary"
          sx={{
            marginLeft: 1
          }}
          onClick={filterSubmitHandler}
          disableElevation
        > Apply
        </Button>

        <Button
          className="FstoButtonFilter-root"
          variant="text"
          onClick={filterClearHandler}
        > Clear All Filters
        </Button>
      </Popover>
    </React.Fragment>
  )
}

export default DocumentRequestingFilter