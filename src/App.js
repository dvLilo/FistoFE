import React from 'react'

import { useSelector } from 'react-redux'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'

import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery
} from '@mui/material'

import Landing from './Landing'

// Masterlist
import UserAccounts from './routes/masterlist/UserAccounts/'
import NewUser from './routes/masterlist/UserAccounts/NewUser'
import UpdateUser from './routes/masterlist/UserAccounts/UpdateUser'
import ChangePassword from './routes/masterlist/ChangePassword'
import Organization from './routes/masterlist/Organization/Organization'
import VoucherCodes from './routes/masterlist/VoucherCodes/'
import Companies from './routes/masterlist/Companies/'
import BusinessUnit from './routes/masterlist/BusinessUnits/'
import DocumentTypes from './routes/masterlist/DocumentTypes/'
import Departments from './routes/masterlist/Departments/'
import SubUnit from './routes/masterlist/SubUnits/'
import Locations from './routes/masterlist/Locations/'
import Categories from './routes/masterlist/Categories/'
import References from './routes/masterlist/References/'
import SupplierTypes from './routes/masterlist/SupplierTypes/'
import Suppliers from './routes/masterlist/Suppliers/'
import UtilityCategories from './routes/masterlist/UtilityCategories/'
import UtilityLocations from './routes/masterlist/UtilityLocations/'
import AccountNumbers from './routes/masterlist/AccountNumbers/'
import CreditCards from './routes/masterlist/CreditCards/'
import AccountTitles from './routes/masterlist/AccountTitles/'
import TransactionTypes from './routes/masterlist/TransactionTypes'
import PayrollClients from './routes/masterlist/PayrollClients/'
import PayrollCategories from './routes/masterlist/PayrollCategories/'
import Banks from './routes/masterlist/Banks/'
import Reasons from './routes/masterlist/Reasons/'

// Requestor
import NewRequest from './routes/requestor/NewRequest'
import UpdateRequest from './routes/requestor/UpdateRequest'
import DocumentRequesting from './routes/requestor/DocumentRequesting'
import DocumentReturnedRequest from './routes/requestor/returned/ReturnedDocument'

// Tagging
import DocumentTagging from './routes/tagging/DocumentTagging'
import DocumentReturnedTag from './routes/tagging/returned/ReturnedDocument'

// GAS (Transmitting)
import DocumentTransferring from './routes/transferring/DocumentTransferring'

// Vouchering
import DocumentVouchering from './routes/vouchering/DocumentVouchering'
import DocumentReturnedVoucher from './routes/vouchering/returned/ReturnedDocument'

// Approving
import DocumentApproving from './routes/approving/DocumentApproving'

// Transmitting
import DocumentTransmitting from './routes/transmitting/DocumentTransmitting'

// Inspecting
import DocumentInspecting from './routes/inspecting/DocumentInspecting'

// Chequing
import DocumentChequing from './routes/chequing/DocumentChequing'
import DocumentReturnedCheque from './routes/chequing/returned/ReturnedDocument'

// Debiting
import DocumentDebiting from './routes/debiting/DocumentDebiting'

// Auditing
import DocumentAuditing from './routes/auditing/DocumentAuditing'

// Signing
import DocumentSigning from './routes/signing/DocumentSigning'

// Issuing
import DocumentIssuing from './routes/issuing/DocumentIssuing'
import DocumentReturnedIssue from './routes/issuing/returned/ReturnedDocument'

// Releasing
import DocumentReleasing from './routes/releasing/DocumentReleasing'

// GAS (Transmitting)
import DocumentDistributing from './routes/distributing/DocumentDistributing'

// Filing
import DocumentFiling from './routes/filing/DocumentFiling'

// Reversal Requesting
import DocumentReversing from './routes/reversing/DocumentReversing'

// Clearing
import DocumentClearing from './routes/clearing/DocumentClearing'

// Confidential
import DocumentConfidentialVouchering from './routes/confidential/vouchering/DocumentConfidentialVouchering'
import DocumentConfidentialApproving from './routes/confidential/approving/DocumentConfidentialApproving'
import DocumentConfidentialTransmitting from './routes/confidential/transmitting/DocumentConfidentialTransmitting'
import DocumentConfidentialReleasing from './routes/confidential/releasing/DocumentConfidentialReleasing'
import DocumentConfidentialFiling from './routes/confidential/filing/DocumentConfidentialFiling'

