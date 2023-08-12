import React from "react";
import Header from "../../Components/Header/Header";
import "./Home.css";
import Gettys from "../../Assets/images/gettys-group.svg";
import IAInteriors from "../../Assets/images/ia_interior_architects.svg";
import Gensler from "../../Assets/images/Gensler_logo.svg";
import Stantec from "../../Assets/images/stantec.svg";
import OKK from "../../Assets/images/OKK.svg";
import HPA from "../../Assets/images/hpa.svg";
import Collaboration from "../../Assets/images/handshake.svg";
import Telescope from "../../Assets/images/telescope.svg";
import Target from "../../Assets/images/target.svg";
import Arrow from "../../Assets/images/arrow.svg";
import TrustIcon from "../../Assets/images/professional-trust.svg";
import CommunicationIcon from "../../Assets/images/communication.svg";
import SearchIcon from "../../Assets/images/search.svg";
import StoreIcon from "../../Assets/images/industry.svg";
import ToolsIcon from "../../Assets/images/tools.svg";
import AdvanceSearchIcon from "../../Assets/images/search-cap.svg";
import GraphIcon from "../../Assets/images/graph.svg";

export default function Home() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        <section className="banner">
          <div className="banner-heading">
            <h1>
              The future of <img src={Telescope} alt="telescope" />
            </h1>
            <h1>
              <img className="ml-1" src={Target} alt="target" /> designer-vendor
            </h1>
            <h1>
              collaboration is <img src={Collaboration} alt="collaboration" />
              here
            </h1>
          </div>
        </section>

        <section className="team">
          <div className="joinContainer">
            <div className="join-block">
              <h2>
                join <br /> the list
              </h2>
            </div>
            <div className="arrow">
              <img src={Arrow} alt="arrow" />
            </div>
          </div>
        </section>
        <section className="faq">
          <div className="faq-block">
            ALL YOUR QUESTIONS, AND REPS ON ONE PLATFORM. NO MORE LONG EMAIL
            THREADS.
          </div>
        </section>

        {/* mission section  */}
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
                We are dedicated to eliminating the barriers that hinder
                effective communication and partnership in the construction and
                design industry.
              </h4>
              <p className="text-grey">
                We're here to revolutionize the construction and design industry
                by becoming the leading platform for architect-vendor
                collaboration. We envision a world where architects can easily
                find the right vendors for their projects, and vendors can
                provide hands-on assist, leading to better design outcomes and a
                thriving industry.
              </p>
            </div>
          </div>
        </section>

        <section className="services">
          <div className="service-container">
            <div className="card">
              <div className="card-head">
                <img src={TrustIcon} alt="icon" />
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
                <img src={CommunicationIcon} alt="icon" />
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
                <img src={SearchIcon} alt="icon" />
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
                <img src={StoreIcon} alt="icon" />
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
                <img src={ToolsIcon} alt="icon" />
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
                <img src={AdvanceSearchIcon} alt="icon" />
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
                <img src={GraphIcon} alt="icon" />
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
          </div>
        </section>

        {/* collaborations section  */}
        <section className="collaborators">
          <h2 className="heading">In Collaboration With</h2>
          <div className="companies">
            <div>
              <img src={Gettys} alt="gettys-logo" />
            </div>
            <div>
              <img src={IAInteriors} alt="ia-interiors" />
            </div>
            <div>
              <img src={Gensler} alt="gensler-logo" />
            </div>
            <div>
              <img src={Stantec} alt="stantec-logo" />
            </div>
            <div>
              <img src={OKK} alt="okk-logo" />
            </div>
            <div>
              <img src={HPA} alt="hpa-logo" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
