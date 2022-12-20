import React from 'react'

import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useGenerateCounterReceipts = (URL) => {

  const toast = useToast()

  const [params, setParams] = React.useState({
    state: 'moniroting-receive',
    paginate: 0,
    from: null,
    to: null,
    suppliers: null,
    departments: null
  })

  const fetchData = async () => {
    return await axios.get(URL, {
      params: {
        state: params.state,
        paginate: params.paginate,
        departments: params.departments ? JSON.stringify(params.departments) : params.departments,
        suppliers: params.suppliers ? JSON.stringify(params.suppliers) : params.suppliers,
        transaction_from: params.from ? new Date(params.from).toISOString().slice(0, 10) : null,
        transaction_to: params.to ? new Date(params.to).toISOString().slice(0, 10) : null
      }
    })
  }

  const generateData = (data) => {
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

  const { status, data, error, refetch: refetchData } = useQuery(
    ["counter_receipts", params.state, params.page, params.rows, params.from, params.to, params.departments, params.suppliers],
    fetchData,
    {
      enabled: false,
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
    status, data, error, refetchData, filterData: generateData
  }
}

export default useGenerateCounterReceipts