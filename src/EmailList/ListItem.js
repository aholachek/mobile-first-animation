import React, { useRef, useEffect, useState } from 'react'
import {
  StyledAction,
  StyledListItem,
  StyledListItemContainer,
  StyledEmail,
  StyledAvatar
} from './styled-components'
import { animated, useSpring } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import {
  rubberBandIfOutOfBounds,
  findNearestNumberInArray,
  projection,
  range
} from '../utilities'

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

  useEffect(() => {
    stops.current = [0, actionsOpen, -itemRef.current.clientWidth]
  }, [])

  const [{ x }, set] = useSpring(() => ({
    x: 0
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
      movement: [movementX],
      delta: [deltaX],
      last,
      memo = x.get(),
      cancel
    }) => {
      // hack
      const isSwipeNavigation = deltaX < -200 && velocityX > -100
      if (isSwipeNavigation) return cancel()

      let newX
      let onRest = () => {}
      if (last) {
        const projectedEndpoint = x.get() + projection(velocityX, 'fast')
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

      set({
        x: newX,
        immediate: !last,
        velocity: last ? velocityX : undefined,
        onRest,
        config: {
          ...spring,
          clamp: last
        }
      })

      return memo
    },
    {
      axis: 'x',
      filterClicks: true,
      threshold
    }
  )

  return (
    <StyledListItemContainer
      ref={itemRef}
      onTouchStart={bind().onTouchStart}
      isBeingDeleted={isBeingDeleted}
      data-list-id={id}
      onClick={() => alert('clicked')}
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
