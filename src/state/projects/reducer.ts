import { createReducer } from '@reduxjs/toolkit'
import {
  doGetAllProjects
} from './actions'

interface Props {
  projectData: Array<any>
}

const initialState: Props = {
  projectData: [],
}

export default createReducer(initialState, builder =>
  builder
    .addCase(doGetAllProjects, (state, action) => {
      state.projectData = action.payload.projectData
    })
)
