import React from 'react'

import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useGeneratedCounterReceipts = (URL, props) => {

  const toast = useToast()

  const [params, setParams] = React.useState({
    paginate: 0,
    state: props.state,
    from: props.from,
    to: props.to,
    suppliers: props.suppliers,
    departments: props.departments
  })

  const fetchData = async () => {
    return await axios.get(URL, {
      params: {
        paginate: params.paginate,
        state: params.state,
        departments: params.departments ? JSON.stringify(params.departments) : params.departments,
        suppliers: params.suppliers ? JSON.stringify(params.suppliers) : params.suppliers,
        from: params.from ? new Date(params.from).toISOString().slice(0, 10) : null,
        to: params.to ? new Date(params.to).toISOString().slice(0, 10) : null
      }
    })
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
      state,
      from,
      to,
      suppliers,
      departments
    }))
  }

  const { status, data, error, refetch: refetchData } = useQuery(
    ["counter_receipts", params.paginate, params.state, params.from, params.to, params.departments, params.suppliers],
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
    status, data, error, refetchData, generateData
  }
}

export default useGeneratedCounterReceipts