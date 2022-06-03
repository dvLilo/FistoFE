import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const usePayrollClents = () => {

  const toast = useToast()

  const fetchPayrollClientsList = async () => {
    return await axios.get(`/api/dropdown/payroll-clients`, {
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
  } = useQuery("PAYROLL_CLIENTS", fetchPayrollClientsList, {
    enabled: false,
    refetchOnWindowFocus: false,
    select: (response) => response.data.result.payroll_clients,
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

export default usePayrollClents