import React from 'react'

import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useTransactions = (URL, STATE = "pending", MEMO = 0) => {

  const toast = useToast()

  const [params, setParams] = React.useState({
    state: STATE,
    page: 1,
    rows: 10,
    search: null,
    from: null,
    to: null,
    cheque_from: null,
    cheque_to: null,
    suppliers: null,
    types: null,
    department: null,
    is_auto_debit: MEMO
  })

  const fetchData = async () => {
    return await axios.get(URL, {
      params: {
        state: params.state,
        page: params.page,
        rows: params.rows,
        search: params.search,
        department: params.department ? JSON.stringify(params.department) : params.department,
        suppliers: params.suppliers ? JSON.stringify(params.suppliers) : params.suppliers,
        transaction_from: params.from ? new Date(params.from).toISOString().slice(0, 10) : null,
        transaction_to: params.to ? new Date(params.to).toISOString().slice(0, 10) : null,
        cheque_from: params.cheque_from ? new Date(params.cheque_from).toISOString().slice(0, 10) : null,
        cheque_to: params.cheque_to ? new Date(params.cheque_to).toISOString().slice(0, 10) : null,
        document_ids: params.types ? JSON.stringify(params.types) : params.types,
        is_auto_debit: params.is_auto_debit
      }
    })
  }

  const searchData = (data) => {
    if (status === 'loading') return

    setParams(currentValue => ({
      ...currentValue,
      page: 1,
      search: data
    }))
  }

  const filterData = (data) => {
    const {
      from,
      to,
      cheque_from,
      cheque_to,
      types,
      suppliers,
      department
    } = data

    if (status === 'loading') return

    setParams(currentValue => ({
      ...currentValue,
      page: 1,
      from,
      to,
      cheque_from,
      cheque_to,
      types,
      suppliers,
      department
    }))
  }

  const changeStatus = (data) => setParams(currentValue => ({
    ...currentValue,
    page: 1,
    state: data,
    search: null
  }))

  const changePage = (data) => setParams(currentValue => ({
    ...currentValue,
    page: data + 1
  }))

  const changeRows = (data) => setParams(currentValue => ({
    ...currentValue,
    rows: data
  }))

  const { status, data, error, refetch: refetchData } = useQuery(
    ["transactions", params.search, params.state, params.page, params.rows, params.from, params.to, params.cheque_from, params.cheque_to, params.types, params.department, params.suppliers],
    fetchData,
    {
      retry: false,
      refetchOnWindowFocus: false,
      select: (response) => response.data.result,
      onError: (error) => {
        if (error.request.status !== 404)
          toast({
            open: true,
            severity: "error",
            title: "Error",
            message: "Something went wrong whilst fetching the list of data."
          })
      }
    }
  )

  return {
    status, data, error, refetchData, searchData, filterData, changeStatus, changePage, changeRows
  }
}

export default useTransactions