import React from 'react'

import {
  Box,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  List,
  ListItem
} from '@mui/material'

import MoreIcon from '@mui/icons-material/More';

import ActionMenu from '../../../components/ActionMenu'
import Preloader from '../../../components/Preloader'

const ShowMore = (props) => {

  const { data } = props

  const [anchorEl, setAnchorEl] = React.useState(null)

  return (
    Boolean(data.length)
    && (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, textTransform: 'capitalize' }}>
        {
          data.slice(0, 2).map(category => category.name).join(', ')
        }
        {
          data.length > 2
          && (
            <React.Fragment>
              <MoreIcon
                sx={{
                  color: 'rgba(0,0,0,0.35)',
                  fontSize: '1.55em',
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'rgba(0,0,0,0.65)'
                  }
                }}
                onClick={(e) => setAnchorEl(e.currentTarget)}
              />
              <Popover
                open={Boolean(anchorEl)}
                elevation={2}
                anchorEl={anchorEl}
                disablePortal={true}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                  horizontal: "left",
                  vertical: "bottom"
                }}
                PaperProps={{
                  sx: {
                    maxWidth: 260,
                    maxHeight: 210
                  }
                }}
              >
                <List dense disablePadding>
                  {
                    data.slice(2, data.length).map((category, index) => (
                      <ListItem dense key={index}>
                        {category.name}
                      </ListItem>
                    ))
                  }
                </List>
              </Popover>
            </React.Fragment>
          )
        }
      </Box>
    )
  )
}

const DocumentTypesTable = (props) => {

  const {
    fetching,
    data,
    onStatusChange,
    onUpdateChange
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
              active={orderBy === `type`}
              direction={orderBy === `type` ? order : `asc`}
              onClick={() => onSort(`type`)}
            > TYPE
            </TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-head">
            <TableSortLabel
              active={orderBy === `description`}
              direction={orderBy === `description` ? order : `asc`}
              onClick={() => onSort(`description`)}
            > DESCRIPTION
            </TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-head">CATEGORIES</TableCell>

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
            ? <Preloader row={5} col={7} />
            : data
              ? data.sort(comparator(order, orderBy)).map((data, index) => (
                <TableRow className="FstoTableRowMasterlist-root" key={index}>
                  <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-body" align="center">
                    {data.id}
                  </TableCell>

                  <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-body">
                    {data.type}
                  </TableCell>

                  <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-body">
                    {data.description}
                  </TableCell>

                  <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-body">
                    <ShowMore data={data.categories} />
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
                  <TableCell align="center" colSpan={7}>NO RECORDS FOUND</TableCell>
                </TableRow>
              )
        }
      </TableBody>
    </Table>
  )
}

export default DocumentTypesTable