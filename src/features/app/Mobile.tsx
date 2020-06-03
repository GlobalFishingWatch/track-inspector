import React, { Fragment } from 'react'

import { ReactComponent as LogoImage } from 'assets/images/gfw-carrier-vessels.svg'
import { ReactComponent as ScreenImage } from 'assets/images/screen-too-small.svg'

import styles from './App.module.css'

function MobileApp() {
  return (
    <Fragment>
      <LogoImage className={styles.mobileLogo} />
      <div className={styles.mobileContainer}>
        <ScreenImage className={styles.mobileImage} />
        <h1 className={styles.mobileDisclaimer}>
          <span
            aria-label="Open the link on a tablet, laptop, or desktop computer."
            data-tip-wrap="multiline"
          >
            You'll need a bigger screen to explore <br /> this Global Fishing Watch product.
          </span>
        </h1>
      </div>
    </Fragment>
  )
}

export default MobileApp
