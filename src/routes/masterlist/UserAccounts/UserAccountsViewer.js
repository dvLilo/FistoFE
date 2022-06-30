import React from 'react'

import {
  Typography,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'

const UserAccountsViewer = (props) => {

  const {
    open = false,
    data = null,
    onClose
  } = props

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disablePortal
    >
      <DialogContent>
        <Typography variant="h6" sx={{ fontWeight: 700, textTransform: "uppercase" }}>{data?.last_name}, {data?.first_name} {data?.middle_name}</Typography>
        <Typography variant="subtitle2" sx={{ marginBottom: 2 }}>{data?.role}</Typography>

        <Typography variant="subtitle2">Employee ID: {data?.id_prefix}-{data?.id_no}</Typography>
        <Typography variant="subtitle2">Position: {data?.position}</Typography>
        <Typography variant="subtitle2">Department: {data?.department[0].name}</Typography>

        <Divider variant="middle" sx={{ marginY: 3 }} />

        <Typography variant="subtitle2">Permissions:</Typography>
        <Box>
          {
            data?.permissions.map((permission, index) => (
              <Chip size="small" color="secondary" variant="outlined" key={index} label={permission.description} sx={{ margin: "2px" }} />
            ))
          }
        </Box>

        {
          Boolean(data?.document_types.length)
          && (
            <React.Fragment>
              <Divider variant="middle" sx={{ marginY: 3 }} />

              <Typography variant="subtitle2">Document Types:</Typography>
              <List dense disablePadding>
                {
                  data?.document_types.map((document, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemText
                        primary={
                          <Chip size="small" color="info" variant="outlined" label={document.type} />
                        }
                        primaryTypographyProps={{
                          sx: { fontWeight: 500 }
                        }}
                        secondary={
                          Boolean(document.categories.length)
                          && document.categories.map(category => category.name).join(", ")
                        }
                        secondaryTypographyProps={{
                          sx: { marginLeft: 1, textTransform: "capitalize" }
                        }}
                      />
                    </ListItem>
                  ))
                }
              </List>
            </React.Fragment>
          )
        }
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          sx={{ textTransform: "capitalize" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UserAccountsViewer