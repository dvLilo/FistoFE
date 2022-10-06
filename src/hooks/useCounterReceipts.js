import React from 'react'

import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useCounterReceipts = (URL, STATE = "pending") => {

  const toast = useToast()

  const [params, setParams] = React.useState({
    state: STATE,
    page: 1,
    rows: 10,
    search: null,
    from: null,
    to: null,
    suppliers: null,
    department: null
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
        transaction_to: params.to ? new Date(params.to).toISOString().slice(0, 10) : null
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
      suppliers,
      department
    } = data

    if (status === 'loading') return

    setParams(currentValue => ({
      ...currentValue,
      page: 1,
      from,
      to,
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
    ["counter_receipt", params.search, params.state, params.page, params.rows, params.from, params.to, params.department, params.suppliers],
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

export default useCounterReceipts