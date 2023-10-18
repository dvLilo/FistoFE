import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useCompanyCOA = ({
  enabled = true
}) => {

  const toast = useToast()

  const fetchCompanyList = async () => {
    return await axios.get(`/api/dropdown/company`, {
      params: {
        status: 1,
        paginate: 0
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
  } = useQuery("COMPANY_COA", fetchCompanyList, {
    enabled,
    refetchOnWindowFocus: false,
    select: (response) => response.data.result.companies,
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

export default useCompanyCOA