import { createSelector } from '@reduxjs/toolkit'
import { Dataview, resolveDataviews } from '@globalfishingwatch/dataviews-client'
import { Generators } from '@globalfishingwatch/layer-composer'
import { selectDataviewsQuery } from 'routes/routes.selectors'
import { selectDataviews } from './dataviews.slice'

export const selectResolvedDataviews = createSelector(
  [selectDataviewsQuery, selectDataviews],
  (workspaceDataviews, dataviews) => {
    const resolvedDataviews = resolveDataviews(dataviews, workspaceDataviews)
    return resolvedDataviews
  }
)

export const selectDataviewByGeneratorConfigType = (type: Generators.Type) =>
  createSelector([selectResolvedDataviews], (resolvedDataviews) => {
    return resolvedDataviews.filter((dataview: Dataview) => {
      if (!dataview.view) return false
      return dataview.view.type === type
    })
  })

export const selectTrackDataviews = createSelector(
  [selectResolvedDataviews],
  (resolvedDataviews) => {
    return resolvedDataviews.filter((dataview: Dataview) => {
      if (!dataview.view) return false
      return dataview.view.type === Generators.Type.Track
    })
  }
)

export const selectGeneratorConfigCurrentEventId = createSelector(
  [selectResolvedDataviews],
  (resolvedDataviews) => {
    const vesselEventsConfig = resolvedDataviews.find(
      (dataview) =>
        dataview.view &&
        dataview.view.type === Generators.Type.VesselEvents &&
        dataview.view.currentEventId
    )
    if (vesselEventsConfig && vesselEventsConfig.view) {
      return vesselEventsConfig.view.currentEventId
    }
    return null
  }
)
