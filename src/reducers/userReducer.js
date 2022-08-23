import CryptoJS from 'crypto-js'

let user = window.localStorage.getItem("user")
if (!!user) user = CryptoJS.AES.decrypt(user, process.env.REACT_APP_SECRET_KEY).toString(CryptoJS.enc.Utf8)

const userReducer = (state = JSON.parse(user), action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload.user
    default:
      return state
  }
}

export default userReducer;