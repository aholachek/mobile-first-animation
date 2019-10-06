import React from "react"
import styled from "styled-components"
import doneDisappeared from "./assets/done-disappeared.jpg"
import morePerfect from "./assets/more-perfect.jpg"
import reveal from "./assets/reveal.jpg"
import dropOut from "./assets/the-drop-out.jpg"
import thisAmericanLife from "./assets/this-american-life.jpg"
import ninetyninePercent from "./assets/99-percent.jpg"
import theUncertainHour from "./assets/the-uncertain-hour.jpg"
import allusionist from "./assets/allusionist.jpg"
import memoryPalace from "./assets/memory-palace.jpg"
import tinyDesk from "./assets/tiny-desk.jpg"

const podcasts = [
  {
    img: dropOut,
    subtitle: "The Drop Out",
    title: "The Downfall"
  },
  { img: morePerfect, subtitle: "More Perfect", title: "The Heist" },
  { img: allusionist, subtitle: "The Allusionist", title: "A Novel Remedy" },
  { img: reveal, subtitle: "Reveal", title: "Hate is all around you" },
  {
    img: doneDisappeared,
    subtitle: "Done Disappeared",
    title: "Knitting Circle"
  },
  {
    img: thisAmericanLife,
    subtitle: "This American Life",
    title: "Escape from the Lab"
  },
  {
    img: ninetyninePercent,
    subtitle: "99% Invisible",
    title: "Invisible Women"
  },
  {
    img: theUncertainHour,
    subtitle: "The Uncertain Hour",
    title: "George H.W. Bush and his baggie..."
  },
  {
    img: memoryPalace,
    subtitle: "The Memory Palace",
    title: "Shipwreck Kelly"
  },
  { img: tinyDesk, subtitle: "Tiny Desk Concerts", title: "Kian Soltani" }
]
const StyledPlaylist = styled.ul`
  margin: 0;
  padding: 0;
`
const PlaylistItem = styled.li`
  list-style-type: none;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  display: flex;
  align-items: center;
  position: relative;
  -webkit-user-select: none;
  &::after {
    content: "";
    width: calc(100% - 3rem);
    position: absolute;
    bottom: 0;
    right: 0;
    height: 1px;
    background-color: hsla(0, 0%, 0%, 0.1);
  }
`
const Subtitle = styled.div`
  font-size: 0.9rem;
`

const Album = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  background-color: hsla(0, 0%, 0%, 0.5);
  border-radius: 3px;
  margin-right: 1rem;
`

const Playlist = () => {
  return (
    <StyledPlaylist>
      {podcasts.map(p => {
        return (
          <PlaylistItem>
            <Album src={p.img} />
            <div>
              {p.title}
              <Subtitle>{p.subtitle}</Subtitle>
            </div>
          </PlaylistItem>
        )
      })}
    </StyledPlaylist>
  )
}

export default Playlist
