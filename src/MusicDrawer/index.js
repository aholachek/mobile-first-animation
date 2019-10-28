import React, { useRef } from "react"
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock"
import { animated } from "react-spring"
import useVelocityTrackedSpring from "../useVelocityTrackedSpring"
import {
  Container,
  PlaylistDrawer,
  NowPlayingDrawer,
  NowPlayingImage,
  Backdrop,
  TabBar,
  TabBarItem,
  Handle,
  ClosedControlsContainer,
  OpenControlsContainer,
  Title,
  Subtitle,
  Flex,
  StyledClosedTitle
} from "./styled-components"
import { useDrag } from "react-use-gesture"
import {
  rubberBandIfOutOfBounds,
  findNearestNumberInArray,
  projection,
  rangeMap
} from "../utilities"
import useWindowSize from "../useWindowSize"

import Playlist from "./Playlist"

import { ReactComponent as LikeIcon } from "./assets/like.svg"
import { ReactComponent as PlaylistIcon } from "./assets/playlist.svg"
import { ReactComponent as RadioIcon } from "./assets/radio.svg"
import { ReactComponent as SearchIcon } from "./assets/search.svg"
import { ReactComponent as SongIcon } from "./assets/song.svg"
import { ReactComponent as PlayIcon } from "./assets/play.svg"
import { ReactComponent as RewindIcon } from "./assets/rewind.svg"
import { ReactComponent as FastForwardIcon } from "./assets/fast-forward.svg"
import snapJudgement from "./assets/snap-judgement.jpg"

const tabIcons = [LikeIcon, PlaylistIcon, RadioIcon, SearchIcon, SongIcon]

const drawerHeight = 160
const nowPlayingImageDimensions = 70
const drawerPadding = 16

const ApplePlaylist = () => {
  const { width, height } = useWindowSize()
  const nowPlayingDrawerRef = useRef(null)

  const stops = [0, -(height - drawerHeight - 40)]

  const spring = {
    tension: 247,
    friction: 27
  }

  const dampedSpring = {
    tension: 247,
    friction: 33
  }

  const [{ y }, set] = useVelocityTrackedSpring(() => ({
    y: 0,
    config: spring
  }))

  const setDrawerOpen = () => {
    set({
      y: stops[1],
      config: dampedSpring,
      immediate: false
    })
  }

  const threshold = 10

  const bind = useDrag(
    ({
      vxvy: [, velocityY],
      movement: [movementX, movementY],
      last,
      memo,
      event
    }) => {
      event.preventDefault()

      const drawerIsOpen = y.value === stops[1]

      const isClick =
        last && Math.abs(movementX) + Math.abs(movementY) <= 3 && !drawerIsOpen

      if (isClick) return setDrawerOpen()

      if (!memo) {
        const isIntentionalGesture =
          Math.abs(movementY) > threshold &&
          Math.abs(movementY) > Math.abs(movementX)

        if (!isIntentionalGesture) return
        disableBodyScroll(nowPlayingDrawerRef.current)
        memo = y.value - movementY
      }

      if (last) {
        enableBodyScroll(nowPlayingDrawerRef.current)

        const projectedEndpoint = y.value + projection(velocityY)
        const point = findNearestNumberInArray(projectedEndpoint, stops)

        return set({
          y: point,
          immediate: false,
          config: spring
        })
      }

      const newY = rubberBandIfOutOfBounds(
        stops[stops.length - 1],
        stops[0],
        movementY + memo,
        0.08
      )

      set({
        y: newY,
        immediate: true
      })
      return memo
    },
    {
      domTarget: nowPlayingDrawerRef,
      event: { passive: false }
    }
  )

  React.useEffect(bind, [bind])

  const getImageTransform = () => {
    const newWidth = (2 * width) / 3
    const scale = newWidth / nowPlayingImageDimensions / 3
    const paddingLeft = (width - newWidth) / 2
    const translateX = paddingLeft - drawerPadding
    return { scale, translateX }
  }

  return (
    <Container>
      <PlaylistDrawer padding={drawerPadding}>
        <Playlist />
      </PlaylistDrawer>
      <Backdrop
        as={animated.div}
        style={{
          opacity: y.interpolate(stops, [0, 1])
        }}
      />
      <NowPlayingDrawer
        ref={nowPlayingDrawerRef}
        height={drawerHeight}
        padding={drawerPadding}
        windowHeight={height}
        as={animated.div}
        style={{
          transform: y.interpolate(y => `translate3D(0, ${y}px, 0)`)
        }}
      >
        <Handle
          as={animated.div}
          style={{
            opacity: y.interpolate(stops, [0, 1])
          }}
        />
        <Flex>
          <NowPlayingImage
            src={snapJudgement}
            dimensions={nowPlayingImageDimensions}
            as={animated.img}
            style={{
              transform: y.interpolate(y => {
                const endTransform = getImageTransform()
                const translateX = rangeMap(
                  stops,
                  [0, endTransform.translateX],
                  y
                )

                const translateY = rangeMap(stops, [0, 30], y)
                const scale = rangeMap(stops, [0.333, endTransform.scale], y)

                const scaleX = Math.max(
                  0.333,
                  Math.min(scale, endTransform.scale)
                )
                return `translate3D(${translateX}px, ${translateY}px, 0) scaleX(${scaleX}) scaleY(${scale})`
              })
            }}
          />

          <StyledClosedTitle
            as={animated.div}
            style={{
              opacity: y.interpolate(stops, [1, 0])
            }}
          >
            <Title as={animated.h3}>Head Games</Title>
            <Subtitle>Snap Judgement</Subtitle>
          </StyledClosedTitle>

          <ClosedControlsContainer
            padding={drawerPadding}
            as={animated.div}
            style={{
              opacity: y.interpolate([0, stops.slice(-1)[0] / 2], [1, 0])
            }}
          >
            <PlayIcon />
            <FastForwardIcon />
          </ClosedControlsContainer>
        </Flex>
        <OpenControlsContainer
          as={animated.div}
          style={{
            opacity: y.interpolate([stops[1] / 2, stops[1]], [0, 1])
          }}
        >
          <Title>Head Games</Title>
          <Subtitle>Snap Judgement</Subtitle>
          <div>
            <RewindIcon />
            <PlayIcon />
            <FastForwardIcon />
          </div>
        </OpenControlsContainer>
      </NowPlayingDrawer>
      <TabBar
        as={animated.div}
        style={{
          opacity: y.interpolate([stops], [1, 0]),
          transform: y.interpolate(y => {
            const translateY = rangeMap(stops, [0, 60], y)
            return `translate3D(0px, ${translateY}px, 0)`
          })
        }}
      >
        {tabIcons.map(Icon => (
          <TabBarItem>
            <Icon />
          </TabBarItem>
        ))}
      </TabBar>
    </Container>
  )
}

export default ApplePlaylist
