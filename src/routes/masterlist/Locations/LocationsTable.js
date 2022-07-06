import React from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,

  Box,
  Popover,
  List,
  ListItem
} from '@mui/material'

import MoreIcon from '@mui/icons-material/More'

import ActionMenu from '../../../components/ActionMenu'
import Preloader from '../../../components/Preloader'

const LocationsTable = (props) => {

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
            <TableSortLabel active={false}>CODE</TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-head">
            <TableSortLabel active={false}>LOCATION</TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-head">DEPARTMENTS</TableCell>

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
            ? <Preloader row={5} col={7} />
            : data
              ? data.map((data, index) => (
                <TableRow className="FstoTableRowMasterlist-root" key={index}>
                  <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-body" align="center">
                    {data.id}
                  </TableCell>

                  <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-body">
                    {data.code}
                  </TableCell>

                  <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-body">
                    {data.location}
                  </TableCell>

                  <TableCell className="FstoTableCellMasterlist-root FstoTableCellMasterlist-body">
                    <ShowMore data={data.departments} />
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

const ShowMore = (props) => {

  const { data } = props

  const [anchorEl, setAnchorEl] = React.useState(null)

  return (
    Boolean(data.length) &&
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {
        data.slice(0, 2).map(data => data.name).join(", ")}
      {
        data.length > 2 &&
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
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'right',
            }}
            transitionDuration={{
              appear: 200,
              enter: 200,
              exit: 200
            }}
            PaperProps={{
              sx: {
                maxWidth: 260,
                maxHeight: 210
              }
            }}
            disablePortal
          >
            <List dense disablePadding>
              {
                data.slice(2, data.length).map((item, index) => (
                  <ListItem dense key={index}>
                    {item.name}
                  </ListItem>
                ))
              }
            </List>
          </Popover>
        </React.Fragment>
      }
    </Box>
  )
}

export default LocationsTable