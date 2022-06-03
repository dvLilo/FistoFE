import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useAccountNumbers = () => {

  const toast = useToast()

  const fetchAccountNumbersList = async () => {
    return await axios.get(`/api/dropdown/account-numbers`, {
      params: {
        status: 1,
        paginate: 0
      }
    })
  }

  const {
    refetch,
    status,
    data,
    error
  } = useQuery("ACCOUNT_NUMBERS", fetchAccountNumbersList, {
    enabled: false,
    refetchOnWindowFocus: false,
    select: (response) => response.data.result.account_numbers,
    onError: (error) => {
      if (error.request.status !== 404)
        toast({
          open: true,
          severity: "error",
          title: "Error",
          message: "Something went wrong whilst fetching the list of data."
        })
    }
  })

  return { refetch, status, data, error }
}

export default useAccountNumbers