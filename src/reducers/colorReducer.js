let color = window.localStorage.getItem("color")
if (!!!color) color = "light"

const colorReducer = (state = color, action) => {
  switch (action.type) {
    case 'SET_COLOR':
      return action.payload.color
    default:
      return state
  }
}

export default colorReducer
