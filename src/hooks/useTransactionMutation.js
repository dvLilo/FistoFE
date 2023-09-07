import { useMutation } from 'react-query'

import useToast from './useToast'

const useTransactionMutation = () => {

  const toast = useToast()

  const postData = ({ id, ...payload }) => {
    return axios.post(`/api/transactions/flow/update-transaction/${id}`, payload)
  }

  const { mutate, reset, status, data, error } = useMutation(postData, {
    retry: false,
    onError: (error) => {
      if (error.request.status !== 404)
        toast({
          open: true,
          severity: "error",
          title: "Error",
          message: "Something went wrong whilst fetching the transaction details."
        })
    }
  })

  return { mutate, reset, status, data, error }
}

export default useTransactionMutation