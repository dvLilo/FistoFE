import React from 'react'

import NumberFormat from 'react-number-format'

import {
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Paper,
  TextField,
  Box,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Stack,
  Divider,
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'

import useCompanyCOA from '../hooks/useCompanyCOA'
import useDepartmentCOA from '../hooks/useDepartmentCOA'
import useLocationCOA from '../hooks/useLocationCOA'
import useAccountEntryCOA from '../hooks/useAccountEntryCOA'

const ENTRY_LIST = ["Debit", "Credit"]

const NumberField = React.forwardRef(function NumberField(props, ref) {
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
          }
        })
      }}
      prefix="₱"
      allowNegative={false}
      thousandSeparator
      isNumericString
    />
  )
})

const AccountTitleDialog = ({
  open = false,
  state = null,
  transaction = null,
  accounts = [],
  onInsert = () => { },
  onUpdate = () => { },
  onRemove = () => { },
  onBack = () => { },
  onClear = () => { },
  onClose = () => { },
  onSubmit = () => { }
}) => {

  const [AT, setAT] = React.useState({
    update: false,
    index: null,

    entry: null,
    account_title: null,
    company: null,
    department: null,
    location: null,
    amount: "",
    remarks: ""
  })

  const {
    data: COMPANY_LIST,
    status: COMPANY_STATUS
  } = useCompanyCOA({ enabled: open })

  const {
    data: DEPARTMENT_LIST,
    status: DEPARTMENT_STATUS
  } = useDepartmentCOA({ enabled: !!AT.company?.id, company: AT.company?.id })

  const {
    data: LOCATION_LIST,
    status: LOCATION_STATUS
  } = useLocationCOA({ enabled: !!AT.department?.id, department: AT.department?.id })

  const {
    data: ACCOUNT_ENTRY_LIST,
    status: ACCOUNT_ENTRY_STATUS
  } = useAccountEntryCOA({ enabled: !!transaction?.transaction_type_id, type: transaction?.transaction_type_id })

  React.useEffect(() => {
    if (!open) clearAccountTitleHandler()

    // eslint-disable-next-line
  }, [open])

  React.useEffect(() => {
    if (AT.entry && AT.entry === "Debit") {
      setAT((currentValue) => ({
        ...currentValue,

        company: {
          id: transaction.company_id,
          code: transaction.company_code,
          name: transaction.company
        },
        department: {
          id: transaction.department_id,
          code: transaction.department_code,
          name: transaction.department,
        },
        location: {
          id: transaction.location_id,
          code: transaction.location_code,
          name: transaction.location,
        }
      }))
    }

    if (AT.entry && AT.entry === "Credit") {
      switch (transaction.company_code) {
        case "10":
          setAT((currentValue) => ({
            ...currentValue,

            company: {
              id: transaction.company_id,
              code: transaction.company_code,
              name: transaction.company
            },
            department: {
              id: 3,
              code: "0010",
              name: "Corporate Common",
            },
            location: {
              id: 2,
              code: "0001",
              name: "Head Office",
            }
          }))
          break

        case "21":
          setAT((currentValue) => ({
            ...currentValue,

            company: {
              id: transaction.company_id,
              code: transaction.company_code,
              name: transaction.company
            },
            department: {
              id: 40,
              code: "2105",
              name: "Feedmill Services",
            },
            location: {
              id: 5,
              code: "1001",
              name: "FM - Lara",
            }
          }))
          break

        case "22":
          setAT((currentValue) => ({
            ...currentValue,

            company: {
              id: transaction.company_id,
              code: transaction.company_code,
              name: transaction.company
            },
            department: {
              id: 42,
              code: "3110",
              name: "Broiler Farms",
            },
            location: {
              id: 1,
              code: "0000",
              name: "Common",
            }
          }))
          break

        case "23":
          setAT((currentValue) => ({
            ...currentValue,

            company: {
              id: transaction.company_id,
              code: transaction.company_code,
              name: transaction.company
            },
            department: {
              id: 48,
              code: "4100",
              name: "Swine Production Common",
            },
            location: {
              id: 1,
              code: "0000",
              name: "Common",
            }
          }))
          break

        case "31":
          setAT((currentValue) => ({
            ...currentValue,

            company: {
              id: transaction.company_id,
              code: transaction.company_code,
              name: transaction.company
            },
            department: {
              id: 51,
              code: "5001",
              name: "Meatshop Administration",
            },
            location: {
              id: 1,
              code: "0000",
              name: "Common",
            }
          }))
          break

        default:
          console.log("There is no company defined in this static setup.")
      }
    }

    // eslint-disable-next-line
  }, [AT.entry])


  const addAccountTitleHandler = () => {
    const isDefault = transaction?.company_id === AT.company.id && transaction?.department_id === AT.department.id && transaction?.location_id === AT.location.id

    if (!AT.update)
      onInsert({
        entry: AT.entry,
        amount: parseFloat(AT.amount),
        remarks: AT.remarks,
        is_default: AT.entry === "Debit" ? isDefault : true,

        account_title: AT.account_title,
        company: AT.company,
        department: AT.department,
        location: AT.location
      })


    if (!!AT.update)
      onUpdate({
        entry: AT.entry,
        amount: parseFloat(AT.amount),
        remarks: AT.remarks,
        is_default: AT.entry === "Debit" ? isDefault : true,

        account_title: AT.account_title,
        company: AT.company,
        department: AT.department,
        location: AT.location
      }, AT.index)

    clearAccountTitleHandler()
  }

  const editAccountTitleHandler = (item, index) => {
    setAT({
      update: true,
      index,

      ...item,
      amount: item.amount.toString(),
      remarks: item.remarks || ""
    })
  }

  const removeAccountTitleHandler = (index) => {
    onRemove(index)
  }


  const submitAccountTitleHandler = () => {
    onClose()
    onSubmit()
  }

  const backAccountTitleHandler = () => {
    onClose()
    onBack(transaction)
  }

  const clearAccountTitleHandler = () => {
    setAT({
      update: false,
      index: null,

      entry: null,
      account_title: null,
      company: null,
      department: null,
      location: null,
      amount: "",
      remarks: ""
    })
  }

  const closeAccountTitleHandler = () => {
    onClose()
    onClear()
    clearAccountTitleHandler()
  }

  return (
    <Dialog
      className="FstoDialogAccountTitle-root"
      open={open}
      PaperProps={{
        className: "FstoPaperAccountTitle-root"
      }}
      fullWidth
      disablePortal
    >
      <DialogTitle className="FstoDialogAccountTitle-title">
        Account Title Entry
        <IconButton size="large" onClick={closeAccountTitleHandler}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="FstoDialogAccountTitle-content">
        {
          Boolean(state) && !Boolean(state.match(/approve-|transmit-|release-|file-|reverse-|pending-|audit-|executive-|issue-|counter-.*/)) &&
          <Box className="FstoBoxAccountTitle-root FstoBoxAccountTitle-form">
            <Autocomplete
              className="FstoSelectForm-root"
              size="small"
              options={ENTRY_LIST}
              value={AT.entry}
              disabled={Boolean(state) && Boolean(state.match(/cheque-|clear-|debit-|return-.*/))}
              renderInput={
                (props) => <TextField {...props} label="Entry" variant="outlined" />
              }
              PaperComponent={
                (props) => <Paper {...props} sx={{ textTransform: 'capitalize' }} />
              }
              getOptionDisabled={
                (option) => !accounts.some((item) => item.entry.toLowerCase() === `debit`) && option.toLowerCase() === `credit`
              }
              isOptionEqualToValue={
                (option, value) => option === value
              }
              onChange={(_, value) => {
                const isMultipleSelection = ACCOUNT_ENTRY_LIST.filter((item) => item.entry.toLowerCase() === value.toLowerCase()).length > 1

                if (isMultipleSelection) {
                  setAT(currentValue => ({
                    ...currentValue,
                    entry: value,
                    account_title: null,
                    company: null,
                    department: null,
                    location: null
                  }))
                }
                else {
                  const account = ACCOUNT_ENTRY_LIST.find((item) => item.entry.toLowerCase() === value.toLowerCase())

                  setAT(currentValue => ({
                    ...currentValue,
                    entry: value,
                    account_title: account.account_title,
                    company: null,
                    department: null,
                    location: null
                  }))
                }
              }}
              disablePortal
              disableClearable
            />

            <Autocomplete
              className="FstoSelectForm-root"
              size="small"
              options={ACCOUNT_ENTRY_LIST.filter((item) => item.entry.toLowerCase() === AT.entry?.toLowerCase()).map((item) => item.account_title) || []}
              value={AT.account_title}
              disabled={Boolean(state) && Boolean(state.match(/cheque-|clear-|debit-|return-.*/))}
              loading={
                ACCOUNT_ENTRY_STATUS === 'loading'
              }
              renderInput={
                (props) => <TextField {...props} label="Account Title" variant="outlined" />
              }
              PaperComponent={
                (props) => <Paper {...props} sx={{ textTransform: 'capitalize' }} />
              }
              getOptionLabel={
                (option) => `${option.code} - ${option.name}`
              }
              getOptionDisabled={
                (option) => accounts.some((item) => item.account_title.id === option.id)
              }
              isOptionEqualToValue={
                (option, value) => option.id === value.id
              }
              onChange={(e, value) => setAT(currentValue => ({
                ...currentValue,
                account_title: value
              }))}
              disablePortal
              disableClearable
            />

            <Autocomplete
              className="FstoSelectForm-root"
              size="small"
              options={COMPANY_LIST}
              value={AT.company}
              disabled={
                AT.entry === 'Credit'
              }
              loading={
                COMPANY_STATUS === 'loading'
              }
              renderInput={
                (props) => <TextField {...props} label="Company" variant="outlined" />
              }
              componentsProps={{
                paper: {
                  sx: { textTransform: 'capitalize' }
                }
              }}
              getOptionLabel={
                (option) => `${option.code} - ${option.name}`
              }
              isOptionEqualToValue={
                (option, value) => option.id === value.id
              }
              onChange={(e, value) => setAT(currentValue => ({
                ...currentValue,
                company: value,
                department: null,
                location: null
              }))}
              disablePortal
              disableClearable
            />

            <Autocomplete
              className="FstoSelectForm-root"
              size="small"
              options={DEPARTMENT_LIST}
              value={AT.department}
              disabled={
                AT.entry === 'Credit'
              }
              loading={
                DEPARTMENT_STATUS === 'loading'
              }
              renderInput={
                (props) => <TextField {...props} label="Department" variant="outlined" />
              }
              componentsProps={{
                paper: {
                  sx: { textTransform: 'capitalize' }
                }
              }}
              getOptionLabel={
                (option) => `${option.code} - ${option.name}`
              }
              isOptionEqualToValue={
                (option, value) => option.id === value.id
              }
              onChange={(e, value) => setAT(currentValue => ({
                ...currentValue,
                department: value,
                location: null
              }))}
              disablePortal
              disableClearable
            />

            <Autocomplete
              className="FstoSelectForm-root"
              size="small"
              options={LOCATION_LIST}
              value={AT.location}
              disabled={
                AT.entry === 'Credit'
              }
              loading={
                LOCATION_STATUS === 'loading'
              }
              renderInput={
                (props) => <TextField {...props} label="Location" variant="outlined" />
              }
              componentsProps={{
                paper: {
                  sx: { textTransform: 'capitalize' }
                }
              }}
              getOptionLabel={
                (option) => `${option.code} - ${option.name}`
              }
              isOptionEqualToValue={
                (option, value) => option.id === value.id
              }
              onChange={(e, value) => setAT(currentValue => ({
                ...currentValue,
                location: value
              }))}
              disablePortal
              disableClearable
            />

            <TextField
              className="FstoTextfieldForm-root"
              label="Amount"
              variant="outlined"
              autoComplete="off"
              size="small"
              value={AT.amount}
              InputProps={{
                inputComponent: NumberField
              }}
              onChange={(e) => setAT(currentValue => ({
                ...currentValue,
                amount: e.target.value
              }))}
            />

            <TextField
              className="FstoTextfieldForm-root"
              label="Remarks (Optional)"
              variant="outlined"
              autoComplete="off"
              size="small"
              value={AT.remarks}
              onChange={(e) => setAT(currentValue => ({
                ...currentValue,
                remarks: e.target.value
              }))}
            />

            <Button
              className="FstoButtonForm-root"
              variant="contained"
              startIcon={
                AT.update ? <EditIcon /> : <AddIcon />
              }
              onClick={addAccountTitleHandler}
              disabled={
                !Boolean(AT.entry) ||
                !Boolean(AT.account_title) ||
                !Boolean(AT.company) ||
                !Boolean(AT.department) ||
                !Boolean(AT.location) ||
                !Boolean(AT.amount)
              }
              disableElevation
            > {AT.update ? "Update" : "Add"}
            </Button>
          </Box>
        }

        <Stack direction="column" flex={1}>
          <TableContainer sx={{ marginBottom: 5 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Chart Of Account</TableCell>
                  <TableCell className="FstoTabelCellAccountTitle-root" align="right">Debit</TableCell>
                  <TableCell>Credit</TableCell>
                  {
                    Boolean(state) && !Boolean(state.match(/approve-|transmit-|release-|file-|reverse-|pending-|audit-|executive-|issue-|counter-.*/)) &&
                    <TableCell align="right">Action</TableCell>
                  }
                </TableRow>
              </TableHead>

              {
                Boolean(accounts.length) &&
                <TableBody className="FstoTableBodyAccountTitle-root">
                  {
                    accounts.map((item, index) => (
                      <TableRow className="FstoTableRowAccountTitle-root" key={index}>
                        <TableCell size="small">
                          <Stack direction="column">
                            <strong>{item.account_title.name}</strong>
                            <em>{item.company.name}</em>
                            <em>{item.department.name}</em>
                            <em>{item.location.name}</em>
                            <em>{item.remarks}</em>
                          </Stack>
                        </TableCell>

                        <TableCell className="FstoTabelCellAccountTitle-root" align="right" size="small">
                          {
                            item.entry === `Debit`
                              ? <React.Fragment>&#8369;{item.amount.toLocaleString()}</React.Fragment>
                              : <React.Fragment>&mdash;</React.Fragment>
                          }
                        </TableCell>

                        <TableCell size="small">
                          {
                            item.entry === `Credit`
                              ? <React.Fragment>&#8369;{item.amount.toLocaleString()}</React.Fragment>
                              : <React.Fragment>&mdash;</React.Fragment>
                          }
                        </TableCell>

                        {
                          Boolean(state) && !Boolean(state.match(/approve-|transmit-|release-|file-|reverse-|pending-|audit-|executive-|issue-|counter-.*/)) &&
                          <TableCell align="right" size="small">
                            <IconButton onClick={() => editAccountTitleHandler(item, index)} disabled={Boolean(state) && Boolean(state.match(/cheque-|clear-|debit-|return-.*/)) && Boolean(item.entry.match(/debit.*/i))}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => removeAccountTitleHandler(index)} disabled={Boolean(state) && Boolean(state.match(/cheque-|clear-|debit-|return-.*/)) && Boolean(item.entry.match(/debit.*/i))}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        }
                      </TableRow>
                    ))}
                </TableBody>
              }

              {
                !Boolean(accounts.length) &&
                <TableBody className="FstoTableBodyAccountTitle-root">
                  <TableRow>
                    <TableCell align="center" colSpan={4}>
                      <Typography variant="body2" sx={{ paddingTop: 2, paddingBottom: 2 }}>NO DATA FOUND</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              }
            </Table>
          </TableContainer>

          <Stack className="FstoStackAccountTitle-root" direction="row">
            <Typography variant="body1" sx={{ flex: 1 }}>Total Debit Amount</Typography>
            <Typography variant="h6">
              &#8369;{accounts.filter((item) => item.entry === `Debit`).reduce((a, b) => a + b.amount, 0).toLocaleString()}
            </Typography>
          </Stack>

          <Stack className="FstoStackAccountTitle-root" direction="row">
            <Typography variant="body1" sx={{ flex: 1 }}>Total Credit Amount</Typography>
            <Typography variant="h6">
              &#8369;{accounts.filter((item) => item.entry === `Credit`).reduce((a, b) => a + b.amount, 0).toLocaleString()}
            </Typography>
          </Stack>

          <Divider variant="middle" sx={{ marginY: 2 }} />

          <Stack className="FstoStackAccountTitle-root" direction="row">
            <Typography variant="body1" sx={{ flex: 1 }}>Variance</Typography>
            <Typography variant="h6">
              &#8369;
              {((accounts.filter((item) => item.entry === `Debit`).map((item) => item.amount).reduce((a, b) => a + b, 0)) - (accounts.filter((item) => item.entry === `Credit`).map((item) => item.amount).reduce((a, b) => a + b, 0))).toLocaleString()}
            </Typography>
          </Stack>

          {
            accounts.some((item) => item.entry === `Debit`) &&
            accounts.some((item) => item.entry === `Credit`) &&
            accounts.filter((item) => item.entry === `Debit`).map((item) => item.amount).reduce((a, b) => a + b, 0) !== accounts.filter((item) => item.entry === `Credit`).map((item) => item.amount).reduce((a, b) => a + b, 0) &&
            <Stack className="FstoStackAccountTitle-root" direction="row" justifyContent="flex-end">
              <Typography variant="caption" color="error">Total debit and credit amount are not equal.</Typography>
            </Stack>}

          {
            !state?.match(/cheque|executive|issue|release|discharge|file|clear/gi) &&
            accounts.some((item) => item.entry === `Debit`) &&
            accounts.some((item) => item.entry === `Credit`) &&
            accounts.filter((item) => item.entry === `Debit`).reduce((a, b) => a + b.amount, 0) === accounts.filter((item) => item.entry === `Credit`).reduce((a, b) => a + b.amount, 0) &&
            accounts.filter((item) => item.entry === `Debit`).reduce((a, b) => a + b.amount, 0) !== (transaction?.document_amount || transaction?.referrence_amount) &&
            accounts.filter((item) => item.entry === `Credit`).reduce((a, b) => a + b.amount, 0) !== (transaction?.document_amount || transaction?.referrence_amount) &&
            <Stack className="FstoStackAccountTitle-root" direction="row" justifyContent="flex-end">
              <Typography variant="caption" color="error">Total debit, credit and document amount are not equal.</Typography>
            </Stack>}

          <Stack direction="row-reverse" gap={1} marginTop="auto">
            {
              Boolean(state) && !Boolean(state.match(/approve-|transmit-|release-|file-|reverse-|pending-|audit-|executive-|issue-|counter-.*/)) &&
              <Button
                variant="contained"
                onClick={submitAccountTitleHandler}
                disabled={
                  !Boolean(accounts.length) ||
                  !accounts.some((item) => item.entry.toLowerCase() === `debit`) ||
                  !accounts.some((item) => item.entry.toLowerCase() === `credit`) ||
                  (
                    Boolean(state) && !Boolean(state.match(/clear/gi)) && (
                      !(accounts.filter((item) => item.entry.toLowerCase() === `debit`).reduce((a, b) => a + b.amount, 0) === (transaction?.document_amount || transaction?.referrence_amount)) ||
                      !(accounts.filter((item) => item.entry.toLowerCase() === `credit`).reduce((a, b) => a + b.amount, 0) === (transaction?.document_amount || transaction?.referrence_amount)) ||
                      !(accounts.filter((item) => item.entry.toLowerCase() === `debit`).reduce((a, b) => a + b.amount, 0) === accounts.filter((item) => item.entry.toLowerCase() === `credit`).reduce((a, b) => a + b.amount, 0))
                    )
                  )
                }
                disableElevation
              > {state.match(/receive.*/) ? "Submit" : "Save"}
              </Button>}

            <Button
              variant="outlined"
              color="info"
              onClick={backAccountTitleHandler}
              disableElevation
            > Back
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog >
  )
}

export default AccountTitleDialog