import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useUserDepartment = () => {

  const toast = useToast()

  const fetchUserDepartmentList = async () => {
    return await axios.get(`/api/dropdown/user/departments`)
  }

  const {
    status,
    data,
    error
  } = useQuery("USER_DEPARTMENT", fetchUserDepartmentList, {
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

  return { status, data, error }
}

export default useUserDepartment