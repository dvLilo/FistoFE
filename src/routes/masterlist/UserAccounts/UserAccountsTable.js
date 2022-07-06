import React from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel
} from '@mui/material'

import Preloader from '../../../components/Preloader'

import UserAccountsActions from './UserAccountsActions'

const UserAccountsTable = (props) => {

  const {
    fetching,
    data,
    onUpdate,
    onStatus,
    onReset,
    onView
  } = props

  return (
    <Table className="FstoTableMasterlist-root" size="small">
      <TableHead className="FstoTableHeadMasterlist-root">
        <TableRow className="FstoTableRowMasterlist-root">
          <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-head" align="center">
            <TableSortLabel active={false}>ID NO.</TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-head">
            <TableSortLabel active={false}>USERNAME</TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-head">
            <TableSortLabel active={false}>FULLNAME</TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-head">
            <TableSortLabel active={false}>ROLE</TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-head">
            <TableSortLabel active={false}>DEPARTMENT</TableSortLabel>
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
            ? <Preloader row={5} col={8} />
            : data
              ? data.map((data, index) => (
                <TableRow className="FstoTableRowMasterlist-root" key={index}>
                  <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-body" align="center">
                    {data.id}
                  </TableCell>

                  <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-body">
                    {data.username}
                  </TableCell>

                  <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-body" sx={{ textTransform: "uppercase" }}>
                    {data.last_name}, {data.first_name} {data.middle_name.charAt(0)}.
                  </TableCell>

                  <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-body" sx={{ textTransform: "capitalize" }}>
                    {data.role}
                  </TableCell>

                  <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-body" sx={{ textTransform: "capitalize" }}>
                    {data.department[0].name}
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

                  <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-body" align="center">
                    <UserAccountsActions
                      data={data}
                      onUpdate={onUpdate}
                      onStatus={onStatus}
                      onReset={onReset}
                      onView={onView}
                    />
                  </TableCell>
                </TableRow>
              ))
              : (
                <TableRow>
                  <TableCell align="center" colSpan={8}>NO RECORDS FOUND</TableCell>
                </TableRow>
              )
        }
      </TableBody>
    </Table>
  )
}

export default UserAccountsTable