import React from 'react'

import axios from 'axios'

const useFetch = (url, status, rows) => {
  const [data, setData] = React.useState(null)
  const [paginate, setPaginate] = React.useState(null)

  React.useEffect(() => {
    // setTimeout(() => {
    //   axios.get(`${url}/${status}/${rows}`).then(res => res.data).then(response => {
    //     const { data, ...paginate } = response.result

    //     setData(data)
    //     setPaginate(paginate)

    //     console.log("Response: ", response)
    //   })
    //   .catch(error => {
    //     setData(null)
    //     setPaginate(null)
    //     console.log("Error: ", error)
    //   })
    // }, 1000)
    (async () => {
      let response
      try {
        response = await axios.get(`${url}/${status}/${rows}`).then(JSON => JSON.data)
        const { data, ...paginate } = response.result

        setData(data)
        setPaginate(paginate)

        console.log("Response: ", response)
      }
      catch (error) {
        setData(null)
        setPaginate(null)
        console.log("Error: ", error)
      }
    })()
  }, [url, status, rows])

  return { data, paginate }
}

export default useFetch
