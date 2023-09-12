import React, { useEffect } from "react";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import bg1 from "../../Assets/img/img1.jpg";
import logo from "../../Assets/img/gensler_logo.png";
import { AiOutlineArrowRight, AiOutlineUser, AiFillEdit } from "react-icons/ai";
import "./Profile.css";
import PdfCard from "../../Components/PdfCard/PdfCard";
import supabase from "../../utils/supabase.config";
import { getUser } from "../../utils/profile_helper";
import { useQuery } from "react-query";
import { Empty, Skeleton } from "antd";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate=useNavigate();
  const { data: profile, isLoading } = useQuery("profile", getUser);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="cover-pic center">
          <Skeleton.Image active={isLoading} />
          <div className="profile-pic center">
            <Skeleton.Image active={isLoading} />
          </div>
        </div>
        <div
          className="profile-body"
          style={{ width: "100%", justifyContent: "center", margin: "40px 0" }}
        >
          <div className="profile-info"></div>

          <div className="profile-box center">
            <Skeleton
              active={isLoading}
              paragraph={{
                rows: 2,
              }}
            />
          </div>
          <div className="profile-desc center">
            <Skeleton
              active={isLoading}
              paragraph={{
                rows: 2,
              }}
            />
          </div>
          <div className="profile-downloads">
            <Skeleton
              active={isLoading}
              paragraph={{
                rows: 1,
              }}
            />
            <hr />
          </div>
        </div>

        <Footer />
      </>
    );
  }
  return (
    <>
      <Header />
      <div className="cover-pic">
        <img src={bg1} alt="bg" />
        {profile.profile_pic ? (
          <div className="profile-pic">
            <img src={profile?.profile_pic} alt="profile" />
          </div>
        ) : (
          <div className="profile-pic no-pic">
            <AiOutlineUser />
          </div>
        )}
      </div>
      <div className="profile-body">
        <div className="profile-info">
          <div className="profile-name">
            <p>{profile?.display_name}</p>
            <p>{profile?.location}</p>
            <p>
              Visit Rep's profile{" "}
              <button>
                <AiOutlineArrowRight />
              </button>
            </p>
            <p onClick={()=>navigate('/edit')}>
              Edit profile{" "}
              <button onClick={()=>navigate('/edit')}>
                <AiFillEdit />
              </button>
            </p>
          </div>
          <div className="profile-about">
            {profile?.bio ? (
              <p>{profile?.bio}</p>
            ) : (
              <p>
                <Empty description={"Update your Bio"} />
              </p>
            )}
          </div>
        </div>
        <div className="profile-box">
          <div className="line"></div>
          <p >
          {
            profile?.quote ?profile?.quote :"**Update your quote**"
          }
      
          </p>
        </div>
        <div className="profile-desc">
          <h1>{
          profile?.bio ? profile?.bio.substring(0,30):""
          }</h1>
          {profile?.bio ? (
            <p>{profile?.bio}</p>
          ) : (
            <p>
              <Empty description={"Update your Bio"} />
            </p>
          )}
          
        </div>
        <div className="profile-downloads">
          <p>Downloads</p>
          <hr />
          <div className="pdf-cards">
            <PdfCard />
            <PdfCard />
            <PdfCard />
            <PdfCard />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Profile;
