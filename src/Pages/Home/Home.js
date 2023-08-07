import React from 'react'
import logo from '../../Assets/img/logo.svg'
import logoFont from '../../Assets/img/LogoFont.svg'
import "../Home/Home.css"
import sun from "../../Assets/img/Frame 9.svg"
import forward from "../../Assets/img/Frame 10.svg"
import senior from "../../Assets/img/Frame 11.svg"
import clock from "../../Assets/img/Frame 8.svg"
import fast from "../../Assets/img/Frame 7.svg"
import pause from "../../Assets/img/Frame 12.svg"
import content from "../../Assets/img/content.jpg"
import "../../Components/Vector/Vector.css"
import group from "../../Assets/img/Group.png"
import Marquee from "react-fast-marquee";
import img1 from "../../Assets/img/img1.jpg"
import img2 from "../../Assets/img/img2.jpg"
import img3 from "../../Assets/img/img3.jpg"
import img4 from "../../Assets/img/img4.jpg"
import img5 from "../../Assets/img/img5.jpg"
import pic from "../../Assets/img/pic.jpg"
import pic1 from "../../Assets/img/pic1.jpg"
import collablogo1 from "../../Assets/img/collablogo1.png"
import collablogo2 from "../../Assets/img/collablogo2.png"
import collablogo3 from "../../Assets/img/collablogo3.jpg"
import collablogo4 from "../../Assets/img/collablogo4.png"
import stantechlogo from "../../Assets/img/stantecLogo.svg"
import footer from "../../Assets/img/footer.png"

