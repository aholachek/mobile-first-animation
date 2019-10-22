import {
  rubberBandIfOutOfBounds,
  findNearestNumberInArray,
  projection,
  rangeMap
} from "../utilities"

const threshold = 10
const maxYTranslate = 150
export const yStops = [0, maxYTranslate]
const xStops = [-20, 20]

export const dragUnselected = ({ setSelectedImage }) => ({
  last,
  movement
}) => {
  if (last && Math.abs(movement[0]) + Math.abs(movement[1]) < 2) {
    setSelectedImage()
  }
}

export const dragSelected = ({
  onImageDismiss,
  x,
  y,
  set,
  setBackgroundSpring
}) => ({
  vxvy: [, velocityY],
  movement: [movementX, movementY],
  last,
  memo
}) => {
  if (!memo) {
    const isIntentionalGesture = Math.abs(movementY) > threshold
    if (!isIntentionalGesture) return
    memo = {
      y: y.value - movementY,
      x: x.value - movementX
    }
  }

  if (last) {
    const projectedEndpoint = y.value + projection(velocityY, "fast")
    const point = findNearestNumberInArray(projectedEndpoint, yStops)

    if (point === yStops[1]) {
      return set({
        immediate: false,
        y: point,
        onFrame: () => {
          if (Math.abs(y.lastVelocity) < 1000) {
            onImageDismiss()
            set({
              onFrame: null
            })
          }
        }
      })
    } else {
      setBackgroundSpring({
        opacity: 1
      })
      return set({
        immediate: false,
        y: 0,
        x: 0
      })
    }
  }

  const newY = rubberBandIfOutOfBounds(yStops[0], yStops[1], movementY + memo.y)
  const newX = rubberBandIfOutOfBounds(xStops[0], xStops[1], movementX + memo.x)

  // allow for interruption of enter animation
  memo.immediate = memo.immediate || Math.abs(newY - y.value) < 1

  set({
    y: newY,
    x: newX,
    onFrame: null,
    immediate: memo.immediate
  })

  setBackgroundSpring({
    opacity: rangeMap(yStops, [1.5, 0.5], newY)
  })

  return memo
}
