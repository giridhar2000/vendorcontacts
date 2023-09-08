import React,{ useState } from "react";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import bg1 from "../../Assets/img/img1.jpg";
import { ImPencil } from "react-icons/im";
import { FiCamera } from "react-icons/fi";
import "./Edit.css";

const Edit = () => {
  return (
    <>
      <Header />
      <div className="cover-pic">
        <img src={bg1} alt="bg" />
        <button className='coverbtn'><FiCamera/>&nbsp; Change Photo</button>
      </div>
      <div className='login'>
            <div className='loginContainer'>
                            <div className='loginform'>
                                <div className='names'>
                                    <div className='nameip'>
                                        <input placeholder='First name' />
                                    </div>
                                    <div className='nameip'>
                                        <input placeholder='Last name' />
                                    </div>
                                    <button className='editbtn'><ImPencil/>&nbsp; Edit Profile</button>
                                </div>
                                <div className='emailip'>
                                    <input placeholder='Buisness Email' />
                                </div>
                                <div className='passip'>
                                    <input placeholder='Profile Quote'/>
                                </div>
                                {/* <div className='passip'>
                                    <input placeholder='Bio' type={cip} />
                                </div> */}
                                <div className="bio">Bio</div>
                                <textarea class="textarea" id="txtInput">
                                </textarea>
                                 <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js" type="text/javascript"></script> 
                                 <script>
                                     $("#txtInput").autogrow();
                                 </script>
                            </div>
            </div>
        </div>
      <Footer />
    </>
  );
};

export default Edit;
