import React from "react";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import { AiOutlineArrowRight } from "react-icons/ai";
import { CgOptions } from "react-icons/cg";
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
        <div className="card">

        </div>
        <div className="card">

        </div>
        <div className="card">

        </div>
        <div className="card">

        </div>
        <div className="card">

        </div>
        <div className="card">

        </div>
      </div>
      <Footer />
    </>
  );
};

export default Listing;
