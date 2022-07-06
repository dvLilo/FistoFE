import React from 'react'

import { TableRow, TableCell, Skeleton, Typography } from '@mui/material'

const TablePreloader = ({ row }) => {
  const arrRow = [...Array(row)]

  return (
    arrRow.map((row, index) => (
      <TableRow className="FstoTableRow-root" key={index}>
        <TableCell className="FstoTableCell-root FstoTableCell-body">
          <Typography variant="button" sx={{ lineHeight: 1.25 }}>
            <Skeleton width="50%" />
          </Typography>
          <Typography variant="caption" sx={{ lineHeight: 1.35 }}>
            <Skeleton width="75%" />
          </Typography>
          <Typography variant="h6" sx={{ lineHeight: 1.55 }}>
            <Skeleton />
          </Typography>
          <Typography variant="caption" sx={{ lineHeight: 1.55 }}>
            <Skeleton width="30%" />
          </Typography>
        </TableCell>

        <TableCell className="FstoTableCell-root FstoTableCell-body">
          <Typography variant="subtitle1">
            <Skeleton />
          </Typography>
          <Typography variant="subtitle2">
            <Skeleton width="80%" />
          </Typography>
          <Typography variant="subtitle2">
            <Skeleton width="70%" />
          </Typography>
        </TableCell>

        <TableCell className="FstoTableCell-root FstoTableCell-body">
          <Typography variant="subtitle1">
            <Skeleton />
          </Typography>
          <Typography variant="subtitle2">
            <Skeleton width="80%" />
          </Typography>
          <Typography variant="subtitle2">
            <Skeleton width="70%" />
          </Typography>
        </TableCell>

        <TableCell className="FstoTableCell-root FstoTableCell-body">
          <Typography variant="caption">
            <Skeleton width="65%" />
          </Typography>
          <Typography variant="h6">
            <Skeleton width="90%" />
          </Typography>
        </TableCell>

        <TableCell className="FstoTableCell-root FstoTableCell-body">
          <Typography variant="caption">
            <Skeleton width="65%" />
          </Typography>
          <Typography variant="h6">
            <Skeleton width="90%" />
          </Typography>
        </TableCell>

        <TableCell className="FstoTableCell-root FstoTableCell-body" align="center">
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            <Skeleton />
          </Typography>
        </TableCell>

        <TableCell className="FstoTableCell-root FstoTableCell-body" align="center">
          <Skeleton />
        </TableCell>
      </TableRow>
    ))
  )
}

export default TablePreloader