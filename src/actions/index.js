export const SET_USER = (object = null) => {
  return {
    type: 'SET_USER',
    payload: {
      user: object
    }
  }
}

export const SET_COLOR = (color) => {
  return {
    type: 'SET_COLOR',
    payload: {
      color: color
    }
  }
}

export const SET_AUTH = () => {
  return {
    type: 'SET_AUTH'
  }
}

export const TOGGLE_SIDEBAR = () => {
  return {
    type: 'TOGGLE_SIDEBAR'
  }
}

export const HIDE_SIDEBAR = () => {
  return {
    type: 'HIDE_SIDEBAR'
  }
}