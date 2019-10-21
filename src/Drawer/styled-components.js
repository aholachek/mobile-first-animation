import styled from "styled-components"

export const Drawer = styled.div`
  background-color: white;
  padding-top: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 4rem;
  z-index: 10;
  position: fixed;
  bottom: -4rem;
  left: 0;
  right: 0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  will-change: transform;
  touch-action: none;
  user-select: none;
`

export const Backdrop = styled.div`
  position: fixed;
  background-color: hsla(0, 0%, 0%, 0.3);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9;
`

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  cursor: pointer;
  outline: none;
  line-height: 1;
  padding: 0.1rem 0.2rem;
  &:focus {
    background-color: hsla(0, 0%, 0%, 0.2);
    border-radius: 8px;
  }
`
