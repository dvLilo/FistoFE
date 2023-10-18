import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useAccountTitleCOA = ({
  enabled = true
}) => {

  const toast = useToast()

  const fetchAccoutTitleList = async () => {
    return await axios.get(`/api/dropdown/account-title`)
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
  } = useQuery("ACCOUNT_TITLE_COA", fetchAccoutTitleList, {
    enabled: enabled,
    refetchOnWindowFocus: false,
    select: (response) => response.data.result.account_titles,
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

export default useAccountTitleCOA