// Counter Receipt
import DocumentCounterReceiptCreating from './routes/countering/DocumentCounterReceiptCreating'
import DocumentCounterReceiptMonitoring from './routes/countering/DocumentCounterReceiptMonitoring'
import NewCounterReceipt from './routes/countering/NewCounterReceipt'
import UpdateCounterReceipt from './routes/countering/UpdateCounterReceipt'

// Receive Receipt
import ReportReceiveReceipt from './routes/reports/receive-receipt/ReportReceiveReceipt'

import NotFound from './exceptions/NotFound'
import Sandbox from './Sandbox'

import FistoProvider from './contexts/FistoContext'
import ReasonProvider from './contexts/ReasonContext'
import PasswordContextProvider from './contexts/PasswordContext'

// Experimental Refactored Transction Request
import TransactionRequest from './routes/requestor/new/TransactionRequest'

import { QueryClient, QueryClientProvider } from 'react-query'

// Create a client
const queryClient = new QueryClient()

const App = () => {

  const colorScheme = useSelector(state => state.theme)
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")

  React.useEffect(() => {
    document.body.classList.add(colorScheme)
    return () => {
      document.body.classList.remove(colorScheme)
    }
  }, [colorScheme])

  const theme = React.useMemo(() => createTheme({
    typography: {
      fontFamily: "'Open Sans', sans-serif",
      fontSize: 12,
      heading: {
        margin: 0,
        fontSize: '1.35em',
        fontWeight: 700
      },
      permission: {
        margin: 0,
        fontSize: '0.95em',
        fontWeight: 500
      },
      sidebar: {
        marginLeft: 20,
        fontWeight: 700
      }
    },
    components: {
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: '0.75em',
            transform: 'translate(14px, 10px) scale(1)'
          },
          shrink: {
            transform: 'translate(18px, -6px) scale(0.85)'
          }
        }
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            color: '#ffffff',
            backgroundColor: 'transparent',

            '&:before': {
              backgroundColor: 'transparent'
            }
          }
        }
      },
      MuiAccordionSummary: {
        styleOverrides: {
          content: {
            alignItems: 'center'
          }
        }
      },
      MuiAccordionDetails: {
        styleOverrides: {
          root: {
            padding: '8px 12px 12px'
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'capitalize'
          }
        }
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&.MuiTableRow-hover:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)'
            }
          }
        }
      }
    },
    palette: {
      mode: colorScheme === "system" ? (prefersDarkMode ? "dark" : "light") : colorScheme,
      ...(
        (colorScheme === "dark" || (colorScheme === "system" && prefersDarkMode))
        && {
          background: {
            default: "#181818"
          }
        }
      ),
      pending: {
        main: "#F79647",
        light: "#F79647",
        dark: "#F79647",
        contrastText: "#F79647"
      },
      tag: {
        main: "#578FFE",
        light: "#578FFE",
        dark: "#578FFE",
        contrastText: "#578FFE"
      },
      voucher: {
        main: "#7030A0",
        light: "#7030A0",
        dark: "#7030A0",
        contrastText: "#7030A0"
      },
      approve: {
        main: "#77933C",
        light: "#77933C",
        dark: "#77933C",
        contrastText: "#77933C"
      },
      transmit: {
        main: "#31859D",
        light: "#31859D",
        dark: "#31859D",
        contrastText: "#31859D"
      },
      cheque: {
        main: "#F79647",
        light: "#F79647",
        dark: "#F79647",
        contrastText: "#F79647"
      },
      release: {
        main: "#F4D836",
        light: "#F4D836",
        dark: "#F4D836",
        contrastText: "#F4D836"
      },
      file: {
        main: "#B66837",
        light: "#B66837",
        dark: "#B66837",
        contrastText: "#B66837"
      }
    },
    zIndex: {
      modal: 1400,
      snackbar: 1300
    }
  }), [colorScheme, prefersDarkMode]);

  console.log(`%c
███████╗██╗ ██████╗████████╗ █████╗
██╔════╝██║██╔════╝╚══██╔══╝██╔══██╗%c
█████╗  ██║╚█████╗    ██║   ██║  ██║
██╔══╝  ██║ ╚═══██╗   ██║   ██║  ██║%c
██║     ██║██████╔╝   ██║   ╚█████╔╝
╚═╝     ╚═╝╚═════╝    ╚═╝    ╚════╝ %c

    Financial Statement Online
    
  `,
    `color: #6a4b9f`,
    `color: #543b7e`,
    `color: #47326a`,
    `color: #b9e4f3`,
  )


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route exact strict path="*" element={<NotFound />} />

            <Route exact path="/sandbox" element={<FistoProvider><ReasonProvider><Sandbox /></ReasonProvider></FistoProvider>} />

            <Route exact path="/" element={<Landing />} />

            <Route exact path="/user/change-password" element={<ProtectedRoute />}>
              <Route index exact strict element={<ChangePassword />} />
            </Route>

            <Route exact path="/masterlist" element={<ProtectedRoute permission={0} />}>
              <Route index exact strict
                path="users"
                element={
                  <PasswordContextProvider>
                    <UserAccounts />
                  </PasswordContextProvider>
                }
              />
              <Route exact strict path="new-user" element={<NewUser />} />
              <Route exact strict path="update-user/:id" element={<UpdateUser />} />
              <Route exact strict path="organization-departments" element={<Organization />} />
              <Route exact strict path="categories" element={<Categories />} />
              <Route exact strict path="document-types" element={<DocumentTypes />} />
              <Route exact strict path="voucher-codes" element={<VoucherCodes />} />
              <Route exact strict path="companies" element={<Companies />} />
              <Route exact strict path="business-unit" element={<BusinessUnit />} />
              <Route exact strict path="departments" element={<Departments />} />
              <Route exact strict path="sub-unit" element={<SubUnit />} />
              <Route exact strict path="locations" element={<Locations />} />
              <Route exact strict path="references" element={<References />} />
              <Route exact strict path="supplier-types" element={<SupplierTypes />} />
              <Route exact strict path="suppliers" element={<Suppliers />} />
              <Route exact strict path="utility-categories" element={<UtilityCategories />} />
              <Route exact strict path="utility-locations" element={<UtilityLocations />} />
              <Route exact strict path="account-numbers" element={<AccountNumbers />} />
              <Route exact strict path="credit-cards" element={<CreditCards />} />
              <Route exact strict path="account-titles" element={<AccountTitles />} />
              <Route exact strict path="transaction-types" element={<TransactionTypes />} />
              <Route exact strict path="payroll-clients" element={<PayrollClients />} />
              <Route exact strict path="payroll-categories" element={<PayrollCategories />} />
              <Route exact strict path="banks" element={<Banks />} />
              <Route exact strict path="reasons" element={<Reasons />} />
            </Route>

            <Route exact path="/request" element={<ProtectedRoute permission={1} />}>
              <Route index exact strict
                element={
                  <PasswordContextProvider>
                    <DocumentRequesting />
                  </PasswordContextProvider>
                }
              />
              <Route exact strict path="new-request" element={<NewRequest />} />
              <Route exact strict path="update-request/:id" element={<UpdateRequest />} />

              <Route exact strict path="returned-requests" element={<DocumentReturnedRequest />} />

              <Route exact strict path="transaction-request" element={<TransactionRequest />} />
            </Route>

            <Route exact path="/document/tagging" element={<ProtectedRoute permission={20} />}>
              <Route index exact strict
                element={
                  <PasswordContextProvider>
                    <DocumentTagging />
                  </PasswordContextProvider>
                }
              />
            </Route>

            <Route exact path="/document/transmitting" element={<ProtectedRoute permission={25} />}>
              <Route index exact strict
                element={<DocumentTransferring />}
              />
            </Route>

            <Route exact path="/document/filing" element={<ProtectedRoute permission={26} />}>
              <Route index exact strict
                element={<DocumentDistributing />}
              />
            </Route>

            <Route exact path="/document/returned-documents" element={<ProtectedRoute permission={20} />}>
              <Route index exact strict
                element={<DocumentReturnedTag />}
              />
            </Route>

            <Route exact path="/voucher/vouchering" element={<ProtectedRoute permission={12} />}>
              <Route index exact strict
                element={
                  <PasswordContextProvider>
                    <DocumentVouchering />
                  </PasswordContextProvider>
                }
              />
            </Route>

            <Route exact path="/voucher/transmitting" element={<ProtectedRoute permission={19} />}>
              <Route index exact strict
                element={<DocumentTransmitting />}
              />
            </Route>

            <Route exact path="/voucher/returned-vouchers" element={<ProtectedRoute permission={12} />}>
              <Route index exact strict
                element={<DocumentReturnedVoucher />}
              />
            </Route>

            <Route exact path="/audit/vouchering" element={<ProtectedRoute permission={3} />}>
              <Route index exact strict
                element={
                  <PasswordContextProvider>
                    <DocumentInspecting />
                  </PasswordContextProvider>
                }
              />
            </Route>

            <Route exact path="/audit/chequing" element={<ProtectedRoute permission={3} />}>
              <Route index exact strict
                element={<DocumentAuditing />}
              />
            </Route>

            <Route exact path="/voucher/filing" element={<ProtectedRoute permission={11} />}>
              <Route index exact strict
                element={<DocumentFiling />}
              />
            </Route>

            <Route exact path="/voucher/reversing" element={<ProtectedRoute />}>
              <Route index exact strict
                element={<DocumentReversing />}
              />
            </Route>

            <Route exact path="/approval" element={<ProtectedRoute permission={17} />}>
              <Route index exact strict
                element={
                  <PasswordContextProvider>
                    <DocumentApproving />
                  </PasswordContextProvider>
                }
              />
            </Route>

            <Route exact path="/confidential/vouchering" element={<ProtectedRoute permission={15} />}>
              <Route index exact strict
                element={<DocumentConfidentialVouchering />}
              />
            </Route>

            <Route exact path="/confidential/approving" element={<ProtectedRoute permission={18} />}>
              <Route index exact strict
                element={<DocumentConfidentialApproving />}
              />
            </Route>

            <Route exact path="/confidential/transmitting" element={<ProtectedRoute permission={13} />}>
              <Route index exact strict
                element={<DocumentConfidentialTransmitting />}
              />
            </Route>

            <Route exact path="/confidential/releasing" element={<ProtectedRoute permission={13} />}>
              <Route index exact strict
                element={<DocumentConfidentialReleasing />}
              />
            </Route>

            <Route exact path="/confidential/filing" element={<ProtectedRoute permission={13} />}>
              <Route index exact strict
                element={<DocumentConfidentialFiling />}
              />
            </Route>

            <Route exact path="/cheque/chequing" element={<ProtectedRoute permission={7} />}>
              <Route index exact strict
                element={
                  <PasswordContextProvider>
                    <DocumentChequing />
                  </PasswordContextProvider>
                }
              />
            </Route>

            <Route exact path="/cheque/debiting" element={<ProtectedRoute permission={9} />}>
              <Route index exact strict
                element={
                  <PasswordContextProvider>
                    <DocumentDebiting />
                  </PasswordContextProvider>
                }
              />
            </Route>

            <Route exact path="/cheque/transmitting" element={<ProtectedRoute permission={23} />}>
              <Route index exact strict
                element={
                  <PasswordContextProvider>
                    <DocumentSigning />
                  </PasswordContextProvider>
                }
              />
            </Route>

            <Route exact path="/cheque/issuing" element={<ProtectedRoute permission={24} />}>
              <Route index exact strict
                element={<DocumentIssuing />}
              />
            </Route>

            <Route exact path="/cheque/returned-issues" element={<ProtectedRoute permission={24} />}>
              <Route index exact strict
                element={<DocumentReturnedIssue />}
              />
            </Route>

            <Route exact path="/cheque/clearing" element={<ProtectedRoute permission={8} />}>
              <Route index exact strict
                element={<DocumentClearing />}
              />
            </Route>

            <Route exact path="/cheque/releasing" element={<ProtectedRoute permission={6} />}>
              <Route index exact strict
                element={<DocumentReleasing />}
              />
            </Route>

            <Route exact path="/cheque/returned-cheques" element={<ProtectedRoute permission={7} />}>
              <Route index exact strict
                element={<DocumentReturnedCheque />}
              />
            </Route>


            <Route exact path="/counter-receipt/creating" element={<ProtectedRoute permission={6} />}>
              <Route index exact strict element={<DocumentCounterReceiptCreating />} />
            </Route>

            <Route exact path="/counter-receipt/new-counter-receipt" element={<ProtectedRoute permission={6} />}>
              <Route index exact strict element={<NewCounterReceipt />} />
            </Route>

            <Route exact path="/counter-receipt/update-counter-receipt/:id" element={<ProtectedRoute permission={6} />}>
              <Route index exact strict element={<UpdateCounterReceipt />} />
            </Route>

            <Route exact path="/counter-receipt/monitoring" element={<ProtectedRoute permission={6} />}>
              <Route index exact strict element={<DocumentCounterReceiptMonitoring />} />
            </Route>



            <Route element={<ProtectedRoute permission={4} />}>
              <Route index exact strict path="/reports/receive-receipt" element={<ReportReceiveReceipt />} />
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </ThemeProvider >
  )
}

export default App