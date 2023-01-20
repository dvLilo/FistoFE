import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useBanks = () => {

  const toast = useToast()

  const fetchBankList = async () => {
    return await axios.get(`/api/dropdown/bank-account-title`, {
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
  } = useQuery(["BANKS"], fetchBankList, {
    refetchOnWindowFocus: false,
    select: (response) => response.data.result.banks,
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

export default useBanks