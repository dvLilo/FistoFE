const token = window.localStorage.getItem("token")

const authReducer = (state = Boolean(token), action) => {
  switch (action.type) {
    case 'SET_AUTH':
      return true
    default:
      return state
  }
}

export default authReducer
