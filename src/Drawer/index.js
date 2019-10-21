import React from "react"
import PropTypes from "prop-types"
import { animated } from "react-spring"
import { useDrag } from "react-use-gesture"
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock"
import useVelocityTrackedSpring from "../useVelocityTrackedSpring"
import {
  projection,
  rubberBandIfOutOfBounds,
  findNearestNumberInArray,
  rangeMap
} from "../utilities"
import * as Styles from "./styled-components"

const threshold = 10

const BottomDrawer = ({ removeDrawer, children }) => {
  const [{ y }, set] = useVelocityTrackedSpring(() => ({ y: 0 }))
  const yStops = React.useRef([])
  const containerRef = React.useRef(null)

  React.useLayoutEffect(() => {
    yStops.current = [0, containerRef.current.clientHeight - 3 * 16]
    set({ y: yStops.current[1], immediate: true })
  })
  React.useEffect(() => {
    set({ y: 0, immediate: false })
  }, [set])

  const closeDrawer = () => set({ y: yStops.current[1], onRest: removeDrawer })

  const bind = useDrag(
    ({ last, movement: [, movementY], vxvy: [, velocityY], memo }) => {
      if (!memo) {
        const isIntentionalGesture = Math.abs(movementY) > threshold
        if (!isIntentionalGesture) return
        memo = y.value - movementY
      }

      disableBodyScroll(containerRef.current)

      if (last) {
        enableBodyScroll(containerRef.current)

        const projectedEndpoint = y.value + projection(velocityY)
        const point = findNearestNumberInArray(
          projectedEndpoint,
          yStops.current
        )

        const notificationClosed = point === yStops.current[1]

        return set({
          y: notificationClosed ? yStops.current[1] : yStops.current[0],
          onRest: notificationClosed ? removeDrawer : () => {},
          immediate: false
        })
      }

      const newY = rubberBandIfOutOfBounds(
        yStops.current[0],
        yStops.current[1],
        memo + movementY,
        0.06
      )

      set({
        y: newY,
        immediate: true
      })

      return memo
    }
  )

  return (
    <>
      <Styles.Drawer
        onTouchStart={bind().onTouchStart}
        ref={containerRef}
        as={animated.div}
        style={{
          transform: y.interpolate(y => `translateY(${y}px)`)
        }}
      >
        <Styles.CloseButton aria-label="close drawer" onClick={closeDrawer}>
          ×
        </Styles.CloseButton>
        {children}
      </Styles.Drawer>
      <Styles.Backdrop
        as={animated.div}
        style={{
          opacity: y.interpolate(y => rangeMap(yStops.current, [1, 0], y))
        }}
      />
    </>
  )
}

BottomDrawer.defaultProps = {
  removeDrawer: () => {}
}
BottomDrawer.propTypes = {
  removeDrawer: PropTypes.func
}

export default BottomDrawer
