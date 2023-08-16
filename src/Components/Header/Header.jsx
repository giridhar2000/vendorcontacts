import React from "react";
import "./Header.css";
import Logo from "../../Assets/images/Frame.svg";
import Icon from "../../Assets/images/logo-icon.svg";

const Header = () => {
  return (
    <div className="header">
      <div className="headerlogo">
        <img src={Icon} alt="" className="logoIcon" />
        <h1 className="logo-text">VENDORCONTACTS</h1>
      </div>
      <div className="right">
        <div className="buttons">
          <button className="signin">Sign in</button>
          <button className="request">Request Invite</button>
        </div>
      </div>
    </div>
  );
};

export default Header;
