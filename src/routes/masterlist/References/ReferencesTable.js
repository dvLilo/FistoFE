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

const ReferencesTable = (props) => {

  const {
    fetching,
    data,
    onStatusChange,
    onUpdateChange
  } = props

  return (
    <Table className="FstoTableMasterlist-root" size="small">
      <TableHead className="FstoTableHeadMasterlist-root">
        <TableRow className="FstoTableRowMasterlist-root">
          <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-head" align="center">
            <TableSortLabel active={false}>ID NO.</TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-head">
            <TableSortLabel active={false}>TYPE</TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-head">
            <TableSortLabel active={false}>DESCRIPTION</TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-head">STATUS</TableCell>

          <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-head">
            <TableSortLabel active={false}>LAST MODIFIED</TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-head" align="center">ACTIONS</TableCell>
        </TableRow>
      </TableHead>
      <TableBody className="FstoTableHeadMasterlist-root">
        {
          fetching
            ? <Preloader row={5} col={6} />
            : data
              ? data.map((data, index) => (
                <TableRow className="FstoTableRowMasterlist-root" key={index}>
                  <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-body" align="center">
                    {data.id}
                  </TableCell>

                  <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-body" sx={{ textTransform: "uppercase" }}>
                    {data.type}
                  </TableCell>

                  <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-body">
                    {data.description}
                  </TableCell>

                  <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-body">
                    {
                      Boolean(data.deleted_at)
                        ? "Inactive"
                        : "Active"
                    }
                  </TableCell>

                  <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-body">
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
                  <TableCell align="center" colSpan={6}>NO RECORDS FOUND</TableCell>
                </TableRow>
              )
        }
      </TableBody>
    </Table>
  )
}

export default ReferencesTable