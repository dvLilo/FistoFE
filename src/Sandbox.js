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


//         <Mui.Typography variant="h1" title="h1">Fisto Typography.</Mui.Typography>
//         <Mui.Typography variant="h2" title="h2">Fisto Typography.</Mui.Typography>
//         <Mui.Typography variant="h3" title="h3">Fisto Typography.</Mui.Typography>
//         <Mui.Typography variant="h4" title="h4">Fisto Typography.</Mui.Typography>
//         <Mui.Typography variant="h5" title="h5">Fisto Typography.</Mui.Typography>
//         <Mui.Typography variant="h6" title="h6">Fisto Typography.</Mui.Typography>
//         <Mui.Typography variant="subtitle1" title="subtitle1">Fisto Typography.</Mui.Typography>
//         <Mui.Typography variant="subtitle2" title="subtitle2">Fisto Typography.</Mui.Typography>
//         <Mui.Typography variant="body1" title="body1">Fisto Typography.</Mui.Typography>
//         <Mui.Typography variant="body2" title="body2">Fisto Typography.</Mui.Typography>
//         <Mui.Typography variant="button" title="button">Fisto Typography.</Mui.Typography>
//         <Mui.Typography variant="caption" title="caption">Fisto Typography.</Mui.Typography>
//         <Mui.Typography variant="overline" title="overline">Fisto Typography.</Mui.Typography>
//         <Mui.Divider variant="middle" flexItem />
//         <Mui.Typography variant="heading" title="heading">Fisto Typography.</Mui.Typography>
//         <Mui.Typography variant="permission" title="permission">Fisto Typography.</Mui.Typography>
//         <Mui.Divider variant="middle" flexItem />

//       </Mui.Box>
//     </React.Fragment>,
//     document.getElementById("sandbox")
//   )
// }

// export default Sandbox





// import React from 'react'

// import ReactDOM from 'react-dom'

// import * as Mui from '@mui/material'

// import useTransactions from './hooks/useTransactions'

// const Sandbox = () => {

//   const {
//     status, data
//   } = useTransactions("/api/transactions")

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
//           status === 'loading' ? "Please wait..." :
//             data?.data.map(data => (
//               <div key={data.id}>
//                 {data.transaction_id}
//               </div>
//             ))
//         }

//         <Mui.Divider flexItem variant="middle" sx={{ marginY: 2 }} />

//       </Mui.Box>
//     </React.Fragment>,
//     document.getElementById("sandbox")
//   )
// }

// export default Sandbox





// import React from 'react'

// import ReactDOM from 'react-dom'

// import * as Mui from '@mui/material'

// import useTransaction from './hooks/useTransaction'

// const Sandbox = () => {

//   const {
//     status, data
//   } = useTransaction(1)

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
//           status === 'loading' ? "Please wait..." :
//             <span>{data.document.no}</span>
//         }

//         <Mui.Divider flexItem variant="middle" sx={{ marginY: 2 }} />

//         <Mui.Typography variant="h1" title="h1">Fisto Typography.</Mui.Typography>
//         <Mui.Typography variant="h2" title="h2">Fisto Typography.</Mui.Typography>
//         <Mui.Typography variant="h3" title="h3">Fisto Typography.</Mui.Typography>
//         <Mui.Typography variant="h4" title="h4">Fisto Typography.</Mui.Typography>
//         <Mui.Typography variant="h5" title="h5">Fisto Typography.</Mui.Typography>
//         <Mui.Typography variant="h6" title="h6">Fisto Typography.</Mui.Typography>
//         <Mui.Typography variant="subtitle1" title="subtitle1">Fisto Typography.</Mui.Typography>
//         <Mui.Typography variant="subtitle2" title="subtitle2">Fisto Typography.</Mui.Typography>
//         <Mui.Typography variant="body1" title="body1">Fisto Typography.</Mui.Typography>
//         <Mui.Typography variant="body2" title="body2">Fisto Typography.</Mui.Typography>
//         <Mui.Typography variant="button" title="button">Fisto Typography.</Mui.Typography>
//         <Mui.Typography variant="caption" title="caption">Fisto Typography.</Mui.Typography>
//         <Mui.Typography variant="overline" title="overline">Fisto Typography.</Mui.Typography>
//         <Mui.Divider variant="middle" flexItem />
//         <Mui.Typography variant="heading" title="heading">Fisto Typography.</Mui.Typography>
//         <Mui.Typography variant="permission" title="permission">Fisto Typography.</Mui.Typography>
//       </Mui.Box>
//     </React.Fragment>,
//     document.getElementById("sandbox")
//   )
// }

