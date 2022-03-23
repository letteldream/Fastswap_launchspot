import { createReducer } from '@reduxjs/toolkit'
import {
  doCheckAdmin
} from './actions'

interface AdminsState {
  logined: boolean
}

const initialState: AdminsState = {
  logined: false,
}

export default createReducer<AdminsState>(initialState, builder =>
  builder
    .addCase(doCheckAdmin, (state, action) => {
      state.logined = action.payload.logined
    })
)
