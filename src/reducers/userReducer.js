const userReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload.user
    default:
      return state
  }
}

export default userReducer;