// export default Sandbox





// import React from 'react'

// import ReactDOM from 'react-dom'

// import * as Mui from '@mui/material'

// const Sandbox = () => {
//   const data = [
//     {
//       id: 3,
//       name: "Limay Ducut",
//       email: "limay@email.com"
//     },
//     {
//       id: 2,
//       name: "Vilo Abad",
//       email: "vilo@email.com"
//     }
//   ]

//   const [selected, setSelected] = React.useState([]);
//   const [order, setOrder] = React.useState('asc');
//   const [orderBy, setOrderBy] = React.useState('id');

//   function descendingComparator(a, b, orderBy) {
//     if (b[orderBy] < a[orderBy]) {
//       return -1;
//     }
//     if (b[orderBy] > a[orderBy]) {
//       return 1;
//     }
//     return 0;
//   }

//   function getComparator(order, orderBy) {
//     return order === 'desc'
//       ? (a, b) => descendingComparator(a, b, orderBy)
//       : (a, b) => -descendingComparator(a, b, orderBy)
//   }

//   const handleRequestSort = (property) => {
//     const isAsc = orderBy === property && order === 'asc'
//     setOrder(isAsc ? 'desc' : 'asc')
//     setOrderBy(property)
//   }

//   const handleClick = (e, id) => {
//     const check = selected.includes(id)
//     if (check)
//       setSelected(currentValue => {
//         return currentValue.filter((item) => item !== id)
//       })
//     else
//       setSelected(currentValue => {
//         return [...currentValue, id]
//       })
//   }

//   const handleSelectAllClick = (e) => {
//     if (e.target.checked) {
//       const newSelecteds = data.map((item) => item.id)
//       setSelected(newSelecteds)
//       return
//     }

//     setSelected([])
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
//         <Mui.TableContainer sx={{ maxWidth: 1000 }}>
//           <Mui.Table>
//             <Mui.TableHead>
//               <Mui.TableRow>
//                 <Mui.TableCell padding="checkbox">
//                   <Mui.Checkbox
//                     onChange={handleSelectAllClick}
//                     indeterminate={selected.length > 0 && data.length > selected.length}
//                     checked={data.length > 0 && data.length === selected.length}
//                   />
//                 </Mui.TableCell>

//                 <Mui.TableCell>
//                   <Mui.TableSortLabel
//                     active={orderBy === `id`}
//                     direction={orderBy === `id` ? order : 'asc'}
//                     onClick={() => handleRequestSort("id")}
//                   >
//                     <Mui.Typography variant="button">ID No.</Mui.Typography>
//                   </Mui.TableSortLabel>
//                 </Mui.TableCell>

//                 <Mui.TableCell>
//                   <Mui.TableSortLabel
//                     active={orderBy === `name`}
//                     direction={orderBy === `name` ? order : 'asc'}
//                     onClick={() => handleRequestSort("name")}
//                   >
//                     <Mui.Typography variant="button">Fullname</Mui.Typography>
//                   </Mui.TableSortLabel>
//                 </Mui.TableCell>

//                 <Mui.TableCell>
//                   <Mui.TableSortLabel
//                     active={orderBy === `email`}
//                     direction={orderBy === `email` ? order : 'asc'}
//                     onClick={() => handleRequestSort("email")}
//                   >
//                     <Mui.Typography variant="button">Email Address</Mui.Typography>
//                   </Mui.TableSortLabel>
//                 </Mui.TableCell>
//               </Mui.TableRow>
//             </Mui.TableHead>

