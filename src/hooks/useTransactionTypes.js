import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useTransactionTypes = ({
  enabled = true
}) => {

  const toast = useToast()

  const fetchTransactionTypes = async () => {
    return await axios.get(`/api/dropdown/transaction-types`)
  }

  const {
    refetch,

    status,
    isLoading,
    isFetching,
    isSuccess,
    isError,

    data = [],
    error
  } = useQuery("TRANSACTION_TYPES", fetchTransactionTypes, {
    enabled: enabled,
    refetchOnWindowFocus: false,
    select: (response) => response.data.result.transaction_types,
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

  return {
    refetch,

    status,
    isLoading,
    isFetching,
    isSuccess,
    isError,

    data,
    error
  }
}

export default useTransactionTypes