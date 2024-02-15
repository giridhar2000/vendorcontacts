import React, { useState } from "react";
import "./Header.css";
import dummi from "../../Assets/images/dummy.png";
import { Badge, Button, Drawer, Skeleton } from "antd";
import Icon from "../../Assets/images/vc.svg";
import {
  AiOutlineArrowRight,
  AiOutlineUser,
  AiOutlineLogout,
  AiFillBell,
  AiOutlineSearch,
  AiFillRightCircle,
} from "react-icons/ai";
import { BsChatLeftText, BsBell } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../contexts/authContext";
import { Popover, message, Modal } from "antd";
import { GiPartyPopper } from "react-icons/gi";
import { toast } from "react-toastify";
import supabase from "../../utils/supabase.config";
import { useQuery, useInfiniteQuery } from "react-query";
import { getAllVendorsOfSameCompany, getUser } from "../../utils/profile_helper";
import pdf from "../../Assets/TNC.pdf";
import { ConsoleSqlOutlined, SearchOutlined } from "@ant-design/icons";
import { getUnreadMessagesOfUser } from "../../utils/chat_helper";
import { getNotifications } from "../../utils/notifications_helper";

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

  const { data: vendorsOfSameCompany, isLoading: isLoading5 } = useQuery(
    ["vendorsSameCompany"],
    async () => {
      let data = await getAllVendorsOfSameCompany(
        profile?.type,
        profile?.company
      );
      return data;
    }
  );
  const { data: unread_messages, isLoading: isLoading2 } = useQuery(
    ["unread_messages", profile?.id],
    async () => {
      const data = await getUnreadMessagesOfUser(profile?.id);
      return data.unread_messages || 0;
    },
    {
      enabled: profile?.id !== undefined,
    }
  );
  const { data: notificationsData } = useQuery(
    ["notifications", profile?.id],
    async () => {
      let data = await getNotifications(profile?.id, profile?.email);
      return data;
    },
    {
      enabled: profile?.id !== null,
    }
  );
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [searchData, setSearchData] = useState([])

  const signin = () => {
    navigate("/login");
  };
  const showDrawer = () => {
    setOpenMenu(true);
  };
  const onClose = () => {
    setOpenMenu(false);
  };

  const handleOnSearch = (e) => {
    if (e.target.value === "") {
      setSearchData([])
    } else {
      setSearchData((old) => {
        return vendorsOfSameCompany?.filter((value, i) =>
          value?.display_name.toLowerCase()?.includes(e.target.value?.toLowerCase())
        ).map(val => val)
      });
    }
  }

  const getFullList = () => {
    setSearchData((old) => {
      return vendorsOfSameCompany?.slice(0, 5).map(val => val)
    });
  }

  async function invite() {
    if (email && checkbox) {
      try {
        const { count, error } = await supabase
          .from("invite_email")
          .select("email_id", { count: "exact", head: true })
          .eq("email_id", email);
        if (error) throw new Error(error);
        if (count > 0) {
          message.warning("Email id already in invite list");
          return;
        }
        const { data, error: error2 } = await supabase
          .from("invite_email")
          .insert([
            {
              email_id: email,
              type: userType,
            },
          ]);
        if (error2) throw new Error(error2);

        setIsSent(true);
        setEmail("");
        setUserType(null);
        return data[0]?.email_id;
      } catch (err) {
        console.log();
        return null;
      }
    } else {
      message.error("please enter your email id and click on the checkbox");
    }
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

  const notificationcontent = (
    <div>
      <p
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        onClick={() => navigate("/notifications")}
      >
        <AiFillBell style={{ marginRight: ".5rem" }} />
        View your notifications
      </p>
    </div>
  );

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
                Are you a<br /> Vendor or a Designer ?
              </h4>

              <div
                className="Loginform mt-32 w-40"
                style={{ marginLeft: "0", marginTop: "32px", width: "40%" }}
              >
                <div className="buttons-select" style={{ width: "100%" }}>
                  <div className="button">
                    <input
                      type="radio"
                      id="Designer"
                      name="signupBtn"
                      value="designer"
                      onChange={(e) => setUserType(e.target.value)}
                    />
                    <label className="btn btn-default" for="Designer">
                      Designer
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
                <button className="submit-btn" onClick={invite}>
                  Request invite
                </button>
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
                <button className="submit-btn" onClick={invite}>
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
          <br /> Team VendorContacts
        </p>
      </Modal>

      <div className="header">
        <div className="top">
          <div className="menu">
            <Button type="secondary" onClick={showDrawer}>
              <svg
                height="50px"
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
              open={openMenu}
            >
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
                <div className="menu-icons">
                  <p onClick={() => navigate("/chats")}>
                    <BsChatLeftText />
                    &nbsp;
                    <p>Chats</p>
                  </p>

                  <p onClick={() => navigate("/notifications")}>
                    <BsBell />
                    &nbsp;
                    <p>Notifications</p>
                  </p>
                  <p onClick={() => navigate("/profile")}>
                    <AiOutlineUser /> &nbsp;
                    <p>Profile</p>
                  </p>
                  <p onClick={logout}>
                    <AiOutlineLogout />
                    &nbsp;
                    <p>Logout</p>
                  </p>
                </div>
              )}
            </Drawer>
          </div>
          <div className="headerlogo" onClick={() => navigate("/")}>
            <img
              src={Icon}
              alt=""
              className="logoIcon"
              style={{ width: "80%" }}
            />
          </div>

          <div className="menu-profile-pic">
            <img src={profile?.profile_pic || dummi} alt="profile" />
          </div>
        </div>

        {isAuth && (
          <div className="search">
            <div className="search-bar">
              <div className="left" style={{ width: "100%" }}>
                <SearchOutlined />
                <input
                  type="text"
                  placeholder="Search your favourite vendor"
                  onChange={handleOnSearch}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      getFullList()
                    }
                  }}
                />
              </div>
              <div className="righti">
                <AiFillRightCircle size={50} />
              </div>
            </div>
            {searchData?.length > 0 &&
              <div className="search-list">
                <ul>
                  <li style={{color: 'red', fontSize: 'x-small'}}>* showing vendors only from your company</li>
                  {searchData?.map((val) =>
                    <li className="selected-data" onClick={()=>navigate(`/profile/${val?.id}`)}>
                      {val.display_name}
                    </li>
                  )}
                </ul>
              </div>
            }
          </div>
        )}

        <div className="right" style={{ width: !isAuth ? '' : "15%" }}>
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
              <Badge count={unread_messages}>
                <BsChatLeftText onClick={() => navigate("/chats")} />
              </Badge>
              <Badge count={notificationsData?.length}>
                <BsBell onClick={() => navigate("/notifications")} />
              </Badge>
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
      </div>
    </>
  );
};

export default Header;
