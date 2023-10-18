import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useDepartmentCOA = ({
  company,
  enabled = false
}) => {

  const toast = useToast()

  const fetchDepartmentList = async () => {
    return await axios.get(`/api/dropdown/department`, {
      params: {
        status: 1,
        paginate: 0,
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
  } = useQuery(["DEPARTMENT_COA", company], fetchDepartmentList, {
    enabled,
    refetchOnWindowFocus: false,
    select: (response) => response.data.result.departments,
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

export default useDepartmentCOA