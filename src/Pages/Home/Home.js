import React from 'react'
import logo from '../../Assets/img/logo.svg'
import "../Home/Home.css"
import addreq from "../../Assets/img/addreq.svg"
import bell from "../../Assets/img/bell.svg"
import check from "../../Assets/img/check.svg"
import tick1 from "../../Assets/img/tick1.svg"
import tick2 from "../../Assets/img/tick2.svg"
import tick3 from "../../Assets/img/tick3.svg"
import tick4 from "../../Assets/img/tick4.svg"
import tick5 from "../../Assets/img/tick5.svg"
import tick6 from "../../Assets/img/tick6.svg"
import sun from "../../Assets/img/sun.svg"
import forward from "../../Assets/img/forward.svg"
import senior from "../../Assets/img/senior.svg"
import clock from "../../Assets/img/clock.svg"
import fast from "../../Assets/img/fast.svg"
import pause from "../../Assets/img/pause.svg"
import propic from "../../Assets/img/propic.png"

export default function Home() {

    return (
        <div className='home'>
            <div className='intro'>
                <img src={logo} alt='logoimg' />
                <div className='introcontent'>
                    <span>The unlimited</span>
                    <span>Design</span>
                    <span>subscription.</span>
                </div>

                <p>Entrust all your product design, branding and growth
                    <br /> projects to a top designer, unlimited and for a fixed monthly price.</p>

                <button className='offerbtn'>See offers</button>

                <p style={{ color: 'black', fontSize: "medium" }}>14 day free trial</p>

            </div>

            <div className='requests'>
                <div className='requestshead'>
                    <span>Unlimited requests. Satisfaction assured.</span>
                    <div style={{ marginBlock: "9vh" }}>
                        <p>Add all your requests on your dedicated table, then easily follow </p>
                        <p>their progress. Each task is completed one after the other, with </p>
                        <p>unlimited revisions until you sign off.</p>
                    </div>

                    <div className='requestsbody'>
                        <div className='requestsitem'>
                            <div className='requestsitemhead'>
                                <img src={addreq} alt='img' />
                                <h1>Add your requests.</h1>
                            </div>
                            <p>Create your unlimited requests, they will be carried out one by one and according to your priorities.</p>
                        </div>
                        <div className='requestsitem'>
                            <div className='requestsitemhead'>
                                <img src={bell} alt='img' />
                                <h1>Receive your designs.</h1>
                            </div>
                            <p>Your designs are ready in a few days, 48 hours for simple requests.</p>
                        </div>
                        <div className='requestsitem'>
                            <div className='requestsitemhead'>
                                <img src={check} alt='img' />
                                <h1>100% satisfaction assured.</h1>
                            </div>
                            <p>Not convinced yet? We iterate unlimited on the designs, until your go-ahead.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='buisness'>
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
            </div>

            <div className='about'>
                <div className='requestshead'>
                    <span>Ideal for start-ups. Great for scale-ups.</span>
                    <div style={{ marginBlock: "5vh" }}>
                        <p>The Flexboom subscription works at your own pace for all your </p>
                        <p>one-time and recurring Design needs. Accelerate with a top </p>
                        <p>designer by your side, less recruitment cost.</p>
                    </div>
                </div>

                <div className='aboutbody'>
                    <div className='aboutrow'>
                        <div className='aboutcolumn'>
                            <div className='requestsitemhead'>
                                <img src={sun} alt='img' />
                                <h1>A fixed price</h1>
                            </div>
                            <p>Known in advance and guaranteed without surprises, easy to plan for in your budget.</p>
                        </div>

                        <div className='aboutcolumn'>
                            <div className='requestsitemhead'>
                                <img src={forward} alt='img' />
                                <h1>Available immediately</h1>
                            </div>
                            <p>Forget long recruitments, entrust us with your tasks today.</p>
                        </div>

                        <div className='aboutcolumn'>
                            <div className='requestsitemhead'>
                                <img src={senior} alt='img' />
                                <h1>Senior Designer</h1>
                            </div>
                            <p>Work with a designer with over 10 years of experience.</p>
                        </div>
                    </div>

                    <div className='aboutrow'>
                        <div className='aboutcolumn'>
                            <div className='requestsitemhead'>
                                <img src={clock} alt='img' />
                                <h1>Asynchronous</h1>
                            </div>
                            <p>Your entire team participates in the design process at their own pace.</p>
                        </div>

                        <div className='aboutcolumn'>
                            <div className='requestsitemhead'>
                                <img src={fast} alt='img' />
                                <h1>Fast</h1>
                            </div>
                            <p>Your designs are ready in 48 hours for simple requests.</p>
                        </div>

                        <div className='aboutcolumn'>
                            <div className='requestsitemhead'>
                                <img src={pause} alt='img' />
                                <h1>Flexible subscription</h1>
                            </div>
                            <p>Pause the subscription or stop whenever you want.</p>
                        </div>
                    </div>
                </div>

            </div>

            <div className='profile'>
                <img src={propic} alt='profilepic' />
                <span>How can I help you ?</span>
                <div>
                    <p>All your requests are carried out by Julien Perrière, founder of </p>
                    <p>Flexboom. Julien has more than 10 years of experience in agencies and </p>
                    <p>startups. He was recently VP Design of Ornikar (French Tech Next40).</p>
                </div>
            </div>
        </div>
    )
}
