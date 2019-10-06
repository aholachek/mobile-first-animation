import React, { useRef, useEffect, useState } from "react"
import {
  StyledAction,
  StyledListItem,
  StyledListItemContainer,
  StyledEmail,
  StyledAvatar
} from "./styled-components"
import { animated, useSpring } from "react-spring"
import { useDrag } from "react-use-gesture"
import {
  rubberBandIfOutOfBounds,
  findNearestNumberInArray,
  projection,
  range
} from "../utilities"

const actionWidth = 100
const threshold = 15

const spring = {
  tension: 439,
  friction: 40
}

const actionsOpen = -actionWidth * 2

const ListItem = ({
  avatar,
  title,
  message,
  deleteItem,
  id,
  isBeingDeleted
}) => {
  const itemRef = useRef(null)
  const stops = useRef(null)
  const [willTransform, setWillTransform] = useState(null)

  useEffect(() => {
    stops.current = [0, actionsOpen, -itemRef.current.clientWidth]
  }, [])

  const [{ x }, set] = useSpring(() => ({
    x: 0
  }))

  const [{ v }, setVelocityTracker] = useSpring(() => ({
    v: 0,
    config: spring
  }))

  const calculateDeleteButtonTransforms = x => {
    if (x < actionsOpen && stops.current) {
      const deleteStop = stops.current[stops.current.length - 1]
      const dragPercentage = Math.abs(
        (x - actionsOpen) / (deleteStop - actionsOpen)
      )
      const translateX = range(-actionWidth, deleteStop, dragPercentage)
      const scaleX = range(1, -deleteStop / actionWidth, dragPercentage)

      return { scaleX, translateX }
    }
    return { scaleX: 1.001, translateX: x / 2 }
  }

  const bind = useDrag(
    ({
      vxvy: [velocityX],
      movement: [movementX, movementY],
      delta: [deltaX],
      last,
      memo,
      cancel
    }) => {
      if (!memo) {
        const isIntentionalGesture =
          Math.abs(movementX) > threshold &&
          Math.abs(movementX) > Math.abs(movementY)

        if (!isIntentionalGesture) {
          if (!willTransform) setWillTransform(true)
          return
        }
        memo = x.value + (movementX < 0 ? threshold : -threshold)
      }

      // hack
      const isSwipeNavigation = deltaX < -200 && velocityX > -100
      if (isSwipeNavigation) return cancel()

      let newX
      let onRest = () => {}
      if (last) {
        const projectedEndpoint = x.value + projection(velocityX, "fast")
        newX = findNearestNumberInArray(projectedEndpoint, stops.current)
        if (newX === stops.current[2]) {
          onRest = ({ x }) => {
            if (x <= stops.current[2]) {
              deleteItem(id)
              set({
                onRest: null
              })
            }
          }
        }
      } else {
        newX = rubberBandIfOutOfBounds(
          stops.current[2],
          stops.current[0],
          memo + movementX
        )
      }

      setVelocityTracker({
        v: newX
      })

      set({
        x: newX,
        immediate: !last,
        onRest,
        config: {
          ...spring,
          velocity: last ? v.lastVelocity : undefined,
          clamp: last
        }
      })

      return memo
    }
  )

  return (
    <StyledListItemContainer
      ref={itemRef}
      {...bind()}
      willTransform={willTransform}
      isBeingDeleted={isBeingDeleted}
      data-list-id={id}
    >
      <StyledListItem
        as={animated.div}
        style={{
          transform: x.interpolate(x => `translateX(${x}px)`)
        }}
      >
        <StyledEmail>
          <StyledAvatar>{avatar}</StyledAvatar>
          <div>
            <h3>{title}</h3>
            <div>{message}</div>
          </div>
        </StyledEmail>
      </StyledListItem>
      <StyledAction
        archiveAction
        width={actionWidth}
        as={animated.div}
        style={{
          transform: x.interpolate(x => `translateX(${x}px) scaleY(0.999)`)
        }}
      >
        Archive
      </StyledAction>
      <StyledAction
        width={actionWidth}
        as={animated.div}
        style={{
          transform: x.interpolate(x => {
            const { scaleX, translateX } = calculateDeleteButtonTransforms(x)
            return `translateX(${translateX}px) scaleX(${scaleX})`
          })
        }}
      >
        <animated.div
          style={{
            transform: x.interpolate(x => {
              const { scaleX } = calculateDeleteButtonTransforms(x)
              return `scaleX(${1 / scaleX})`
            })
          }}
        >
          Delete
        </animated.div>
      </StyledAction>
    </StyledListItemContainer>
  )
}

export default React.memo(ListItem)
