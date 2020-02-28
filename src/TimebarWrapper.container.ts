import { createSelector } from 'reselect'
import { connect } from 'react-redux'
import TimebarWrapper from './TimebarWrapper'
import { getStartQuery, getEndQuery } from './model/route.selectors'
import { updateQueryParams } from './model/router.actions'

const getTracks = (state: any) => state.vessels.tracks

const mapStateToProps = (state: any) => ({
  start: getStartQuery(state),
  end: getEndQuery(state),
})

const mapDispatchToProps = (dispatch: any) => ({
  setTimerange: (start: string, end:string) => {
    dispatch(updateQueryParams({ start, end }))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(TimebarWrapper)
