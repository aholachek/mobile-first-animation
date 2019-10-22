import { useSpring } from "react-spring"

/**
 * Use this wrapper hook instead of useSpring from react-spring
 * to make sure that your spring animations have velocity,
 * even when parts of the animation have been delegated to other means of control
 * (e.g. gestures)
 */

const getTrackedVar = (_trackedVar, initialConfig) => {
  if (_trackedVar) return _trackedVar
  const hasX = initialConfig.x !== undefined
  const hasY = initialConfig.y !== undefined
  if ((hasX && hasY) || (!hasX && !hasY)) {
    throw new Error(
      "[useVelocityTrackedSpring] can't automatically detect which variable to track, so you need to specify which variable should be tracked in the second argument"
    )
  }
  return hasX ? "x" : "y"
}

const useVelocityTrackedSpring = (initialConfigFunc, _trackedVar) => {
  const initialConfig = initialConfigFunc()
  const trackedVar = getTrackedVar(_trackedVar, initialConfig)
  const [springVals, set] = useSpring(initialConfigFunc)
  const [{ velocityTracker }, setVelocityTracker] = useSpring(() => ({
    velocityTracker: initialConfig[trackedVar],
    ...initialConfig
  }))

  // you can disable the tracking or setting of velocity by providing options in the second argument
  const wrappedSet = (data, { skipTrackVelocity, skipSetVelocity } = {}) => {
    // update velocity tracker
    const velocityTrackerArgs = { config: data.config }
    if (data[trackedVar] && !skipTrackVelocity)
      velocityTrackerArgs.velocityTracker = data[trackedVar]
    setVelocityTracker(velocityTrackerArgs)

    // update actual spring
    if (data.immediate) return set(data)
    set({
      ...data,
      config: {
        ...data.config,
        velocity: !skipSetVelocity && velocityTracker.lastVelocity
      }
    })
  }
  return [springVals, wrappedSet]
}

export default useVelocityTrackedSpring
