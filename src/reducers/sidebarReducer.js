const sidebarReducer = (state = false, action) => {
  switch(action.type)
  {
    case 'HIDE_SIDEBAR':
      return false
    case 'TOGGLE_SIDEBAR':
      return !state
    default:
      return state
  }
}

export default sidebarReducer