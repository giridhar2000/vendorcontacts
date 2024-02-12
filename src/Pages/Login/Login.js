import React, { useEffect, useState } from "react";
import "../Login/Login.css";
import loginbg from "../../Assets/img/loginbg.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import supabase from "../../utils/supabase.config.js";
import { useContext } from "react";
import UserContext from "../../contexts/authContext";
import { Button, Divider, Input, Select, Space, Spin } from "antd";
import { getUserById } from "../../utils/profile_helper";
import $ from "jquery";
// import HubspotForm from "react-hubspot-form";
// import { v4 as uuidv4 } from "uuid";
import Icon from "../../Assets/images/vc.svg";
import pdf from "../../Assets/TNC.pdf";
// import abstract1 from "../../Assets/images/abstract1.svg";
// import abstract2 from "../../Assets/images/abstract2.svg";
// import abstract3 from "../../Assets/images/abstract3.svg";
import { PlusOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "react-query";
import { getCompanies, insertCompany } from "../../utils/company_helper.js";

export default function Login() {
  const queryClient = useQueryClient();
  const [signup, setSignUp] = useState(true);
  const [ip, setIp] = useState("password");
  const [cip, setCIp] = useState("password");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState(null);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [next, setNext] = useState(false);
  const [isAuth, setIsAuth] = useContext(UserContext);
  const navigate = useNavigate();

  // States for sign ups................
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [company, setCompany] = useState("");

  const { data: companies, isLoading } = useQuery(["companies"], getCompanies);

  const back = () => {
    if (next) {
      setNext(false);
      setUserType(null);
    } else if (!signup) setSignUp(true);
    else navigate(-1);
  };

  const handleSubmit = async () => {
    var _hsq = (window._hsq = window._hsq || []);
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
    if (
      !/^([\w.-]+)@(\[(\d{1,3}\.){3}|(?!hotmail|gmail|yahoo)(([a-zA-Z\d-]+\.)+))([a-zA-Z]{2,4}|\d{1,3})(\]?)$/.test(
        email
      )
    ) {
      toast("Please use your company mail", { type: "error" });
      return;
    }

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
        throw new Error(error);
      }
      toast("Profile created", { type: "success" });
      let profile = await getUserById(user?.id);
      localStorage.setItem("auth", JSON.stringify(true));
      setIsAuth(true);
      toast(
        <p>
          Welcome {firstName + " " + lastName} <br />
          Please update your profile !!
        </p>,
        { type: "warning" }
      );
      console.log(profile?.status);
      navigate("/edit");
    } catch (error) {
      setLoading(false);
      toast(error.message, { type: "error" });
    }

    var data = {
      service_id: "service_cpytsjm",
      template_id: "template_p7qh9y5",
      user_id: "F3rrwZwcav-0a-BOW",
      template_params: {
        name: firstName,
        companyName: 'VendorContacts',
        email: email,
      },
    };

    $.ajax("https://api.emailjs.com/api/v1.0/email/send", {
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
    })
      .done(function () {
        alert("Your mail is sent!");
      })
      .fail(function (error) {
        alert("Oops... " + JSON.stringify(error));
      });
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
        throw new Error(error);
      }
      // console.log(data?.user?.id);
      let profile = await getUserById(data?.user?.id);
      // console.log("profile", profile);
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

  async function addNewCompany() {
    if (!newCompanyName) {
      toast("Company Name Required", { type: "warning" });
      return;
    }
    try {
      let isInserted = await insertCompany(newCompanyName);
      if (isInserted) toast("Company added", { type: "success" });
      setNewCompanyName("");
      queryClient.invalidateQueries("companies");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="login">
      <div className="navbarheader">
        <div className="backbtn" onClick={back}>
          <p>&larr;</p>
        </div>

        <div className="loginheader headerlogo" onClick={() => navigate("/")}>
          <img
            src={Icon}
            alt=""
            className="logoIcon"
            style={{ width: "100%" }}
          />
        </div>
      </div>
      <div className="loginContainer lg-page">
        {signup ? (
          <>
            <div className="loginText">
              <h1>Welcome Back!</h1>
              <span>
                Please provide your login details to access <br /> the content.
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

            <img src={loginbg} alt="login" className="loginimg" id="loginimg" />
          </>
        ) : (
          <>
            {userType && next ? (
              <>
                {" "}
                <div className="loginText lgs">
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
                    <Select
                      style={{
                        width: 700,
                      }}
                      onChange={(data) => setCompany(data)}
                      placeholder="Select Company"
                      dropdownRender={(menu) => (
                        <>
                          {menu}
                          <Divider
                            style={{
                              margin: "8px 0",
                            }}
                          />
                          <Space
                            style={{
                              padding: "0 8px 4px",
                            }}
                          >
                            <Input
                              placeholder="Please enter company name"
                              onChange={(e) => {
                                setNewCompanyName(e.target.value);
                              }}
                              onKeyDown={(e) => e.stopPropagation()}
                            />
                            <Button
                              type="text"
                              icon={<PlusOutlined />}
                              onClick={addNewCompany}
                            >
                              Add New Company
                            </Button>
                          </Space>
                        </>
                      )}
                      options={companies.map((item) => ({
                        label: item,
                        value: item,
                      }))}
                    />

                    {
                      // <input
                      //   placeholder="Company"
                      //   value={company}
                      //   onChange={(e) => setCompany(e.target.value)}
                      // />
                    }
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
                        setUserType(null);
                        setNext(false);
                      }}
                    >
                      <b>Login</b>
                    </span>
                  </p>
                </div>
                <div className="y-img">
                  <img
                    src={loginbg}
                    alt="login"
                    className="loginimg singup-img"
                  />
                </div>
              </>
            ) : (
              <div className="signup">
                <div className="loginContainer lg-page">
                  <div className="loginText lgs">
                    <h1 style={{ margin: 0 }}>Let's get started!</h1>
                    <span>
                      Free membership is open to professionals in the
                      architecture and design industry.
                    </span>
                  </div>
                  <div className="Loginform mobLofinForm">
                    <p style={{ color: "#6F6F6F" }}>Select your profession</p>
                    <div className="buttons-select">
                      <div
                        className="button"
                        onClick={() => {
                          setNext(true);
                        }}
                      >
                        <input
                          type="radio"
                          id="Designer"
                          name="signupBtn"
                          value="architect"
                          onChange={(e) => setUserType(e.target.value)}
                        />
                        <label className="btn btn-default" for="Designer">
                          Designer
                        </label>
                      </div>
                      <div
                        className="button"
                        onClick={() => {
                          setNext(true);
                        }}
                      >
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
                  </div>
                </div>
                <img src={loginbg} alt="login" className="loginimg" />
              </div>
            )}
          </>
        )}
      </div>
      <div className="imgi">
        <img src={loginbg} alt="login" className="loginimg" id="loginimg" />
      </div>
    </div>
  );
}
