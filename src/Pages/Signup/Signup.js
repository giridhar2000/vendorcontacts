import React from 'react'
import NavbarHeader from '../Header/NavbarHeader'
import loginbg from "../../Assets/img/loginbg.png";
import "../Signup/Signup.css"

export default function Signup() {
  return (
    <div className='signup'>
      <NavbarHeader />
      <img src={loginbg} alt="login" className="loginimg" />
      <div className="loginContainer lg-page" style={{ justifyContent: "space-evenly" }}>
        <div className="loginText">
          <h1 style={{ margin: 0 }}>Let's get started!</h1>
          <span>
            Free membership is open to professionals in the architecture and design industry.
          </span>
        </div>
        <div className="Loginform">
          <p style={{ color: "#6F6F6F" }}>Select your profession</p>
          <div>
            <div className="button">
              <input type="radio" id="Architect" name="signupBtn" />
              <label className="btn btn-default" for="Architect">Architect</label>
            </div>
            <div className="button">
              <input type="radio" id="Vendor" name="signupBtn" />
              <label className="btn btn-default" for="Vendor">Vendor</label>
            </div>
          </div>
          <hr style={{ maxWidth: "100%", margin: "0", marginTop: "2vh" }} />
          <button className="loginbtn">Next</button>
        </div>
      </div>
    </div>
  )
}
