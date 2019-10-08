import React, { useEffect } from "react"
import styled, { css } from "styled-components"
import { animated, useSpring, interpolate } from "react-spring"
import { useDrag } from "react-use-gesture"
import drag from "./drag"
import useWindowSize from "../useWindowSize"

export const defaultSpringSettings = {
  y: 0,
  x: 0,
  scaleX: 1,
  scaleY: 1,
  config: {
    tension: 500,
    friction: 50
  }
}

export const bounceConfig = {
  tension: 500,
  friction: 30
}

const StyledGrid = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  margin: 0.5rem;
  grid-template-columns: repeat(3, 1fr);
`

const StyledGridItem = styled.div`
  overflow: hidden;
  transform-origin: 0 0;
  position: relative;
  ${props =>
    props.isSelected
      ? css`
          height: 100vw;
          position: fixed;
          top: calc(${props.height / 2}px - 50vw);
          left: 0;
          right: 0;
          touch-action: pan-x;
        `
      : css`
          height: calc(33.33vw - 0.666rem);
          touch-action: manipulation;
        `}
  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const GridImage = ({
  setSelectedImage,
  unsetSelectedImage,
  img,
  id,
  setSpring,
  isSelected,
  setBackgroundSpring,
  zIndexQueue,
  height
}) => {
  const [springVals, set] = useSpring(() => defaultSpringSettings)
  const [{ v }, setVelocityTracker] = useSpring(() => ({
    config: defaultSpringSettings.config,
    v: 0
  }))
  const containerRef = React.useRef(null)

  const { x, y, scaleX, scaleY } = springVals

  const bind = useDrag(
    drag({
      onImageDismiss: () => unsetSelectedImage(id),
      x,
      y,
      v,
      set,
      setVelocityTracker,
      setBackgroundSpring
    })
  )

  useEffect(() => {
    setSpring({
      id,
      springVals,
      set
    })
  }, [id, set, setSpring, springVals])

  return (
    <div>
      <StyledGridItem
        height={height}
        isSelected={isSelected}
        ref={containerRef}
        as={animated.div}
        data-flip-key={id}
        onTouchStart={isSelected ? bind().onTouchStart : null}
        style={{
          zIndex: interpolate([x, y], (x, y) => {
            const animationInProgress = x !== 0 || y !== 0
            if (isSelected) return 5
            if (zIndexQueue.slice(-1)[0] === id && animationInProgress) return 5
            if (zIndexQueue.indexOf(id) > -1 && animationInProgress) return 2
            return 1
          }),
          transform: interpolate(
            [x, y, scaleX, scaleY],
            (x, y, scaleX, scaleY) => {
              return `translate3d(${x}px, ${y}px, 0) scaleX(${scaleX}) scaleY(${scaleY})`
            }
          )
        }}
        onClick={() => {
          if (isSelected) return
          return setSelectedImage(id)
        }}
      >
        <animated.img src={img} alt="landscape" draggable={false} />
      </StyledGridItem>
    </div>
  )
}

const MemoizedGridImage = React.memo(GridImage)

const ImageGrid = ({ images, selectedImageId, ...rest }) => {
  const { height } = useWindowSize()
  return (
    <StyledGrid>
      {images.map(({ id, img }) => {
        return (
          <MemoizedGridImage
            key={id}
            isSelected={selectedImageId === id}
            id={id}
            img={img}
            height={height}
            {...rest}
          />
        )
      })}
    </StyledGrid>
  )
}

export default ImageGrid
