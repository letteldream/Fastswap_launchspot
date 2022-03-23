import { createAction } from '@reduxjs/toolkit'

export const doGetAllProjects = createAction<{ projectData: Array<any> }>('app/doGetAllProjects')
export const doCheckAdmin1 = createAction<{ account: string }>('app/doCheckAdmin1')