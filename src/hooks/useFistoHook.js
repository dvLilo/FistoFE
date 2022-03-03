import React from 'react'

import axios from 'axios'

const useFistoHook = (URL) => {

  const [fetching, setIsFetching] = React.useState(true)

  const [data, setData] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [paginate, setPaginate] = React.useState(null)

  const [params, setParams] = React.useState({
    status: 1,
    page: 1,
    rows: 10,
    search: ""
  })

  const [toast, setToast] = React.useState({
    show: false,
    title: null,
    message: null
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
        }).then(JSON => JSON.data)
        const { data, ...pagination } = response.result

        setData(data)
        setPaginate(pagination)

        console.log("Response: ", response)
      }
      catch (error) {
        setError(error.request)
        setToast({
          show: true,
          title: "Error",
          message: error.request.statusText,
          severity: "error"
        })

        setData(null)
        setPaginate(null)
      }

      setIsFetching(false)
    })()
  }, [URL, params])

  const searchData = async (e) => {
    if (e.key === "Enter") setParams({
      ...params,
      search: e.target.value
    })
  }

  const statusChange = () => setParams({
    ...params,
    status: params.status ? 0 : 1
  })

  const pageChange = (e, page) => setParams({
    ...params,
    page: ++page
  })

  const rowChange = (e) => setParams({
    ...params,
    rows: e.target.value
  })

  const switchDataStatus = async (props) => {
    const { ID, status } = props

    let response
    try {
      response = await axios.post(`${URL}${ID}`, {
        status: status
      }).then(JSON => JSON.data)

      // will refetch the data
      setParams({
        ...params,
        status: status
      })
      setToast({
        show: true,
        title: "Success",
        message: response.message
      })

      console.log("Response: ", response)
    }
    catch (error) {
      console.log("Error: ", error)
    }
  }

  return { fetching, error, data, paginate, searchData, statusChange, pageChange, rowChange, switchDataStatus, state: { toast, setToast } }
}

export default useFistoHook