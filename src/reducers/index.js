import { combineReducers } from 'redux'
import authReducer from './authReducer'
import userReducer from './userReducer'
// import permsReducer from './permsReducer'
import sidebarReducer from './sidebarReducer'
import colorReducer from './colorReducer'
import poReducer from './poReducer'

const reducers = combineReducers({
  color: colorReducer,
  auth: authReducer,
  // perms: permsReducer,
  user: userReducer,
  sidebar: sidebarReducer,
  po: poReducer
})

export default reducers