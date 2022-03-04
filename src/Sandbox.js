import React from 'react'

import ReactDOM from 'react-dom'

import * as Mui from '@mui/material'

import useFistoHook from './hooks/useFistoHook'

import Toast from './components/Toast'

const Sandbox = () => {

  const {
    fetching,
    error,
    data,
    paginate,
    searchData,
    statusChange,
    pageChange,
    rowChange,
    switchDataStatus,
    state: { toast, setToast }
  } = useFistoHook("/api/categories/")

  return ReactDOM.createPortal(
    <React.Fragment>
      <Mui.Box sx={{
        backgroundColor: '#eee',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        padding: 5
      }}>

        {
          fetching
          && <Mui.Typography variant="h1">Fetching... Please wait.</Mui.Typography>
        }

        {
          Boolean(error)
          && <Mui.Typography variant="body2">{error.status}</Mui.Typography>
        }

        <Mui.TextField label="Search" size="small" onKeyPress={searchData} />

        <Mui.Button onClick={statusChange}>Toogle Status</Mui.Button>

        <Mui.Button onClick={() => setToast({
          show: true,
          title: "Success",
          message: "You've used the toast right."
        })}>Use Toast</Mui.Button>

        <Mui.FormControl variant="outlined">
          <Mui.InputLabel>Rows</Mui.InputLabel>
          <Mui.Select
            label="Rows"
            onChange={rowChange}
            value={Boolean(paginate) ? paginate.per_page : 10}
          >
            <Mui.MenuItem value={5}>5</Mui.MenuItem>
            <Mui.MenuItem value={10}>10</Mui.MenuItem>
            <Mui.MenuItem value={20}>20</Mui.MenuItem>
            <Mui.MenuItem value={50}>50</Mui.MenuItem>
          </Mui.Select>
        </Mui.FormControl>

        <Mui.Stack direction="row" spacing={2}>
          <Mui.Button onClick={() => pageChange(null, 0)}>Page 1</Mui.Button>
          <Mui.Button onClick={() => pageChange(null, 1)}>Page 2</Mui.Button>
        </Mui.Stack>

        <Mui.Button onClick={() => switchDataStatus({ ID: 1, status: 1 })}>Archive</Mui.Button>
        <Mui.Button>Restore</Mui.Button>

        <Mui.Typography variant="body1" sx={{ textTransform: "capitalize" }}>
          {data?.map(row => row.name).join(", ")}
        </Mui.Typography>

        <Mui.Typography variant="body2">
          Current Page: {paginate?.current_page}
        </Mui.Typography>

        <Mui.Typography variant="body2">
          Row Per Page: {paginate?.per_page}
        </Mui.Typography>


        <Mui.Typography variant="h1" title="h1">Fisto cutie.</Mui.Typography>
        <Mui.Typography variant="h2" title="h2">Fisto cutie.</Mui.Typography>
        <Mui.Typography variant="h3" title="h3">Fisto cutie.</Mui.Typography>
        <Mui.Typography variant="h4" title="h4">Fisto cutie.</Mui.Typography>
        <Mui.Typography variant="h5" title="h5">Fisto cutie.</Mui.Typography>
        <Mui.Typography variant="h6" title="h6">Fisto cutie.</Mui.Typography>
        <Mui.Typography variant="subtitle1" title="subtitle1">Fisto cutie.</Mui.Typography>
        <Mui.Typography variant="subtitle2" title="subtitle2">Fisto cutie.</Mui.Typography>
        <Mui.Typography variant="body1" title="body1">Fisto cutie.</Mui.Typography>
        <Mui.Typography variant="body2" title="body2">Fisto cutie.</Mui.Typography>
        <Mui.Typography variant="button" title="button">Fisto cutie.</Mui.Typography>
        <Mui.Typography variant="caption" title="caption">Fisto cutie.</Mui.Typography>
        <Mui.Typography variant="overline" title="overline">Fisto cutie.</Mui.Typography>
        <Mui.Divider variant="middle" flexItem />
        <Mui.Typography variant="heading" title="heading">Fisto cutie.</Mui.Typography>
        <Mui.Typography variant="permission" title="permission">Fisto cutie.</Mui.Typography>

      </Mui.Box>

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

      {/* <Toast
        open={true}
        title="Success"
        message="This is a sample success message."
        severity="success"
        onClose={() => {}}
      /> */}
    </React.Fragment>,
    document.getElementById("sandbox")
  )
}

export default Sandbox
