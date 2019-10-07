import React, { useRef, useLayoutEffect } from "react"
import styled from "styled-components"
import { animated, useSpring } from "react-spring"
import ImageGrid, { defaultSpringSettings, bounceConfig } from "./ImageGrid"
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock"
import images from "../assets/index"
import usePrevious from "../usePrevious"

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

const getEl = (ref, id) => ref.current.querySelector(`[data-flip-key=${id}]`)

class Flipper {
  constructor({ ref, onFlip }) {
    this.ref = ref
    this.onFlip = onFlip
    this.positions = {}
  }
  measure(id) {
    const el = getEl(this.ref, id)
    if (el) return el.getBoundingClientRect()
  }

  beforeFlip(id) {
    this.positions[id] = this.measure(id)
  }

  flip(id, data) {
    const after = this.measure(id, true)
    const before = this.positions[id]
    const diff = {
      scaleX: before.width / after.width,
      scaleY: before.height / after.height,
      x: before.left - after.left,
      y: before.top - after.top
    }

    this.onFlip(id, diff, data)
  }
}

const DismissFullScreen = () => {
  const containerRef = React.useRef(null)
  const zIndexQueue = React.useRef([])

  const [selectedImage, setSelectedImage] = React.useState({
    id: undefined,
    img: undefined
  })

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

        const el = getEl(containerRef, id)
        el.style.transform = `translate(${vals.x}px, ${vals.y}px) scaleX(${vals.scaleX}) scaleY(${vals.scaleY})`
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

  const previousSelectedImage = usePrevious(selectedImage)

  useLayoutEffect(() => {
    if (!previousSelectedImage) return
    if (previousSelectedImage.id !== selectedImage.id) {
      if (selectedImage.id) {
        flipRef.current.flip(selectedImage.id)
        requestAnimationFrame(() => {
          zIndexQueue.current.push(selectedImage.id)
          disableBodyScroll(containerRef.current)
        })
      } else {
        requestAnimationFrame(() => {
          enableBodyScroll(containerRef.current)
        })
        const el = getEl(containerRef, previousSelectedImage.id)
        el.style.transform = ""
        flipRef.current.flip(previousSelectedImage.id, {
          isLeaving: true
        })
      }
    }
  }, [previousSelectedImage, selectedImage])

  const wrappedSetSelectedImage = React.useCallback(state => {
    flipRef.current.beforeFlip(state.id)
    disableBodyScroll()
    setSelectedImage(state)
  }, [])

  const wrappedUnsetSelectedImage = React.useCallback(id => {
    flipRef.current.beforeFlip(id)
    enableBodyScroll()
    setSelectedImage({})
  }, [])

  return (
    <StyledContainer
      flipKey={selectedImage}
      decisionData={selectedImage}
      ref={containerRef}
    >
      <ImageGrid
        zIndexQueue={zIndexQueue.current}
        setSpring={setSpring}
        selectedImageId={selectedImage.id}
        setSelectedImage={wrappedSetSelectedImage}
        unsetSelectedImage={wrappedUnsetSelectedImage}
        setBackgroundSpring={setBackgroundSpring}
        images={imageIds.map(id => imageData[id])}
      />

      <Background
        as={animated.div}
        backgroundPointerEvents={!selectedImage.id}
        style={backgroundSpring}
      />
    </StyledContainer>
  )
}

export default DismissFullScreen
