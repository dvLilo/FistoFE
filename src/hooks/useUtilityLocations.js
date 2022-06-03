import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useUtilityLocations = () => {

  const toast = useToast()

  const fetchUtilityLocationsList = async () => {
    return await axios.get(`/api/dropdown/utility-locations`, {
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
  } = useQuery("UTILITY_LOCATIONS", fetchUtilityLocationsList, {
    enabled: false,
    refetchOnWindowFocus: false,
    select: (response) => response.data.result.utility_locations,
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

export default useUtilityLocations