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
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell className="FstoTableHead-root" align="center">
            <TableSortLabel active={false}>ID NO.</TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableHead-root">
            <TableSortLabel active={false}>USERNAME</TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableHead-root">
            <TableSortLabel active={false}>FULLNAME</TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableHead-root">
            <TableSortLabel active={false}>ROLE</TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableHead-root">
            <TableSortLabel active={false}>DEPARTMENT</TableSortLabel>
          </TableCell>

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
            ? <Preloader row={5} col={8} />
            : data
              ? data.map((data, index) => (
                <TableRow key={index}>
                  <TableCell className="FstoTableData-root" align="center">
                    {data.id}
                  </TableCell>

                  <TableCell className="FstoTableData-root">
                    {data.username}
                  </TableCell>

                  <TableCell className="FstoTableData-root" sx={{ textTransform: "uppercase" }}>
                    {data.last_name}, {data.first_name} {data.middle_name.charAt(0)}.
                  </TableCell>

                  <TableCell className="FstoTableData-root" sx={{ textTransform: "capitalize" }}>
                    {data.role}
                  </TableCell>

                  <TableCell className="FstoTableData-root" sx={{ textTransform: "capitalize" }}>
                    {data.department[0].name}
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