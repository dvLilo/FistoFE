import React from 'react'

import { TableRow, TableCell, Skeleton } from '@mui/material'

const Preloader = ({ row, col, size = "small" }) => {
  const arrRow = [...Array(row)]
  const arrCol = [...Array(col)]

  return (
    arrRow.map((_, index) => (
      <TableRow key={index}>
        {
          arrCol.map((_, index) => (
            <TableCell key={index} size={size}>
              <Skeleton variant="text" />
            </TableCell>
          ))
        }
      </TableRow>
    ))
  )
}

export default Preloader
