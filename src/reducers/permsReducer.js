const permsReducer = (state = [], action) => {
  switch(action.type)
  {
    case 'SET_PERMS':
      state = action.payload
      return state
    default:
      return state
  }
}

export default permsReducer
