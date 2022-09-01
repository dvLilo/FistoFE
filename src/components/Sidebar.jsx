import React from 'react'

import { NavLink } from 'react-router-dom'

import { TOGGLE_SIDEBAR, HIDE_SIDEBAR } from '../actions'
import { useSelector, useDispatch } from 'react-redux'

import {
  Box,
  Button,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Backdrop
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
                    ? <BulletActive sx={{ fontSize: '0.8125rem', ml: 1, mr: 2 }} />
                    : <BulletInactive sx={{ fontSize: '0.8125rem', ml: 1, mr: 2 }} />
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
              <Close sx={{ color: '#f0f0e1' }} />
            </IconButton>
          </Box>

          <img className="FstoSidebar-logo" src={FistoLogo} alt="Fistó App" />

          {
            user?.role === `Administrator` && user?.permissions.includes(0) &&
            <Accordion elevation={0} square disableGutters>
              <AccordionSummary expandIcon={<ExpandIcon htmlColor="white" />}>
                <MasterlistIcon sx={{ mr: 2.5 }} /> Master List
              </AccordionSummary>
              <AccordionDetails>
                <RouterLink className="FstoLink-root" to="/masterlist/users">User Accounts</RouterLink>
                <RouterLink className="FstoLink-root" to="/masterlist/categories">Categories</RouterLink>
                <RouterLink className="FstoLink-root" to="/masterlist/document-types">Document Types</RouterLink>
                <RouterLink className="FstoLink-root" to="/masterlist/companies">Companies</RouterLink>
                <RouterLink className="FstoLink-root" to="/masterlist/departments">Departments</RouterLink>
                <RouterLink className="FstoLink-root" to="/masterlist/locations">Locations</RouterLink>
                <RouterLink className="FstoLink-root" to="/masterlist/references">References</RouterLink>
                <RouterLink className="FstoLink-root" to="/masterlist/supplier-types">Urgency Types</RouterLink>
                <RouterLink className="FstoLink-root" to="/masterlist/suppliers">Suppliers</RouterLink>
                <RouterLink className="FstoLink-root" to="/masterlist/utility-categories">Utility Categories</RouterLink>
                <RouterLink className="FstoLink-root" to="/masterlist/utility-locations">Utility Locations</RouterLink>
                <RouterLink className="FstoLink-root" to="/masterlist/account-numbers">Utility Account</RouterLink>
                <RouterLink className="FstoLink-root" to="/masterlist/credit-cards">Credit Card</RouterLink>
                <RouterLink className="FstoLink-root" to="/masterlist/account-titles">Account Titles</RouterLink>
                <RouterLink className="FstoLink-root" to="/masterlist/payroll-clients">Payroll Clients</RouterLink>
                <RouterLink className="FstoLink-root" to="/masterlist/payroll-categories">Payroll Categories</RouterLink>
                <RouterLink className="FstoLink-root" to="/masterlist/banks">Banks</RouterLink>
                <RouterLink className="FstoLink-root" to="/masterlist/reasons">Reasons</RouterLink>

              </AccordionDetails>
            </Accordion>
          }

          <Accordion elevation={0} square disableGutters>
            <AccordionSummary expandIcon={<ExpandIcon htmlColor="white" />}>
              <DocumentIcon sx={{ mr: 2.5 }} /> Documents
            </AccordionSummary>
            <AccordionDetails>
              {user?.permissions.includes(1) && <RouterLink className="FstoLink-root" to="/request">Creation of Request</RouterLink>}
              {user?.permissions.includes(20) && <RouterLink className="FstoLink-root" to="/document/tagging">Tagging of Documents</RouterLink>}
              {user?.permissions.includes(19) && <RouterLink className="FstoLink-root" to="/document/transmitting">Transmittal of Documents</RouterLink>}
              <RouterLink className="FstoLink-root" to="/document/returned-documents">Returned Documents</RouterLink>

            </AccordionDetails>
          </Accordion>

          {
            (
              user?.role === `Administrator` ||
              user?.role === `AP Associate` ||
              user?.role === `AP Specialist` ||
              (user?.role === `AP Tagging` && (user?.permissions.includes(10) || user?.permissions.includes(12)))
            ) &&
            <Accordion elevation={0} square disableGutters>
              <AccordionSummary expandIcon={<ExpandIcon htmlColor="white" />}>
                <VoucherIcon sx={{ mr: 2.5 }} /> Voucher
              </AccordionSummary>
              <AccordionDetails>
                {user?.permissions.includes(12) && <RouterLink className="FstoLink-root" to="/voucher/vouchering">Creation of Voucher</RouterLink>}
                {user?.permissions.includes(11) && <RouterLink className="FstoLink-root" to="/voucher/filing">Filing of Voucher</RouterLink>}
                {user?.permissions.includes(10) && <RouterLink className="FstoLink-root" to="/voucher/reversing">Reversal Request</RouterLink>}

              </AccordionDetails>
            </Accordion>
          }

          {
            (
              user?.role === `Administrator` ||
              user?.role === `Treasury Associate` ||
              (user?.role === `AP Tagging` && user?.permissions.includes(6)) ||
              (user?.role === `AP Associate` && user?.permissions.includes(6)) ||
              (user?.role === `AP Specialist` && user?.permissions.includes(6))
            ) &&
            <Accordion elevation={0} square disableGutters>
              <AccordionSummary expandIcon={<ExpandIcon htmlColor="white" />}>
                <ChequeIcon sx={{ mr: 2.5 }} /> Cheque
              </AccordionSummary>
              <AccordionDetails>
                {user?.permissions.includes(7) && <RouterLink className="FstoLink-root" to="/cheque/chequing">Creation of Cheque</RouterLink>}
                {user?.permissions.includes(6) && <RouterLink className="FstoLink-root" to="/cheque/releasing">Releasing of Cheque</RouterLink>}
                {user?.permissions.includes(8) && <RouterLink className="FstoLink-root" to="/cheque/clearing">Clearing of Cheque</RouterLink>}

              </AccordionDetails>
            </Accordion>
          }

          {
            (
              user?.role === `Administrator` ||
              user?.role === `Approver`
            ) &&
            <Accordion elevation={0} square disableGutters>
              <AccordionSummary expandIcon={<ExpandIcon htmlColor="white" />}>
                <ApprovalIcon sx={{ mr: 2.5 }} /> Approval
              </AccordionSummary>
              <AccordionDetails>
                {user?.permissions.includes(17) && <RouterLink className="FstoLink-root" to="/approval">Transaction Approval</RouterLink>}

              </AccordionDetails>
            </Accordion>
          }

          {
            (
              user?.role === `Administrator` ||
              user?.role === `Approver`
            ) &&
            <Accordion elevation={0} square disableGutters>
              <AccordionSummary expandIcon={<ExpandIcon htmlColor="white" />}>
                <ConfidentialIcon sx={{ mr: 2.5 }} /> Confidential
              </AccordionSummary>
              <AccordionDetails>
                {/* RouterLink here... */}

              </AccordionDetails>
            </Accordion>
          }

          <Accordion elevation={0} square disableGutters>
            <AccordionSummary expandIcon={<ExpandIcon htmlColor="white" />}>
              <ReportsIcon sx={{ mr: 2.5 }} /> Reports
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
