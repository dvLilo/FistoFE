import React from 'react'
import {
  TableRow,
  TableCell,
  MenuItem,
} from '@mui/material'
import ActionMenu from '../../../components/ActionMenu'
import { Archive, Edit } from '@mui/icons-material'


const TableData = ({ data, actionUpdate }) => {


  return (
    <TableRow>
      <TableCell className="FstoTableData-root" align="center">
        {data.id}
      </TableCell>

      <TableCell className="FstoTableData-root" sx={{ textTransform: "capitalize" }}>
        {data.name}
      </TableCell>

      <TableCell className="FstoTableData-root">
        {Boolean(data.deleted_at) ? "Inactive" : "Active"}
      </TableCell>

      <TableCell className="FstoTableData-root">
        {
          new Date(data.updated_at).toLocaleString("default", {
            month: "long",
            day: "numeric",
            year: "numeric"
          })
        }
      </TableCell>

      <TableCell align="center">
        <ActionMenu
          data={data}
          view={true}
          // view={mode}
          onEdit={(actionUpdate)}
        // onArchive={actionArchiveHandler}
        // onRestore={actionRestoreHandler}
        />
      </TableCell>
    </TableRow>
  )
}

export default TableData