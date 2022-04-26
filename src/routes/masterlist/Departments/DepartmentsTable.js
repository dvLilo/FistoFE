import React from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel
} from '@mui/material'

import ActionMenu from '../../../components/ActionMenu'
import Preloader from '../../../components/Preloader'

const DepartmentsTable = (props) => {

  const {
    fetching,
    data,
    onStatusChange,
    onUpdateChange
  } = props

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell className="FstoTableHead-root" align="center">
            <TableSortLabel active={false}>ID NO.</TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableHead-root">
            <TableSortLabel active={false}>CODE</TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableHead-root">
            <TableSortLabel active={false}>DEPARTMENT</TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableHead-root">COMPANY</TableCell>

          <TableCell className="FstoTableHead-root">STATUS</TableCell>

          <TableCell className="FstoTableHead-root">
            <TableSortLabel active={false}>LAST MODIFIED</TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableHead-root" align="center">ACTIONS</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {
          fetching
            ? <Preloader row={5} col={7} />
            : data
              ? data.map((data, index) => (
                <TableRow key={index}>
                  <TableCell className="FstoTableData-root" align="center">
                    {data.id}
                  </TableCell>

                  <TableCell className="FstoTableData-root">
                    {data.code}
                  </TableCell>

                  <TableCell className="FstoTableData-root">
                    {data.department}
                  </TableCell>

                  <TableCell className="FstoTableData-root">
                    {data.company?.name}
                  </TableCell>

                  <TableCell className="FstoTableData-root">
                    {
                      Boolean(data.deleted_at)
                        ? "Inactive"
                        : "Active"
                    }
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
                      onStatusChange={onStatusChange}
                      onUpdateChange={onUpdateChange}
                    />
                  </TableCell>
                </TableRow>
              ))
              : (
                <TableRow>
                  <TableCell align="center" colSpan={7}>NO RECORDS FOUND</TableCell>
                </TableRow>
              )
        }
      </TableBody>
    </Table>
  )
}

export default DepartmentsTable