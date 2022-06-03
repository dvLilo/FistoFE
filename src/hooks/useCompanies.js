import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useCompanies = () => {

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
    status,
    data,
    error
  } = useQuery("COMPANIES", fetchCompanyList, {
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

  return { status, data, error }
}

export default useCompanies