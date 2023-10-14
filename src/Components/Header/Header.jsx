import React, { useState } from "react";
import "./Header.css";
import { Button, Drawer, Skeleton } from "antd";
import Icon from "../../Assets/images/vc.svg";
import {
  AiOutlineArrowRight,
  AiOutlineUser,
  AiOutlineLogout,
} from "react-icons/ai";
import { BsChatLeftText, BsBell } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../contexts/authContext";
import UserContext from "../../contexts/userContext";
import { Popover, message, Modal } from "antd";
import { GiPartyPopper } from "react-icons/gi";
import { toast } from "react-toastify";
import supabase from "../../utils/supabase.config";
import { useQuery } from "react-query";
import { getUser } from "../../utils/profile_helper";
import pdf from "../../Assets/TNC.pdf";

const Header = () => {
  const [isAuth, setIsAuth] = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [checkbox, setCheckbox] = useState(false);
  const [userType, setUserType] = useState(null);
  const [isSent, setIsSent] = useState(false);
  const location = useLocation();
  const { data: profile, isLoading } = useQuery("profile", getUser, {
    enabled: isAuth !== undefined,
  });
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const signin = () => {
    navigate("/login");
  };
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  async function invite(email) {
    if (email && checkbox && userType) {
      try {
        const { data, error } = await supabase.from("invite_email").insert([
          {
            email_id: email,
            type: userType,
          },
        ]);
        if (error) throw new Error(error);
        setIsSent(true);
        setOpen(false);
        setUserType(null);
        return data[0]?.email_id;
      } catch (err) {
        return null;
      }
    } else {
      message.error("please enter your email id and click on the checkbox");
    }
    setEmail("");
    setUserType(null);
    setCheckbox(false);
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast("Logout failed", { type: "error" });
      return;
    }
    setIsAuth(false);
    localStorage.removeItem("auth");
    navigate("/");
  }

  const content = (
    <div>
      <p
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        onClick={() => navigate("/profile")}
      >
        <AiOutlineUser style={{ marginRight: ".5rem" }} />
        View profile
      </p>
      <p
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        onClick={logout}
      >
        <AiOutlineLogout style={{ marginRight: ".5rem" }} />
        Logout
      </p>
    </div>
  );

  return (
    <>
      {open && !userType && (
        <div id="myModal" className="modal">
          <div className="modal-content">
            <span
              className="close"
              onClick={() => {
                setOpen(false);
                setUserType(null);
              }}
            >
              &times;
            </span>

            <div className="modalform">
              <h4>
                Are you a<br /> Vendor or an Architect ?
              </h4>

              <div
                className="Loginform mt-32 w-40"
                style={{ marginLeft: "0", marginTop: "32px", width: "40%" }}
              >
                <div className="buttons-select" style={{ width: "100%" }}>
                  <div className="button">
                    <input
                      type="radio"
                      id="Architect"
                      name="signupBtn"
                      value="architect"
                      onChange={(e) => setUserType(e.target.value)}
                    />
                    <label className="btn btn-default" for="Architect">
                      Architect
                    </label>
                  </div>
                  <div className="button">
                    <input
                      type="radio"
                      id="Vendor"
                      name="signupBtn"
                      value="vendor"
                      onChange={(e) => setUserType(e.target.value)}
                    />
                    <label className="btn btn-default" for="Vendor">
                      Vendor
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {open &&
        userType &&
        (userType === "vendor" ? (
          <div id="myModal" className="modal">
            <div className="modal-content">
              <span
                className="close"
                onClick={() => {
                  setOpen(false);
                  setUserType(null);
                }}
              >
                &times;
              </span>

              <div className="modalform">
                <h4>Request an Invite.</h4>

                <p>
                  We'll contact a partner firm to confirm your credentials and
                  get you on the list :)
                </p>

                <form>
                  <div>
                    {/* <label style={{ color: 'rgba(0,0,0,0.5)' }}>Email</label><br /> */}
                    <input
                      className="mailinput"
                      type="text"
                      placeholder="Enter your email here"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <br />
                  </div>
                  <br />
                  <div>
                    <input
                      type="checkbox"
                      name="agreement"
                      onChange={(e) => setCheckbox(e.target.value)}
                    />
                    &nbsp;
                    <label className="checklabel">
                      By clicking "Accept," you agree to our{" "}
                      <a href={pdf} target="_blank">
                        Terms and Conditions
                      </a>
                      .
                    </label>
                    <br />
                  </div>
                  <br />
                </form>
                <button className="submit-btn">Request invite</button>
              </div>
            </div>
          </div>
        ) : (
          <div id="myModal" className="modal">
            <div className="modal-content">
              <span
                className="close"
                onClick={() => {
                  setOpen(false);
                  setUserType(null);
                }}
              >
                &times;
              </span>

              <div className="modalform">
                <h4>Join the list</h4>

                <p>
                  You're one step away from easy communication with your reps :)
                </p>

                <form>
                  <div>
                    {/* <label style={{color: 'rgba(0,0,0,0.5)'}}>Email</label><br /> */}
                    <input
                      className="mailinput"
                      type="text"
                      placeholder="Enter your email here"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <br />
                  </div>
                  <br />
                  <div>
                    <input
                      type="checkbox"
                      name="agreement"
                      onChange={(e) => setCheckbox(e.target.value)}
                    />
                    &nbsp;
                    <label className="checklabel">
                      By clicking "Accept," you agree to our{" "}
                      <a href={pdf} target="_blank">
                        Terms and Conditions
                      </a>
                      .
                    </label>
                    <br />
                  </div>
                  <br />
                </form>
                <button className="submit-btn" onClick={() => invite(email)}>
                  Join the list
                </button>
              </div>
            </div>
          </div>
        ))}
      <Modal
        bodyStyle={{
          fontFamily: " 'Quicksand' sans-serif",
        }}
        title={
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              fontFamily: " 'Quicksand' sans-serif",
            }}
          >
            <GiPartyPopper
              style={{
                marginRight: ".8rem",
                fontSize: "1.7rem",
                color: "#aeba00",
              }}
            />
            Thank you for Joining Our Waitlist!{" "}
          </h3>
        }
        centered
        open={isSent}
        footer={null}
        onCancel={() => setIsSent(false)}
      >
        <p>
          We are thrilled to have you onboard. Stay tuned for exclusive updates
          and be ready to experience a transformative approach to
          vendor-designer collaboration.
          <br /> <br />
          Looking forward to building the future together!
          <br />
          <br /> Team VendorContacts
        </p>
      </Modal>
      <div className="header">
        <div className="headerlogo" onClick={() => navigate("/")}>
          <img
            src={Icon}
            alt=""
            className="logoIcon"
            style={{ width: "100%" }}
          />
        </div>

        {/* {isAuth ? (
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
      ) : null} */}
        <div className="right">
          {!isAuth ? (
            <div className="buttons">
              <button className="signin" onClick={signin}>
                Sign in
              </button>
              <button className="request" onClick={() => setOpen(true)}>
                Request Invite
              </button>
            </div>
          ) : (
            <div className="buttons icons">
              <BsChatLeftText onClick={() => navigate("/chats")} />
              {/* <BsBell /> */}
              <Popover
                placement="bottomRight"
                content={content}
                trigger="click"
              >
                {isLoading ? (
                  <Skeleton.Avatar active={isLoading} shape={"circle"} />
                ) : (
                  <>
                    {profile?.profile_pic ? (
                      <div className="profile_pic_label small-pic">
                        <img src={profile?.profile_pic} alt="profile" />
                      </div>
                    ) : (
                      <AiOutlineUser />
                    )}
                  </>
                )}
              </Popover>
            </div>
          )}
        </div>

        {
          //   <div className="menu">
          //   <Button type="secondary" onClick={showDrawer}>
          //     <svg
          //       height="32px"
          //       id="Layer_1"
          //       style={{ enableBackground: "new 0 0 32 32" }}
          //       version="1.1"
          //       viewBox="0 0 32 32"
          //       width="25px"
          //       xmlns="http://www.w3.org/2000/svg"
          //     >
          //       <path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2 s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2 S29.104,22,28,22z" />
          //     </svg>
          //   </Button>
          //   <Drawer
          //     title="Vendor Connect"
          //     placement="right"
          //     onClose={onClose}
          //     open={open}
          //   >
          //     {isAuth ? (
          //       <div>
          //         <form className="header-form">
          //           <button>
          //             <svg
          //               width={17}
          //               height={16}
          //               fill="none"
          //               xmlns="http://www.w3.org/2000/svg"
          //               role="img"
          //               aria-labelledby="search"
          //             >
          //               <path
          //                 d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
          //                 stroke="currentColor"
          //                 strokeWidth="1.333"
          //                 strokeLinecap="round"
          //                 strokeLinejoin="round"
          //               />
          //             </svg>
          //           </button>
          //           <input
          //             className="header-input"
          //             placeholder="Search your favourite vendor"
          //             required
          //             type="text"
          //           />
          //           <button>
          //             <div className="form-button">
          //               <AiOutlineArrowRight />
          //             </div>
          //           </button>
          //         </form>
          //       </div>
          //     ) : null}
          //       {!isAuth ? (
          //         <div className="buttons">
          //           <button className="signin" onClick={signin}>
          //             Sign in
          //           </button>
          //           <button className="request">Request Invite</button>
          //         </div>
          //       ) : (
          //         <div className="buttons icons">
          //           <p onClick={() => navigate("/chats")}>
          //             <BsChatLeftText /> Chats
          //           </p>
          //           <p>
          //             <BsBell /> Notifications
          //           </p>
          //           <p onClick={() => navigate("/profile")}>
          //             <AiOutlineUser /> Profile
          //           </p>
          //           <p onClick={logout}>
          //             <AiOutlineLogout />
          //             Logout
          //           </p>
          //         </div>
          //       )}
          //   </Drawer>
          // </div>
        }
      </div>
    </>
  );
};

export default Header;
