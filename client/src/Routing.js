import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// pages, components, styles
import Nav from "./components/Nav";
import Container from "./styles/Container";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import DetailedPost from "./pages/DetailedPost";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./components/ChangePassword";

const Routing = () => {
  return (
    <Router>
      <Nav />
      <Container>
        <Switch>
          <Route path="/explore" component={Explore} />
          <Route path="/p/:postId" component={DetailedPost} />
          <Route exact path="/accounts/edit" component={EditProfile} />
          <Route exact path="/accounts/change-password" component={ChangePassword} />
          <Route exact path="/:username" component={Profile} />
          <Route exact path="/" component={Home} />
        </Switch>
      </Container>
    </Router>
  );
};

export default Routing;
