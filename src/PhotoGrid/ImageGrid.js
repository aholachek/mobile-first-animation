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
  imgScale: 1,
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
  will-change: transform;
  ${props =>
    props.isSelected
      ? css`
          height: 100vw;
          position: fixed;
          top: calc(${props.height / 2}px - 50vw);
          left: 0;
          right: 0;
          touch-action: none;
        `
      : css`
          height: calc(33.33vw - 0.666rem);
        `}
  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    ${props => (props.isSelected ? "will-change: transform" : "")};
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
  console.log(height)
  const [springVals, set] = useSpring(() => defaultSpringSettings)
  const [{ v }, setVelocityTracker] = useSpring(() => ({
    config: defaultSpringSettings.config,
    v: 0
  }))
  const containerRef = React.useRef(null)

  const { x, y, scaleX, scaleY, imgScale } = springVals

  const bind = useDrag(
    drag({
      unsetSelectedImage,
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
    <StyledGridItem
      height={height}
      isSelected={isSelected}
      ref={containerRef}
      as={animated.div}
      data-flip-key={id}
      {...(isSelected ? bind() : {})}
      style={{
        zIndex: interpolate([x, y], (x, y) => {
          const animationInProgress = x !== 0 || y !== 0
          if (isSelected) return 5
          if (zIndexQueue.slice(-1)[0] === id && animationInProgress) return 5
          if (zIndexQueue.indexOf(id) > -1 && animationInProgress) return 2
          return ""
        }),
        transform: interpolate(
          [x, y, scaleX, scaleY],
          (x, y, scaleX, scaleY) => {
            return `translate(${x}px, ${y}px) scaleX(${scaleX}) scaleY(${scaleY})`
          }
        )
      }}
      onClick={() => {
        if (isSelected) return
        return setSelectedImage({
          parent: containerRef.current,
          id,
          img: containerRef.current.querySelector("img")
        })
      }}
    >
      <animated.img
        src={img}
        alt="landscape"
        draggable={false}
        style={{
          transform: imgScale.interpolate(imgScale => `scale(${imgScale})`)
        }}
      />
    </StyledGridItem>
  )
}

const ImageGrid = ({ images, selectedImageId, ...rest }) => {
  const { height } = useWindowSize()
  return (
    <StyledGrid>
      {images.map(({ id, img }) => {
        return (
          <div>
            <GridImage
              isSelected={selectedImageId === id}
              id={id}
              img={img}
              height={height}
              {...rest}
            />
          </div>
        )
      })}
    </StyledGrid>
  )
}

export default ImageGrid