export default function Home() {
    return (
        <>
            <div className='home'>
                <div className='intro'>
                    <div className='introbody'>
                        <div className='introcontent'>
                            <img src={logo} alt='logoimg' style={{ width: "3vh" }} />
                            <img src={logoFont} alt='logoimg' style={{ width: "25%" }} />
                        </div>

                        <div>
                            <h1 style={{ fontSize: "xxx-large" }}>The future of vendor-architect<br />collaboration is here</h1>
                        </div>

                        <button className='offerbtn'>Join the List</button>
                        <p>*Exclusive to vendors requested by our partner firms at this time.
                            <br /> please note this is a paid service for vendors.</p>
                    </div>

                    <div className='introfooter'>
                        <img src={group} alt='groupimg' style={{width: "100%"}}/>
                    </div>
                </div>

                <div className='requests'>
                    <div className='requestshead'>
                        <span>Created in partnership with the top firms in the country.</span>
                        <div style={{ marginBlock: "3vh" }}>
                            <p>our mission is to empower designers and vendors by providing a platform that<br /> simplifies and enhances their collaboration.</p>
                        </div>
                        <img src={content} alt='contentimg' />
                    </div>
                </div>

                <div className='works'>
                    <div className='requestshead'>
                        <span>We are dedicated<br /> to eliminating the barriers.</span>
                        <div style={{ marginBlock: "3vh" }}>
                            <p>That hinder effective communication and partnership in the<br /> construction and design industry.</p>
                        </div>
                    </div>
                    <div className='marquees'>
                        <Marquee>
                            <div>
                                <img src={img1} alt='img' />
                            </div>
                            <div>
                                <img src={img2} alt='img' />
                            </div>
                            <div>
                                <img src={img3} alt='img' />
                            </div>
                            <div>
                                <img src={img1} alt='img' />
                            </div>
                            <div>
                                <img src={img2} alt='img' />
                            </div>
                            <div>
                                <img src={img3} alt='img' />
                            </div>

                        </Marquee>
                    </div>
                    <div>
                        <Marquee className='marquees'>
                            <div>
                                <img src={img4} alt='img' />
                            </div>
                            <div>
                                <img src={img5} alt='img' />
                            </div>
                            <div>
                                <img src={img1} alt='img' />
                            </div>
                            <div>
                                <img src={img4} alt='img' />
                            </div>
                            <div>
                                <img src={img5} alt='img' />
                            </div>
                            <div>
                                <img src={img1} alt='img' />
                            </div>

                        </Marquee>
                    </div>
                </div>

                {/* <div className='buisness'>
                <div className='requestshead'>
                    <span>Accelerate your business. We take care <br />of the design.</span>
                    <div style={{ marginBlock: "9vh" }}>
                        <p>We are here to meet all your design needs, from your visual  </p>
                        <p>identity to the product, in order to offer your users a  </p>
                        <p>seamless experience.</p>
                    </div>

                </div>

                <div className='buisnessbody'>
                    <div className='row'>
                        <span><img src={tick1} alt='tickimg' />Logo</span>
                        <span><img src={tick2} alt='tickimg' />Visual identity </span>
                        <span><img src={tick3} alt='tickimg' />UX/UI</span>
                        <span><img src={tick4} alt='tickimg' />Branding</span>
                        <span><img src={tick5} alt='tickimg' />Design systems</span>
                        <span><img src={tick6} alt='tickimg' />Social media visuals</span>
                    </div>

                    <div className='row'>
                        <span><img src={tick1} alt='tickimg' />Web apps</span>
                        <span><img src={tick2} alt='tickimg' />Mobile apps</span>
                        <span><img src={tick3} alt='tickimg' />e-commerce</span>
                        <span><img src={tick4} alt='tickimg' />Icons</span>
                        <span><img src={tick5} alt='tickimg' />Responsive websites</span>
                        <span><img src={tick6} alt='tickimg' />Landing pages</span>
                    </div>

                    <div className='row'>
                        <span><img src={tick1} alt='tickimg' />Web flow</span>
                        <span><img src={tick2} alt='tickimg' />Framer</span>
                        <span><img src={tick3} alt='tickimg' />Prototyes</span>
                        <span><img src={tick4} alt='tickimg' />UX writing</span>
                        <span><img src={tick5} alt='tickimg' />ads</span>
                        <span><img src={tick6} alt='tickimg' />Slides</span>
                    </div>
                </div>
            </div> */}



                <div className='about'>
                    <div className='requestshead'>
                        <span>We're here to revolutionize the construction and design industry</span>
                        <div style={{ marginBlock: "5vh" }}>
                            <p>by becoming the leading platform for architect-vendor collaboration.</p>

                        </div>
                    </div>

                    <div className='aboutbody'>
                        <div className='aboutrow'>
                            <div className='aboutcolumn'>
                                <div className='requestsitemhead'>
                                    <img src={sun} alt='img' />
                                    <h1>Reliable</h1>
                                </div>
                                <p>Trusted by Industry Professional.</p>
                            </div>

                            <div className='aboutcolumn'>
                                <div className='requestsitemhead'>
                                    <img src={forward} alt='img' />
                                    <h1>persuasive</h1>
                                </div>
                                <p>Effective Communication Tool.</p>
                            </div>

                            <div className='aboutcolumn'>
                                <div className='requestsitemhead'>
                                    <img src={senior} alt='img' />
                                    <h1>Skilled</h1>
                                </div>
                                <p>Advanced Search Capabilities.</p>
                            </div>
                        </div>

                        <div className='aboutrow'>
                            <div className='aboutcolumn'>
                                <div className='requestsitemhead'>
                                    <img src={clock} alt='img' />
                                    <h1>Asynchronous</h1>
                                </div>
                                <p>Vendor Direct Sampling Order.</p>
                            </div>

                            <div className='aboutcolumn'>
                                <div className='requestsitemhead'>
                                    <img src={fast} alt='img' />
                                    <h1>Fast</h1>
                                </div>
                                <p>User-Friendly Interface.</p>
                            </div>

                            <div className='aboutcolumn'>
                                <div className='requestsitemhead'>
                                    <img src={pause} alt='img' />
                                    <h1>Flexible</h1>
                                </div>
                                <p>Relationship Building Features.</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* <div className='profile'>
                <div className='profilehead'>
                    <img src={propic} alt='profilepic' />
                    <span>How can I help you ?</span>
                    <div>
                        <p>All your requests are carried out by Julien Perrière, founder of </p>
                        <p>Flexboom. Julien has more than 10 years of experience in agencies and </p>
                        <p>startups. He was recently VP Design of Ornikar (French Tech Next40).</p>
                    </div>
                </div>

                <div className='profilebody'>

                    <div className='profilerow'>
                        <div className='profilecolumn' style={{ border: "8px solid #f4f4f4" }}>
                            <img src={propic2} alt='propic2' />
                            <p>"Julien brilliantly led the design during our hypergrowth phase. He is responsive and efficient."</p>
                            <div>
                                <span className='profilespan' style={{ fontSize: "20px" }}>Benjamin Gaignault</span><br />
                                <span className='profilespan' style={{ fontSize: "14px" }}>Co-founder @Ornikar</span><br />
                                <span className='profilespan' style={{ fontSize: "14px" }}>Co-founder @Skarlett</span>
                            </div>
                        </div>
                        <div className='profilecolumn black'>
                            <span>From 108,875 to 2,704,636</span>
                            <span style={{ fontSize: "64px", color: "white" }}>+ 2,386%</span>
                            <span>Growth in the number of Ornikar users</span>
                        </div>
                    </div>

                    <div className='profilerow'>
                        <div style={{ marginTop: "5vh", paddingInline: "15vh", width: "100%" }}>
                            <div class="framer-2o0271" id="money">
                                <div class="framer-x9m1eb"
                                    style={{ opacity: 1, transform: "translateX(0px) translateY(0) scale(1) rotate(0deg) rotateX(0deg) rotateY(0deg) translateZ(0px)" }}>
                                    <div class="framer-8mavu0"></div>
                                    <div class="framer-16x9014"></div>
                                    <div class="framer-1lvsclt"></div>
                                    <div class="framer-1x4en10"></div>
                                    <div class="framer-bpo1nj"></div>
                                    <div class="framer-15daoq4"></div>
                                    <div className='caption'>
                                        <div>
                                            <span className='captionspan' style={{ fontSize: "100px" }}>146</span>
                                            <br />
                                            <span className='captionspan'>million</span>
                                        </div>
                                        <p style={{ color: "rgba(255,255,255,0.5)" }}>Total amount of funds raised by<br /> supported companies</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className='profilerow'>
                        <div className='profilecolumn' style={{ border: "8px solid #f4f4f4" }}>
                            <img src={propic2} alt='propic2' />
                            <p>"I had the chance to collaborate with Julien on our branding. I recommend 200%!"</p>
                            <div>
                                <span className='profilespan' style={{ fontSize: "20px" }}>Antonin Delfino</span><br />
                                <span className='profilespan' style={{ fontSize: "14px" }}>Co-founder @Ornikar</span><br />
                                <span className='profilespan' style={{ fontSize: "14px" }}>Co-founder @Skarlett</span>
                            </div>
                        </div>
                        <div className='profilecolumn black'>
                            <span>From 108,875 to 2,704,636</span>
                            <span style={{ fontSize: "64px", color: "white" }}>+ 2,386%</span>
                            <span>Growth in the number of Ornikar users</span>
                        </div>
                    </div>

                </div>
            </div> */}

                <div className='works'>
                    <div className='requestshead'>
                        <span>We envision a world where architects can<br />easily find the right vendors.</span>
                        <div style={{ marginBlock: "5vh" }}>
                            <p>for their projects, and vendors can effectively provide hands-on assistance with their offerings,<br /> leading to better design outcomes and a thriving industry".</p>
                        </div>
                    </div>

                    <div className='imgbody'>
                        <img src={pic} alt='img' />
                        <img src={pic1} alt='img' />
                    </div>
                </div>

                <div className='collaboration'>
                    <div className='requestshead'>
                        <span>In collaboration with</span>
                    </div>

                    <div className='collaborations'>
                        <img src={collablogo1} alt='img' />
                        <img src={collablogo2} alt='img' />
                        <div style={{ display: "flex", flexDirection: "row", alignItems: " center", justifyContent: "center", gap: "1vh" }}>
                            <img src={stantechlogo} alt='img' style={{ width: "10%" }} />
                            <img src={collablogo3} alt='img' />
                        </div>
                        <img src={collablogo4} alt='img' style={{ width: "20%" }} />
                    </div>
                </div>
            </div>
            <div className='footer'>
                <img src={footer} alt='footerimg' style={{ width: "100%" }} />

                <div className='introcontent' style={{ marginBlock: "10vh" }}>
                    <img src={logo} alt='logoimg' style={{ width: "3vh" }} />
                    <img src={logoFont} alt='logoimg' style={{ width: "18%" }} />
                </div>

                <span style={{ fontSize: "50px", fontWeight: "600", marginBlock: "5vh" }}>
                    We streamline communication, <br />so you can better serve your clients
                </span><br /><br /><br />

                <button className='offerbtn'>Join for Free</button><br /><br /><br />

                <p style={{ color: "rgba(0,0,0,0.5)" }}>® 2023 Vendorcontacts. All rights reserved.</p>
            </div>
        </>
    )
}
