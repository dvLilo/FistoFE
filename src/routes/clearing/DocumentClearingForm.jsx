import React from 'react'

import { Box } from '@mui/material'

import { CLEAR } from "../../constants"

const DocumentClearingForm = () => {

  const [clearData, setClearData] = React.useState({
    process: CLEAR,
    subprocess: CLEAR,
    date: null,
    accounts: []
  })

  return (
    <Box className="">

    </Box>
  )
}

export default DocumentClearingForm