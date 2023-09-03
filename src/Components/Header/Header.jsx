import React, { useState } from "react";
import "./Header.css";
import { Button, Drawer } from "antd";
import Icon from "../../Assets/images/logo-icon.svg";
import { AiOutlineArrowRight, AiOutlineUser } from "react-icons/ai";
import { BsChatLeftText, BsBell } from "react-icons/bs";
import { useNavigate } from "react-router-dom";


const Header = () => {
  const navigate = useNavigate()
  const signin = () => {
    navigate('/login')
  }
  const [open, setOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(true);
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
        {!isAuth ? (
          <h1 className="logo-text">VENDORCONTACTS</h1>
        ) : (
          <h2 className="logo-text">VENDORCONTACTS</h2>
        )}
      </div>


      {isAuth ? (
        <div className="right">
          <form className="header-form">
            <button>
              <svg
                width={17}
                height={16}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-labelledby="search"
              >
                <path
                  d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                  stroke="currentColor"
                  strokeWidth="1.333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <input
              className="header-input"
              placeholder="Search your favourite vendor"
              required
              type="text"
            />
            <button>
              <div className="form-button">
                <AiOutlineArrowRight />
              </div>
            </button>
          </form>


        </div>
      ) : null}

      <div className="right">
        {!isAuth ? (
          <div className="buttons">
            <button className="signin" onClick={signin}>Sign in</button>
            <button className="request">Request Invite</button>
          </div>
        ) : (
          <div className="buttons icons">
            <BsChatLeftText />
            <BsBell />
            <AiOutlineUser />
          </div>
        )}
      </div>

      <div className="menu">
        <Button type="secondary" onClick={showDrawer}>
          <svg
            height="32px"
            id="Layer_1"
            style={{ enableBackground: "new 0 0 32 32" }}
            version="1.1"
            viewBox="0 0 32 32"
            width="25px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2 s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2 S29.104,22,28,22z" />
          </svg>
        </Button>
        <Drawer
          title="Vendor Connect"
          placement="right"
          onClose={onClose}
          open={open}
        >
          {isAuth ? (
            <div>
              <form className="header-form">
                <button>
                  <svg
                    width={17}
                    height={16}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-labelledby="search"
                  >
                    <path
                      d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                      stroke="currentColor"
                      strokeWidth="1.333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <input
                  className="header-input"
                  placeholder="Search your favourite vendor"
                  required
                  type="text"
                />
                <button>
                  <div className="form-button">
                    <AiOutlineArrowRight />
                  </div>
                </button>
              </form>
            </div>
          ) : null}

          <div className="buttons">
            {!isAuth ? (
              <div className="buttons">
                <button className="signin" onClick={signin}>Sign in</button>
                <button className="request">Request Invite</button>
              </div>
            ) : (
              <div className="buttons icons">
                <p>
                  <BsChatLeftText /> Chats
                </p>
                <p>
                  <BsBell /> Notifications
                </p>
                <p>
                  <AiOutlineUser /> Profile
                </p>
              </div>
            )}
            <button className="signin" onClick={signin}>Sign in</button>
            <button className="request">Request Invite</button>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default Header;
