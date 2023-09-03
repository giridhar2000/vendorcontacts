import React from "react";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import bg1 from "../../Assets/img/img1.jpg";
import logo from "../../Assets/img/gensler_logo.png";
import { AiOutlineArrowRight } from "react-icons/ai";
import "./Profile.css";
import PdfCard from "../../Components/PdfCard/PdfCard";
const Profile = () => {
  return (
    <>
      <Header />
      <div className="cover-pic">
        <img src={bg1} alt="bg" />
        <div className="profile-pic">
          <img src={logo} alt="profile" />
        </div>
      </div>
      <div className="profile-body">
        <div className="profile-info">
          <div className="profile-name">
            <p>Gensler</p>
            <p>Los angels</p>
            <p>
              Visit Rep's profile{" "}
              <button>
                <AiOutlineArrowRight />
              </button>
            </p>
          </div>
          <div className="profile-about">
            <p>
              Gensler is a global architecture, design, and planning firm with
              50 locations across Asia, Europe, Australia, the Middle East, and
              the Americas. Founded in 1965, the firm serves more than 3,500
              active clients. Aside from continuously being recognized on
              top-ranking reports, their team receives many industry accolades
              for stellar design work each year.
            </p>
          </div>
        </div>
        <div className="profile-box">
          <div className="line"></div>
          <p>
            Do not follow where the path may lead. Go instead where there is no
            path and leave a trail
          </p>
        </div>
        <div className="profile-desc">
          <h1>We Use Design to Create a Better World</h1>
          <p>
            Gensler is a global architecture, design, and planning firm with 53
            locations and 7,000 professionals networked across the Americas,
            Europe, Greater China, Asia Pacific, and the Middle East. Founded in
            1965, the firm works globally with more than 4,000 clients across
            more than 29 practice areas spanning the work, lifestyle, community,
            and health sectors.<br/> <br/>  We are guided by our mission to create a better
            world through the power of design and believe the source of our
            strength is our people. By leveraging our diversity of ideas, our
            research and innovation, our shared values, and our One-Firm Firm
            culture, we are moving forward together into a new era defined by
            design. By empowering our people and working seamlessly as an
            interconnected firm, we’re able to make the greatest impact for our
            communities as we continue to tackle the world’s challenges.
          </p>
        </div>
        <div className="profile-downloads">
          <p>Downloads</p>
          <hr/>
          <div className="pdf-cards">
          <PdfCard/>
          <PdfCard/>
          <PdfCard/>
          <PdfCard/>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Profile;
