import React from 'react'

import { TableRow, TableCell, Skeleton } from '@mui/material'

const Preloader = ({ row, col }) => {
  const arrRow = [...Array(row)]
  const arrCol = [...Array(col)]

  return (
    arrRow.map((row, index) => (
      <TableRow key={index}>
        {
          arrCol.map((col, index) => (
            <TableCell key={index} sx={{ py: 1 }}>
              <Skeleton variant="text" />
            </TableCell>
          ))
        }
      </TableRow>
    ))
  )
}

export default Preloader
