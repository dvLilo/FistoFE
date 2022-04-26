import React from 'react'

import axios from 'axios'

import useToast from './useToast'
import useConfirm from './useConfirm'

const useFistoHook = (URL) => {

  const toast = useToast()
  const confirm = useConfirm()

  const [fetching, setIsFetching] = React.useState(true)

  const [data, setData] = React.useState(null)
  const [paginate, setPaginate] = React.useState(null)

  const [params, setParams] = React.useState({
    status: 1,
    page: 1,
    rows: 10,
    search: null
  })

  React.useEffect(() => {
    (async () => {
      let response
      try {
        setIsFetching(true)

        response = await axios.get(URL, {
          params: {
            status: params.status,
            page: params.page,
            rows: params.rows,
            search: params.search
          }
        })
        const { data, ...pagination } = response.data.result

        setData(data)
        setPaginate(pagination)
      }
      catch (error) {
        setData(null)
        setPaginate(null)

        if (error.request.status !== 404)
          toast({
            open: true,
            severity: "error",
            title: "Error",
            message: "Something went wrong whilst fetching the list of data."
          })
      }

      setIsFetching(false)
    })()

    // eslint-disable-next-line
  }, [URL, params])

  const refetchData = () => setParams(
    currentValue => ({
      ...currentValue
    })
  )

  const switchData = (data) => {
    const {
      id: ID,
      deleted_at: STATUS
    } = data

    confirm({
      open: true,
      wait: true,
      onConfirm: async () => {
        let response
        try {
          response = await axios.patch(`${URL}/${ID}`, {
            status: Boolean(STATUS) ? 0 : 1
          })

          toast({
            open: true,
            severity: "success",
            title: "Success",
            message: response.data.message
          })

          refetchData()
        }
        catch (error) {
          toast({
            open: true,
            severity: "error",
            title: "Error",
            message: "An unexpected error occurred. Please try again later."
          })

          console.log(error.request)
        }
      }
    })
  }

  const searchData = (e) => {
    if (e.key === "Enter") {
      if (fetching) return

      setParams({
        ...params,
        page: 1,
        search: e.target.value
      })
    }
  }

  const searchClear = () => {
    if (fetching) return

    setParams({
      ...params,
      page: 1,
      search: null
    })
  }

  const statusChange = () => {
    if (fetching) return

    setParams({
      ...params,
      page: 1,
      status: params.status ? 0 : 1
    })
  }

  const pageChange = (e, page) => {
    if (fetching) return

    setParams({
      ...params,
      page: ++page
    })
  }

  const rowChange = (e) => {
    if (fetching) return

    setParams({
      ...params,
      rows: e.target.value
    })
  }

  return { fetching, data, paginate, refetchData, switchData, searchData, searchClear, statusChange, pageChange, rowChange }
}

export default useFistoHook





































// In God We Trust.