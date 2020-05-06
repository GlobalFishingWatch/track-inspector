import { Middleware, Dispatch } from 'redux'
import { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store/store'
import { DataviewWorkspace } from '@globalfishingwatch/api-client'
import { addDataviews } from './dataviews.slice'
import { updateQueryParams } from 'routes/routes.actions'

export const forwardDataviewsToURLMiddleware: Middleware = ({
  getState,
  dispatch,
}: {
  getState: () => RootState
  dispatch: Dispatch
}) => (next: any) => (action: PayloadAction<DataviewWorkspace[]>) => {
  if (![addDataviews.type].includes(action.type)) {
    next(action)
    return
  }
  const prevQuery = getState().location.query || {}
  const currentDataviewsWorkspace = (prevQuery.dataviewsWorkspace as unknown) as DataviewWorkspace[]

  switch (action.type) {
    case addDataviews.type:
      console.log(currentDataviewsWorkspace, action)
      const newDataviewsWorkspace = [...currentDataviewsWorkspace, ...action.payload]
      dispatch(
        updateQueryParams({
          dataviewsWorkspace: newDataviewsWorkspace as any,
        })
      )
      break
  }
}
