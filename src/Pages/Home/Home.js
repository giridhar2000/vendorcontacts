import React, { useEffect, useState } from "react";
import "./Home.css";
import Gettys from "../../Assets/images/PW.svg";
import IAInteriors from "../../Assets/images/ia_interior_architects.svg";
import Gensler from "../../Assets/images/Gensler_logo.svg";
import Stantec from "../../Assets/images/stantec.svg";
import OKK from "../../Assets/images/PerkinsEastman.jpg";
import HPA from "../../Assets/images/hpa.svg";
// import Collaboration from "../../Assets/images/handshake.svg";
// import Telescope from "../../Assets/images/telescope.svg";
// import Target from "../../Assets/images/target.svg";
import TrustIcon from "../../Assets/images/professional-trust.svg";
import CommunicationIcon from "../../Assets/images/communication.svg";
import SearchIcon from "../../Assets/images/search.svg";
import StoreIcon from "../../Assets/images/industry.svg";
import ToolsIcon from "../../Assets/images/tools.svg";
import AdvanceSearchIcon from "../../Assets/images/search-cap.svg";
import GraphIcon from "../../Assets/images/graph.svg";
import bg1 from "../../Assets/images/bg.png";
import { gsap } from "gsap";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import pdf from "../../Assets/TNC.pdf";
import supabase from "../../utils/supabase.config";
import { message, Modal } from "antd";
import ribbon2 from "../../Assets/images/strip 2.svg";
import { GiPartyPopper } from "react-icons/gi";
import ribbon1 from "../../Assets/images/strip.svg";
import ribbon3 from "../../Assets/images/strip3.svg";
import { toast } from "react-toastify";
export default function Home() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [checkbox, setCheckbox] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [userType, setUserType] = useState(null);
  const [next, setNext] = useState(false);

  useEffect(() => {
    animator();
  });

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

  function animator() {
    document.querySelectorAll(".codedText").forEach((t) => {
      const arr1 = t.innerHTML.split("");
      const arr2 = [];
      arr1.forEach((char, i) => (arr2[i] = randChar())); //fill arr2 with random characters
      t.onpointerover = () => {
        const tl = gsap.timeline();
        let step = 0;
        tl.fromTo(
          t,
          {
            innerHTML: arr2.join(""),
            color: "#000",
            background: "#bada55",
          },
          {
            duration: arr1.length / 20, //duration based on text length
            ease: "power4.in",
            delay: 0.1,
            color: "#fff",
            background: "#000",
            onUpdate: () => {
              const p = Math.floor(tl.progress() * arr1.length); //whole number from 0 - text length
              if (step !== p) {
                //throttle the change of random characters
                step = p;
                arr1.forEach((char, i) => (arr2[i] = randChar()));
                let pt1 = arr1.join("").substring(p, 0),
                  pt2 = arr2.join("").substring(arr2.length - p, 0);
                if (t.classList.contains("fromRight")) {
                  pt1 = arr2.join("").substring(arr2.length - p, 0);
                  pt2 = arr1.join("").substring(arr1.length - p);
                }
                t.innerHTML = pt1 + pt2;
              }
            },
          }
        );
      };
    });
  }

  function randChar() {
    let c = "abcdefghijklmnopqrstuvwxyz1234567890!@#$^&*()…æ_+-=;[]/~`";
    c = c[Math.floor(Math.random() * c.length)];
    return Math.random() > 0.5 ? c : c.toUpperCase();
  }

  return (
    <>
      <Header />
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

      <section className="banner">
        <div className="banner-heading">
          <div className="banner-text">
            <h1>
              The <span className="future">future</span> of{" "}
              {/* <img className="img1" src={Telescope} alt="telescope" /> */}
            </h1>
            <h1>
              {/* <img className="ml-1" src={Target} alt="target" /> */}
              designer-vendor
            </h1>
            <h1>
              collaboration is{" "}
              {/* <img className="img2" src={Collaboration} alt="collaboration" /> */}
              here
            </h1>
          </div>
          <img src={bg1} alt="bg" className="bg" />
        </div>
      </section>
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
      <section className="team">
        <div className="joinContainer">
          <div className="join-block" onClick={() => setOpen(true)}>
            <svg
              id="circle"
              xmlns="http://www.w3.org/2000/svg"
              width="269"
              height="176"
              viewBox="0 0 269 176"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M135 0H0V176H269V107.642C269 107.595 269 107.547 269 107.5C269 69.8412 243.579 63.5656 220.623 65.5758C201.882 67.2169 182.019 56.1436 179.5 37.5L179.298 36.4852C178.927 34.6156 178.704 32.7147 178.482 30.8138C178.234 28.6982 177.987 26.5826 177.533 24.5101C175.588 15.6141 167.539 0 135 0Z"
                fill="black"
              />
              <text
                x="30%"
                y="32%"
                text-anchor="middle"
                dominant-baseline="middle"
                fill="white"
                font-size="40px"
              >
                JOIN
              </text>

              <text
                x="40%"
                y="68%"
                dominant-baseline="middle"
                text-anchor="middle"
                fill="white"
                font-size="40px"
              >
                THE LIST
              </text>
              <svg
                id="circle"
                x="67%"
                y="-3%"
                xmlns="http://www.w3.org/2000/svg"
                width="72"
                height="72"
                viewBox="0 0 72 72"
                fill="none"
              >
                <circle cx="36" cy="36" r="30" fill="black"></circle>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="65"
                height="65"
                x="68%"
                y="-1%"
                viewBox="0 0 65 65"
                fill="none"
              >
                <mask
                  id="circle"
                  style={{ maskType: "alpha" }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="65"
                  height="65"
                >
                  <rect
                    y="32.0541"
                    width="45.3313"
                    height="45.3313"
                    transform="rotate(-45 0 32.0541)"
                    fill="#D9D9D9"
                  />
                </mask>
                <g mask="url(#circle)">
                  <path
                    d="M38.9656 27.8136L22.7048 44.0744L20.0337 41.4032L36.2944 25.1424L21.3359 25.1424L21.3693 21.3694H42.7387V42.7388L38.9656 42.7722L38.9656 27.8136Z"
                    fill="white"
                  />
                </g>
              </svg>
            </svg>
          </div>
        </div>

        <div className="steps firststep">
          <img src={ribbon1} alt="ribbon-2" />
        </div>
      </section>

      <section className="faq">
        <div className="faq-block">
          <div className="faq-text">
            ALL YOUR QUESTIONS, AND <br />
            REPS ON ONE PLATFORM. <br />
            NO MORE LONG EMAIL
            <br />
            THREADS.
          </div>
        </div>

        <div className="tilt">
          <div className="tiltedChild codedText">Who's my rep?</div>
          <div className="tiltedChild codedText">What's the cost on this?</div>
          <div className="tiltedChild codedText">Is this bleach cleanable?</div>
          <div className="tiltedChild codedText">Can this be made custom?</div>
          <div className="tiltedChild codedText">
            Digital or standard vinyl?
          </div>
        </div>
      </section>

      <section className="mission">
        <div className="mission-block">
          <div className="mission-left">
            <h4>
              Our mission is to empower designers and vendors by providing a
              platform that simplifies and enhances their collaboration.
            </h4>
          </div>
          <div className="mission-right">
            <h4>
              We are dedicated to eliminating the barriers that hinder effective
              communication and partnership in the construction and design
              industry.
            </h4>
            <p className="text-grey">
              We're here to revolutionize the construction and design industry
              by becoming the leading platform for architect-vendor
              collaboration. We envision a world where architects can easily
              find the right vendors for their projects, and vendors can provide
              hands-on assist, leading to better design outcomes and a thriving
              industry.
            </p>
          </div>
        </div>
      </section>

      <section className="services">
        <div className="steps">
          <img src={ribbon3} alt="ribbon" style={{ width: "100%" }} />
        </div>

        {/* <div className="service-container">
                    <div className="card">
                        <div className="animate card-head">
                            <img src={TrustIcon} alt="icon" className="animate" />
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">
                                Trusted by Industry Professionals
                            </h5>
                            <p className="card-text">
                                Created and vetted by the best in the industry.
                            </p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-head">
                            <img src={CommunicationIcon} alt="icon" className="animate" />
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Effective Communication Tools</h5>
                            <p className="card-text">
                                No more email threads. Streamlined, Al assisted communication
                            </p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-head">
                            <img src={SearchIcon} alt="icon" className="animate" />
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Advanced Search Capabilities</h5>
                            <p className="card-text">
                                Increased exposure through detailed and data-rich filtering
                                tools.
                            </p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-head">
                            <img src={StoreIcon} alt="icon" className="animate" />
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">
                                Trusted by Industry Professionals
                            </h5>
                            <p className="card-text">
                                For a personalized experience, where you can specify with
                                certainty.
                            </p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-head">
                            <img src={ToolsIcon} alt="icon" className="animate" />
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Effective Communication Tools</h5>
                            <p className="card-text">
                                All your projects and rep communications, in one place.
                            </p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-head">
                            <img src={AdvanceSearchIcon} alt="icon" className="animate" />
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Advanced Search Capabilities</h5>
                            <p className="card-text">
                                Tools to enable library updates, lunch and learns, event
                                invites, and more.
                            </p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-head">
                            <img src={GraphIcon} alt="icon" className="animate" />
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">
                                Trusted by Industry Professionals
                            </h5>
                            <p className="card-text">
                                Organization tools make your project workflow faster, with
                                less hassle.
                            </p>
                        </div>
                    </div>

                    <div className="ribbon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="601" height="390" viewBox="0 0 601 390" fill="none">
                            <path id="p3" d="M43 0V347H558V0" stroke="#D9E167" stroke-width="85" stroke-linejoin="round" />
                            <text dominant-baseline="middle" fill="black" font-size="32px">
                                <textPath href="#p3" startOffset="100%">
                                    Uniting Visionaries and makers .Uniting Visionaries and makers .
                                    <animate
                                        attributeName="startOffset" from="-100%" to="100%"
                                        dur="10s" begin="3s" repeatCount="indefinite" />
                                </textPath>
                            </text>
                        </svg>
                    </div>
                </div> */}

        <div className="aboutbody">
          <div className="aboutrow">
            <div className="aboutcolumn">
              <div className="requestsitemhead">
                <img src={TrustIcon} alt="img" />
                <h1>Trusted by Industry Professionals</h1>
              </div>
              <p>Created and vetted by the best in the industry.</p>
            </div>

            <div className="aboutcolumn">
              <div className="requestsitemhead">
                <img src={CommunicationIcon} alt="img" />
                <h1>Effective Communication Tools</h1>
              </div>
              <p>
                No more email threads. Streamlined, Al assisted communication.
              </p>
            </div>

            <div className="aboutcolumn">
              <div className="requestsitemhead">
                <img src={SearchIcon} alt="img" />
                <h1>Advanced Search Capabilities</h1>
              </div>
              <p>
                Increased exposure through detailed and data-rich filtering
                tools.
              </p>
            </div>
          </div>
          <div className="aboutrow">
            <div className="aboutcolumn">
              <div className="requestsitemhead">
                <img src={StoreIcon} alt="img" />
                <h1>Vendor Direct Sample Ordering</h1>
              </div>
              <p>
                For a personalized experience, where you can specify with
                certainty.
              </p>
            </div>

            <div className="aboutcolumn">
              <div className="requestsitemhead">
                <img src={ToolsIcon} alt="img" />
                <h1>User-Friendly Interface</h1>
              </div>
              <p>All your projects and rep communications, in one place.</p>
            </div>

            <div className="aboutcolumn">
              <div className="requestsitemhead">
                <img src={AdvanceSearchIcon} alt="img" />
                <h1>Relationship Building Features</h1>
              </div>
              <p>
                Tools to enable library updates, lunch and learns, event
                invites, and more.
              </p>
            </div>
          </div>
          <div
            className="aboutrow lastrow"
            style={{ justifyContent: "flex-start", border: "none" }}
          >
            <div
              className="aboutcolumn lastcolumn"
              id="aboutcolumn"
              style={{ justifyContent: " center" }}
            >
              <div className="requestsitemhead lastitem">
                <img src={GraphIcon} alt="img" />
                <h1>Increased Efficiency</h1>
              </div>
              <p className="lastitem">
                Organization tools make your project workflow faster, with less
                hassle.
              </p>
            </div>

            <div className="ribbon">
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                width="601"
                height="390"
                viewBox="0 0 601 390"
                fill="none"
              >
                <path
                  id="p3"
                  d="M43 0V347H558V0"
                  stroke="#D9E167"
                  stroke-width="85"
                  stroke-linejoin="round"
                />
                <text dominant-baseline="middle" fill="black" font-size="32px">
                  <textPath href="#p3">
                    Uniting Visionaries and makers .Uniting Visionaries and
                    makers . Uniting Visionaries and makers .Uniting Visionaries
                    and makers .
                    <animate
                                            attributeName="startOffset" from="-100%" to="100%"
                                            dur="10s" begin="3s" repeatCount="indefinite" />
                  </textPath>
                </text>
              </svg> */}
              <img src={ribbon2} alt="ribon-img" />
            </div>
          </div>
        </div>
      </section>

      <section className="collaborators">
        <h2 className="heading">In Collaboration With Designers From</h2>
        <div className="companies">
          <img src={IAInteriors} alt="ia-interiors" />
          <img src={Gensler} alt="gensler-logo" />
          <img src={Stantec} alt="stantec-logo" />
          <img src={HPA} alt="hpa-logo" />
        </div>
      </section>
      <Footer />
    </>
  );
}
