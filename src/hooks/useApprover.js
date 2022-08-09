import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useApprover = () => {

  const toast = useToast()

  const fetchApproverList = async () => {
    return await axios.get(`/api/dropdown/approver`)
  }

  const {
    status,
    data,
    error
  } = useQuery("APPROVER", fetchApproverList, {
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

  return { status, data, error }
}

export default useApprover