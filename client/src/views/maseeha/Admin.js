import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import PrivateRoute from 'views/maseeha/routing/PrivateRoute';
import AdminNavbar from "components/Navbars/AdminNavbar";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";

import sidebarImage from "assets/img/sidebar-3.jpg";
import routes from "routes.js";

import Dashboard from 'views/maseeha/Dashboard'
import EmotionPacks from "views/maseeha/EmotionPacks"
import QAmanagement from "views/maseeha/QAmanagement"
import EmotionFlowAudioManagement from "views/maseeha/EmotionFlowAudioManagement"
import MeditationAudioManagement from "views/maseeha/MeditationAudioManagement"
import UserManagement from "views/maseeha/UserManagement"
import SplashManagement from "views/maseeha/SplashManagement"
import ReviewManagement from "views/maseeha/ReviewManagement"
import UserProfile from "views/UserProfile"

const Admin = (props) => {
  const [image, setImage] = React.useState(sidebarImage);
  const [color, setColor] = React.useState("black");
  const [hasImage, setHasImage] = React.useState(true);
  const mainPanel = React.useRef(null);

  if (props.isAuthenticated === false) {
    window.location.href = "/login"
  }

  return (
    <Router>
      <Switch>
        <div className="wrapper">
          <Sidebar color={color} image={hasImage ? image : ""} routes={routes} />
          <div className="main-panel" ref={mainPanel}>
            <AdminNavbar />
            <div className="content">
              <PrivateRoute exact path="/admin/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/admin/emotionpacks" component={EmotionPacks} />
              <PrivateRoute exact path="/admin/qamanagement" component={QAmanagement} />
              <PrivateRoute exact path="/admin/emotionflowaudiomanagement" component={EmotionFlowAudioManagement} />
              <PrivateRoute exact path="/admin/meditationaudiomanagement" component={MeditationAudioManagement} />
              <PrivateRoute exact path="/admin/user" component={UserManagement} />
              <PrivateRoute exact path="/admin/splash" component={SplashManagement} />
              <PrivateRoute exact path="/admin/review" component={ReviewManagement} />
              <PrivateRoute exact path="/admin/profile" component={UserProfile} />
            </div>
            <Footer />
          </div>
        </div>
      </Switch>
    </Router>
  )
}

// export default Admin;
Admin.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {  })(Admin);
