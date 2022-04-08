// import React from 'react'

// import ReactDOM from 'react-dom'

// import * as Mui from '@mui/material'

// import useToast from './hooks/useToast'
// import useConfirm from './hooks/useConfirm'

// import useFistoHook from './hooks/useFistoHook'

// const Sandbox = () => {

//   const toast = useToast()
//   const confirm = useConfirm()

//   const {
//     fetching,
//     data,
//     paginate,
//     refetchData,
//     switchData,
//     searchData,
//     statusChange,
//     pageChange,
//     rowChange
//   } = useFistoHook("/api/admin/categories")

//   const [status, setStatus] = React.useState(true)

//   const toggleStatus = () => {
//     if (fetching) return

//     setStatus(currentValue => (
//       !currentValue
//     ))
//     statusChange()
//   }

//   return ReactDOM.createPortal(
//     <React.Fragment>
//       <Mui.Box sx={{
//         backgroundColor: '#eee',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         minHeight: '100vh',
//         padding: 5
//       }}>

//         {
//           fetching
//           && <Mui.Typography variant="h1">Fetching... Please wait.</Mui.Typography>
//         }

//         <Mui.TextField label="Search" size="small" onKeyPress={searchData} />

//         <Mui.Button
//           sx={{
//             color: status ? "RED" : "BLUE"
//           }}
//           onClick={toggleStatus}
//         >
//           Toogle Status
//         </Mui.Button>

//         <Mui.Button onClick={refetchData}>Refetch</Mui.Button>

//         <Mui.Stack direction="row" spacing={2}>
//           <Mui.Button onClick={() => switchData({ id: 1, deleted_at: null })}>Archive</Mui.Button>
//           <Mui.Button onClick={() => switchData({ id: 1, deleted_at: "2022-22-22 00:00" })}>Restore</Mui.Button>
//         </Mui.Stack>

//         <Mui.FormControl variant="outlined">
//           <Mui.InputLabel>Rows</Mui.InputLabel>
//           <Mui.Select
//             label="Rows"
//             onChange={rowChange}
//             value={Boolean(paginate) ? paginate.per_page : 10}
//           >
//             <Mui.MenuItem value={5}>5</Mui.MenuItem>
//             <Mui.MenuItem value={10}>10</Mui.MenuItem>
//             <Mui.MenuItem value={20}>20</Mui.MenuItem>
//             <Mui.MenuItem value={50}>50</Mui.MenuItem>
//             <Mui.MenuItem value={100}>100</Mui.MenuItem>
//           </Mui.Select>
//         </Mui.FormControl>

//         <Mui.Stack direction="row" spacing={2}>
//           <Mui.Button onClick={() => pageChange(null, 0)}>Page 1</Mui.Button>
//           <Mui.Button onClick={() => pageChange(null, 1)}>Page 2</Mui.Button>
//         </Mui.Stack>

//         <Mui.Typography variant="body1" sx={{ textTransform: "capitalize" }}>
//           {data?.map(row => row.name).join(", ")}
//         </Mui.Typography>

//         <Mui.Typography variant="body2">
//           Current Page: {paginate?.current_page}
//         </Mui.Typography>

//         <Mui.Typography variant="body2">
//           Row Per Page: {paginate?.per_page}
//         </Mui.Typography>

//         <Mui.Divider flexItem variant="middle" sx={{ marginY: 2 }} />

//         <Mui.Button onClick={() => toast({
//           open: true,
//           severity: "success",
//           title: "Success!",
//           message: "You've used the toast right."
//         })}>Use Toast</Mui.Button>

//         <Mui.Button onClick={() => confirm({
//           open: true,
//           onConfirm: () => console.log("Hello world")
//         })}>Use Confirm</Mui.Button>


//         <Mui.Typography variant="h1" title="h1">Fisto cutie.</Mui.Typography>
//         <Mui.Typography variant="h2" title="h2">Fisto cutie.</Mui.Typography>
//         <Mui.Typography variant="h3" title="h3">Fisto cutie.</Mui.Typography>
//         <Mui.Typography variant="h4" title="h4">Fisto cutie.</Mui.Typography>
//         <Mui.Typography variant="h5" title="h5">Fisto cutie.</Mui.Typography>
//         <Mui.Typography variant="h6" title="h6">Fisto cutie.</Mui.Typography>
//         <Mui.Typography variant="subtitle1" title="subtitle1">Fisto cutie.</Mui.Typography>
//         <Mui.Typography variant="subtitle2" title="subtitle2">Fisto cutie.</Mui.Typography>
//         <Mui.Typography variant="body1" title="body1">Fisto cutie.</Mui.Typography>
//         <Mui.Typography variant="body2" title="body2">Fisto cutie.</Mui.Typography>
//         <Mui.Typography variant="button" title="button">Fisto cutie.</Mui.Typography>
//         <Mui.Typography variant="caption" title="caption">Fisto cutie.</Mui.Typography>
//         <Mui.Typography variant="overline" title="overline">Fisto cutie.</Mui.Typography>
//         <Mui.Divider variant="middle" flexItem />
//         <Mui.Typography variant="heading" title="heading">Fisto cutie.</Mui.Typography>
//         <Mui.Typography variant="permission" title="permission">Fisto cutie.</Mui.Typography>
//         <Mui.Divider variant="middle" flexItem />

//       </Mui.Box>
//     </React.Fragment>,
//     document.getElementById("sandbox")
//   )
// }

// export default Sandbox





import React from 'react'

import ReactDOM from 'react-dom'

import * as Mui from '@mui/material'

import useTransaction from './hooks/useTransaction'

const Sandbox = () => {

  const {
    status, data
  } = useTransaction("/api/transactions")

  const [textfield, setTextfield] = React.useState({
    value1: "",
    value2: ""
  })

  const [singleValue1, setSingleValue1] = React.useState("")
  const [singleValue2, setSingleValue2] = React.useState("")

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
          status === 'loading' ? "Please wait..." :
            data?.data.map(data => (
              <div key={data.id}>
                {data.transaction_id}
              </div>
            ))
        }

        <Mui.Divider flexItem variant="middle" sx={{ marginY: 2 }} />

        <Mui.TextField
          value={textfield.value1}
          onChange={(e) => setTextfield({ ...textfield, value1: e.target.value })}
        />

        <Mui.TextField
          value={textfield.value2}
          onChange={(e) => setTextfield({ ...textfield, value2: e.target.value })}
        />

        <Mui.Divider flexItem variant="middle" sx={{ marginY: 2 }} />

        <Mui.TextField
          value={singleValue1}
          onChange={(e) => setSingleValue1(e.target.value)}
        />

        <Mui.TextField
          value={singleValue2}
          onChange={(e) => setSingleValue2(e.target.value)}
        />

      </Mui.Box>
    </React.Fragment>,
    document.getElementById("sandbox")
  )
}

export default Sandbox
