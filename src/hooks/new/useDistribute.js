import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from '../useToast'

const useDistribute = ({
  company,
  enabled = true,
}) => {

  const toast = useToast()

  const fetchDistributeList = async () => {
    return await axios.get(`/api/dropdown/associate`, {
      params: {
        company_id: company
      }
    })
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
  } = useQuery(["DISTRIBUTE", company], fetchDistributeList, {
    enabled: enabled,
    refetchOnWindowFocus: false,
    select: (response) => response.data.result.associates,
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

export default useDistribute