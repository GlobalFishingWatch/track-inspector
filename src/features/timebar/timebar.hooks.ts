import { useSelector, useDispatch } from 'react-redux'
import {
  selectTimerange,
  selectBookmarkTimerange,
  selectTimebarMode,
} from 'routes/routes.selectors'
import { updateQueryParams } from 'routes/routes.actions'

export const useTimerangeConnect = () => {
  const dispatch = useDispatch()
  const { start, end } = useSelector(selectTimerange)
  // TODO needs to be debounced like viewport
  const dispatchTimerange = (newStart: string, newEnd: string) =>
    dispatch(updateQueryParams({ start: newStart, end: newEnd }))
  return { start, end, dispatchTimerange }
}

export const useBookmarkTimerangeConnect = () => {
  const dispatch = useDispatch()
  const { bookmarkStart, bookmarkEnd } = useSelector(selectBookmarkTimerange)
  const dispatchBookmarkTimerange = (newStart: string, newEnd: string) =>
    dispatch(updateQueryParams({ bookmarkStart: newStart, bookmarkEnd: newEnd }))
  return { bookmarkStart, bookmarkEnd, dispatchBookmarkTimerange }
}

export const useTimebarModeConnect = () => {
  const dispatch = useDispatch()
  const timebarMode = useSelector(selectTimebarMode)
  const dispatchTimebarMode = (newTimebarMode: string) =>
    dispatch(updateQueryParams({ timebarMode: newTimebarMode }))
  return { timebarMode, dispatchTimebarMode }
}
