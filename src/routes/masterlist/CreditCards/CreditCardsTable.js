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

const CreditCardsTable = (props) => {

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
            <TableSortLabel active={false}>BANK NAME</TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableHead-root">
            <TableSortLabel active={false}>ACCOUNT NO.</TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableHead-root">CATEGORIES</TableCell>

          <TableCell className="FstoTableHead-root">LOCATIONS</TableCell>

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
                    {data.name}
                  </TableCell>

                  <TableCell className="FstoTableData-root">
                    {data.account_no}
                  </TableCell>

                  <TableCell className="FstoTableData-root" sx={{ textTransform: "capitalize" }}>
                    {data.utility_categories.map(cat => cat.category).join(', ')}
                  </TableCell>

                  <TableCell className="FstoTableData-root">
                    <ShowMore data={data.utility_locations} />
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
                  <TableCell align="center" colSpan={8}>NO RECORDS FOUND</TableCell>
                </TableRow>
              )
        }
      </TableBody>
    </Table>
  )
}

const ShowMore = (props) => {

  const { data } = props

  const [anchorEl, setAnchorEl] = React.useState(null)

  return (
    Boolean(data.length)
    && (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, textTransform: 'capitalize' }}>
        {
          data.slice(0, 2).map(data => data.location).join(', ')
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
                    data.slice(2, data.length).map((data, index) => (
                      <ListItem dense key={index}>
                        {data.location}
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

export default CreditCardsTable