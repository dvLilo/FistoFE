import React from 'react'

import { NavLink } from 'react-router-dom'

import { TOGGLE_SIDEBAR, HIDE_SIDEBAR } from '../actions'
import { useSelector, useDispatch } from 'react-redux'

import {
  styled,
  Box,
  Button,
  IconButton,
  Backdrop
} from '@mui/material'

import {
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails
} from '@mui/material'

import {
  CircleOutlined as Bullet,
  // Circle as BulletFilled,

  SettingsOutlined as Masterlist,
  PostAddOutlined as Request,
  FeedOutlined as Document,
  ConfirmationNumberOutlined as Voucher,
  LocalAtmOutlined as Cheque,
  FactCheckOutlined as Approval,
  SecurityOutlined as Confidential,
  AssessmentOutlined as Reports,

  ExpandMoreSharp,
  Close
} from '@mui/icons-material'

import '../assets/css/styles.sidebar.scss'

import FistoLogo from '../assets/img/logo_s.png'

const Accordion = styled(props => (
  <MuiAccordion
    elevation={0}
    square
    disableGutters
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: 'rgba(0,0,0,0)',
  color: 'rgba(255,255,255,0.95)',
  '&:before': {
    display: 'none'
  }
}))

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={
      <ExpandMoreSharp sx={{ color: 'rgba(255,255,255,0.85)' }} />
    }
    {...props}
  />
))(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: 'rgba(255,255,255,0.85)',
  fontWeight: '700',
  whiteSpace: 'nowrap'
}))

const Sidebar = () => {
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
          <Bullet
            sx={{
              fontSize: '0.8125rem',
              ml: 1,
              mr: 2
            }}
          />
          {children}
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
              <Close sx={{ color: '#f0f0e1' }} />
            </IconButton>
          </Box>

          <img className="FstoSidebar-logo" src={FistoLogo} alt="Fistó App" />

          <Accordion>
            <AccordionSummary>
              <Masterlist sx={{ mr: 2.5 }} /> Master List
            </AccordionSummary>
            <AccordionDetails>
              <RouterLink className="FstoLink-root" to="/dashboard">User Accounts</RouterLink>
              <RouterLink className="FstoLink-root" to="/dashboard/categories">Categories</RouterLink>
              <RouterLink className="FstoLink-root" to="/dashboard/document-types">Document Types</RouterLink>
              <RouterLink className="FstoLink-root" to="/dashboard/companies">Companies</RouterLink>
              <RouterLink className="FstoLink-root" to="/dashboard/departments">Departments</RouterLink>
              <RouterLink className="FstoLink-root" to="/dashboard/locations">Locations</RouterLink>
              <RouterLink className="FstoLink-root" to="/dashboard/references">References</RouterLink>
              <RouterLink className="FstoLink-root" to="/dashboard/supplier-types">Urgency Types</RouterLink>
              <RouterLink className="FstoLink-root" to="/dashboard/suppliers">Suppliers</RouterLink>
              <RouterLink className="FstoLink-root" to="/dashboard/utility-categories">Utility Categories</RouterLink>
              <RouterLink className="FstoLink-root" to="/dashboard/utility-locations">Utility Locations</RouterLink>
              <RouterLink className="FstoLink-root" to="/dashboard/account-numbers">Utility Account</RouterLink>
              <RouterLink className="FstoLink-root" to="/dashboard/credit-cards">Credit Card</RouterLink>
              <RouterLink className="FstoLink-root" to="/dashboard/account-titles">Account Titles</RouterLink>
              <RouterLink className="FstoLink-root" to="/dashboard/payroll-clients">Payroll Clients</RouterLink>
              <RouterLink className="FstoLink-root" to="/dashboard/payroll-categories">Payroll Categories</RouterLink>
              <RouterLink className="FstoLink-root" to="/dashboard/banks">Banks</RouterLink>
              <RouterLink className="FstoLink-root" to="/dashboard/reasons">Reasons</RouterLink>

            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              <Request sx={{ mr: 2.5 }} /> Requests
            </AccordionSummary>
            <AccordionDetails>
              <RouterLink className="FstoLink-root" to="/requestor">Creation of Request</RouterLink>
              <RouterLink className="FstoLink-root" to="/requestor/returned-documents">Returned Requests</RouterLink>

            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              <Document sx={{ mr: 2.5 }} /> Documents
            </AccordionSummary>
            <AccordionDetails>
              <RouterLink className="FstoLink-root" to="/tagging">Tagging of Documents</RouterLink>
              <RouterLink className="FstoLink-root" to="/tagging/returned-documents">Returned Documents</RouterLink>

            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              <Voucher sx={{ mr: 2.5 }} /> Voucher
            </AccordionSummary>
            <AccordionDetails>
              {/* RouterLink here... */}

            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              <Cheque sx={{ mr: 2.5 }} /> Cheque
            </AccordionSummary>
            <AccordionDetails>
              {/* RouterLink here... */}

            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              <Approval sx={{ mr: 2.5 }} /> Approval
            </AccordionSummary>
            <AccordionDetails>
              {/* RouterLink here... */}

            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              <Confidential sx={{ mr: 2.5 }} /> Confidential
            </AccordionSummary>
            <AccordionDetails>
              {/* RouterLink here... */}

            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              <Reports sx={{ mr: 2.5 }} /> Reports
            </AccordionSummary>
            <AccordionDetails>
              {/* RouterLink here... */}

            </AccordionDetails>
          </Accordion>
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