//             <Mui.TableBody>
//               {
//                 data.sort(getComparator(order, orderBy)).map((item, index) => {
//                   const isSelected = selected.includes(item.id)

//                   return (
//                     <Mui.TableRow key={index} selected={isSelected} onClick={(e) => handleClick(e, item.id)}>
//                       <Mui.TableCell padding="checkbox">
//                         <Mui.Checkbox checked={isSelected} />
//                       </Mui.TableCell>

//                       <Mui.TableCell>
//                         {item.id}
//                       </Mui.TableCell>

//                       <Mui.TableCell>
//                         {item.name}
//                       </Mui.TableCell>

//                       <Mui.TableCell>
//                         {item.email}
//                       </Mui.TableCell>
//                     </Mui.TableRow>
//                   )
//                 })
//               }
//             </Mui.TableBody>
//           </Mui.Table>
//         </Mui.TableContainer>
//       </Mui.Box>
//     </React.Fragment>,
//     document.getElementById("sandbox")
//   )
// }

// export default Sandbox











// import React from 'react'

// import ReactDOM from 'react-dom'

// import * as Mui from '@mui/material'

// import { ReasonContext } from './contexts/ReasonContext'

// const Sandbox = () => {

//   const { reason } = React.useContext(ReasonContext)

//   return ReactDOM.createPortal(
//     <React.Fragment>
//       <Mui.Typography variant="h1" align="center">Hello world</Mui.Typography>
//       <Mui.Box sx={{ display: `flex`, justifyContent: `center`, paddingTop: `3em` }}>
//         <Mui.Button variant="outlined" onClick={reason}>Reason!</Mui.Button>
//       </Mui.Box>
//     </React.Fragment>,
//     document.getElementById("sandbox")
//   )
// }

// export default 







// import React from 'react'

// import ReactDOM from 'react-dom'

// import * as Mui from '@mui/material'

// import { CSSTransition, TransitionGroup } from 'react-transition-group';
// import './Sandbox.scss'

// const Sandbox = () => {

//   const [todo, setTodo] = React.useState("")

//   const [todos, setTodos] = React.useState([
//     'Walk dog',
//     'Sweep floors',
//     'Do homework'
//   ])

//   return ReactDOM.createPortal(
//     <React.Fragment>
//       <input type="text" onChange={(e) => setTodo(e.target.value)} />
//       <input
//         type="button"
//         value="Add"
//         onClick={() => setTodos(currentValue => ([
//           ...currentValue,
//           todo
//         ]))}
//       />

//       <table>
//         <thead>
//           <tr>
//             <th>To Do</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <TransitionGroup component="tbody">
//           {todos.map((todo) => (
//             <CSSTransition key={todo} timeout={500} classNames="item">
//               <tr>
//                 <td>{todo}</td>
//                 <td>
//                   <button
//                     onClick={() => {
//                       setTodos(todos.filter((t) => t !== todo));
//                     }}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             </CSSTransition>
//           ))}
//         </TransitionGroup>
//       </table>

//     </React.Fragment >,
//     document.getElementById("sandbox")
//   )
// }

// export default Sandbox






// import React from 'react'

// import ReactDOM from 'react-dom'

// import * as Mui from '@mui/material'

// import { CSSTransition, TransitionGroup } from 'react-transition-group';
// import './Sandbox.scss'

// const Sandbox = () => {

//   const [data, setData] = React.useState([
//     {
//       id: 1,
//       name: "Limay",
//       email: "limay@email.com"
//     },
//     {
//       id: 2,
//       name: "Vilo",
//       email: "vilo@email.com"
//     },
//     {
//       id: 3,
//       name: "Roy",
//       email: "roy@email.com"
//     },
//     {
//       id: 4,
//       name: "Jaypee",
//       email: "jaypee@email.com"
//     }
//   ])

//   const onInsert = () => {
//     setData(currentValue => ([
//       ...currentValue,
//       {
//         id: 5,
//         name: "Humer",
//         email: "humer@email.com"
//       }
//     ]))
//   }

