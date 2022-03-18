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

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell className="FstoTableHead-root" align="center">
            <TableSortLabel active={false}>ID NO.</TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableHead-root">
            <TableSortLabel active={false}>TYPE</TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableHead-root">
            <TableSortLabel active={false}>DESCRIPTION</TableSortLabel>
          </TableCell>

          <TableCell className="FstoTableHead-root">CATEGORIES</TableCell>

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
                    {data.type}
                  </TableCell>

                  <TableCell className="FstoTableData-root">
                    {data.description}
                  </TableCell>

                  <TableCell className="FstoTableData-root">
                    <ShowMore data={data.categories} />
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

export default DocumentTypesTable