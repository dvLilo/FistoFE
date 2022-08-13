import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useTransaction = (ID) => {

  const toast = useToast()

  const fetchData = async () => {
    return await axios.get(`/api/transactions/${ID}`)
  }

  const { refetch, status, data, error } = useQuery(
    ["transaction", ID],
    fetchData,
    {
      retry: false,
      enabled: false,
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

  return { refetch, status, data, error }
}

export default useTransaction