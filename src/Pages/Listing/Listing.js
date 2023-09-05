import React from "react";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import bg1 from "../../Assets/img/img1.jpg";
import { CgOptions } from "react-icons/cg";
import { BsFillArrowUpRightSquareFill } from "react-icons/bs";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import "./Listing.css";

const options = [
  'Recent', 'Popular', 'Oldest'
];
const defaultOption = options[0];

const Listing = () => {
  return (
    <>
      <Header />
      <div className="filter">
        <button>
        <CgOptions /> Filter
        </button>
        <Dropdown options={options} value={defaultOption} placeholder="Recent" />
      </div>
      <hr/>
      <div className="cardcontainer">
        <div className="listingcard">
          <img src={bg1} alt="bg"/>
          <div className="listingname">
          <p>Gensler</p>
          <p>Los Angeles</p>
          <p>
              Gensler is a global architecture, design, and planning firm with
              50 locations across Asia, Europe, Australia, the Middle East, and
              the Americas. Founded in 1965, the firm serves more than 3,500
              active clients.
          </p>
          </div>
          <BsFillArrowUpRightSquareFill style={{backgroundColor:'black', color:'#D9E167', margin:'10px 10px 0 0', width:'6.15%', height:'1.7em', borderRadius:'3.5px'}}/>
        </div>
        <div className="listingcard">
          <img src={bg1} alt="bg"/>
          <div className="listingname">
          <p>Gensler</p>
          <p>Los Angeles</p>
          <p>
              Gensler is a global architecture, design, and planning firm with
              50 locations across Asia, Europe, Australia, the Middle East, and
              the Americas. Founded in 1965, the firm serves more than 3,500
              active clients.
          </p>
          </div>
          <BsFillArrowUpRightSquareFill style={{backgroundColor:'black', color:'#D9E167', margin:'10px 10px 0 0', width:'6.15%', height:'1.7em', borderRadius:'3.5px'}}/>
        </div>
        <div className="listingcard">
          <img src={bg1} alt="bg"/>
          <div className="listingname">
          <p>Gensler</p>
          <p>Los Angeles</p>
          <p>
              Gensler is a global architecture, design, and planning firm with
              50 locations across Asia, Europe, Australia, the Middle East, and
              the Americas. Founded in 1965, the firm serves more than 3,500
              active clients.
          </p>
          </div>
          <BsFillArrowUpRightSquareFill style={{backgroundColor:'black', color:'#D9E167', margin:'10px 10px 0 0', width:'6.15%', height:'1.7em', borderRadius:'3.5px'}}/>
        </div>
        <div className="listingcard">
          <img src={bg1} alt="bg"/>
          <div className="listingname">
          <p>Gensler</p>
          <p>Los Angeles</p>
          <p>
              Gensler is a global architecture, design, and planning firm with
              50 locations across Asia, Europe, Australia, the Middle East, and
              the Americas. Founded in 1965, the firm serves more than 3,500
              active clients.
          </p>
          </div>
          <BsFillArrowUpRightSquareFill style={{backgroundColor:'black', color:'#D9E167', margin:'10px 10px 0 0', width:'6.15%', height:'1.7em', borderRadius:'3.5px'}}/>
        </div>
        <div className="listingcard">
          <img src={bg1} alt="bg"/>
          <div className="listingname">
          <p>Gensler</p>
          <p>Los Angeles</p>
          <p>
              Gensler is a global architecture, design, and planning firm with
              50 locations across Asia, Europe, Australia, the Middle East, and
              the Americas. Founded in 1965, the firm serves more than 3,500
              active clients.
          </p>
          </div>
          <BsFillArrowUpRightSquareFill style={{backgroundColor:'black', color:'#D9E167', margin:'10px 10px 0 0', width:'6.15%', height:'1.7em', borderRadius:'3.5px'}}/>
        </div>
        <div className="listingcard">
          <img src={bg1} alt="bg"/>
          <div className="listingname">
          <p>Gensler</p>
          <p>Los Angeles</p>
          <p>
              Gensler is a global architecture, design, and planning firm with
              50 locations across Asia, Europe, Australia, the Middle East, and
              the Americas. Founded in 1965, the firm serves more than 3,500
              active clients.
          </p>
          </div>
          <BsFillArrowUpRightSquareFill style={{backgroundColor:'black', color:'#D9E167', margin:'10px 10px 0 0', width:'6.15%', height:'1.7em', borderRadius:'3.5px'}}/>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Listing;
