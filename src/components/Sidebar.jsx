import React from 'react'

import { NavLink } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'
import { TOGGLE_SIDEBAR, HIDE_SIDEBAR } from '../actions'

import {
  Box,
  Button,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Backdrop,
  Typography,
  Chip
} from '@mui/material'

import {
  Close,
  CircleOutlined as BulletInactive,
  Circle as BulletActive,

  ExpandMoreRounded as ExpandIcon,
  SettingsOutlined as MasterlistIcon,
  FeedOutlined as DocumentIcon,
  ConfirmationNumberOutlined as VoucherIcon,
  LocalAtmOutlined as ChequeIcon,
  FactCheckOutlined as ApprovalIcon,
  SecurityOutlined as ConfidentialIcon,
  AssessmentOutlined as ReportsIcon
} from '@mui/icons-material'

import '../assets/css/styles.sidebar.scss'

import FistoLogo from '../assets/img/logo_s.png'

const Sidebar = () => {
  const user = useSelector(state => state.user)
  const open = useSelector(state => state.sidebar)
  const color = useSelector(state => state.color)

  const dispatch = useDispatch()

  const hideSidebarHandler = () => {
    dispatch(HIDE_SIDEBAR())
  }

  const toggleSidebarHandler = () => {
    dispatch(TOGGLE_SIDEBAR())
  }

  const RouterLink = ({ children, ...rest }) => {
    return (
      <Button
        className="FstoButton-root"
        size="small"
        onClick={hideSidebarHandler}
        fullWidth
        disableElevation
      >
        <NavLink end {...rest}>
          {
            ({ isActive }) => {
              return (
                <React.Fragment>
                  {isActive
                    ? <BulletActive sx={{ fontSize: '0.8125rem', ml: '4px', mr: '10px' }} />
                    : <BulletInactive sx={{ fontSize: '0.8125rem', ml: '4px', mr: '10px' }} />
                  }
                  {children}
                </React.Fragment>
              )
            }
          }
        </NavLink>
      </Button>
    )
  }

  return (
    <React.Fragment>
      <aside className={open ? `FstoSidebar-root visible ${color}` : `FstoSidebar-root ${color}`}>
        <Box className="FstoSidebar-wrapper">
          <Box className="FstoSidebar-toggle">
            <IconButton onClick={toggleSidebarHandler} disableRipple>
              <Close htmlColor="#f0f0e1" />
            </IconButton>
          </Box>

          <img className="FstoSidebar-logo" src={FistoLogo} alt="Fistó App" />

          {
            !!user &&
            (!!user.role.match(/administrator/i) && user.permissions.includes(0)) &&
            <Accordion defaultExpanded={/administrator/i.test(user.role)} elevation={0} square disableGutters>
              <AccordionSummary expandIcon={<ExpandIcon htmlColor="white" />}>
                <MasterlistIcon />
                <Typography variant="sidebar">Master List</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <RouterLink className="FstoSidebarLink-root" to="/masterlist/users">User Accounts</RouterLink>
                <RouterLink className="FstoSidebarLink-root" to="/masterlist/categories">Categories</RouterLink>
                <RouterLink className="FstoSidebarLink-root" to="/masterlist/document-types">Document Types</RouterLink>
                <RouterLink className="FstoSidebarLink-root" to="/masterlist/companies">Companies</RouterLink>
                <RouterLink className="FstoSidebarLink-root" to="/masterlist/departments">Departments</RouterLink>
                <RouterLink className="FstoSidebarLink-root" to="/masterlist/locations">Locations</RouterLink>
                <RouterLink className="FstoSidebarLink-root" to="/masterlist/references">References</RouterLink>
                <RouterLink className="FstoSidebarLink-root" to="/masterlist/supplier-types">Urgency Types</RouterLink>
                <RouterLink className="FstoSidebarLink-root" to="/masterlist/suppliers">Suppliers</RouterLink>
                <RouterLink className="FstoSidebarLink-root" to="/masterlist/utility-categories">Utility Categories</RouterLink>
                <RouterLink className="FstoSidebarLink-root" to="/masterlist/utility-locations">Utility Locations</RouterLink>
                <RouterLink className="FstoSidebarLink-root" to="/masterlist/account-numbers">Utility Account</RouterLink>
                <RouterLink className="FstoSidebarLink-root" to="/masterlist/credit-cards">Credit Card</RouterLink>
                <RouterLink className="FstoSidebarLink-root" to="/masterlist/account-titles">Account Titles</RouterLink>
                <RouterLink className="FstoSidebarLink-root" to="/masterlist/payroll-clients">Payroll Clients</RouterLink>
                <RouterLink className="FstoSidebarLink-root" to="/masterlist/payroll-categories">Payroll Categories</RouterLink>
                <RouterLink className="FstoSidebarLink-root" to="/masterlist/banks">Banks</RouterLink>
                <RouterLink className="FstoSidebarLink-root" to="/masterlist/reasons">Reasons</RouterLink>
              </AccordionDetails>
            </Accordion>
          }

          {
            !!user &&
            <Accordion defaultExpanded={/tagging|requestor/i.test(user.role)} elevation={0} square disableGutters>
              <AccordionSummary expandIcon={<ExpandIcon htmlColor="white" />}>
                <DocumentIcon />
                <Typography variant="sidebar">Documents</Typography>
              </AccordionSummary>

              <AccordionDetails>
                {user.permissions.includes(1) && <RouterLink className="FstoSidebarLink-root" to="/request">Creation of Request</RouterLink>}
                {user.permissions.includes(20) && <RouterLink className="FstoSidebarLink-root" to="/document/tagging">Tagging of Documents <Chip className="FstoSidebarChip-root" color="primary" label="99+" size="small" /></RouterLink>}
                {user.permissions.includes(19) && <RouterLink className="FstoSidebarLink-root" to="/document/transmitting">Transmittal of Documents</RouterLink>}
                <RouterLink className="FstoSidebarLink-root" to="/document/returned-documents">Returned Documents</RouterLink>
              </AccordionDetails>
            </Accordion>
          }

          {
            !!user &&
            (!!user.role.match(/administrator|ap associate|specialist/i) || (!!user.role.match(/tagging/i) && (user.permissions.includes(10) || user.permissions.includes(12)))) &&
            <Accordion defaultExpanded={/associate|specialist/i.test(user.role)} elevation={0} square disableGutters>
              <AccordionSummary expandIcon={<ExpandIcon htmlColor="white" />}>
                <VoucherIcon />
                <Typography variant="sidebar">Voucher</Typography>
              </AccordionSummary>

              <AccordionDetails>
                {user.permissions.includes(12)
                  && <RouterLink className="FstoSidebarLink-root" to="/voucher/vouchering">Creation of Voucher</RouterLink>
                }

                {user.permissions.includes(11)
                  && <RouterLink className="FstoSidebarLink-root" to="/voucher/filing">Filing of Voucher</RouterLink>
                }

                {user.permissions.includes(10)
                  && <RouterLink className="FstoSidebarLink-root" to="/voucher/reversing">Reversal Request</RouterLink>
                }
              </AccordionDetails>
            </Accordion>
          }

          {
            !!user &&
            (!!user.role.match(/administrator|treasury/i) || (!!user.role.match(/tagging|associate|specialist/i) && user.permissions.includes(6))) &&
            <Accordion defaultExpanded={/treasury/i.test(user.role)} elevation={0} square disableGutters>
              <AccordionSummary expandIcon={<ExpandIcon htmlColor="white" />}>
                <ChequeIcon />
                <Typography variant="sidebar">Cheque</Typography>
              </AccordionSummary>

              <AccordionDetails>
                {user.permissions.includes(7)
                  && <RouterLink className="FstoSidebarLink-root" to="/cheque/chequing">Creation of Cheque</RouterLink>
                }

                {user.permissions.includes(6)
                  && <RouterLink className="FstoSidebarLink-root" to="/cheque/releasing">Releasing of Cheque</RouterLink>
                }

                {user.permissions.includes(8)
                  && <RouterLink className="FstoSidebarLink-root" to="/cheque/clearing">Clearing of Cheque</RouterLink>
                }
              </AccordionDetails>
            </Accordion>
          }

          {
            !!user &&
            !!user.role.match(/administrator|approver/i) &&
            <Accordion defaultExpanded={/approver/i.test(user.role)} elevation={0} square disableGutters>
              <AccordionSummary expandIcon={<ExpandIcon htmlColor="white" />}>
                <ApprovalIcon />
                <Typography variant="sidebar">Approval</Typography>
              </AccordionSummary>

              <AccordionDetails>
                {user.permissions.includes(17)
                  && <RouterLink className="FstoSidebarLink-root" to="/approval">Transaction Approval</RouterLink>
                }
              </AccordionDetails>
            </Accordion>
          }

          {
            !!user &&
            !!user.role.match(/administrator|approver/i) &&
            <Accordion elevation={0} square disableGutters>
              <AccordionSummary expandIcon={<ExpandIcon htmlColor="white" />}>
                <ConfidentialIcon />
                <Typography variant="sidebar">Confidential</Typography>
              </AccordionSummary>

              <AccordionDetails>
                {user.permissions.includes(15)
                  && <RouterLink className="FstoSidebarLink-root" to="/confidential/vouchering">Tagging and Vouchering</RouterLink>
                }

                {user.permissions.includes(18)
                  && <RouterLink className="FstoSidebarLink-root" to="/confidential/approving">Transaction Approval</RouterLink>
                }
              </AccordionDetails>
            </Accordion>
          }

          {
            !!user &&
            <Accordion elevation={0} square disableGutters>
              <AccordionSummary expandIcon={<ExpandIcon htmlColor="white" />}>
                <ReportsIcon />
                <Typography variant="sidebar">Reports</Typography>
              </AccordionSummary>

              <AccordionDetails>
                {/* RouterLink here... */}
              </AccordionDetails>
            </Accordion>
          }
        </Box>
      </aside>

      <Backdrop
        className="FstoBackdrop-root"
        open={open}
        onClick={hideSidebarHandler}
      >
      </Backdrop>
    </React.Fragment>
  )
}

export default Sidebar
