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

const drag = ({
  unsetSelectedImage,
  x,
  y,
  v,
  set,
  setVelocityTracker,
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
      y: y.value + (movementY < 0 ? threshold : -threshold),
      x: x.value + (movementX < 0 ? movementX : -movementX)
    }
  }

  if (last) {
    const projectedEndpoint = y.value + projection(velocityY, "fast")
    const point = findNearestNumberInArray(projectedEndpoint, yStops)

    if (point === yStops[1]) {
      return set({
        y: point,
        immediate: false,
        velocity: v.lastVelocity,
        onFrame: () => {
          if (Math.abs(y.lastVelocity) < 1500) {
            unsetSelectedImage()
          }
        }
      })
    } else {
      return set({
        y: 0,
        x: 0,
        imgScale: 1,
        immediate: false,
        velocity: v.lastVelocity
      })
    }
  }

  const newY = rubberBandIfOutOfBounds(yStops[0], yStops[1], movementY + memo.y)
  const newX = rubberBandIfOutOfBounds(xStops[0], xStops[1], movementX + memo.x)

  const scaleRange = [1, 0.8]
  const imgScale = rubberBandIfOutOfBounds(
    scaleRange[1],
    scaleRange[0],
    rangeMap(yStops, scaleRange, newY)
  )

  // allow for interruption of enter animation
  memo.immediate = memo.immediate || Math.abs(newY - y.value) < 1

  set({
    y: newY,
    x: newX,
    imgScale,
    onFrame: () => {},
    immediate: memo.immediate
  })

  setVelocityTracker({
    v: newY
  })

  setBackgroundSpring({
    opacity: rangeMap(yStops, [1.5, 0.5], newY)
  })

  return memo
}

export default drag
