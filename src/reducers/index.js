import { combineReducers } from 'redux'
import authReducer from './authReducer'
import userReducer from './userReducer'
import permsReducer from './permsReducer'
import sidebarReducer from './sidebarReducer'

const reducers = combineReducers({
  auth: authReducer,
  perms: permsReducer,
  user: userReducer,
  sidebar: sidebarReducer
})

export default reducers