import React, { useContext } from "react";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import bg1 from "../../Assets/img/img1.jpg";
import { AiOutlineUser, AiFillEdit } from "react-icons/ai";
import "./Profile.css";
import PdfCard from "../../Components/PdfCard/PdfCard";
import { Empty, Skeleton } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../../contexts/userContext";
import { getAllDocs } from "../../utils/profile_helper";
import { useQuery } from "react-query";
const Profile = () => {
  const navigate = useNavigate();
  let { id } = useParams();
  const [profile, isLoading] = useContext(UserContext);
  const { data: docs, isLoading: isLoading2 } = useQuery(
    ["docs", profile?.id],
    async () => {
      const res = await getAllDocs(profile?.id);
      return res;
    }
  );

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
        {profile?.cover_pic ? (
          <img src={profile?.cover_pic} alt="bg" />
        ) : (
          <img src={bg1} alt="bg" />
        )}

        {profile?.profile_pic ? (
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
            <p onClick={() => navigate("/edit")}>
              Edit profile{" "}
              <button onClick={() => navigate("/edit")}>
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
        <div className="profile-box-container">
          <div className="profile-box">
            <div className="line"></div>
            <p>{profile?.quote ? profile?.quote : "**Update your quote**"}</p>
          </div>
        </div>

        <div className="profile-desc">
          <h1>{profile?.bio ? profile?.bio.substring(0, 33) : ""}</h1>
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
            {docs?.map((doc) => {
              return <PdfCard doc={doc} key={doc.id} />;
            })}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Profile;
