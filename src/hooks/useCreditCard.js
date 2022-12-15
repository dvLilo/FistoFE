import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useCreditCard = () => {

  const toast = useToast()

  const fetchCreditCardList = async () => {
    return await axios.get(`/api/dropdown/credit-card`, {
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
  } = useQuery("CREDIT_CARDS", fetchCreditCardList, {
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

export default useCreditCard