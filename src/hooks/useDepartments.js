import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useDepartments = (ID) => {

  const toast = useToast()

  const fetchDepartmentList = async () => {
    return await axios.get(`/api/dropdown/department`, {
      params: {
        status: 1,
        paginate: 0,
        company_id: ID
      }
    })
  }

  const {
    status,
    data,
    error
  } = useQuery(["DEPARTMENTS", ID], fetchDepartmentList, {
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

export default useDepartments