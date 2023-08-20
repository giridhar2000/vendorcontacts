import React, { useState } from "react";
import "./Header.css";
import { Button, Drawer } from 'antd';
import Icon from "../../Assets/images/logo-icon.svg";
import menu from "../../Assets/img/menu.svg";

const Header = () => {
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
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

      <div className="menu">
        <Button type="secondary" onClick={showDrawer}>
          <svg height="32px" id="Layer_1" style={{ enableBackground: "new 0 0 32 32" }} version="1.1" viewBox="0 0 32 32" width="25px" xmlns="http://www.w3.org/2000/svg" >
            <path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2 s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2 S29.104,22,28,22z" />
          </svg>
        </Button>
        <Drawer title="Vendor Connect" placement="right" onClose={onClose} open={open}>
          <div className="buttons">
            <button className="signin">Sign in</button>
            <button className="request">Request Invite</button>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default Header;
