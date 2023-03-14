import React from 'react'

const ReportsFilter = (props) => {

  const {
    filterData = () => { }
  } = props

  const [filterParams, setFilterParams] = React.useState({
    process: null, // request(pending), tag, voucher, approve, transmit, cheque, release, file
    from: null,
    to: null,
    types: [1, 2, 3, 4, 5, 6, 7, 8],
    suppliers: [],
    departments: []
  })

  return (
    <div>ReportsFilter</div>
  )
}

export default ReportsFilter