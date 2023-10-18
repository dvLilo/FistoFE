import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useLocationCOA = ({
  department,
  enabled = false
}) => {

  const toast = useToast()

  const fetchLocationList = async () => {
    return await axios.get(`/api/dropdown/location`, {
      params: {
        status: 1,
        paginate: 0,
        department_id: department
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
  } = useQuery(["LOCATION_COA", department], fetchLocationList, {
    enabled,
    refetchOnWindowFocus: false,
    select: (response) => response.data.result.locations,
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

export default useLocationCOA