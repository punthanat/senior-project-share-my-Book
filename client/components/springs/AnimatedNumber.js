import React from 'react'
import {animated, useSpring} from 'react-spring'

const AnimatedNumber = ({maxNumber, reverse, toFixed}) => {
  const {number} = useSpring({
    reset: true,
    reverse,
    from: {number: 0},
    number: maxNumber,
    delay: 200,
  })

  return (
    <animated.span>{number.to((n) => n.toFixed(toFixed ?? 0))}</animated.span>
  )
}

export default AnimatedNumber
