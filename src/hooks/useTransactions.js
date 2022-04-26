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
    search: null
  })

  const fetchData = async () => {
    return await axios.get(URL, {
      params: {
        state: params.state,
        page: params.page,
        rows: params.rows,
        search: params.search
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
    ["transactions", params.search, params.state, params.page, params.rows],
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
    status, data, error, refetchData, searchData, changeStatus, changePage, changeRows
  }
}

export default useTransactions