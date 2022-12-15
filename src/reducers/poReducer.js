const poReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_PO':
      return [...state, action.payload]

    case 'UPDATE_PO':
      return [
        ...state.map((item, index) => {
          if (index === action.payload.index)
            return action.payload.data

          return item
        })
      ]

    case 'RESET_PO':
      return []

    default:
      return state
  }
}

export default poReducer
