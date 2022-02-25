const colorReducer = (state = "light", action) => {
    switch(action.type)
    {
      case 'SET_COLOR':
        return action.payload.color
      default:
        return state
    }
  }
  
  export default colorReducer
  