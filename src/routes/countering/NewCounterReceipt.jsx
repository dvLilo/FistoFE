import React from 'react'

import NumberFormat from 'react-number-format'

import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material'

import {
  DatePicker,
  LoadingButton,
  LocalizationProvider
} from '@mui/lab'

import {
  Add,
  Check,
  Delete,
  Edit
} from '@mui/icons-material'

import DateAdapter from '@mui/lab/AdapterDateFns'

const NumberField = React.forwardRef((props, ref) => {
  const { onChange, ...rest } = props

  return (
    <NumberFormat
      {...rest}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        })
      }}
      prefix="₱"
      allowNegative={false}
      thousandSeparator
      isNumericString
    />
  )
})

const NewCounterReceipt = () => {

  const submitCounterReceiptHandler = (e) => {
    e.preventDefault()
  }

  return (
    <Box className="FstoBox-root">
      <Paper className="FstoPaperForm-root" elevation={1}>
        <Typography variant="heading" sx={{ display: 'block', marginBottom: 3 }}>Counter Receipt</Typography>

        <Stack component="form" gap={2} onSubmit={submitCounterReceiptHandler}>
          <Autocomplete
            size="small"
            // filterOptions={filterOptions}
            options={[]}
            value={null}
            loading={false}
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
            onChange={(e, value) => console.log(value)}
            disabled={false}
            fullWidth
            disablePortal
            disableClearable
          />

          <TextField
            label="Remarks (Optional)"
            variant="outlined"
            autoComplete="off"
            size="small"
            rows={3}
            value={null}
            onChange={(e) => console.log(e.target.value)}
            InputLabelProps={{
              className: "FstoLabelForm-root"
            }}
            fullWidth
            multiline
          />

          <Stack direction="row" gap={1}>
            <LoadingButton
              type="submit"
              variant="contained"
              loadingPosition="start"
              loading={false}
              startIcon={<Check />}
              disabled={false}
              disableElevation
            > Save
            </LoadingButton>

            <Button
              variant="outlined"
              color="error"
              onClick={() => console.log("Clear counter receipt form.")}
              disableElevation
            > Clear/Back
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Paper className="FstoPaperAttachment-root" elevation={1}>
        <Typography variant="heading" sx={{ display: 'block', marginBottom: 3 }}>Attachment</Typography>

        <Stack direction="row" gap={1}>
          <Autocomplete
            size="small"
            // filterOptions={filterOptions}
            options={[]}
            value={null}
            loading={false}
            renderInput={
              (props) => <TextField {...props} label="Department" variant="outlined" />
            }
            getOptionLabel={
              (option) => option.name
            }
            isOptionEqualToValue={
              (option, value) => option.id === value.id
            }
            onChange={(e, value) => console.log(value)}
            disabled={false}
            fullWidth
            disablePortal
            disableClearable
          />

          <Autocomplete
            size="small"
            // filterOptions={filterOptions}
            options={[]}
            value={null}
            loading={false}
            renderInput={
              (props) => <TextField {...props} label="Type" variant="outlined" />
            }
            getOptionLabel={
              (option) => option.name
            }
            isOptionEqualToValue={
              (option, value) => option.id === value.id
            }
            onChange={(e, value) => console.log(value)}
            sx={{
              minWidth: 128
            }}
            disabled={false}
            // fullWidth
            disablePortal
            disableClearable
          />

          <TextField
            label="Receipt No."
            variant="outlined"
            autoComplete="off"
            size="small"
            type="number"
            value={null}
            onKeyPress={(e) => {
              ["E", "e", ".", "+", "-"].includes(e.key) && e.preventDefault()
            }}
            onChange={(e) => console.log(e.target.value)}
            disabled={false}
            fullWidth
          />

          <LocalizationProvider dateAdapter={DateAdapter}>
            <DatePicker
              value={null}
              onChange={(value) => console.log(value)}
              renderInput={
                (props) => <TextField {...props} label="Release Date" variant="outlined" size="small" onKeyPress={(e) => e.preventDefault()} fullWidth />
              }
              showToolbar
              showTodayButton
            />
          </LocalizationProvider>

          <TextField
            label="Amount"
            variant="outlined"
            autoComplete="off"
            size="small"
            value={null}
            InputProps={{
              inputComponent: NumberField,
            }}
            onChange={(e) => console.log(e.target.value)}
            disabled={false}
            fullWidth
          />

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => console.log("Clear counter receipt form.")}
            sx={{
              minWidth: 96
            }}
            disableElevation
          > Add
          </Button>
        </Stack>

        <Box className="FstoBoxCounterReceipts-root">
          <Box className="FstoBoxCounterReceipt-root">
            <Stack className="FstoStackCounterReceipt-root" direction="column">
              <Typography variant="subtitle2">Departnemt</Typography>
              <Typography className="FstoTypographyCounterReceipts-root" variant="h6">Management Information System Common</Typography>
            </Stack>

            <Stack className="FstoStackCounterReceipt-root short" direction="column">
              <Typography variant="subtitle2">Type</Typography>
              <Typography className="FstoTypographyCounterReceipts-root" variant="h6">SI</Typography>
            </Stack>

            <Stack className="FstoStackCounterReceipt-root" direction="column">
              <Typography variant="subtitle2">Receipt No.</Typography>
              <Typography className="FstoTypographyCounterReceipts-root" variant="h6">REF#10278</Typography>
            </Stack>

            <Stack className="FstoStackCounterReceipt-root short" direction="column">
              <Typography variant="subtitle2">Date</Typography>
              <Typography className="FstoTypographyCounterReceipts-root" variant="h6">09/29/2022</Typography>
            </Stack>

            <Stack className="FstoStackCounterReceipt-root" direction="column">
              <Typography variant="subtitle2">Amount</Typography>
              <Typography className="FstoTypographyCounterReceipts-root" variant="h6">&#8369;25,000.00</Typography>
            </Stack>

            <Stack direction="row" gap={1}>
              <IconButton>
                <Edit fontSize="small" />
              </IconButton>

              <IconButton>
                <Delete fontSize="small" />
              </IconButton>
            </Stack>
          </Box>

          <Box className="FstoBoxCounterReceipt-root">
            <Stack className="FstoStackCounterReceipt-root" direction="column">
              <Typography variant="subtitle2">Departnemt</Typography>
              <Typography className="FstoTypographyCounterReceipts-root" variant="h6">Management Information System Common</Typography>
            </Stack>

            <Stack className="FstoStackCounterReceipt-root short" direction="column">
              <Typography variant="subtitle2">Type</Typography>
              <Typography className="FstoTypographyCounterReceipts-root" variant="h6">INTERNAL</Typography>
            </Stack>

            <Stack className="FstoStackCounterReceipt-root" direction="column">
              <Typography variant="subtitle2">Receipt No.</Typography>
              <Typography className="FstoTypographyCounterReceipts-root" variant="h6">REF#10278</Typography>
            </Stack>

            <Stack className="FstoStackCounterReceipt-root short" direction="column">
              <Typography variant="subtitle2">Date</Typography>
              <Typography className="FstoTypographyCounterReceipts-root" variant="h6">09/29/2022</Typography>
            </Stack>

            <Stack className="FstoStackCounterReceipt-root" direction="column">
              <Typography variant="subtitle2">Amount</Typography>
              <Typography className="FstoTypographyCounterReceipts-root" variant="h6">&#8369;25,000.00</Typography>
            </Stack>

            <Stack direction="row" gap={1}>
              <IconButton>
                <Edit fontSize="small" />
              </IconButton>

              <IconButton>
                <Delete fontSize="small" />
              </IconButton>
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default NewCounterReceipt