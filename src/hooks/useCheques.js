import React from 'react'

import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useCheques = (URL, STATE = "pending") => {

  const toast = useToast()

  const [params, setParams] = React.useState({
    state: STATE,
    page: 1,
    rows: 10,
    search: null,

    cheque_from: null,
    cheque_to: null,

    suppliers: null,
    documents: null
  })

  const fetchData = async () => {
    return await axios.get(URL, {
      params: {
        state: params.state,
        page: params.page,
        rows: params.rows,
        search: params.search,

        suppliers: params.suppliers ? JSON.stringify(params.suppliers) : params.suppliers,
        documents: params.documents ? JSON.stringify(params.documents) : params.documents,

        cheque_from: params.cheque_from ? new Date(params.cheque_from).toISOString().slice(0, 10) : null,
        cheque_to: params.cheque_to ? new Date(params.cheque_to).toISOString().slice(0, 10) : null,
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
      cheque_from,
      cheque_to,

      suppliers,
      documents
    } = data

    if (status === 'loading') return

    setParams(currentValue => ({
      ...currentValue,
      page: 1,

      cheque_from,
      cheque_to,

      suppliers,
      documents
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
    ["cheques", params.search, params.state, params.page, params.rows, params.cheque_from, params.cheque_to, params.documents, params.suppliers],
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

export default useCheques