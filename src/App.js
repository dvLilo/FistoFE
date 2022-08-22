import React from 'react'

import CryptoJS from 'crypto-js'

import { useDispatch, useSelector } from 'react-redux'
import { SET_USER, SET_COLOR } from './actions'

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
import DocumentTypes from './routes/masterlist/DocumentTypes/'
import Companies from './routes/masterlist/Companies/'
import Departments from './routes/masterlist/Departments/'
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
import PayrollClients from './routes/masterlist/PayrollClients/'
import PayrollCategories from './routes/masterlist/PayrollCategories/'
import Banks from './routes/masterlist/Banks/'
import Reasons from './routes/masterlist/Reasons/'

// Requestor
import DocumentRequesting from './routes/requestor/DocumentRequesting'
import NewRequest from './routes/requestor/NewRequest'
import UpdateRequest from './routes/requestor/UpdateRequest'
import ReturnedDocument from './routes/requestor/ReturnedDocument'

// Tagging
import DocumentTagging from './routes/tagging/DocumentTagging'

// Vouchering
import DocumentVouchering from './routes/vouchering/DocumentVouchering'

// Approving
import DocumentApproving from './routes/approving/DocumentApproving'

// Transmitting
import DocumentTransmitting from './routes/transmitting/DocumentTransmitting'

// Chequing
import DocumentChequing from './routes/chequing/DocumentChequing'

// Releasing
import DocumentReleasing from './routes/releasing/DocumentReleasing'

import NotFound from './exceptions/NotFound'
import Sandbox from './Sandbox'

import FistoProvider from './contexts/FistoContext'
import PasswordContextProvider from './contexts/PasswordContext'

import { QueryClient, QueryClientProvider } from 'react-query'

// Create a client
const queryClient = new QueryClient()

const App = () => {

  const dispatch = useDispatch()

  React.useEffect(() => {
    const data = window.localStorage.getItem("user")

    if (data) {
      const decryptedUser = CryptoJS.AES.decrypt(data, process.env.REACT_APP_SECRET_KEY).toString(CryptoJS.enc.Utf8)
      dispatch(SET_USER(JSON.parse(decryptedUser)))
    }
    // eslint-disable-next-line
  }, [])

  React.useEffect(() => {
    const color = window.localStorage.getItem("color")

    if (color) dispatch(SET_COLOR(color))
    else window.localStorage.setItem("color", "light")
    // eslint-disable-next-line
  }, [])

  const colorScheme = useSelector(state => state.color)
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
        fontFamily: "'Open Sans', sans-serif",
        fontSize: "1.35em",
        fontWeight: 700
      },
      permission: {
        margin: 0,
        fontFamily: "'Open Sans', sans-serif",
        fontSize: "0.95em",
        fontWeight: 500
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
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'capitalize'
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
      )
    },
    zIndex: {
      modal: 1400,
      snackbar: 1300
    }
  }), [colorScheme, prefersDarkMode]);

  console.log("%c\n███████╗██╗ ██████╗████████╗ █████╗ \n██╔════╝██║██╔════╝╚══██╔══╝██╔══██╗\n%c█████╗  ██║╚█████╗    ██║   ██║  ██║\n██╔══╝  ██║ ╚═══██╗   ██║   ██║  ██║\n%c██║     ██║██████╔╝   ██║   ╚█████╔╝\n╚═╝     ╚═╝╚═════╝    ╚═╝    ╚════╝ \n\n    %cFinancial Statement Online\n\n", "color: #6a4b9f", "color: #543b7e", "color: #47326a", "color: #b9e4f3")

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route exact strict path="*" element={<NotFound />} />

            <Route exact path="/sandbox" element={<FistoProvider><Sandbox /></FistoProvider>} />

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
              <Route exact strict path="categories" element={<Categories />} />
              <Route exact strict path="document-types" element={<DocumentTypes />} />
              <Route exact strict path="companies" element={<Companies />} />
              <Route exact strict path="departments" element={<Departments />} />
              <Route exact strict path="locations" element={<Locations />} />
              <Route exact strict path="references" element={<References />} />
              <Route exact strict path="supplier-types" element={<SupplierTypes />} />
              <Route exact strict path="suppliers" element={<Suppliers />} />
              <Route exact strict path="utility-categories" element={<UtilityCategories />} />
              <Route exact strict path="utility-locations" element={<UtilityLocations />} />
              <Route exact strict path="account-numbers" element={<AccountNumbers />} />
              <Route exact strict path="credit-cards" element={<CreditCards />} />
              <Route exact strict path="account-titles" element={<AccountTitles />} />
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
            </Route>

            <Route exact path="/document/returned-documents" element={<ProtectedRoute />}>
              <Route index exact strict
                element={<ReturnedDocument />}
              />
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

            <Route exact path="/document/transmitting" element={<ProtectedRoute permission={19} />}>
              <Route index exact strict
                element={<DocumentTransmitting />}
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

            <Route exact path="/voucher/filing" element={<ProtectedRoute />}>
              <Route index exact strict
                element={<h1>Voucher Filing</h1>}
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

            <Route exact path="/cheque/chequing" element={<ProtectedRoute permission={7} />}>
              <Route index exact strict
                element={
                  <PasswordContextProvider>
                    <DocumentChequing />
                  </PasswordContextProvider>
                }
              />
            </Route>

            <Route exact path="/cheque/clearing" element={<ProtectedRoute />}>
              <Route index exact strict
                element={<h1>Cheque Clearing</h1>}
              />
            </Route>

            <Route exact path="/cheque/releasing" element={<ProtectedRoute />}>
              <Route index exact strict
                element={<DocumentReleasing />}
              />
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </ThemeProvider >
  )
}

export default App