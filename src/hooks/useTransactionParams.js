import React from 'react'

const useTransactionParams = ({
  state = "pending",
  rows = 10,
} = {}) => {

  const [params, setParams] = React.useState({
    state: state,
    page: 1,
    rows: rows,
    search: "",

    transaction_from: null,
    transaction_to: null,
    cheque_from: null,
    cheque_to: null,

    suppliers: [],
    documents: [],
    departments: [],
  })

  const filterData = (data) => {
    const {
      transaction_from,
      transaction_to,
      cheque_from,
      cheque_to,

      documents,
      suppliers,
      departments
    } = data

    setParams(currentValue => ({
      ...currentValue,
      page: 1,

      transaction_from,
      transaction_to,
      cheque_from,
      cheque_to,

      suppliers,
      documents,
      departments
    }))
  }

  const searchData = (data) => setParams(currentValue => ({
    ...currentValue,
    page: 1,
    search: data
  }))

  const changeStatus = (data) => setParams(currentValue => ({
    ...currentValue,
    page: 1,
    state: data,
    search: null
  }))

  const changeRows = (data) => setParams(currentValue => ({
    ...currentValue,
    page: 1,
    rows: data
  }))

  const changePage = (data) => setParams(currentValue => ({
    ...currentValue,
    page: data + 1
  }))

  return { params, filterData, searchData, changeStatus, changeRows, changePage }
}

export default useTransactionParams