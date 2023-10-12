import React, { useEffect, useState } from "react";
import "./Home.css";
import IAInteriors from "../../Assets/images/ia_interior_architects.svg";
import Gensler from "../../Assets/images/Gensler_logo.svg";
import Stantec from "../../Assets/images/stantec.svg";
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
import ribbon2 from "../../Assets/images/svg2.svg";
import { GiPartyPopper } from "react-icons/gi";
import ribbon1 from "../../Assets/images/svg1.svg";
import ribbon3 from "../../Assets/images/svg3.svg";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [checkbox, setCheckbox] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [userType, setUserType] = useState(null);

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
                  get you on the list :&#41;
                </p>

                <form>
                  <div>
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
                      <a href={pdf} target="_blank" rel="noreferrer">
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
                      <a href={pdf} target="_blank" rel="noreferrer">
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
          <svg width="459" height="464" viewBox="0 0 459 464" fill="none" xmlns="http://www.w3.org/2000/svg" className="bannerimg">
<g filter="url(#filter0_i_904_282)">
<path d="M359.901 305.173L393.19 155.668C394.849 148.567 392.103 142.042 387.274 138.021L380.458 132.36L159.369 398.561L166.185 404.222C171.025 408.231 177.942 409.732 184.618 406.798L325.471 346.628C342.832 338.998 355.588 323.64 359.901 305.173Z" fill="url(#paint0_linear_904_282)"/>
</g>
<g filter="url(#filter1_i_904_282)">
<path d="M188.086 232.528C192.399 214.061 205.155 198.703 222.516 191.073L362.006 129.771C375.374 123.896 389.712 135.805 386.391 150.024L351.739 298.397C347.426 316.864 334.67 332.222 317.309 339.852L177.819 401.154C164.451 407.029 150.113 395.121 153.434 380.901L188.086 232.528Z" fill="url(#paint1_radial_904_282)"/>
</g>
<g filter="url(#filter2_f_904_282)">
<path d="M351.74 298.395L386.392 150.023C387.904 143.55 385.756 137.556 381.707 133.501C386.087 142.215 385.468 143.805 384.573 149.48L349.455 297.046C348.315 301.132 345.06 312.107 336.877 321.959C328.695 331.811 318.974 336.46 315.456 337.982C270.721 357.601 180.786 398.148 176.374 399.952C171.962 401.756 165.705 401.382 163.128 400.969C167.476 403.047 172.719 403.394 177.82 401.152L317.31 339.851C334.671 332.221 347.427 316.862 351.74 298.395Z" fill="url(#paint2_linear_904_282)"/>
</g>
<g filter="url(#filter3_bi_904_282)">
<path d="M143.154 195.211C147.467 176.744 160.223 161.386 177.584 153.756L317.074 92.454C330.442 86.579 344.78 98.4873 341.459 112.707L306.807 261.08C302.494 279.547 289.738 294.905 272.377 302.535L132.887 363.837C119.519 369.712 105.181 357.803 108.502 343.584L143.154 195.211Z" fill="#E4E8F3" fill-opacity="0.4"/>
</g>
<g filter="url(#filter4_bi_904_282)">
<path d="M114.436 361.244L121.251 366.905C126.091 370.914 133.009 372.415 139.685 369.481L280.538 309.311C297.899 301.681 310.655 286.323 314.967 267.856L348.257 118.351C349.915 111.25 347.17 104.725 342.34 100.704L335.554 95.0676C340.376 99.0898 343.116 105.61 341.459 112.705L306.806 261.078C302.493 279.545 289.738 294.903 272.376 302.533L132.887 363.835C126.203 366.772 119.276 365.264 114.436 361.244Z" fill="#E4E8F3" fill-opacity="0.4"/>
</g>
<g filter="url(#filter5_f_904_282)">
<path d="M306.808 261.078L341.46 112.706C342.972 106.233 340.825 100.239 336.776 96.1836C341.156 104.898 340.536 106.488 339.641 112.163L304.523 259.729C303.384 263.815 300.128 274.789 291.946 284.642C283.763 294.494 274.043 299.143 270.524 300.665C225.79 320.284 135.855 360.83 131.443 362.635C127.031 364.439 120.773 364.065 118.196 363.652C122.545 365.73 127.787 366.077 132.888 363.835L272.378 302.534C289.739 294.904 302.495 279.545 306.808 261.078Z" fill="url(#paint3_linear_904_282)"/>
</g>
<g filter="url(#filter6_bi_904_282)">
<path d="M98.2246 157.893C102.537 139.426 115.293 124.067 132.655 116.438L272.144 55.1359C285.513 49.2609 299.851 61.1691 296.53 75.3888L261.877 223.762C257.564 242.228 244.809 257.587 227.447 265.217L87.9576 326.519C74.5893 332.394 60.2512 320.485 63.5722 306.266L98.2246 157.893Z" fill="#E4E8F3" fill-opacity="0.4"/>
</g>
<g filter="url(#filter7_bi_904_282)">
<path d="M69.5059 323.926L76.3218 329.587C81.1614 333.596 88.0791 335.097 94.755 332.163L235.608 271.993C252.969 264.363 265.725 249.005 270.038 230.538L303.327 81.0331C304.985 73.932 302.24 67.4074 297.411 63.3861L290.624 57.7498C295.446 61.7719 298.186 68.2918 296.529 75.3871L261.877 223.76C257.564 242.227 244.808 257.585 227.447 265.215L87.957 326.517C81.2729 329.454 74.3463 327.946 69.5059 323.926Z" fill="#E4E8F3" fill-opacity="0.4"/>
</g>
<g filter="url(#filter8_f_904_282)">
<path d="M261.876 223.763L296.529 75.3897C298.04 68.9171 295.893 62.9234 291.844 58.8678C296.224 67.5819 295.605 69.1725 294.71 74.8473L259.591 222.413C258.452 226.499 255.197 237.474 247.014 247.326C238.832 257.178 229.111 261.827 225.593 263.349C180.858 282.968 90.923 323.515 86.5111 325.319C82.0992 327.123 75.8417 326.749 73.2644 326.336C77.613 328.414 82.8554 328.761 87.9567 326.519L227.446 265.218C244.808 257.588 257.563 242.229 261.876 223.763Z" fill="url(#paint4_linear_904_282)"/>
</g>
<g filter="url(#filter9_b_904_282)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M56.1401 160.804L55.8625 158.827L55.8144 156.719L56.5763 113.172L56.7473 111.267L57.1252 109.373L57.6946 107.507L58.4406 105.689L59.3491 103.936L60.4063 102.267L61.5991 100.701L62.9148 99.2559L64.3407 97.9525L65.8648 96.8107L67.475 95.8511L69.1593 95.0954L108.418 83.6824L108.419 83.682L110.346 83.3444L112.203 83.2744L113.971 83.4649L115.63 83.9089L117.161 84.5991L118.543 85.5282L119.753 86.6888L120.769 88.072L121.568 89.6695L122.128 91.471L122.425 93.4663L126.892 139.182L127.051 141.418L126.784 143.904L126.065 146.423L125.224 148.738L124.132 150.951L122.81 153.032L121.278 154.951L119.56 156.677L117.678 158.182L115.655 159.438L113.514 160.418L111.28 161.098L68.8013 169.697L66.9273 169.974L65.1493 169.94L63.4832 169.614L61.944 169.018L60.5463 168.169L59.3036 167.088L58.2291 165.794L57.3355 164.304L56.6352 162.635L56.1401 160.804ZM108.418 83.6824L69.1593 95.0954L106.44 84.2945L108.418 83.6824Z" fill="url(#paint5_linear_904_282)" fill-opacity="0.5"/>
<path d="M126.242 139.237L126.396 141.407M126.242 139.237L126.242 139.237L126.242 139.237Z" stroke="url(#paint6_linear_904_282)" stroke-width="1.30418"/>
</g>
<path fill-rule="evenodd" clip-rule="evenodd" d="M53.7856 165.389L55.6596 165.112L101.011 154.714L103.245 154.035L105.385 153.054L107.409 151.798L109.291 150.293L111.009 148.567L112.54 146.649L113.863 144.568L114.954 142.354L115.795 140.039L116.366 137.654L116.647 135.231L116.623 132.8L112.943 83.9132L112.647 81.9181L112.087 80.1165L111.288 78.5191L110.272 77.1358L111.66 78.3977L112.865 79.5536L114.192 80.7589L112.866 79.5542L112.865 79.5536L111.66 78.3977L110.272 77.1358L109.062 75.9753L111.658 78.3965L111.659 78.3971L111.66 78.3977L112.865 79.5536L114.192 80.7589L116.663 83.0628L119.073 85.3109L120.267 86.4546L121.275 87.8088L122.074 89.3643L122.643 91.1111L122.958 93.0384L127.177 140.005L127.233 142.329L126.992 144.641L126.472 146.911L125.689 149.111L124.661 151.21L123.409 153.179L121.953 154.991L120.312 156.617L118.51 158.03L116.567 159.204L114.506 160.114L112.349 160.736L68.3223 170.159L66.4922 170.404L64.7499 170.352L60.0355 168.819L58.5108 168.228L55.3541 166.994L52.1193 165.73L48.8055 164.435L50.3415 165.03L52.0076 165.355L53.7856 165.389Z" fill="url(#paint7_linear_904_282)"/>
<g filter="url(#filter10_b_904_282)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M42.9854 156.173L42.7078 154.196L42.6597 152.087L44.1002 107.924L44.2712 106.019L44.6491 104.125L45.2185 102.259L45.9646 100.441L46.873 98.6879L47.9302 97.0188L49.1231 95.4524L50.4387 94.0077L51.8647 92.7044L53.3887 91.5625L54.9989 90.603L56.6832 89.8473L98.9243 74.082L98.9254 74.0816L100.852 73.744L102.709 73.674L104.477 73.8645L106.136 74.3084L107.667 74.9987L109.049 75.9278L110.259 77.0883L111.275 78.4715L112.074 80.0691L112.634 81.8706L112.93 83.8659L116.61 132.751L116.768 134.988L116.501 137.473L115.782 139.992L114.941 142.307L113.85 144.52L112.527 146.601L110.996 148.52L109.278 150.246L107.396 151.751L105.373 153.007L103.232 153.987L100.998 154.667L55.6466 165.065L53.7726 165.342L51.9946 165.308L50.3285 164.983L48.7893 164.386L47.3916 163.538L46.1489 162.457L45.0744 161.162L44.1808 159.672L43.4805 158.003L42.9854 156.173ZM98.9243 74.082L56.6832 89.8473L96.9463 74.694L98.9243 74.082Z" fill="url(#paint8_linear_904_282)" fill-opacity="0.5"/>
<path d="M115.959 132.797L115.959 132.797L115.959 132.798L115.959 132.8L116.114 134.976L115.859 137.348L115.161 139.791L114.341 142.05L113.28 144.2L111.996 146.222L110.509 148.085L108.842 149.76L107.019 151.217L105.064 152.431L103 153.376L100.83 154.036L55.5258 164.424L53.7309 164.689L52.0638 164.657L50.5102 164.354L49.0786 163.799L47.7775 163.009L46.6168 162L45.6081 160.784L44.7641 159.377L44.0986 157.791L43.6255 156.042L43.3589 154.143L43.3121 152.091L44.7514 107.964L44.9175 106.112L45.2823 104.284L45.8333 102.479L46.5568 100.715L47.439 99.0129L48.4661 97.3915L49.6245 95.8702L50.9007 94.4689L52.2811 93.2072L53.7522 92.1051L55.3003 91.1825L56.9309 90.4509L99.0972 74.7135L100.921 74.3939L102.686 74.3274L104.357 74.5075L105.917 74.9247L107.349 75.5705L108.638 76.4374L109.767 77.5199L110.716 78.813L111.467 80.3134L111.996 82.0161L112.282 83.9383L115.959 132.796L115.959 132.797Z" stroke="url(#paint9_linear_904_282)" stroke-width="1.30418"/>
</g>
<g filter="url(#filter11_b_904_282)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M42.9854 156.173L42.7078 154.196L42.6597 152.087L44.1002 107.924L44.2712 106.019L44.6491 104.125L45.2185 102.259L45.9646 100.441L46.873 98.6879L47.9302 97.0188L49.1231 95.4524L50.4387 94.0077L51.8647 92.7044L53.3887 91.5625L54.9989 90.603L56.6832 89.8473L98.9243 74.082L98.9254 74.0816L100.852 73.744L102.709 73.674L104.477 73.8645L106.136 74.3084L107.667 74.9987L109.049 75.9278L110.259 77.0883L111.275 78.4715L112.074 80.0691L112.634 81.8706L112.93 83.8659L116.61 132.751L116.768 134.988L116.501 137.473L115.782 139.992L114.941 142.307L113.85 144.52L112.527 146.601L110.996 148.52L109.278 150.246L107.396 151.751L105.373 153.007L103.232 153.987L100.998 154.667L55.6466 165.065L53.7726 165.342L51.9946 165.308L50.3285 164.983L48.7893 164.386L47.3916 163.538L46.1489 162.457L45.0744 161.162L44.1808 159.672L43.4805 158.003L42.9854 156.173ZM98.9243 74.082L56.6832 89.8473L96.9463 74.694L98.9243 74.082Z" fill="url(#paint10_linear_904_282)" fill-opacity="0.2"/>
<path d="M115.959 132.797L115.959 132.797L115.959 132.798L115.959 132.8L116.114 134.976L115.859 137.348L115.161 139.791L114.341 142.05L113.28 144.2L111.996 146.222L110.509 148.085L108.842 149.76L107.019 151.217L105.064 152.431L103 153.376L100.83 154.036L55.5258 164.424L53.7309 164.689L52.0638 164.657L50.5102 164.354L49.0786 163.799L47.7775 163.009L46.6168 162L45.6081 160.784L44.7641 159.377L44.0986 157.791L43.6255 156.042L43.3589 154.143L43.3121 152.091L44.7514 107.964L44.9175 106.112L45.2823 104.284L45.8333 102.479L46.5568 100.715L47.439 99.0129L48.4661 97.3915L49.6245 95.8702L50.9007 94.4689L52.2811 93.2072L53.7522 92.1051L55.3003 91.1825L56.9309 90.4509L99.0972 74.7135L100.921 74.3939L102.686 74.3274L104.357 74.5075L105.917 74.9247L107.349 75.5705L108.638 76.4374L109.767 77.5199L110.716 78.813L111.467 80.3134L111.996 82.0161L112.282 83.9383L115.959 132.796L115.959 132.797Z" stroke="url(#paint11_linear_904_282)" stroke-width="1.30418"/>
</g>
<g filter="url(#filter12_f_904_282)">
<path d="M81.5863 99.3805C81.8734 99.1725 82.1883 99.0547 82.4923 99.0389C85.3707 98.9026 88.0546 99.4816 90.3553 100.756C90.5923 100.888 90.7677 101.116 90.8547 101.4C90.8824 101.49 90.8992 101.591 90.9077 101.687C90.9241 101.9 90.8956 102.128 90.8247 102.354L89.8068 105.67C89.6787 106.076 89.6291 106.486 89.6565 106.872C89.6595 106.928 89.6689 106.981 89.6719 107.037C89.7279 107.471 89.8807 107.854 90.1266 108.152C90.3682 108.458 90.6925 108.669 91.0702 108.779C91.4478 108.888 91.8748 108.884 92.3041 108.774L95.3668 108.003C95.6742 107.929 95.9733 107.943 96.2167 108.073C96.4582 108.196 96.6444 108.414 96.7314 108.698C97.1808 110.047 97.4625 111.491 97.5665 112.996C97.6769 114.499 97.6117 116.07 97.3737 117.673C97.328 118.004 97.1866 118.344 96.974 118.635C96.7615 118.925 96.4842 119.166 96.1793 119.316L93.1733 120.774C92.7504 120.975 92.3528 121.28 92.0129 121.659C91.6711 122.032 91.3979 122.469 91.2136 122.92C91.0248 123.38 90.9333 123.859 90.9424 124.301C90.9454 124.356 90.9484 124.411 90.9514 124.467C90.9787 124.853 91.0856 125.201 91.255 125.502L92.6912 127.916C92.7915 128.083 92.8444 128.278 92.8608 128.492C92.8713 128.594 92.8669 128.694 92.8516 128.805C92.8059 129.136 92.6729 129.48 92.4687 129.775C90.4674 132.632 87.9926 135.112 85.25 137.039C84.9609 137.241 84.646 137.359 84.34 137.368C84.0404 137.376 83.7665 137.283 83.5669 137.091L81.562 135.225C81.279 134.966 80.926 134.799 80.5282 134.738C80.1303 134.677 79.698 134.732 79.2632 134.894C78.8349 135.054 78.417 135.316 78.0505 135.654C77.6839 135.992 77.3624 136.408 77.142 136.856L75.5047 140.052C75.3381 140.378 75.0959 140.664 74.8087 140.872C74.5216 141.08 74.2068 141.198 73.9027 141.214C71.0263 141.357 68.3449 140.763 66.0397 139.496C65.8007 139.358 65.6274 139.136 65.5448 138.845C65.5151 138.748 65.4983 138.647 65.4898 138.551C65.4754 138.344 65.5039 138.117 65.5768 137.897L66.5921 134.596C66.7138 134.192 66.7634 133.782 66.7361 133.396C66.7331 133.34 66.7237 133.287 66.7207 133.231C66.6647 132.797 66.5119 132.414 66.2659 132.116C66.018 131.811 65.7 131.599 65.316 131.491C64.9383 131.381 64.5178 131.383 64.082 131.496L61.0238 132.259C60.7119 132.34 60.4089 132.313 60.1655 132.184C59.9156 132.056 59.7339 131.83 59.6468 131.546C59.2251 130.195 58.9493 128.771 58.8226 127.238C58.727 125.737 58.7917 124.187 59.0035 122.614C59.0492 122.282 59.1887 121.936 59.4077 121.643C59.6247 121.344 59.9019 121.104 60.2133 120.952L63.2193 119.493C63.6466 119.285 64.0462 118.986 64.388 118.613C64.7343 118.232 65.0095 117.802 65.1963 117.335C65.3851 116.875 65.4721 116.405 65.4674 115.955C65.4644 115.899 65.4614 115.844 65.4585 115.788C65.4311 115.402 65.3223 115.048 65.1464 114.749L63.7206 112.345C63.6203 112.179 63.5674 111.984 63.551 111.77C63.5405 111.668 63.5449 111.567 63.5602 111.457C63.6059 111.126 63.7389 110.782 63.9431 110.486C65.938 107.632 68.4128 105.152 71.1554 103.224C71.4381 103.025 71.7549 102.913 72.059 102.898C72.3586 102.89 72.6281 102.991 72.832 103.175L74.8415 105.033C75.1244 105.291 75.473 105.466 75.8772 105.525C76.2751 105.587 76.7055 105.525 77.1422 105.37C77.5705 105.21 77.9904 104.954 78.3549 104.61C78.7215 104.272 79.0366 103.858 79.2634 103.407L80.8987 100.205C81.055 99.8679 81.2972 99.582 81.5863 99.3805ZM82.0889 114.257C80.895 113.524 79.3318 113.44 77.7409 114.02C76.1648 114.603 74.6936 115.802 73.6605 117.352C72.6229 118.912 72.1047 120.7 72.2231 122.32C72.3415 123.941 73.0802 125.272 74.2805 126.003C75.4763 126.743 77.0395 126.827 78.624 126.249C80.2066 125.665 81.6777 124.466 82.7089 122.908C83.7484 121.355 84.2602 119.569 84.1462 117.941C84.0343 116.318 83.2912 114.995 82.0889 114.257Z" fill="#D0D737"/>
</g>
<path d="M70.8114 101.237L72.9887 102.868L75.0299 104.756L72.8546 103.131L70.8114 101.237Z" fill="#D6DB63"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M58.726 130.81L60.9033 132.442C60.585 132.525 60.2758 132.498 60.0277 132.367C59.9763 132.339 59.925 132.312 59.8782 132.276L57.7192 130.659C57.7596 130.688 57.8001 130.713 57.8504 130.735C58.0985 130.867 58.4012 130.896 58.726 130.81ZM64.0178 131.664L64.0178 131.664L60.9034 132.441L58.7261 130.81L61.8404 130.033L61.8403 130.033C62.2785 129.92 62.7095 129.924 63.0992 130.026C63.3293 130.099 63.5392 130.199 63.7244 130.336L65.9017 131.967C65.7165 131.831 65.5046 131.724 65.2765 131.658C64.8914 131.547 64.4624 131.549 64.0178 131.664Z" fill="#F6FB8F"/>
<path d="M80.2478 112.511L82.4251 114.142C81.208 113.398 79.6133 113.315 77.9895 113.906C76.3808 114.501 74.8784 115.721 73.8225 117.299C72.762 118.886 72.2312 120.704 72.3499 122.351C72.4593 123.85 73.0859 125.098 74.1182 125.87L71.9409 124.239C70.9086 123.467 70.282 122.219 70.1727 120.719C70.0539 119.072 70.5847 117.254 71.6452 115.668C72.7011 114.09 74.2015 112.863 75.8122 112.275C77.436 111.683 79.0307 111.767 80.2478 112.511Z" fill="url(#paint12_linear_904_282)"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M90.3022 105.405L90.3027 105.405C90.1715 105.818 90.1204 106.235 90.1478 106.628C90.1493 106.656 90.1524 106.684 90.1556 106.711C90.1587 106.739 90.1618 106.767 90.1633 106.795C90.2199 107.236 90.3753 107.625 90.6259 107.928C90.729 108.054 90.8412 108.163 90.9625 108.255L88.7852 106.623C88.6639 106.532 88.5432 106.418 88.4486 106.297C88.2025 105.985 88.0406 105.598 87.986 105.163C87.9765 105.109 87.9735 105.053 87.9705 104.996C87.9451 104.61 87.9962 104.193 88.1254 103.774L88.1249 103.773L89.1674 100.401L91.3447 102.033L90.3022 105.405ZM88.8147 98.8545L90.992 100.486C91.1772 100.622 91.3111 100.825 91.3834 101.061C91.4116 101.152 91.4286 101.255 91.4371 101.352C91.4536 101.569 91.4242 101.8 91.3516 102.031L89.1743 100.399C89.2469 100.169 89.2763 99.938 89.2598 99.7209C89.2493 99.6167 89.2342 99.521 89.2061 99.4293C89.1252 99.1891 88.9934 98.9931 88.8147 98.8545Z" fill="#D6DB63"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M75.66 140.37L75.6593 140.37L77.3281 137.119L77.3367 137.125C77.5621 136.669 77.8907 136.246 78.265 135.902C78.6394 135.558 79.0661 135.291 79.5032 135.128C79.947 134.963 80.3881 134.906 80.7939 134.968C81.1328 135.022 81.4353 135.144 81.695 135.336L79.5177 133.705C79.258 133.512 78.9535 133.384 78.6166 133.337C78.2128 133.281 77.7697 133.332 77.3259 133.496C76.8888 133.659 76.4621 133.926 76.0877 134.271C75.7163 134.62 75.3928 135.034 75.161 135.491L75.1563 135.487L73.482 138.738L73.4827 138.739C73.3123 139.071 73.0649 139.361 72.7717 139.573C72.4785 139.785 72.1572 139.905 71.847 139.922C68.9122 140.07 66.1708 139.472 63.8271 138.185C63.7843 138.163 63.7481 138.138 63.7119 138.113L65.8891 139.745L65.8892 139.745C65.9254 139.769 65.9616 139.794 66.0044 139.817C68.3546 141.101 71.0895 141.702 74.0243 141.553C74.3345 141.536 74.6558 141.416 74.949 141.205C75.2422 140.993 75.4896 140.702 75.66 140.37Z" fill="url(#paint13_linear_904_282)"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M93.7186 120.756L91.5413 119.125C91.1117 119.336 90.7036 119.64 90.3564 120.026C90.0137 120.404 89.7325 120.841 89.5393 121.309C89.3462 121.776 89.2588 122.262 89.261 122.712L89.2699 122.882C89.2974 123.274 89.3994 123.63 89.5784 123.933L91.7557 125.565C91.5832 125.259 91.4747 124.906 91.4472 124.513L91.4383 124.344C91.4295 123.895 91.5235 123.408 91.7166 122.94C91.9052 122.481 92.1845 122.037 92.5337 121.658C92.8809 121.272 93.2869 120.961 93.7186 120.756ZM94.6099 117.638L94.6152 117.642C94.9227 117.489 95.2042 117.252 95.4171 116.953C95.6343 116.657 95.7876 116.316 95.8261 115.975C96.0709 114.345 96.1328 112.75 96.0286 111.22C95.9177 109.692 95.6387 108.223 95.1819 106.852C95.1173 106.642 94.9979 106.461 94.8376 106.336L96.9864 107.946C97.163 108.078 97.2908 108.261 97.3592 108.483C97.816 109.855 98.1016 111.322 98.2059 112.852C98.3167 114.379 98.2482 115.977 98.0034 117.606C97.9564 117.943 97.8116 118.289 97.5944 118.585C97.3772 118.88 97.0941 119.125 96.7828 119.278L96.7774 119.274L93.7187 120.756L91.5414 119.124L94.6099 117.638ZM94.8091 106.314L94.8376 106.336C94.8282 106.328 94.8187 106.321 94.8091 106.314ZM91.7489 125.566L89.5716 123.935L91.0273 126.389L93.2046 128.021L91.7489 125.566Z" fill="url(#paint14_linear_904_282)"/>
<path d="M91.0286 126.39L93.2059 128.021C93.3081 128.19 93.3618 128.389 93.3783 128.606C93.3888 128.71 93.3842 128.812 93.3685 128.924C93.3215 129.261 93.1853 129.611 92.9766 129.911C90.9314 132.817 88.4035 135.342 85.603 137.305C85.3078 137.51 84.9865 137.63 84.6743 137.64C84.4119 137.649 84.1688 137.58 83.975 137.439L81.7977 135.808C81.9915 135.949 82.2346 136.017 82.497 136.009C82.8092 135.999 83.1305 135.879 83.4257 135.673C86.2282 133.717 88.7541 131.186 90.7993 128.28C91.0145 127.977 91.1527 127.634 91.1912 127.293C91.2004 127.182 91.205 127.081 91.201 126.974C91.1931 126.762 91.1308 126.559 91.0286 126.39Z" fill="#D6DB63"/>
<path d="M79.7535 97.3883C80.0467 97.1765 80.3681 97.0564 80.6783 97.0399C83.615 96.8978 86.3524 97.4832 88.6981 98.7762C88.9397 98.9098 89.1183 99.1416 89.2068 99.4297C89.2349 99.5213 89.252 99.6236 89.2605 99.7213C89.277 99.9383 89.2476 100.169 89.1749 100.399L88.1325 103.772C88.0013 104.184 87.9502 104.601 87.9776 104.994C87.9806 105.05 87.9901 105.105 87.9931 105.161C88.0497 105.602 88.2051 105.992 88.4556 106.295C88.7017 106.606 89.0324 106.82 89.4175 106.931C89.8027 107.042 90.2382 107.037 90.6764 106.924L93.8019 106.136C94.1156 106.061 94.4208 106.075 94.6689 106.207C94.9151 106.332 95.1048 106.553 95.1932 106.841C95.6501 108.213 95.9357 109.68 96.0399 111.209C96.1507 112.737 96.0822 114.334 95.8375 115.964C95.7904 116.301 95.6457 116.646 95.4285 116.942C95.2113 117.238 94.9281 117.483 94.6168 117.636L91.5483 119.122C91.1166 119.326 90.7106 119.637 90.3634 120.023C90.0142 120.403 89.7349 120.847 89.5463 121.306C89.3532 121.774 89.2592 122.261 89.268 122.71C89.2709 122.766 89.2739 122.822 89.2769 122.879C89.3044 123.272 89.4129 123.625 89.5854 123.93L91.0477 126.383C91.1498 126.552 91.2035 126.751 91.22 126.968C91.2305 127.072 91.2259 127.174 91.2102 127.286C91.1632 127.623 91.027 127.973 90.8183 128.273C88.7731 131.179 86.2452 133.704 83.4447 135.667C83.1495 135.872 82.8282 135.992 82.516 136.002C82.2103 136.01 81.9309 135.916 81.7276 135.721L79.6844 133.826C79.3961 133.564 79.0361 133.395 78.6303 133.333C78.2245 133.271 77.7834 133.328 77.3396 133.493C76.9025 133.656 76.4758 133.923 76.1014 134.267C75.7271 134.611 75.3985 135.035 75.1731 135.491L73.4988 138.741C73.3284 139.073 73.0809 139.364 72.7877 139.576C72.4945 139.788 72.1732 139.908 71.863 139.924C68.9282 140.073 66.1934 139.472 63.8431 138.188C63.5995 138.048 63.4229 137.823 63.339 137.526C63.3089 137.428 63.2918 137.326 63.2833 137.228C63.2688 137.017 63.2982 136.786 63.3729 136.563L64.4128 133.206C64.5374 132.795 64.5886 132.378 64.5611 131.985C64.5581 131.929 64.5486 131.874 64.5456 131.818C64.489 131.377 64.3337 130.988 64.0831 130.685C63.8305 130.375 63.5064 130.16 63.1147 130.051C62.7295 129.94 62.3005 129.942 61.8558 130.057L58.7348 130.836C58.4166 130.92 58.1074 130.893 57.8592 130.761C57.6045 130.632 57.4194 130.402 57.3309 130.114C56.9023 128.741 56.6227 127.294 56.4953 125.735C56.3996 124.21 56.4676 122.634 56.6856 121.034C56.7327 120.697 56.8754 120.345 57.0992 120.047C57.3209 119.743 57.6041 119.498 57.9219 119.344L60.9904 117.857C61.4267 117.644 61.8347 117.34 62.1839 116.96C62.5377 116.572 62.8189 116.135 63.0101 115.661C63.2032 115.193 63.2926 114.714 63.2884 114.257C63.2854 114.201 63.2824 114.144 63.2795 114.088C63.252 113.695 63.1415 113.335 62.9624 113.032L61.5107 110.59C61.4086 110.421 61.3549 110.223 61.3384 110.005C61.3279 109.901 61.3325 109.8 61.3481 109.687C61.3952 109.35 61.5314 109.001 61.74 108.7C63.7787 105.796 66.3066 103.272 69.1071 101.309C69.3957 101.105 69.7191 100.992 70.0293 100.975C70.3349 100.968 70.6098 101.069 70.8177 101.256L72.8654 103.142C73.1537 103.405 73.5091 103.582 73.9215 103.642C74.3273 103.704 74.7665 103.641 75.2122 103.482C75.6494 103.319 76.0781 103.059 76.4504 102.708C76.8248 102.364 77.1468 101.943 77.3787 101.485L79.0511 98.2273C79.2109 97.8845 79.4583 97.5936 79.7535 97.3883ZM80.2479 112.511C79.0308 111.767 77.4361 111.683 75.8123 112.275C74.2036 112.869 72.7013 114.09 71.6453 115.668C70.5849 117.254 70.054 119.072 70.1728 120.719C70.2916 122.367 71.0435 123.719 72.2672 124.461C73.4863 125.212 75.0809 125.295 76.6982 124.706C78.3134 124.11 79.8158 122.889 80.8697 121.304C81.9322 119.724 82.4565 117.908 82.3423 116.253C82.23 114.604 81.4736 113.26 80.2479 112.511Z" fill="url(#paint15_linear_904_282)"/>
<defs>
<filter id="filter0_i_904_282" x="159.369" y="131.902" width="234.307" height="276.43" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="-0.458319"/>
<feGaussianBlur stdDeviation="0.458319"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="darken" in2="shape" result="effect1_innerShadow_904_282"/>
</filter>
<filter id="filter1_i_904_282" x="152.949" y="128.237" width="233.928" height="274.909" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.458319"/>
<feGaussianBlur stdDeviation="0.458319"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="darken" in2="shape" result="effect1_innerShadow_904_282"/>
</filter>
<filter id="filter2_f_904_282" x="162.21" y="132.584" width="225.583" height="271.019" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="0.458319" result="effect1_foregroundBlur_904_282"/>
</filter>
<filter id="filter3_bi_904_282" x="89.6848" y="72.587" width="270.593" height="311.117" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feGaussianBlur in="BackgroundImageFix" stdDeviation="9.16639"/>
<feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_904_282"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_904_282" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.458319"/>
<feGaussianBlur stdDeviation="0.458319"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.342674 0 0 0 0 0.352133 0 0 0 0 0.579167 0 0 0 0.1 0"/>
<feBlend mode="darken" in2="shape" result="effect2_innerShadow_904_282"/>
</filter>
<filter id="filter4_bi_904_282" x="96.1028" y="76.7348" width="270.972" height="312.613" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feGaussianBlur in="BackgroundImageFix" stdDeviation="9.16639"/>
<feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_904_282"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_904_282" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="-0.458319"/>
<feGaussianBlur stdDeviation="0.458319"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.341176 0 0 0 0 0.352941 0 0 0 0 0.580392 0 0 0 0.25 0"/>
<feBlend mode="darken" in2="shape" result="effect2_innerShadow_904_282"/>
</filter>
<filter id="filter5_f_904_282" x="117.279" y="95.267" width="225.583" height="271.019" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="0.458319" result="effect1_foregroundBlur_904_282"/>
</filter>
<filter id="filter6_bi_904_282" x="44.7551" y="35.2689" width="270.593" height="311.117" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feGaussianBlur in="BackgroundImageFix" stdDeviation="9.16639"/>
<feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_904_282"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_904_282" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.458319"/>
<feGaussianBlur stdDeviation="0.458319"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.342674 0 0 0 0 0.352133 0 0 0 0 0.579167 0 0 0 0.1 0"/>
<feBlend mode="darken" in2="shape" result="effect2_innerShadow_904_282"/>
</filter>
<filter id="filter7_bi_904_282" x="51.1731" y="39.417" width="270.972" height="312.613" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feGaussianBlur in="BackgroundImageFix" stdDeviation="9.16639"/>
<feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_904_282"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_904_282" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="-0.458319"/>
<feGaussianBlur stdDeviation="0.458319"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.341176 0 0 0 0 0.352941 0 0 0 0 0.580392 0 0 0 0.25 0"/>
<feBlend mode="darken" in2="shape" result="effect2_innerShadow_904_282"/>
</filter>
<filter id="filter8_f_904_282" x="72.347" y="57.9512" width="225.583" height="271.019" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="0.458319" result="effect1_foregroundBlur_904_282"/>
</filter>
<filter id="filter9_b_904_282" x="36.2517" y="63.7117" width="110.362" height="125.825" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feGaussianBlur in="BackgroundImageFix" stdDeviation="9.78137"/>
<feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_904_282"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_904_282" result="shape"/>
</filter>
<filter id="filter10_b_904_282" x="23.0974" y="54.1112" width="113.233" height="130.794" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feGaussianBlur in="BackgroundImageFix" stdDeviation="9.78137"/>
<feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_904_282"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_904_282" result="shape"/>
</filter>
<filter id="filter11_b_904_282" x="30.5222" y="61.536" width="98.3834" height="115.944" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feGaussianBlur in="BackgroundImageFix" stdDeviation="6.069"/>
<feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_904_282"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_904_282" result="shape"/>
</filter>
<filter id="filter12_f_904_282" x="23.5791" y="63.8192" width="109.24" height="112.616" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="17.6001" result="effect1_foregroundBlur_904_282"/>
</filter>
<linearGradient id="paint0_linear_904_282" x1="198.202" y1="430.813" x2="419.291" y2="164.612" gradientUnits="userSpaceOnUse">
<stop stop-color="#888D10"/>
<stop offset="0.681928" stop-color="#DAC46E"/>
<stop offset="1" stop-color="#F6E979"/>
</linearGradient>
<radialGradient id="paint1_radial_904_282" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(193.491 357.477) rotate(-50.2892) scale(223.276 223.276)">
<stop stop-color="#D6DB63"/>
<stop offset="1" stop-color="#F6E979"/>
</radialGradient>
<linearGradient id="paint2_linear_904_282" x1="161.02" y1="399.218" x2="381.707" y2="133.501" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.24"/>
<stop offset="0.130208" stop-color="white" stop-opacity="0.865636"/>
<stop offset="0.489583" stop-color="white" stop-opacity="0.494792"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint3_linear_904_282" x1="116.088" y1="361.901" x2="336.776" y2="96.1835" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.24"/>
<stop offset="0.130208" stop-color="white" stop-opacity="0.865636"/>
<stop offset="0.489583" stop-color="white" stop-opacity="0.494792"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint4_linear_904_282" x1="71.1562" y1="324.585" x2="291.844" y2="58.8677" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.24"/>
<stop offset="0.130208" stop-color="white" stop-opacity="0.865636"/>
<stop offset="0.489583" stop-color="white" stop-opacity="0.494792"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint5_linear_904_282" x1="144.797" y1="148.233" x2="41.8217" y2="97.1979" gradientUnits="userSpaceOnUse">
<stop offset="0.168938" stop-color="#D6DB63"/>
<stop offset="0.763637" stop-color="#D6DB63" stop-opacity="0.39"/>
</linearGradient>
<linearGradient id="paint6_linear_904_282" x1="134.232" y1="154.204" x2="51.5987" y2="100.665" gradientUnits="userSpaceOnUse">
<stop offset="0.180663" stop-color="white" stop-opacity="0.49"/>
<stop offset="0.533255" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint7_linear_904_282" x1="71.0971" y1="194.514" x2="134.131" y2="75.4429" gradientUnits="userSpaceOnUse">
<stop stop-color="#D6DB63"/>
<stop offset="0.348528" stop-color="#CBD145"/>
<stop offset="0.563631" stop-color="#BAC028"/>
<stop offset="0.76507" stop-color="#92971F"/>
<stop offset="0.957662" stop-color="#EBF075"/>
</linearGradient>
<linearGradient id="paint8_linear_904_282" x1="134.515" y1="141.802" x2="31.5392" y2="90.7671" gradientUnits="userSpaceOnUse">
<stop offset="0.168938" stop-color="#D6DB63"/>
<stop offset="0.763637" stop-color="#D6DB63" stop-opacity="0.39"/>
</linearGradient>
<linearGradient id="paint9_linear_904_282" x1="123.95" y1="147.773" x2="41.3163" y2="94.2341" gradientUnits="userSpaceOnUse">
<stop offset="0.180663" stop-color="white" stop-opacity="0.49"/>
<stop offset="0.533255" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint10_linear_904_282" x1="134.515" y1="141.802" x2="31.5392" y2="90.7671" gradientUnits="userSpaceOnUse">
<stop offset="0.168938" stop-color="#D6DB63"/>
<stop offset="0.763637" stop-color="#D6DB63" stop-opacity="0.39"/>
</linearGradient>
<linearGradient id="paint11_linear_904_282" x1="123.95" y1="147.773" x2="41.3163" y2="94.2341" gradientUnits="userSpaceOnUse">
<stop offset="0.180663" stop-color="white" stop-opacity="0.14"/>
<stop offset="0.419792" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint12_linear_904_282" x1="69.979" y1="120.598" x2="83.1644" y2="116.551" gradientUnits="userSpaceOnUse">
<stop stop-color="#D6DB63"/>
<stop offset="1" stop-color="#E9EE7A"/>
</linearGradient>
<linearGradient id="paint13_linear_904_282" x1="64.5829" y1="140.95" x2="81.7963" y2="135.666" gradientUnits="userSpaceOnUse">
<stop offset="0.539669" stop-color="#D6DB63"/>
<stop offset="1" stop-color="#D9DF41"/>
</linearGradient>
<linearGradient id="paint14_linear_904_282" x1="88.0066" y1="119.009" x2="99.5112" y2="115.478" gradientUnits="userSpaceOnUse">
<stop stop-color="#DFE646"/>
<stop offset="1" stop-color="#D6DB63"/>
</linearGradient>
<linearGradient id="paint15_linear_904_282" x1="55.6986" y1="124.798" x2="95.3853" y2="108.458" gradientUnits="userSpaceOnUse">
<stop stop-color="#D6DB63"/>
<stop offset="1" stop-color="#BABF3B"/>
</linearGradient>
</defs>
</svg>

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
          <br /> Team VendorContacts
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
      <svg width="585" height="309" viewBox="0 0 585 309" fill="none" xmlns="http://www.w3.org/2000/svg" className="faq-img">
      <g filter="url(#filter0_bi_904_329)">
      <path d="M238.835 261.81C369.605 280.413 482.887 244.51 491.995 181.608L490.133 194.692C481.212 257.404 367.82 293.65 236.954 275.033C106.087 256.416 7.21007 190.632 16.2235 127.273L18.0998 114.085C9.18097 177.063 107.993 243.196 238.835 261.81Z" fill="#E4E8F3" fill-opacity="0.4"/>
      </g>
      <g filter="url(#filter1_bi_904_329)">
      <ellipse cx="255.06" cy="147.759" rx="239.341" ry="115.198" transform="rotate(8.09659 255.06 147.759)" fill="#E4E8F3" fill-opacity="0.4"/>
      </g>
      <g filter="url(#filter2_f_904_329)">
      <path d="M473.06 217.635C432.184 255.202 340.998 272.97 239.308 258.504C137.617 244.037 55.0037 201.544 26.2266 154.067C52.5027 202.959 135.724 247.141 238.838 261.81C341.951 276.479 434.191 257.258 473.06 217.635Z" fill="url(#paint0_linear_904_329)"/>
      </g>
      <g filter="url(#filter3_i_904_329)">
      <path d="M511.107 221.801C502.449 227.906 490.547 225.93 484.524 217.388C478.5 208.846 480.635 196.972 489.293 190.867L462.693 144.618L458.676 147.45C425.716 170.693 417.587 215.898 440.52 248.418C463.453 280.939 508.763 288.46 541.723 265.217L545.74 262.384L511.107 221.801Z" fill="url(#paint1_linear_904_329)"/>
      </g>
      <g filter="url(#filter4_i_904_329)">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M488.392 214.661C494.416 223.203 506.317 225.179 514.975 219.074L545.591 262.49C512.631 285.733 467.321 278.212 444.389 245.691C421.456 213.171 429.585 167.966 462.545 144.723L493.161 188.14C484.503 194.245 482.368 206.119 488.392 214.661Z" fill="url(#paint2_radial_904_329)"/>
      </g>
      <g filter="url(#filter5_f_904_329)">
      <path d="M462.695 144.62L462.693 144.618C429.733 167.86 421.604 213.065 444.537 245.586C467.47 278.106 512.78 285.627 545.74 262.384L545.738 262.382C512.828 285.134 468.197 277.31 445.398 244.979C422.598 212.647 430.214 167.981 462.695 144.62Z" fill="url(#paint3_linear_904_329)"/>
      </g>
      <g filter="url(#filter6_bi_904_329)">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M506.824 201.664C512.847 210.206 524.749 212.182 533.407 206.076L564.023 249.493C531.063 272.735 485.753 265.214 462.82 232.694C439.888 200.174 448.016 154.969 480.977 131.726L511.593 175.142C502.935 181.247 500.8 193.122 506.824 201.664Z" fill="#E4E8F3" fill-opacity="0.4"/>
      </g>
      <g filter="url(#filter7_bi_904_329)">
      <path d="M476.6 134.812L480.617 131.979C447.657 155.222 439.528 200.427 462.461 232.948C485.394 265.468 530.704 272.989 563.664 249.746L559.647 252.579C526.687 275.822 481.377 268.301 458.444 235.78C435.511 203.26 443.64 158.055 476.6 134.812Z" fill="#E4E8F3" fill-opacity="0.4"/>
      </g>
      <g filter="url(#filter8_f_904_329)">
      <path d="M480.978 131.729L480.977 131.726C448.016 154.969 439.888 200.174 462.82 232.694C485.753 265.214 531.063 272.735 564.023 249.493L564.021 249.49C531.111 272.242 486.48 264.418 463.681 232.087C440.882 199.756 448.497 155.089 480.978 131.729Z" fill="url(#paint4_linear_904_329)"/>
      </g>
      <g filter="url(#filter9_bi_904_329)">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M526.286 187.939C532.31 196.481 544.212 198.457 552.87 192.351L583.486 235.768C550.526 259.01 505.216 251.489 482.283 218.969C459.35 186.449 467.479 141.244 500.439 118.001L531.056 161.417C522.398 167.522 520.263 179.397 526.286 187.939Z" fill="#E4E8F3" fill-opacity="0.4"/>
      </g>
      <g filter="url(#filter10_bi_904_329)">
      <path d="M496.423 120.834L500.439 118.001C467.479 141.244 459.35 186.449 482.283 218.969C505.216 251.489 550.526 259.01 583.486 235.768L579.469 238.6C546.509 261.843 501.199 254.322 478.266 221.802C455.334 189.281 463.462 144.076 496.423 120.834Z" fill="#E4E8F3" fill-opacity="0.4"/>
      </g>
      <g filter="url(#filter11_f_904_329)">
      <path d="M500.441 118.004L500.439 118.001C467.479 141.244 459.35 186.449 482.283 218.969C505.216 251.489 550.526 259.01 583.486 235.768L583.484 235.765C550.574 258.517 505.943 250.693 483.144 218.362C460.344 186.031 467.96 141.364 500.441 118.004Z" fill="url(#paint5_linear_904_329)"/>
      </g>
      <defs>
      <filter id="filter0_bi_904_329" x="-47.247" y="51.1861" width="602.14" height="291.633" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feGaussianBlur in="BackgroundImageFix" stdDeviation="31.4497"/>
      <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_904_329"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_904_329" result="shape"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="-1.57248"/>
      <feGaussianBlur stdDeviation="1.57248"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.341176 0 0 0 0 0.352941 0 0 0 0 0.580392 0 0 0 0.25 0"/>
      <feBlend mode="darken" in2="shape" result="effect2_innerShadow_904_329"/>
      </filter>
      <filter id="filter1_bi_904_329" x="-45.3583" y="-34.0985" width="600.838" height="363.716" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feGaussianBlur in="BackgroundImageFix" stdDeviation="31.4497"/>
      <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_904_329"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_904_329" result="shape"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="1.57248"/>
      <feGaussianBlur stdDeviation="1.57248"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.342674 0 0 0 0 0.352133 0 0 0 0 0.579167 0 0 0 0.1 0"/>
      <feBlend mode="darken" in2="shape" result="effect2_innerShadow_904_329"/>
      </filter>
      <filter id="filter2_f_904_329" x="23.0816" y="150.922" width="453.124" height="118.941" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
      <feGaussianBlur stdDeviation="1.57248" result="effect1_foregroundBlur_904_329"/>
      </filter>
      <filter id="filter3_i_904_329" x="427.49" y="144.23" width="118.25" height="134.486" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="-0.387411"/>
      <feGaussianBlur stdDeviation="0.387411"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
      <feBlend mode="darken" in2="shape" result="effect1_innerShadow_904_329"/>
      </filter>
      <filter id="filter4_i_904_329" x="431.357" y="144.723" width="114.234" height="131.653" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="0.387411"/>
      <feGaussianBlur stdDeviation="0.387411"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
      <feBlend mode="darken" in2="shape" result="effect1_innerShadow_904_329"/>
      </filter>
      <filter id="filter5_f_904_329" x="430.731" y="143.843" width="115.784" height="132.815" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
      <feGaussianBlur stdDeviation="0.387411" result="effect1_foregroundBlur_904_329"/>
      </filter>
      <filter id="filter6_bi_904_329" x="434.293" y="116.23" width="145.227" height="162.258" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feGaussianBlur in="BackgroundImageFix" stdDeviation="7.74822"/>
      <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_904_329"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_904_329" result="shape"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="0.387411"/>
      <feGaussianBlur stdDeviation="0.387411"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.342674 0 0 0 0 0.352133 0 0 0 0 0.579167 0 0 0 0.1 0"/>
      <feBlend mode="darken" in2="shape" result="effect2_innerShadow_904_329"/>
      </filter>
      <filter id="filter7_bi_904_329" x="429.918" y="116.483" width="149.243" height="165.091" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feGaussianBlur in="BackgroundImageFix" stdDeviation="7.74822"/>
      <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_904_329"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_904_329" result="shape"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="-0.387411"/>
      <feGaussianBlur stdDeviation="0.387411"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.341176 0 0 0 0 0.352941 0 0 0 0 0.580392 0 0 0 0.25 0"/>
      <feBlend mode="darken" in2="shape" result="effect2_innerShadow_904_329"/>
      </filter>
      <filter id="filter8_f_904_329" x="449.014" y="130.951" width="115.784" height="132.815" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
      <feGaussianBlur stdDeviation="0.387411" result="effect1_foregroundBlur_904_329"/>
      </filter>
      <filter id="filter9_bi_904_329" x="453.756" y="102.505" width="145.227" height="162.258" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feGaussianBlur in="BackgroundImageFix" stdDeviation="7.74822"/>
      <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_904_329"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_904_329" result="shape"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="0.387411"/>
      <feGaussianBlur stdDeviation="0.387411"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.342674 0 0 0 0 0.352133 0 0 0 0 0.579167 0 0 0 0.1 0"/>
      <feBlend mode="darken" in2="shape" result="effect2_innerShadow_904_329"/>
      </filter>
      <filter id="filter10_bi_904_329" x="449.74" y="102.505" width="149.243" height="165.091" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feGaussianBlur in="BackgroundImageFix" stdDeviation="7.74822"/>
      <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_904_329"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_904_329" result="shape"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="-0.387411"/>
      <feGaussianBlur stdDeviation="0.387411"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.341176 0 0 0 0 0.352941 0 0 0 0 0.580392 0 0 0 0.25 0"/>
      <feBlend mode="darken" in2="shape" result="effect2_innerShadow_904_329"/>
      </filter>
      <filter id="filter11_f_904_329" x="468.477" y="117.226" width="115.784" height="132.815" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
      <feGaussianBlur stdDeviation="0.387411" result="effect1_foregroundBlur_904_329"/>
      </filter>
      <linearGradient id="paint0_linear_904_329" x1="34.3324" y1="-0.000508181" x2="508.243" y2="67.4183" gradientUnits="userSpaceOnUse">
      <stop stop-color="white" stop-opacity="0.24"/>
      <stop offset="0.130208" stop-color="white" stop-opacity="0.865636"/>
      <stop offset="0.489583" stop-color="white" stop-opacity="0.494792"/>
      <stop offset="1" stop-color="white" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="paint1_linear_904_329" x1="460.458" y1="146.194" x2="543.505" y2="263.96" gradientUnits="userSpaceOnUse">
      <stop stop-color="#D6DB63"/>
      <stop offset="0.681928" stop-color="#DAC46E"/>
      <stop offset="1" stop-color="#F6E979"/>
      </linearGradient>
      <radialGradient id="paint2_radial_904_329" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(462.845 150.022) rotate(54.8093) scale(126.09 127.795)">
      <stop stop-color="#D6DB63"/>
      <stop offset="1" stop-color="#F6E979"/>
      </radialGradient>
      <linearGradient id="paint3_linear_904_329" x1="579.712" y1="56.7566" x2="667.791" y2="181.66" gradientUnits="userSpaceOnUse">
      <stop stop-color="white" stop-opacity="0.24"/>
      <stop offset="0.130208" stop-color="white" stop-opacity="0.865636"/>
      <stop offset="0.489583" stop-color="white" stop-opacity="0.494792"/>
      <stop offset="1" stop-color="white" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="paint4_linear_904_329" x1="597.995" y1="43.8649" x2="686.074" y2="168.768" gradientUnits="userSpaceOnUse">
      <stop stop-color="white" stop-opacity="0.24"/>
      <stop offset="0.130208" stop-color="white" stop-opacity="0.865636"/>
      <stop offset="0.489583" stop-color="white" stop-opacity="0.494792"/>
      <stop offset="1" stop-color="white" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="paint5_linear_904_329" x1="617.458" y1="30.1399" x2="705.537" y2="155.043" gradientUnits="userSpaceOnUse">
      <stop stop-color="white" stop-opacity="0.24"/>
      <stop offset="0.130208" stop-color="white" stop-opacity="0.865636"/>
      <stop offset="0.489583" stop-color="white" stop-opacity="0.494792"/>
      <stop offset="1" stop-color="white" stop-opacity="0"/>
      </linearGradient>
      </defs>
      </svg>
      <svg width="249" height="181" viewBox="0 0 249 181" fill="none" xmlns="http://www.w3.org/2000/svg" className="faq-img2">
<g filter="url(#filter0_i_904_347)">
<path d="M5.52812 76.2735L3.63192 68.6828C1.75121 61.1541 7.74081 52.2118 18.8332 49.4409L197.916 4.7048C209.268 1.86895 218.588 7.39419 220.505 15.0678L222.23 21.9726L5.52812 76.2735Z" fill="url(#paint0_linear_904_347)"/>
</g>
<g filter="url(#filter1_i_904_347)">
<path d="M153.541 144.5C147.913 153.974 133.161 157.66 123.738 151.945L11.623 83.9466C-0.282279 76.726 5.06085 60.6331 20.657 56.7371L199.74 12.001C215.336 8.10494 227.619 19.7946 220.508 31.7656L153.541 144.5Z" fill="url(#paint1_radial_904_347)"/>
</g>
<g filter="url(#filter2_f_904_347)">
<path d="M222.424 22.8706C221.102 14.8243 211.337 9.10333 199.739 12.0004L20.6564 56.7365C9.05899 59.6336 3.13094 69.275 5.74864 76.9975C4.53831 69.6466 10.2963 60.7681 20.9958 58.0953L200.079 13.3592C210.778 10.6864 220.035 15.8141 222.424 22.8706Z" fill="url(#paint2_linear_904_347)"/>
</g>
<defs>
<filter id="filter0_i_904_347" x="3.28906" y="3.48244" width="218.941" height="72.791" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="-0.467387"/>
<feGaussianBlur stdDeviation="0.467387"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="darken" in2="shape" result="effect1_innerShadow_904_347"/>
</filter>
<filter id="filter1_i_904_347" x="5.13672" y="11.2375" width="217.439" height="143.892" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.467387"/>
<feGaussianBlur stdDeviation="0.467387"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="darken" in2="shape" result="effect1_innerShadow_904_347"/>
</filter>
<filter id="filter2_f_904_347" x="4.20194" y="10.3022" width="219.157" height="67.63" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="0.467387" result="effect1_foregroundBlur_904_347"/>
</filter>
<linearGradient id="paint0_linear_904_347" x1="219.506" y1="11.066" x2="2.76431" y2="65.2094" gradientUnits="userSpaceOnUse">
<stop stop-color="#D6DB63"/>
<stop offset="0.681928" stop-color="#DAC46E"/>
<stop offset="1" stop-color="#F6E979"/>
</linearGradient>
<radialGradient id="paint1_radial_904_347" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(228.812 68.2433) rotate(165.974) scale(181.205)">
<stop stop-color="#D6DB63"/>
<stop offset="1" stop-color="#F6E979"/>
</radialGradient>
<linearGradient id="paint2_linear_904_347" x1="236.816" y1="52.3976" x2="6.93176" y2="109.824" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.24"/>
<stop offset="0.130208" stop-color="white" stop-opacity="0.865636"/>
<stop offset="0.489583" stop-color="white" stop-opacity="0.494792"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
</defs>
      </svg>
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
          <img src={ribbon2} alt="ribbon" style={{ width: "100%" }} />
        </div>

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
              <img src={ribbon3} alt="ribon-img" />
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
