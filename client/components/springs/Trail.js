import React from 'react'
import {useTrail, a} from 'react-spring'

const Trail = ({open, children}) => {
  const items = React.Children.toArray(children)
  const trail = useTrail(items.length, {
    config: {mass: 5, tension: 2000, friction: 200},
    opacity: open ? 1 : 0,
    x: open ? 0 : 20,
    height: open ? 'auto' : 0,
    from: {opacity: 0, x: 20, height: 0},
  })
  return (
    <div>
      {trail.map(({height, ...style}, index) => (
        <a.div key={index} style={style}>
          {items[index]}
        </a.div>
      ))}
    </div>
  )
}

export default Trail
