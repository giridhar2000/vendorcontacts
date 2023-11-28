import React, { useState,useContext } from "react";
import "./Footer.css";
import LogoIcon from "../../Assets/images/logo-icon-2.svg";
import pdf from "../../Assets/TNC.pdf";
import { Popover, message, Modal } from "antd";
import { GiPartyPopper } from "react-icons/gi";
import AuthContext from "../../contexts/authContext";
import supabase from "../../utils/supabase.config";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const [isAuth, setIsAuth] = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [userType, setUserType] = useState(null);
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [checkbox, setCheckbox] = useState(false);
  const { pathname } = useLocation();

  async function invite() {
    
    if (email && checkbox) {
      try {
        const { count, error } = await supabase.from("invite_email").select("email_id", { count: "exact", head: true }).eq('email_id',email);
        if (error) throw new Error(error);
        if(count>0){
          message.warning("Email id already in invite list");
          return;
        }
        const { data, error:error2 } = await supabase.from("invite_email").insert([
          {
            email_id: email,
            type: userType,
          },
        ]);
        if(error2) throw new Error(error2);
        
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
  // you can check a more conditions here
  if (pathname === "/login") return null;

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
                <button className="submit-btn" onClick={invite}>Request invite</button>
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

    <div className="footer">
      <div className="logo">
        <img src={LogoIcon} alt="logo" />
      </div>
      <div className="footer-content">
        <p className="fs-56 ">
          We streamline communication, <br/> <span className="footer-text">so you can better serve your
          clients</span>
        </p>
      </div>
      {
        !isAuth &&  <div className="footerButton">
        <button onClick={()=>setOpen(true)}>Request Invite</button>
      </div>
      }
    
      <div className="copyright">
        <p className="text-light">
          &copy; 2023 Vendorcontacts. All rights reserved.
        </p>
      </div>
    </div>
    </>
  );
};

export default Footer;
