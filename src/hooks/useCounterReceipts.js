import React from 'react'

import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useCounterReceipts = (URL, STATUS = "pending", queryProps) => {

  const toast = useToast()

  const [params, setParams] = React.useState({
    status: STATUS,
    paginate: 1,
    page: 1,
    rows: 10,
    state: null,
    search: null,
    from: null,
    to: null,
    suppliers: null,
    departments: null
  })

  const fetchData = async () => {
    return await axios.get(URL, {
      params: {
        status: params.status,
        paginate: params.paginate,
        page: params.page,
        rows: params.rows,
        search: params.search,
        state: params.state,
        departments: params.departments ? JSON.stringify(params.departments) : params.departments,
        suppliers: params.suppliers ? JSON.stringify(params.suppliers) : params.suppliers,
        from: params.from ? new Date(params.from).toISOString().slice(0, 10) : null,
        to: params.to ? new Date(params.to).toISOString().slice(0, 10) : null
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
      departments
    } = data

    if (status === 'loading') return

    setParams(currentValue => ({
      ...currentValue,
      page: 1,
      from,
      to,
      suppliers,
      departments
    }))
  }

  const generateData = (data) => {
    const {
      state,
      from,
      to,
      suppliers,
      departments
    } = data

    if (status === 'loading') return

    setParams(currentValue => ({
      ...currentValue,
      paginate: 0,
      page: null,
      state,
      from,
      to,
      suppliers,
      departments
    }))
  }

  const changeStatus = (data) => setParams(currentValue => ({
    ...currentValue,
    page: 1,
    status: data,
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
    ["counter_receipts", params.search, params.status, params.state, params.paginate, params.page, params.rows, params.from, params.to, params.departments, params.suppliers],
    fetchData,
    {
      ...queryProps,
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
    status, data, error, refetchData, searchData, filterData, generateData, changeStatus, changePage, changeRows
  }
}

export default useCounterReceipts