import styled, { css } from "styled-components"

export const StyledEmail = styled.div`
  padding: 0.75rem;
  display: flex;
  align-items: center;
  h3 {
    font-weight: bold;
    margin-bottom: 0.3rem;
  }
`

export const StyledAvatar = styled.div`
  background-color: #f3f3f3;
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1rem;
`

export const StyledMoreAction = styled.button``

export const StyledAction = styled.button`
  position: absolute;
  top: 0;
  bottom: 0;
  right: -100px;
  border-radius: 0;
  width: ${props => props.width}px;
  background-color: ${({ archiveAction }) =>
    archiveAction ? "#5c6bc0" : "#ef5350"};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  transform-origin: 0 0;
`
export const StyledListItem = styled.div`
  background-color: white;
  position: relative;
  z-index: 1;
  border-bottom: 1px solid #f3f3f3;
  h3 {
    margin-bottom: 0 !important;
  }
  touch-action: pan-y;
`

export const StyledListItemContainer = styled.li`
  position: ${props => (props.isBeingDeleted ? "absolute" : "relative")};
  width: 100%;
  ${props =>
    props.willTransform
      ? css`
          will-change: transform;
          > ${StyledListItem} {
            will-change: transform;
          }
          > ${StyledAction} {
            will-change: transform;
            > div {
              will-change: transform;
            }
          }
        `
      : ""}
  overflow: hidden;
`

export const StyledCollapseHandler = styled.div`
  will-change: transform;
  transition: transform ${props => props.exitDuration}ms ease-out;
`
