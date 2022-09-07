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

const DocumentReturningFilter = (props) => {

  const { filterData } = props

  const {
    status: SUPPLIER_STATUS,
    data: SUPPLIER_LIST
  } = useSuppliers()

  const [filter, setFilter] = React.useState({
    from: new Date(),
    to: new Date(),
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

  const filterOpenHandler = (e) => {
    setAnchor(e.currentTarget)
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
      from: new Date(),
      to: new Date(),
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
        <Typography className="FstoTypographyFilter-root">Document Types:</Typography>
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
                    onChange={(e) => {
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
                    }}
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
              (props) => <TextField {...props} className="FstoTextfieldFilter-root" label="From Date" variant="outlined" size="small" />
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
              (props) => <TextField {...props} className="FstoTextfieldFilter-root" label="To Date" variant="outlined" size="small" />
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
          options={SUPPLIER_LIST || []}
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

        <Button
          className="FstoButtonFilter-root"
          variant="contained"
          color="primary"
          size="small"
          onClick={filterSubmitHandler}
          disableElevation
        > Apply
        </Button>

        <Button
          className="FstoButtonFilter-root"
          variant="text"
          size="small"
          onClick={filterClearHandler}
        > Clear All Filters
        </Button>
      </Popover>
    </React.Fragment>
  )
}

export default DocumentReturningFilter