//   return ReactDOM.createPortal(
//     <React.Fragment>
//       <Mui.Box sx={{ maxWidth: 760, margin: `250px auto` }}>
//         <Mui.Button
//           variant="contained"
//           size="large"
//           onClick={onInsert}
//           sx={{
//             marginBottom: `10px`
//           }}
//           fullWidth
//           disableElevation
//         >
//           Add
//         </Mui.Button>

//         <Mui.TableContainer component={Mui.Paper} sx={{ minHeight: `400px`, overflowX: `hidden` }}>
//           <Mui.Table>
//             <Mui.TableHead>
//               <Mui.TableRow>
//                 <Mui.TableCell>ID</Mui.TableCell>
//                 <Mui.TableCell>NAME</Mui.TableCell>
//                 <Mui.TableCell>EMAIL</Mui.TableCell>
//                 <Mui.TableCell>ACTION</Mui.TableCell>
//               </Mui.TableRow>
//             </Mui.TableHead>

//             <TransitionGroup component={Mui.TableBody}>
//               {
//                 data.map((item, index) => (
//                   <CSSTransition classNames="item" key={index} timeout={500}>
//                     <Mui.TableRow>
//                       <Mui.TableCell>{item.id}</Mui.TableCell>
//                       <Mui.TableCell>{item.name}</Mui.TableCell>
//                       <Mui.TableCell>{item.email}</Mui.TableCell>
//                       <Mui.TableCell>
//                         <Mui.Button size="small" onClick={() => setData(data.filter((d) => d.id !== item.id))}>DELETE</Mui.Button>
//                       </Mui.TableCell>
//                     </Mui.TableRow>
//                   </CSSTransition>
//                 ))
//               }
//             </TransitionGroup>
//           </Mui.Table>
//         </Mui.TableContainer>
//       </Mui.Box>
//     </React.Fragment>,
//     document.getElementById("sandbox")
//   )
// }

// export default Sandbox




// import React from 'react'

// import ReactDOM from 'react-dom'

// import * as Mui from '@mui/material'
// import * as MuiIcon from '@mui/icons-material'

// const Sandbox = () => {

//   return ReactDOM.createPortal(
//     <React.Fragment>
//       <Mui.Typography variant="h2" align="center">Hello world</Mui.Typography>
//       <Mui.Box sx={{ display: `flex`, flexDirection: `column`, alignItems: `center`, paddingTop: `3em` }}>

//         <Mui.Accordion elevation={0} square disableGutters>
//           <Mui.AccordionSummary expandIcon={<MuiIcon.ExpandMoreRounded />}>
//             <b>Hello</b>
//           </Mui.AccordionSummary>

//           <Mui.AccordionDetails>Lorem ipsum dolor sit amet..</Mui.AccordionDetails>
//         </Mui.Accordion>

//         <Mui.Accordion elevation={0} square disableGutters>
//           <Mui.AccordionSummary expandIcon={<MuiIcon.ExpandMoreRounded />}>
//             <b>Hello</b>
//           </Mui.AccordionSummary>

//           <Mui.AccordionDetails>Lorem ipsum dolor sit amet..</Mui.AccordionDetails>
//         </Mui.Accordion>

//       </Mui.Box>
//     </React.Fragment>,
//     document.getElementById("sandbox")
//   )
// }

// export default Sandbox






import React from 'react'

import ReactDOM from 'react-dom'

import * as Mui from '@mui/material'

const Sandbox = () => {

  const [loading, setLoading] = React.useState(true)

  return ReactDOM.createPortal(
    <React.Fragment>
      <Mui.Typography variant="h2" align="center">Hello world</Mui.Typography>
      <Mui.Box sx={{ display: `flex`, flexDirection: `column`, alignItems: `center`, paddingTop: `3em` }}>

        <Mui.Button variant="contained" size="large" startIcon={loading && <Mui.CircularProgress color="inherit" size={16} />} disabled={loading}>Hello world.</Mui.Button>

        <Mui.Switch
          onChange={(e) => setLoading(e.target.checked)}
        />

      </Mui.Box>
    </React.Fragment>,
    document.getElementById("sandbox")
  )
}

export default Sandbox