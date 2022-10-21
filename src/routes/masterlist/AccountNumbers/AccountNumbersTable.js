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

const AccountNumbersTable = (props) => {

  const {
    fetching,
    data,
    onStatusChange,
    onUpdateChange
  } = props

  const [order, setOrder] = React.useState('desc')
  const [orderBy, setOrderBy] = React.useState('updated_at')
  const [orderKey, setOrderKey] = React.useState(null)

  const descendingComparator = (a, b, orderBy, orderKey) => {
    if (orderKey) {
      if (b[orderBy][orderKey] < a[orderBy][orderKey]) return -1
      if (b[orderBy][orderKey] > a[orderBy][orderKey]) return 1
    }
    else {
      if (b[orderBy] < a[orderBy]) return -1
      if (b[orderBy] > a[orderBy]) return 1
    }

    return 0;
  }

  const comparator = (order, orderBy, orderKey) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy, orderKey)
      : (a, b) => -descendingComparator(a, b, orderBy, orderKey)
  }

  const onSort = (property, key = null) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
    setOrderKey(key)
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
              active={orderBy === `account_no`}
              direction={orderBy === `account_no` ? order : `asc`}
              onClick={() => onSort(`account_no`)}
            > ACCOUNT NO.
            </TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-head">
            <TableSortLabel
              active={orderBy === `category`}
              direction={orderBy === `category` ? order : `asc`}
              onClick={() => onSort(`category`, `category`)}
            > TYPE
            </TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-head">
            <TableSortLabel
              active={orderBy === `supplier`}
              direction={orderBy === `supplier` ? order : `asc`}
              onClick={() => onSort(`supplier`, `name`)}
            > SUPPLIER
            </TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-head">
            <TableSortLabel
              active={orderBy === `location`}
              direction={orderBy === `location` ? order : `asc`}
              onClick={() => onSort(`location`, `location`)}
            > LOCATION
            </TableSortLabel>
          </TableCell>

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
              ? data.sort(comparator(order, orderBy, orderKey)).map((data, index) => (
                <TableRow className="FstoTableRowMasterlist-root" key={index} hover>
                  <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-body" align="center">
                    {data.id}
                  </TableCell>

                  <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-body">
                    {data.account_no}
                  </TableCell>

                  <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-body" sx={{ textTransform: "capitalize" }}>
                    {data.category?.category}
                  </TableCell>

                  <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-body">
                    {data.supplier?.name}
                  </TableCell>

                  <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-body">
                    {data.location?.location}
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
                  <TableCell align="center" colSpan={8}>NO RECORDS FOUND</TableCell>
                </TableRow>
              )
        }
      </TableBody>
    </Table>
  )
}

export default AccountNumbersTable