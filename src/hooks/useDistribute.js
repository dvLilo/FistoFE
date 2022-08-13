import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useDistribute = (ID) => {

  const toast = useToast()

  const fetchDistributeList = async () => {
    return await axios.get(`/api/dropdown/associate`, {
      params: {
        company_id: ID
      }
    })
  }

  const {
    refetch,
    status,
    data,
    error
  } = useQuery(["DISTRIBUTE", ID], fetchDistributeList, {
    enabled: false,
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

  return { refetch, status, data, error }
}

export default useDistribute