import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import styled from "styled-components";
import GlobalStyle from "./GlobalStyle";
import SwipeableTabs from "./SwipeableTabs";
import EmailList from "./EmailList";
import MusicDrawer from "./MusicDrawer";
import PhotoGrid from "./PhotoGrid";
import Notification from "./Notification";

const StyledNav = styled.nav`
  padding: 1.5rem;
  li {
    display: block;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
  }
  h1 {
    font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont,
      "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
      "Helvetica Neue", sans-serif;
    font-weight: bold;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }
`;

const MessageWrapper = styled.div`
  display: none;
  padding-bottom: 1rem;
  padding-left: 1rem;
  padding-top: 1rem;
  background: blue;
  color: white;

  @media (min-width: 768px) {
    display: block;
  }
`;

const MobileWarning = () => {
  return (
    <MessageWrapper>
      These demos should be viewed on a mobile device, an emulator or the mobile
      view in your devtools.
    </MessageWrapper>
  );
};

const routes = [
  { path: "/email-list", component: EmailList, title: "Email List" },
  { path: "/music-drawer", component: MusicDrawer, title: "Music drawer" },
  {
    path: "/swipeable-tabs",
    component: SwipeableTabs,
    title: "Swipeable Tabs"
  },
  { path: "/photo-grid", component: PhotoGrid, title: "Photo Grid" },
  { path: "/notification", component: Notification, title: "Notification" }
];

function App() {
  return (
    <div>
      <MobileWarning />
      <Router>
        <GlobalStyle />
        <Switch>
          <Route
            path="/"
            exact
            render={() => {
              return (
                <StyledNav>
                  <h1>Touch-driven mobile animation examples</h1>
                  <ul>
                    {routes.map(r => (
                      <li key={r.title}>
                        <Link to={r.path}>{r.title}</Link>
                      </li>
                    ))}
                  </ul>
                </StyledNav>
              );
            }}
          />
          {routes.map(r => {
            const Component = r.component;
            return (
              <Route path={r.path} key={r.path}>
                <Component />
              </Route>
            );
          })}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
