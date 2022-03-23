import { createAction } from '@reduxjs/toolkit'

export const doCheckAdmin = createAction<{ logined: boolean }>('app/doCheckAdmin')
export const doCheckAdmin1 = createAction<{ account: string }>('app/doCheckAdmin1')