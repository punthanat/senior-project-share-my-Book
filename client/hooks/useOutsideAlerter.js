import {useEffect} from 'react'

export const useOutsideAlerter = (isInside, ref, mouseBehavior) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        isInside(false, event)
      } else {
        isInside(true, event)
      }
    }

    document.addEventListener(mouseBehavior ?? 'mousedown', handleClickOutside)
    return () => {
      document.removeEventListener(
        mouseBehavior ?? 'mousedown',
        handleClickOutside
      )
    }
  }, [ref, mouseBehavior, isInside])
}
