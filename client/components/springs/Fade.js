import React from 'react'
import {animated, useSpring} from 'react-spring'

const Fade = ({children}) => {
  const styles = useSpring({
    from: {opacity: 0},
    to: {opacity: 1},
  })

  return <animated.div style={styles}>{children}</animated.div>
}

export default Fade
