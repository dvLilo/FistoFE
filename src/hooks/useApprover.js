import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useApprover = ({
  enabled = true
}) => {

  const toast = useToast()

  const fetchApproverList = async () => {
    return await axios.get(`/api/dropdown/approver`)
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
  } = useQuery("APPROVER", fetchApproverList, {
    enabled: enabled,
    refetchOnWindowFocus: false,
    select: (response) => response.data.result.approvers,
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

export default useApprover