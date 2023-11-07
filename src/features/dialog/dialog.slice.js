import { createSlice } from '@reduxjs/toolkit'

const defaultValue = {
  id: null,

  transaction: false,
  entry: false,
  cheque: false,
  print: false
}

export const dialogSlice = createSlice({
  name: "dialog",
  initialState: defaultValue,
  reducers: {
    openTransaction: (state, action) => {
      state.id = action.payload

      state.transaction = true
      state.entry = false
      state.cheque = false
      state.print = false
    },
    openEntry: (state) => {
      state.transaction = false
      state.entry = true
      state.cheque = false
      state.print = false
    },
    openCheque: (state) => {
      state.transaction = false
      state.entry = false
      state.cheque = true
      state.print = false
    },
    openPrint: (state) => {
      state.transaction = false
      state.entry = false
      state.cheque = false
      state.print = true
    },
    closeDialog: (state) => {
      state.id = null

      state.transaction = false
      state.entry = false
      state.cheque = false
      state.print = false
    }
  }
})

export const { openTransaction, openEntry, openCheque, closeDialog } = dialogSlice.actions

export default dialogSlice.reducer