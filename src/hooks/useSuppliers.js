import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useSuppliers = () => {

  const toast = useToast()

  const fetchSupplierList = async () => {
    return await axios.get(`/api/dropdown/suppliers`, {
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
  } = useQuery("SUPPLIERS", fetchSupplierList, {
    refetchOnWindowFocus: false,
    select: (response) => response.data.result,
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

export default useSuppliers