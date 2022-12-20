import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useCounterReceipt = (ID) => {

  const toast = useToast()

  const fetchData = async () => {
    return await axios.get(`/api/counter-receipts/view/${ID}`)
  }

  const { refetch, status, data, error } = useQuery(
    ["counter_receipt", ID],
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

export default useCounterReceipt