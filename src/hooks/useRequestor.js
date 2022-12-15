import axios from 'axios'

import { useQuery } from 'react-query'

import useToast from './useToast'

const useRequestor = () => {

  const toast = useToast()

  const fetchRequestor = async () => {
    return await axios.get(`/api/dropdown/current-user`)
  }

  const {
    status,
    data = {},
    error
  } = useQuery("REQUESTOR", fetchRequestor, {
    refetchOnWindowFocus: false,
    select: (response) => {
      const { document_types, ...requestor } = response.data.result

      return {
        ...requestor,
        documents: document_types.map((item) => {
          const { type, ...rest } = item

          return ({
            ...rest,
            name: type
          })
        })
      }
    },
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

  const {
    documents,
    ...requestor
  } = data

  return { status, documents, requestor, error }
}

export default useRequestor