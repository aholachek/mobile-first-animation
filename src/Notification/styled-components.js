import styled from "styled-components"

export const StyledNotification = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 8px;
  padding: 0.5rem 2rem 0.5rem 2rem;
  background-color: #171226;
  color: white;
  user-select: none;
  min-width: 70vw;
  pointer-events: all;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  touch-action: none;
  > div:first-of-type {
    font-size: 2rem;
    margin-right: 0.5rem;
  }
`

export const StyledNotificationContainer = styled.div`
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

export const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 4rem);
`
