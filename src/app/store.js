import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import authReducer from '../features/auth/auth.slice'
import themeReducer from '../features/theme/theme.slice'
import sidebarReducer from '../features/sidebar/sidebar.slice'
import userReducer from '../features/users/users.slice'

import { transactionApi } from "../features/transactions/transactions.api"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    sidebar: sidebarReducer,
    user: userReducer,

    [transactionApi.reducerPath]: transactionApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([transactionApi.middleware])
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)