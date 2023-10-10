import React, { useState } from "react";
import "../Login/Login.css";
import loginbg from "../../Assets/img/loginbg.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import supabase from "../../utils/supabase.config.js";
import { useContext } from "react";
import UserContext from "../../contexts/authContext";
import { Spin } from "antd";
import { getUserById } from "../../utils/profile_helper";
import HubspotForm from "react-hubspot-form";
import { v4 as uuidv4 } from "uuid";
import Icon from "../../Assets/images/logo-icon.svg";
import pdf from "../../Assets/TNC.pdf";

export default function Login() {
  const [signup, setSignUp] = useState(true);
  const [ip, setIp] = useState("password");
  const [cip, setCIp] = useState("password");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState(null);
  const [next, setNext] = useState(false);
  const [isAuth, setIsAuth] = useContext(UserContext);
  const navigate = useNavigate();

  // States for sign ups................
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");

  <HubspotForm
    portalId="22384747"
    formId="556eed30-2d51-4224-86f8-ffa83f0bde15"
    onSubmit={() => console.log("Submit!")}
    onReady={(form) => console.log("Form ready!", form)}
    loading={<div>Loading...</div>}
  />;

  const back = () => {
    navigate("/");
  };

  const handleSubmit = async () => {
    var _hsq = (window._hsq = window._hsq || []);
    // _hsq.push(['setPath', 'http://localhost:3000/login']);
    //   _hsq.push(['trackPageView']);
    //   _hsq.push(["identify",{
    //     email: email
    // }]);
    _hsq.push([
      "trackCustomBehavioralEvent",
      {
        name: "Signup",
        properties: {
          email: email,
        },
      },
    ]);
    console.log(_hsq);
    // Perform form validation
    if (!firstName || !lastName || !email || !password) {
      toast("Please fill out all fields", { type: "error" });
      return;
    }
    if (password !== cPassword) {
      toast("Password does not matching", { type: "error" });
      return;
    }
    try {
      setLoading(true);
      let { data: user, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: firstName + " " + lastName,
            type: userType || "architect",
          },
        },
      });

      if (error) {
        setLoading(false);
        toast(error.message, { type: "error" });
        return;
      }
      toast("Profile created", { type: "success" });
      let profile = await getUserById(user?.id);
      if (profile.status === false) {
        localStorage.setItem("auth", JSON.stringify(true));
        setIsAuth(true);
        toast(
          <p>
            Welcome {profile.display_name} <br />
            Please update your profile !!
          </p>,
          { type: "warning" }
        );
        console.log(profile?.status);
        navigate("/edit");
      }

      // localStorage.setItem("auth", JSON.stringify(user));
      // setIsAuth(true);
      else if (profile?.type === "vendor") {
        localStorage.setItem("auth", JSON.stringify(true));
        setIsAuth(true);
        toast(<p>Welcome {profile.display_name}</p>, { type: "success" });
        navigate("/profile");
      } else {
        localStorage.setItem("auth", JSON.stringify(true));
        setIsAuth(true);
        toast(<p>Welcome {profile.display_name}</p>, { type: "success" });
        navigate("/listing");
      }
    } catch (error) {
      setLoading(false);
      toast(error.message, { type: "error" });
    }
  };

  async function handleLogin() {
    var _hsq = (window._hsq = window._hsq || []);
    _hsq.push(["setPath", "http://localhost:3000/login"]);
    _hsq.push(["trackPageView"]);
    _hsq.push([
      "identify",
      {
        email: email,
      },
    ]);
    console.log(_hsq);

    if (!email || !password) {
      toast("Please fill out all fields", { type: "error" });
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        setLoading(false);
        toast(error.message, { type: "error" });
        return;
      }
      let profile = await getUserById(data?.user?.id);
      console.log("profile", profile);
      if (profile.status === false) {
        localStorage.setItem("auth", JSON.stringify(data));
        toast(
          <p>
            Welcome {profile.display_name} <br />
            Please update your profile !!
          </p>,
          { type: "warning" }
        );
        console.log(profile?.status);
        localStorage.setItem("auth", JSON.stringify(true));
        setIsAuth(true);
        navigate("/edit");
      } else if (profile?.type === "vendor") {
        // localStorage.setItem("auth", JSON.stringify(data));

        toast(`Welcome ${profile.display_name}`, { type: "success" });
        // Redirect to another page
        localStorage.setItem("auth", JSON.stringify(true));
        setIsAuth(true);
        navigate("/profile");
      } else if (profile?.type === "architect") {
        // localStorage.setItem("auth", JSON.stringify(data));
        localStorage.setItem("auth", JSON.stringify(true));
        setIsAuth(true);
        toast(`Welcome ${profile.display_name}`, { type: "success" });
        // Redirect to another page
        navigate("/listing");
      } else {
        toast("No user type found", { type: "error" });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast(error.message, { type: "error" });
    }
  }

  return (
    <div className="login">
      <div className="navbarheader">
        <div className="backbtn" onClick={back}>
          <p>&larr;</p>
        </div>
        <div className="headerlogo">
          <img src={Icon} alt="" className="logoIcon" />
          <h1 className="logo-text" style={{ fontSize: "x-large" }}>
            VENDORCONTACTS
          </h1>
        </div>
      </div>
      <div className="loginContainer lg-page">
        {signup ? (
          <>
            <div className="loginText">
              <h1>Welcome Back!</h1>
              <span>
                Please provide your login details.
              </span>
            </div>
            <div className="Loginform">
              <div className="emailip">
                <input
                  placeholder="Buisness Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="passip">
                <input
                  placeholder="Password"
                  type={ip}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {ip === "password" ? (
                  <svg
                    onClick={() => setIp("text")}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12"
                        stroke="#000000"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                      <path
                        d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12"
                        stroke="#000000"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="#000000"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></circle>{" "}
                    </g>
                  </svg>
                ) : (
                  <svg
                    onClick={() => setIp("password")}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M2 2L22 22"
                        stroke="#000000"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                      <path
                        d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335"
                        stroke="#000000"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                      <path
                        d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818"
                        stroke="#000000"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                )}
              </div>
              <p className="forgotpass">Forgot Password?</p>
              <button
                className="loginbtn"
                disabled={loading}
                onClick={handleLogin}
              >
                {loading ? (
                  <>
                    <Spin style={{ marginRight: ".5rem" }} /> Logging in...
                  </>
                ) : (
                  "Log in"
                )}
              </button>
              <p className="p">
                Don't have an account?{" "}
                <span className="loginsignup" onClick={() => setSignUp(false)}>
                  <b>Sign Up</b>
                </span>
              </p>
            </div>
          </>
        ) : (
          <>
            {userType && next ? (
              <>
                {" "}
                <div className="loginText">
                  <h1>Let's get started!</h1>
                  <span>
                    Free membership is open to professionals in the architecture
                    and design industry.
                  </span>
                </div>
                <div className="Loginform">
                  <div className="names">
                    <div className="nameip">
                      <input
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="nameip">
                      <input
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="emailip">
                    <input
                      placeholder="Buisness Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="passip">
                    <input
                      placeholder="Password"
                      type={ip}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    {ip === "password" ? (
                      <svg
                        onClick={() => setIp("text")}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <path
                            d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12"
                            stroke="#000000"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>{" "}
                          <path
                            d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12"
                            stroke="#000000"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>{" "}
                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            stroke="#000000"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></circle>{" "}
                        </g>
                      </svg>
                    ) : (
                      <svg
                        onClick={() => setIp("password")}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <path
                            d="M2 2L22 22"
                            stroke="#000000"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>{" "}
                          <path
                            d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335"
                            stroke="#000000"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>{" "}
                          <path
                            d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818"
                            stroke="#000000"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>{" "}
                        </g>
                      </svg>
                    )}
                  </div>
                  <div className="passip">
                    <input
                      placeholder="Confirm password"
                      type={cip}
                      value={cPassword}
                      onChange={(e) => setCPassword(e.target.value)}
                    />

                    {cip === "password" ? (
                      <svg
                        onClick={() => setCIp("text")}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <path
                            d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12"
                            stroke="#000000"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>{" "}
                          <path
                            d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12"
                            stroke="#000000"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>{" "}
                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            stroke="#000000"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></circle>{" "}
                        </g>
                      </svg>
                    ) : (
                      <svg
                        onClick={() => setCIp("password")}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <path
                            d="M2 2L22 22"
                            stroke="#000000"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>{" "}
                          <path
                            d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335"
                            stroke="#000000"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>{" "}
                          <path
                            d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818"
                            stroke="#000000"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>{" "}
                        </g>
                      </svg>
                    )}
                  </div>
                  <p className="forgotpass">
                    By Clicking "Sign Up", You Agree to Our{" "}
                    <a href={pdf} target="_blank">
                      Terms of Use and Privacy Policy
                    </a>
                  </p>
                  <button
                    className="loginbtn"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spin style={{ marginRight: ".5rem" }} /> Signing up...
                      </>
                    ) : (
                      "Sign up"
                    )}
                  </button>
                  <p className="p">
                    Already have an account?{" "}
                    <span
                      className="loginsignup"
                      onClick={() => {
                        setSignUp(true);
                      }}
                    >
                      <b>Login</b>
                    </span>
                  </p>
                </div>
              </>
            ) : (
              <div className="signup">
                <div
                  className="loginContainer lg-page"
                  style={{ justifyContent: "space-evenly" }}
                >
                  <div className="loginText">
                    <h1 style={{ margin: 0 }}>Let's get started!</h1>
                    <span>
                      Free membership is open to professionals in the
                      architecture and design industry.
                    </span>
                  </div>
                  <div className="Loginform">
                    <p style={{ color: "#6F6F6F" }}>Select your profession</p>
                    <div className="buttons-select">
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
                    <hr
                      style={{
                        maxWidth: "100%",
                        margin: "0",
                        marginTop: "2vh",
                      }}
                    />
                    <button
                      className="loginbtn"
                      onClick={() => {
                        if (!userType) {
                          toast("Select your profession first!", {
                            type: "warning",
                          });
                        } else {
                          setNext(true);
                        }
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <img src={loginbg} alt="login" className="loginimg" />
    </div>
  );
}
