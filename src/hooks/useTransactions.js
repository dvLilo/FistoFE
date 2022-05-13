import React from 'react'

import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useTransactions = (URL) => {

  const toast = useToast()

  const [params, setParams] = React.useState({
    state: "request",
    page: 1,
    rows: 10,
    search: null,
    from: null,
    to: null,
    suppliers: null,
    types: null
  })

  const fetchData = async () => {
    return await axios.get(URL, {
      params: {
        state: params.state,
        page: params.page,
        rows: params.rows,
        search: params.search,
        suppliers: params.suppliers ? JSON.stringify(params.suppliers) : params.suppliers,
        transaction_from: params.from ? new Date(params.from).toISOString().slice(0, 10) : null,
        transaction_to: params.to ? new Date(params.to).toISOString().slice(0, 10) : null,
        document_ids: params.types ? JSON.stringify(params.types) : params.types
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
      types,
      suppliers
    } = data

    if (status === 'loading') return

    setParams(currentValue => ({
      ...currentValue,
      page: 1,
      from,
      to,
      types,
      suppliers
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
    ["transactions", params.search, params.state, params.page, params.rows, params.from, params.to, params.types, params.suppliers],
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