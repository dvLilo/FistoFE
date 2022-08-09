import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useAccountTitles = () => {

  const toast = useToast()

  const fetchAccoutTitleList = async () => {
    return await axios.get(`/api/dropdown/account-title`)
  }

  const {
    refetch,
    status,
    data,
    error
  } = useQuery("ACCOUNT_TITLE", fetchAccoutTitleList, {
    enabled: false,
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

  return { refetch, status, data, error }
}

export default useAccountTitles