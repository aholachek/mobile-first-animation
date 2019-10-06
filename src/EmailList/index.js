import React from "react"
import styled from "styled-components"
import ListItem from "./ListItem"
import { StyledCollapseHandler } from "./styled-components"

const StyledEmailList = styled.ul``

const messageIds = [...new Array(30).keys()]

const emails = [
  {
    avatar: "A",
    title: "Hi from Alex",
    message: "Can you pick up some ice cream...",
    id: 1
  },
  {
    avatar: "L",
    title: "Message from the Library",
    message: "Your library books are overdue",
    id: 2
  },
  {
    avatar: "K",
    title: "Whats up",
    message: "Want to grab coffee after work...",
    id: 3
  },
  {
    avatar: "M",
    title: "Great sale",
    message: "Act now to get your hands on...",
    id: 4
  },
  {
    avatar: "L",
    title: "Message from the Library",
    message: "Your library books will soon be...",
    id: 5
  },
  {
    avatar: "K",
    title: "LOL",
    message: "This gif is my life right now...",
    id: 6
  }
]

const exitDuration = 250

const Demo = () => {
  const [emailIds, setEmailIds] = React.useState(messageIds)
  const [deletingId, setDeletingId] = React.useState()
  const listRef = React.useRef(null)
  const collapseHandlerRef = React.useRef(null)

  const deleteItem = React.useCallback(deleteId => {
    setDeletingId(deleteId)
    const componentsAfter = [
      ...listRef.current.querySelectorAll("[data-list-id]")
    ].filter(component => {
      const id = component.dataset.listId
      if (id <= deleteId) return false
      return true
    })
    collapseHandlerRef.current.style.transition = "none"
    collapseHandlerRef.current.style.transform = `translateY(71px)`
    const fragment = document.createDocumentFragment()
    componentsAfter.forEach(c => fragment.appendChild(c))
    collapseHandlerRef.current.appendChild(fragment)

    requestAnimationFrame(() => {
      collapseHandlerRef.current.style.transition = ""
      collapseHandlerRef.current.style.transform = "translateY(-1px)"
      setTimeout(() => {
        componentsAfter.forEach(c => listRef.current.appendChild(c))
        listRef.current.appendChild(collapseHandlerRef.current)

        setEmailIds(prevEmails => prevEmails.filter(id => id !== deleteId))
      }, exitDuration)
    })
  }, [])

  return (
    <StyledEmailList ref={listRef}>
      {emailIds.map(id => {
        const isBeingDeleted = id === deletingId
        const { avatar, title, message } = emails[id % emails.length]
        return (
          <ListItem
            key={id}
            deleteItem={deleteItem}
            id={id}
            isBeingDeleted={isBeingDeleted}
            avatar={avatar}
            title={title}
            message={message}
          />
        )
      })}
      <StyledCollapseHandler
        ref={collapseHandlerRef}
        exitDuration={exitDuration}
      />
    </StyledEmailList>
  )
}

export default Demo
