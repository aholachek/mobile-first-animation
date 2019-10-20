import React, { useRef, useLayoutEffect } from "react"
import styled from "styled-components"
import { animated, useSpring } from "react-spring"
import ImageGrid, { defaultSpringSettings, bounceConfig } from "./ImageGrid"
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock"
import images from "../assets/index"
import usePrevious from "../usePrevious"
import Flipper from "../Flipper"

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  ${props =>
    props.backgroundPointerEvents
      ? "pointer-events:none;"
      : "pointer-events:all;"};
  background-color: white;
  z-index: 3;
  will-change: opacity;
`

const StyledContainer = styled.div`
  position: relative;
`

const imageData = images
  .map((img, i) => ({ img, id: `img-${i}` }))
  .reduce((acc, curr) => {
    acc[curr.id] = curr
    return acc
  }, {})

const imageIds = Object.keys(imageData)

const DismissFullScreen = () => {
  const containerRef = React.useRef(null)
  const zIndexQueue = React.useRef([])

  const [selectedImageId, setSelectedImage] = React.useState(null)

  const [backgroundSpring, setBackgroundSpring] = useSpring(() => {
    return {
      opacity: 0
    }
  })

  const springsRef = React.useRef({})

  const setSpring = React.useCallback(({ id, springVals, set }) => {
    springsRef.current[id] = {
      springVals,
      set
    }
  }, [])

  const flipRef = useRef(
    new Flipper({
      ref: containerRef,
      onFlip(id, vals, data = {}) {
        const set = springsRef.current[id].set
        const el = this.getEl(id)
        el.style.zIndex = 5
        set({
          ...vals,
          immediate: true,
          onFrame: () => {}
        })

        requestAnimationFrame(() => {
          setBackgroundSpring({
            opacity: data.isLeaving ? 0 : 1
          })

          const springSettings = {
            ...defaultSpringSettings,
            config: data.isLeaving ? bounceConfig : defaultSpringSettings.config
          }

          set({
            ...springSettings,
            immediate: false
          })
        })
      }
    })
  )

  const previousSelectedImageId = usePrevious(selectedImageId)

  useLayoutEffect(() => {
    if (
      previousSelectedImageId === undefined ||
      previousSelectedImageId === selectedImageId
    )
      return
    if (selectedImageId) {
      flipRef.current.flip(selectedImageId)
      requestAnimationFrame(() => {
        zIndexQueue.current.push(selectedImageId)
        disableBodyScroll(containerRef.current)
      })
    } else {
      requestAnimationFrame(() => {
        enableBodyScroll(containerRef.current)
      })
      flipRef.current.flip(previousSelectedImageId, {
        isLeaving: true
      })
    }
  }, [previousSelectedImageId, selectedImageId])

  const wrappedSetSelectedImage = React.useCallback(id => {
    flipRef.current.beforeFlip(id)
    disableBodyScroll()
    setSelectedImage(id)
  }, [])

  const wrappedUnsetSelectedImage = React.useCallback(id => {
    flipRef.current.beforeFlip(id)
    enableBodyScroll()
    setSelectedImage(null)
  }, [])

  return (
    <StyledContainer ref={containerRef}>
      <ImageGrid
        zIndexQueue={zIndexQueue.current}
        setSpring={setSpring}
        selectedImageId={selectedImageId}
        setSelectedImage={wrappedSetSelectedImage}
        unsetSelectedImage={wrappedUnsetSelectedImage}
        setBackgroundSpring={setBackgroundSpring}
        images={imageIds.map(id => imageData[id])}
      />

      <Background
        as={animated.div}
        backgroundPointerEvents={!selectedImageId}
        style={backgroundSpring}
      />
    </StyledContainer>
  )
}

export default DismissFullScreen
