import React, { useState, useContext, useEffect } from "react";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import bg1 from "../../Assets/img/img1.jpg";
import { ImPencil } from "react-icons/im";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { FiCamera } from "react-icons/fi";
import "./Edit.css";
import supabase from "../../utils/supabase.config";
import { toast } from "react-toastify";
import { getUser, updateUserProfile } from "../../utils/profile_helper";
import { useNavigate } from "react-router-dom";
import UserContext from "../../contexts/userContext";
import { UploadOutlined } from '@ant-design/icons';
import { useQuery } from "react-query";
import FileUpload from "../../Components/FileUpload/FileUpload";
const Edit = () => {
  const {data:profile,isLoading}=useQuery('profile',getUser)
  let navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [location, setLocation] = useState(null);
  const [quote, setQuote] = useState(null);
  const [bio, setBio] = useState(null);


  const checkFileExists = async (bucketName, filePath) => {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(filePath);

    if (error) {
      console.error(error);
      return false;
    }

    const files = data.filter((item) => item.name === filePath);
    return files.length > 0;
  };

  async function handleUpload(e) {
    const maxSize=5*1024*1024 // 5mb
    if(e.target.files[0]?.size > maxSize ){
      e.target.value="";
      toast("Max size limit is 5MB",{type:"error"});
      return;
    }
    let file;
    if (e.target.files && e.target.files.length) {
      file = e.target.files[0];
    }

    const fileExists = await checkFileExists(
      "profile_pics",
      `public/${file.name}`
    );
    if (fileExists) {
      const { data, error } = await supabase.storage
        .from("profile_pics")
        .update("public/" + file?.name, file, {
          cacheControl: "3600",
          upsert: true,
        });

      return;
    }

    const { data, error } = await supabase.storage
      .from("profile_pics")
      .upload("public/" + file?.name, file);
    setUrl(
      `https://kzthdyjkhdwyqztvlvmp.supabase.co/storage/v1/object/public/profile_pics/public/${file.name}`
    );
  }

  async function updateProfile() {
    let name;
    if (!firstName && !lastName) {
      name = profile?.display_name;
    } else {
      name = firstName + " " + lastName;
    }
    const res = await updateUserProfile(
      url || profile?.profile_pic,
      name,
      email || profile?.email,
      location || profile?.location,
      quote || profile?.quote,
      bio || profile?.bio
    );
    if (res) {
      toast("Profile updated", { type: "success" });
      navigate("/profile");
    } else {
      toast("Profile not updated", { type: "error" });
    }
  }

  if (isLoading) {
    return <p>Loading....</p>;
  }

  return (
    <>
      <Header />
      <div className="cover-pic">
        <img src={bg1} alt="bg" />
        <button className="coverbtn">
          <FiCamera />
          &nbsp; Change Photo
        </button>
      </div>
      <div className="login">
        <div className="loginContainer">
          <div className="loginform">
            <div className="photo">
              <input
                type="file"
                accept="image/*"
                id="profile_pic"
                onChange={handleUpload}
              />
              <label htmlFor="profile_pic" className="profile_pic_label">
                {url ? <img src={url} /> : profile?.profile_pic ?<img src={profile?.profile_pic} /> : <AiOutlineCloudUpload />}
              </label>
              <p>{url ? "Uploaded" : "Upload your logo here"}</p>
            </div>
            <div className="names">
              <div className="nameip">
                <input
                  placeholder="First name"
                  value={profile?.display_name && firstName ===null ? profile?.display_name?.split(' ')[0] :firstName }
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="nameip">
                <input
                  placeholder="Last name"
                  value={profile?.display_name && lastName ===null ? profile?.display_name?.split(' ')[1] :lastName }
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <button className="editbtn" onClick={updateProfile}>
                <ImPencil />
                &nbsp; Edit Profile
              </button>
            </div>
            <div className="emailip">
              <input
                placeholder="Buisness Email"
                value={profile?.email && email ===null ? profile?.email :email }
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="emailip">
              <input
                placeholder="Location"
                value={profile?.location && location ===null ? profile?.location:location }
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="passip">
              <input
                placeholder="Profile Quote"
                value={profile?.quote && quote ===null ? profile?.quote :quote }
                onChange={(e) => setQuote(e.target.value)}
              />
            </div>
            {/* <div className='passip'>
              <input placeholder='Bio' type={cip} />
            </div> */}
            <div className="bio">Bio</div>
            <textarea
              class="textarea"
              id="txtInput"
              maxLength="500"
              value={profile?.bio && bio ===null ? profile?.bio :bio }
              onChange={(e) => setBio(e.target.value)}
            ></textarea>
            <div className="bio">Attachment</div>
            <div className="attachment">
              <label for="file-upload" class="custom-file-upload" id="docpicker">
                Upload
                &nbsp;{url ? <file src={url} /> : <UploadOutlined />}
                <input 
                type="file" 
                id="docpicker"
                accept=".pdf,image/*,.doc,.docx,.xml, application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                onChange={handleUpload}/>
              </label>
              {/* <FileUpload /> */}
            </div>
            <script
              src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js"
              type="text/javascript"
            ></script>
            <script>$("#txtInput").autogrow();</script>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Edit;
