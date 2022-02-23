const authReducer = (state = false, action) => {
  switch(action.type)
  {
    case 'SET_AUTH':
      return true
    default:
      return state
  }
}

export default authReducer
