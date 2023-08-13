import React from "react";
import "./Footer.css";
import LogoIcon from "../../Assets/images/logo-icon-2.svg";

const Footer = () => {
  return (
    <div className="footer">
      <div className="logo">
        <img src={LogoIcon} alt="logo" />
      </div>
      <div className="footer-content">
        <p className="fs-56 ">
          We streamline communication, <br /> so you can better serve your
          clients
        </p>
      </div>
      <div className="footerButton">
        <button>Request Invite</button>
      </div>
      <div className="copyright">
        <p className="text-light">
          &copy; 2023 Vendorcontacts. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
