import React, { useState } from 'react'
import cx from 'classnames'
import { useSelector, useDispatch } from 'react-redux'
import mapControlsStyles from 'features/map/MapControls.module.css'
import { selectEditing, selectNumRulers } from './rulers.selectors'
import { toggleRulersEditing, resetRulers } from './rulers.slice'
import styles from './Rulers.module.css'
import { ReactComponent as IconRemove } from 'assets/icons/close.svg'
import { ReactComponent as IconRuler } from 'assets/icons/ruler.svg'

const Rulers = () => {
  const editing = useSelector(selectEditing)
  const numRulers = useSelector(selectNumRulers)

  const dispatch = useDispatch()

  const [deleteVisible, setDeleteVisible] = useState(false)

  return (
    <div
      className={styles.container}
      onMouseEnter={() => setDeleteVisible(true)}
      onMouseLeave={() => setDeleteVisible(false)}
    >
      <button
        className={cx(mapControlsStyles.mapControl, { [mapControlsStyles._active]: editing })}
        onClick={() => {
          dispatch(toggleRulersEditing())
        }}
        aria-label="Add rulers"
      >
        <IconRuler />
        {numRulers > 0 && (
          <div className={cx(styles.num, { [styles._active]: editing })}>{numRulers}</div>
        )}
      </button>
      {deleteVisible && numRulers > 0 && (
        <button
          className={cx(mapControlsStyles.mapControl, styles.remove)}
          onClick={() => dispatch(resetRulers())}
        >
          <IconRemove />
        </button>
      )}
    </div>
  )
}

export default Rulers
