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
import Dashboard from './Dashboard'

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
import TaggingRequest from './routes/requestor/TaggingRequest'
import NewRequest from './routes/requestor/NewRequest'
import UpdateRequest from './routes/requestor/UpdateRequest'
import ReturnedDocument from './routes/requestor/ReturnedDocument'

import DocumentTagging from './routes/tagging/DocumentTagging'

import DocumentVouchering from './routes/vouchering/DocumentVouchering'

import NotFound from './exceptions/NotFound'
import AccessDenied from './exceptions/AccessDenied'
import Sandbox from './Sandbox'

import FistoProvider from './contexts/FistoContext'

import { QueryClient, QueryClientProvider } from 'react-query'

// Create a client
const queryClient = new QueryClient()

const App = () => {

  const dispatch = useDispatch()

  React.useEffect(() => {
    const data = window.localStorage.getItem("user")

    if (data) {
      const decryptedUser = CryptoJS.AES.decrypt(data, "Fistocutie.")
      dispatch(SET_USER(JSON.parse(decryptedUser.toString(CryptoJS.enc.Utf8))))
    }

    const color = window.localStorage.getItem("color")

    if (color) dispatch(SET_COLOR(color))
    else window.localStorage.setItem("color", "light")

    // eslint-disable-next-line
  }, [])

  const colorScheme = useSelector(state => state.color)
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")

  React.useEffect(() => {
    document.body.className = colorScheme
    return () => { document.body.className = '' }
  });

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route exact strict path="*" element={<NotFound />} />
            <Route exact strict path="/403" element={<AccessDenied />} />

            <Route exact path="/sandbox" element={<FistoProvider><Sandbox /></FistoProvider>} />

            <Route exact path="/" element={<Landing />} />

            <Route exact path="/user/change-password" element={<ProtectedRoute />}>
              <Route exact path="/user/change-password" element={<Dashboard />}>
                <Route index exact strict element={<ChangePassword />} />
              </Route>
            </Route>

            <Route exact path="/dashboard" element={<ProtectedRoute />}>
              <Route exact path="/dashboard" element={<Dashboard />}>
                <Route index exact strict element={<UserAccounts />} />
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
            </Route>

            <Route exact path="/requestor" element={<ProtectedRoute />}>
              <Route exact path="/requestor" element={<Dashboard />}>
                <Route index exact strict element={<TaggingRequest />} />
                <Route exact strict path="new-request" element={<NewRequest />} />
                <Route exact strict path="update-request/:id" element={<UpdateRequest />} />
                <Route exact strict path="returned-documents" element={<ReturnedDocument />} />
              </Route>
            </Route>

            <Route exact path="/tagging" element={<ProtectedRoute />}>
              <Route exact path="/tagging" element={<Dashboard />}>
                <Route index exact strict element={<DocumentTagging />} />
              </Route>
            </Route>

            <Route exact path="/vouchering" element={<ProtectedRoute />}>
              <Route exact path="/vouchering" element={<Dashboard />}>
                <Route index exact strict element={<DocumentVouchering />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </ThemeProvider >
  )
}

export default App