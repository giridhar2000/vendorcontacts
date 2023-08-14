import React, { useEffect } from "react";
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
import Vector from "../../Assets/images/Vector.png";
import bg1 from "../../Assets/images/bg.png";
import Ellipse from "../../Assets/images/Ellipse.png";
import Marquee from "react-fast-marquee";
import { gsap } from "gsap";

export default function Home() {
    useEffect(() => {
        animator();
        // const observer = new IntersectionObserver((entries) => {
        //     entries.forEach((entry) => {
        //         console.log(entry)
        //         if (entry.isIntersecting) {
        //             entry.target.classList.add('showcontent')
        //         } else {
        //             entry.target.classList.remove('showcontent')
        //         }
        //     });
        // });

        // const hiddenElements = document.querySelectorAll('.hidden');
        // hiddenElements.forEach((el) => observer.observe(el));
    })

    function animator() {
        document.querySelectorAll('.codedText').forEach((t) => {
            const arr1 = t.innerHTML.split('')
            const arr2 = []
            arr1.forEach((char, i) => arr2[i] = randChar()) //fill arr2 with random characters
            t.onpointerover = () => {
                const tl = gsap.timeline()
                let step = 0
                tl.fromTo(t, {
                    innerHTML: arr2.join(''),
                    color: '#000',
                    background: '#bada55'
                }, {
                    duration: arr1.length / 20, //duration based on text length
                    ease: 'power4.in',
                    delay: 0.1,
                    color: '#fff',
                    background: '#000',
                    onUpdate: () => {
                        const p = Math.floor(tl.progress() * (arr1.length)) //whole number from 0 - text length
                        if (step !== p) { //throttle the change of random characters
                            step = p
                            arr1.forEach((char, i) => arr2[i] = randChar())
                            let pt1 = arr1.join('').substring(p, 0),
                                pt2 = arr2.join('').substring(arr2.length - p, 0)
                            if (t.classList.contains('fromRight')) {
                                pt1 = arr2.join('').substring(arr2.length - p, 0)
                                pt2 = arr1.join('').substring(arr1.length - p)
                            }
                            t.innerHTML = pt1 + pt2
                        }

                    }
                })
            }
        })
    }

    function randChar() {
        let c = "abcdefghijklmnopqrstuvwxyz1234567890!@#$^&*()…æ_+-=;[]/~`"
        c = c[Math.floor(Math.random() * c.length)]
        return (Math.random() > 0.5) ? c : c.toUpperCase()
    }


    return (
        <>
            <header>
                <Header />
            </header>
            <main>
                <section className="banner">
                    <div className="banner-heading">
                        <div className="banner-text">
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
                        <img src={bg1} alt="bg" className="bg" />
                        {/* <img src={Ellipse} alt="bg" className="Ellipse" /> */}
                    </div>
                </section>

                <section className="team">
                    <div className="joinContainer">
                        <div className="join-block">
                            <div>
                                <h2> join <br /> the list</h2>
                            </div>
                            <div className="arrow">
                                <img src={Arrow} alt="arrow" />
                            </div>
                        </div>

                    </div>

                    <div className="steps firststep">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 348" fill="none">
                            <path id="p1" d="M0 305H570.5V43L1443.5 43" stroke="#D9E167" stroke-width="85" stroke-linejoin="round" />
                            <text dominant-baseline="middle" fill="black">
                                <textPath href="#p1" startOffset="100%">
                                    Uniting Visionaries and makers .Uniting Visionaries and makers .
                                    <animate
                                        attributeName="startOffset" from="-100%" to="100%"
                                        dur="10s" begin="3s" repeatCount="indefinite" />
                                </textPath>
                            </text>
                        </svg>
                    </div>
                </section>

                <div className="tilt">
                    <div className="tiltedChild codedText">
                        Who's my rep?
                    </div>
                    <div className="tiltedChild codedText">
                        What's the cost on this?
                    </div>
                    <div className="tiltedChild codedText">
                        Is this bleach cleanable?
                    </div>
                    <div className="tiltedChild codedText">
                        Can this be made custom?
                    </div>
                    <div className="tiltedChild codedText">
                        Digital or standard vinyl?
                    </div>
                </div>

                <section className="faq">
                    <div className="faq-block">
                        ALL YOUR QUESTIONS, AND REPS ON ONE PLATFORM. NO MORE LONG EMAIL
                        THREADS.
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
                    <div className="steps">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 264" fill="none">
                            <path id="p2" d="M-208 43H-47.6758V221L1348.07 221V43H1489" stroke="#D9E167" stroke-width="85" stroke-linejoin="round" />
                            <text dominant-baseline="middle" fill="black">
                                <textPath href="#p2" startOffset="100%">
                                    Uniting Visionaries and makers .Uniting Visionaries and makers .
                                    <animate
                                        attributeName="startOffset" from="-100%" to="100%"
                                        dur="10s" begin="3s" repeatCount="indefinite" />
                                </textPath>
                            </text>
                        </svg>
                    </div>

                    <div className="service-container">
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
                                <text dominant-baseline="middle" fill="black">
                                    <textPath href="#p3" startOffset="100%">
                                        Uniting Visionaries and makers .Uniting Visionaries and makers .
                                        <animate
                                            attributeName="startOffset" from="-100%" to="100%"
                                            dur="10s" begin="3s" repeatCount="indefinite" />
                                    </textPath>
                                </text>
                            </svg>
                        </div>
                    </div>
                </section>

                <section className="collaborators">
                    <h2 className="heading">In Collaboration With</h2>
                    <div className="companies">
                        <Marquee>

                            <img src={Gettys} alt="gettys-logo" />


                            <img src={IAInteriors} alt="ia-interiors" />


                            <img src={Gensler} alt="gensler-logo" />


                            <img src={Stantec} alt="stantec-logo" />


                            <img src={OKK} alt="okk-logo" />


                            <img src={HPA} alt="hpa-logo" />

                        </Marquee>
                    </div>
                </section>
            </main >
        </>
    );
}
