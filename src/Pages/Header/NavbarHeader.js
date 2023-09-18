import React from 'react'
import Icon from "../../Assets/images/DESIGNPORT-01.png";
import "../Header/NavbarHeader.css"
import { useNavigate } from 'react-router-dom';

export default function NavbarHeader() {
  const navigate = useNavigate();
  const back = () => {
    navigate("/")
  }
  return (
    <div className='navbarheader'>
      <div className='backbtn' onClick={back}>
        <p>&larr;</p>
      </div>
      <div className="headerlogo">
        <img src={Icon} alt="" className="logoIcon" style={{width: "100%"}}/>
        {/* <h1 className="logo-text" style={{fontSize: "x-large"}}>VENDORCONTACTS</h1> */}
      </div>
    </div>
  )
}
