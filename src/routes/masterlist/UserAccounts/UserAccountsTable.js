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

  const [order, setOrder] = React.useState('desc')
  const [orderBy, setOrderBy] = React.useState('updated_at')

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  const comparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy)
  }

  const onSort = (property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  return (
    <Table className="FstoTableMasterlist-root" size="small">
      <TableHead className="FstoTableHeadMasterlist-root">
        <TableRow className="FstoTableRowMasterlist-root">
          <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-head" align="center">
            <TableSortLabel
              active={orderBy === `id`}
              direction={orderBy === `id` ? order : `asc`}
              onClick={() => onSort(`id`)}
            > ID NO.
            </TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-head">
            <TableSortLabel
              active={orderBy === `username`}
              direction={orderBy === `username` ? order : `asc`}
              onClick={() => onSort(`username`)}
            > USERNAME
            </TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-head">
            <TableSortLabel
              active={orderBy === `last_name`}
              direction={orderBy === `last_name` ? order : `asc`}
              onClick={() => onSort(`last_name`)}
            > FULLNAME
            </TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-head">
            <TableSortLabel
              active={orderBy === `role`}
              direction={orderBy === `role` ? order : `asc`}
              onClick={() => onSort(`role`)}
            > ROLE
            </TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-head">DEPARTMENT</TableCell>

          <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-head">STATUS</TableCell>

          <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-head">
            <TableSortLabel
              active={orderBy === `updated_at`}
              direction={orderBy === `updated_at` ? order : `asc`}
              onClick={() => onSort(`updated_at`)}
            > LAST MODIFIED
            </TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-head" align="center">ACTIONS</TableCell>
        </TableRow>
      </TableHead>
      <TableBody className="FstoTableHeadMasterlist-root">
        {
          fetching
            ? <Preloader row={5} col={8} />
            : data
              ? data.sort(comparator(order, orderBy)).map((data, index) => (
                <TableRow className="FstoTableRowMasterlist-root" key={index} hover>
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