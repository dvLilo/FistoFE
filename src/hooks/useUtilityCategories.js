import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useUtilityCategories = () => {

  const toast = useToast()

  const fetchUtilityCategoriesList = async () => {
    return await axios.get(`/api/dropdown/utility-categories`, {
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
  } = useQuery("UTILITY_CATEGORIES", fetchUtilityCategoriesList, {
    enabled: false,
    refetchOnWindowFocus: false,
    select: (response) => response.data.result.utility_categories,
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

export default useUtilityCategories