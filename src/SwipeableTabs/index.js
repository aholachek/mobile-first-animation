import React, { useState } from "react"
import styled from "styled-components"
import useWindowSize from "../useWindowSize"
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs"
import tabs from "./data"

const Line = styled.div`
  height: 1rem;
  margin-bottom: 0.5rem;
  background-color: hsla(0, 0%, 0%, 0.09);
  width: ${props => props.width || "100%"};
`
const ContentContainer = styled.div`
  padding: 1rem;
  padding-top: 0;
`
const StyledTabs = styled(Tabs)`
  width: 100vw;
  overflow-x: hidden;
`
const StyledActiveTabIndicator = styled.div`
  background-color: #ff2192;
  width: 20%;
  height: 0.3rem;
  left: 6.5%;
  position: relative;
  transition: translate 0.15s ease-in;
  will-change: transform;
`

const StyledTabList = styled(TabList)`
  display: flex;
  margin-top: 1rem;
`

const StyledTab = styled(Tab)`
  background-color: white;
  flex: 1;
  font-weight: bold;
  font-size: 0.95rem;
`
const StyledTabPanels = styled(TabPanels)`
  width: 100vw;
  scroll-snap-type: x mandatory;
  display: flex;
  -webkit-overflow-scrolling: touch;
  scroll-snap-stop: always;
  overflow-x: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`

const StyledTabPanel = styled(TabPanel)`
  min-width: 100vw;
  min-height: 10rem;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  &[hidden] {
    display: block !important;
  }
  &:focus {
    outline: none;
  }
`

const StyledContent = styled.div`
  h1 {
    font-size: 1.5rem;
    margin: 1rem 0 1rem 0;
    font-weight: bold;
    font-family: "Source Sans Pro", -apple-system, system-ui, BlinkMacSystemFont,
      "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
  }
  img {
    width: 100%;
    height: 15rem;
    object-fit: cover;
  }
`

const TabComponent = () => {
  const tabPanelsRef = React.useRef(null)
  const tabPanelsScrollWidth = React.useRef(null)
  const tabIndicatorRef = React.useRef(null)
  const [tabIndex, setTabIndex] = useState(0)
  const { width } = useWindowSize()

  React.useLayoutEffect(() => {
    tabPanelsScrollWidth.current = tabPanelsRef.scrollWidth
  }, [width])

  const getTab = x => {
    return tabs
      .map((t, i) => (i / tabs.length - 1) * width)
      .findIndex(distance => Math.abs(x) === Math.abs(distance))
  }

  const setScrollLeft = x => {
    tabPanelsRef.current.scrollLeft = x
    onScrollChanged(x)
  }

  const onScrollChanged = scroll => {
    if (tabIndicatorRef.current) {
      const translateX =
        (scroll / (tabPanelsRef.current.clientWidth * tabs.length)) * width
      tabIndicatorRef.current.style.transform = `translateX(${translateX}px)`
    }
    const tabIndex = getTab(scroll)
    if (tabIndex === -1) return
    setTabIndex(tabIndex)
  }

  // const getAdjacentTabs = (tab, i) => {
  //   return Math.abs(tabIndex - i) <= 1
  // }

  return (
    <>
      <StyledTabs
        index={tabIndex}
        onChange={index => {
          setScrollLeft((index / tabs.length) * width)
          tabPanelsRef.current.scrollLeft = index * tabPanelsScrollWidth.current
        }}
      >
        <StyledTabList>
          {tabs.map(({ tab }) => (
            <StyledTab>{tab}</StyledTab>
          ))}
        </StyledTabList>
        <StyledActiveTabIndicator ref={tabIndicatorRef} />
        <StyledTabPanels
          ref={tabPanelsRef}
          onScroll={e => {
            onScrollChanged(e.target.scrollLeft)
          }}
        >
          {tabs.map(({ img, title }) => {
            return (
              <StyledTabPanel>
                <StyledContent>
                  <img src={img} alt="landscape" draggable="false" />
                  <ContentContainer>
                    <h1>{title}</h1>
                    <div style={{ marginBottom: "1.25rem" }}>
                      {[...new Array(4).keys()].map(i => {
                        return <Line width={i === 3 ? "50%" : "100%"} />
                      })}
                    </div>
                    <div style={{ marginBottom: "1.25rem" }}>
                      {[...new Array(3).keys()].map(i => {
                        return <Line width={i === 2 ? "33%" : "100%"} />
                      })}
                    </div>
                    <div>
                      {[...new Array(2).keys()].map(i => {
                        return <Line width={i === 1 ? "80%" : "100%"} />
                      })}
                    </div>
                  </ContentContainer>
                </StyledContent>
              </StyledTabPanel>
            )
          })}
        </StyledTabPanels>
      </StyledTabs>
    </>
  )
}

export default TabComponent
