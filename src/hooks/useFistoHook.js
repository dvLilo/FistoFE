import React from 'react'

import axios from 'axios'

const useFistoHook = (URL) => {

  const [fetching, setIsFetching] = React.useState(true)

  const [data, setData] = React.useState(null)
  const [paginate, setPaginate] = React.useState(null)

  const [error, setError] = React.useState(null)

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

        setError(null)
      }
      catch (error) {
        setError(error.request)
        setData(null)
        setPaginate(null)
      }

      setIsFetching(false)
    })()
  }, [URL, params])

  const refetchData = () => setParams(
    currentValue => ({
      ...currentValue
    })
  )

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

  return { fetching, error, data, paginate, refetchData, searchData, searchClear, statusChange, pageChange, rowChange }
}

export default useFistoHook





































// In God We Trust.