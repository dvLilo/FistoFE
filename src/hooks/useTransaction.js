// import React from 'react'

import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useTransaction = (ID) => {

  const toast = useToast()

  const fetchData = async () => {
    return await axios.get(`/api/transactions/${ID}`)
  }

  const { status, data, error } = useQuery(
    ["transaction", ID],
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
            message: "Something went wrong whilst fetching the transaction details."
          })
      }
    }
  )

  return { status, data, error }
}

export default useTransaction