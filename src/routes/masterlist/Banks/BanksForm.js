import React from 'react'

import axios from 'axios'

import {
  Paper,
  Button,
  TextField,
  Autocomplete,
  Divider
} from '@mui/material'

import { LoadingButton } from '@mui/lab'

import { createFilterOptions } from '@mui/material/Autocomplete'

import useAccountTitleCOA from '../../../hooks/useAccountTitleCOA'
import useCompanyCOA from '../../../hooks/useCompanyCOA'
import useDepartmentCOA from '../../../hooks/useDepartmentCOA'
import useLocationCOA from '../../../hooks/useLocationCOA'

const BanksForm = (props) => {

  const {
    data,
    refetchData,
    toast,
    confirm
  } = props

  const [isSaving, setIsSaving] = React.useState(false)
  const [isUpdating, setIsUpdating] = React.useState(false)

  const [error, setError] = React.useState(null)

  // Form Data State
  const [bank, setBank] = React.useState({
    code: "",
    name: "",
    branch: "",
    account_no: "",
    location: "",

    account_title_1: null,
    company_1: null,
    business_unit_1: null,
    department_1: null,
    sub_unit_1: null,
    location_1: null,

    account_title_2: null,
    company_2: null,
    business_unit_2: null,
    department_2: null,
    sub_unit_2: null,
    location_2: null,
  })


  const {
    data: ACCOUNT_TITLE_LIST,
    isLoading: ACCOUNT_TITLE_LOADING
  } = useAccountTitleCOA({ enabled: true })

  const {
    data: COMPANY_LIST,
    isLoading: COMPANY_LOADING
  } = useCompanyCOA({ enabled: true })


  const {
    data: DEPARTMENT_1_LIST,
    isLoading: DEPARTMENT_1_LOADING
  } = useDepartmentCOA({ enabled: !!bank.company_1?.id, company: bank.company_1?.id })

  const {
    data: DEPARTMENT_2_LIST,
    isLoading: DEPARTMENT_2_LOADING
  } = useDepartmentCOA({ enabled: !!bank.company_2?.id, company: bank.company_2?.id })

  const {
    data: LOCATION_1_LIST,
    isLoading: LOCATION_1_LOADING
  } = useLocationCOA({ enabled: !!bank.department_1?.id, department: bank.department_1?.id })

  const {
    data: LOCATION_2_LIST,
    isLoading: LOCATION_2_LOADING
  } = useLocationCOA({ enabled: !!bank.department_2?.id, department: bank.department_2?.id })


  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    limit: 100
  });

  React.useEffect(() => {
    if (data) {
      setIsUpdating(true)
      setBank({
        code: data.code,
        name: data.name,
        branch: data.branch,
        account_no: data.account_no,
        location: data.location,

        account_title_1: data.account_title_1,
        company_1: data.company_1,
        business_unit_1: data.business_unit_1,
        department_1: data.department_1,
        sub_unit_1: data.sub_unit_1,
        location_1: data.location_1,

        account_title_2: data.account_title_2,
        company_2: data.company_2,
        business_unit_2: data.business_unit_2,
        department_2: data.department_2,
        sub_unit_2: data.sub_unit_2,
        location_2: data.location_2
      })
    }
  }, [data])

  const formClearHandler = () => {
    setIsUpdating(false)
    setError({
      status: false,
      message: ""
    })
    setBank({
      code: "",
      name: "",
      branch: "",
      account_no: "",
      location: "",

      account_title_1: null,
      company_1: null,
      business_unit_1: null,
      department_1: null,
      sub_unit_1: null,
      location_1: null,

      account_title_2: null,
      company_2: null,
      business_unit_2: null,
      department_2: null,
      sub_unit_2: null,
      location_2: null
    })
  }

  const formSubmitHandler = (e) => {
    e.preventDefault()

    confirm({
      show: true,
      loading: false,
      onConfirm: async () => {
        confirm({
          show: false,
          loading: false,
          onConfirm: () => { }
        })
        setIsSaving(true)

        let response
        try {
          if (isUpdating)
            response = await axios.put(`/api/admin/banks/${data.id}`, {
              code: bank.code,
              name: bank.name,
              branch: bank.branch,
              account_no: bank.account_no,
              location: bank.location,

              account_title_1: bank.account_title_1.id,
              company_id_1: bank.company_1.id,
              business_unit_id_1: null,
              department_id_1: bank.department_1.id,
              sub_unit_id_1: null,
              location_id_1: bank.location_1.id,

              account_title_2: bank.account_title_2.id,
              company_id_2: bank.company_2.id,
              business_unit_id_2: null,
              department_id_2: bank.department_2.id,
              sub_unit_id_2: null,
              location_id_2: bank.location_2.id
            })
          else
            response = await axios.post(`/api/admin/banks`, {
              code: bank.code,
              name: bank.name,
              branch: bank.branch,
              account_no: bank.account_no,
              location: bank.location,

              account_title_1: bank.account_title_1.id,
              company_id_1: bank.company_1.id,
              business_unit_id_1: null,
              department_id_1: bank.department_1.id,
              sub_unit_id_1: null,
              location_id_1: bank.location_1.id,

              account_title_2: bank.account_title_2.id,
              company_id_2: bank.company_2.id,
              business_unit_id_2: null,
              department_id_2: bank.department_2.id,
              sub_unit_id_2: null,
              location_id_2: bank.location_2.id
            })

          toast({
            show: true,
            title: "Success",
            message: response.data.message
          })

          formClearHandler()
          refetchData() // refresh the table data
        }
        catch (error) {
          switch (error.request.status) {
            case 422:
              setError(error.response?.data?.errors)
              break

            case 304:
              formClearHandler()
              toast({
                show: true,
                title: "Info",
                message: "Nothing has changed.",
                severity: "info"
              })
              break

            default:
              toast({
                show: true,
                title: "Error",
                message: "Something went wrong whilst saving bank.",
                severity: "error"
              })
          }
        }

        setIsSaving(false)
      }
    })
  }

  return (
    <form onSubmit={formSubmitHandler}>
      <TextField
        className="FstoTextfieldForm-root"
        label="Bank Code"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={bank.code}
        helperText={error?.code && error?.code?.at(0)}
        error={!!error?.code}
        onChange={(e) => setBank({
          ...bank,
          code: e.target.value
        })}
        InputLabelProps={{
          className: "FstoLabelForm-root"
        }}
        fullWidth
      />

      <TextField
        className="FstoTextfieldForm-root"
        label="Bank Name"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={bank.name}
        helperText={error?.name && error?.name?.at(0)}
        error={!!error?.name}
        onChange={(e) => setBank({
          ...bank,
          name: e.target.value
        })}
        InputLabelProps={{
          className: "FstoLabelForm-root"
        }}
        fullWidth
      />

      <TextField
        className="FstoTextfieldForm-root"
        label="Branch"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={bank.branch}
        helperText={error?.branch && error?.branch?.at(0)}
        error={!!error?.branch}
        onChange={(e) => setBank({
          ...bank,
          branch: e.target.value
        })}
        InputLabelProps={{
          className: "FstoLabelForm-root"
        }}
        fullWidth
      />

      <TextField
        className="FstoTextfieldForm-root"
        label="Account Number"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={bank.account_no}
        helperText={error?.account_no && error?.account_no?.at(0)}
        error={!!error?.account_no}
        onChange={(e) => setBank({
          ...bank,
          account_no: e.target.value
        })}
        InputLabelProps={{
          className: "FstoLabelForm-root"
        }}
        fullWidth
      />

      <TextField
        className="FstoTextfieldForm-root"
        label="Location"
        variant="outlined"
        autoComplete="off"
        size="small"
        value={bank.location}
        onChange={(e) => setBank({
          ...bank,
          location: e.target.value
        })}
        InputLabelProps={{
          className: "FstoLabelForm-root"
        }}
        fullWidth
      />

      <Divider variant="middle" sx={{ marginBottom: "1.25em" }} />

      <Autocomplete
        className="FstoSelectForm-root"
        size="small"
        value={bank.account_title_1}
        options={ACCOUNT_TITLE_LIST}
        loading={ACCOUNT_TITLE_LOADING}
        filterOptions={filterOptions}
        renderInput={
          (props) => <TextField {...props} variant="outlined" label="Cheque Creation" />
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
        onChange={(_, value) => setBank({
          ...bank,
          account_title_1: value
        })}
        fullWidth
        disablePortal
        disableClearable
      />

      <Autocomplete
        className="FstoSelectForm-root"
        size="small"
        value={bank.company_1}
        options={COMPANY_LIST}
        loading={COMPANY_LOADING}
        filterOptions={filterOptions}
        renderInput={
          (props) => <TextField {...props} variant="outlined" label="Company" />
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
        onChange={(_, value) => setBank({
          ...bank,
          company_1: value
        })}
        fullWidth
        disablePortal
        disableClearable
      />

      <Autocomplete
        className="FstoSelectForm-root"
        size="small"
        value={bank.department_1}
        options={DEPARTMENT_1_LIST}
        loading={DEPARTMENT_1_LOADING}
        filterOptions={filterOptions}
        renderInput={
          (props) => <TextField {...props} variant="outlined" label="Department" />
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
        onChange={(_, value) => setBank({
          ...bank,
          department_1: value
        })}
        fullWidth
        disablePortal
        disableClearable
      />

      <Autocomplete
        className="FstoSelectForm-root"
        size="small"
        value={bank.location_1}
        options={LOCATION_1_LIST}
        loading={LOCATION_1_LOADING}
        filterOptions={filterOptions}
        renderInput={
          (props) => <TextField {...props} variant="outlined" label="Location" />
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
        onChange={(_, value) => setBank({
          ...bank,
          location_1: value
        })}
        fullWidth
        disablePortal
        disableClearable
      />

      <Divider variant="middle" sx={{ marginBottom: "1.25em" }} />

      <Autocomplete
        className="FstoSelectForm-root"
        size="small"
        value={bank.account_title_2}
        options={ACCOUNT_TITLE_LIST}
        loading={ACCOUNT_TITLE_LOADING}
        filterOptions={filterOptions}
        renderInput={
          (props) => <TextField {...props} variant="outlined" label="Cheque Clearing" />
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
        onChange={(_, value) => setBank({
          ...bank,
          account_title_2: value
        })}
        fullWidth
        disablePortal
        disableClearable
      />

      <Autocomplete
        className="FstoSelectForm-root"
        size="small"
        value={bank.company_2}
        options={COMPANY_LIST}
        loading={COMPANY_LOADING}
        filterOptions={filterOptions}
        renderInput={
          (props) => <TextField {...props} variant="outlined" label="Company" />
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
        onChange={(_, value) => setBank({
          ...bank,
          company_2: value
        })}
        fullWidth
        disablePortal
        disableClearable
      />

      <Autocomplete
        className="FstoSelectForm-root"
        size="small"
        value={bank.department_2}
        options={DEPARTMENT_2_LIST}
        loading={DEPARTMENT_2_LOADING}
        filterOptions={filterOptions}
        renderInput={
          (props) => <TextField {...props} variant="outlined" label="Department" />
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
        onChange={(_, value) => setBank({
          ...bank,
          department_2: value
        })}
        fullWidth
        disablePortal
        disableClearable
      />

      <Autocomplete
        className="FstoSelectForm-root"
        size="small"
        value={bank.location_2}
        options={LOCATION_2_LIST}
        loading={LOCATION_2_LOADING}
        filterOptions={filterOptions}
        renderInput={
          (props) => <TextField {...props} variant="outlined" label="Location" />
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
        onChange={(_, value) => setBank({
          ...bank,
          location_2: value
        })}
        fullWidth
        disablePortal
        disableClearable
      />

      <LoadingButton
        className="FstoButtonForm-root"
        type="submit"
        variant="contained"
        loadingPosition="start"
        loading={isSaving}
        startIcon={<></>}
        disabled={
          !Boolean(bank.code.trim()) ||
          !Boolean(bank.name.trim()) ||
          !Boolean(bank.branch.trim()) ||
          !Boolean(bank.account_no.trim()) ||
          !Boolean(bank.location.trim()) ||
          !Boolean(bank.account_title_1) ||
          !Boolean(bank.account_title_2)
        }
        disableElevation
      >
        {
          isUpdating
            ? "Update"
            : "Save"
        }
      </LoadingButton>

      <Button
        className="FstoButtonForm-root"
        variant="outlined"
        color="error"
        onClick={formClearHandler}
        disableElevation
      >
        {
          isUpdating
            ? "Cancel"
            : "Clear"
        }
      </Button>
    </form>
  )
}

export default BanksForm