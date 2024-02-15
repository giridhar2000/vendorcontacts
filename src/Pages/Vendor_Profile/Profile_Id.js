import React, { useState } from "react";
import $ from "jquery";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import bg1 from "../../Assets/img/img1.jpg";
import { AiOutlineArrowRight, AiOutlineUser, AiFillEdit } from "react-icons/ai";
import { BsFillChatDotsFill } from "react-icons/bs";
import "./Profile.css";
import PdfCard from "../../Components/PdfCard/PdfCard";
import { Button, Empty, Modal, Skeleton } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById, getUser, getAllDocs } from "../../utils/profile_helper";
import { useQuery, useMutation } from "react-query";
import {
  createChat,
  isChatExist,
  sendChatRequest,
} from "../../utils/chat_helper";
import { WechatOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const Profile = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  let { id } = useParams();
  const { data: profile, isLoading } = useQuery(
    `profile/${id}`,
    () => {
      return getUserById(id);
    },
    {
      enabled: id !== null,
    }
  );

  const { data: docs, isLoading: isLoading3 } = useQuery(
    ["docs", id],
    async () => {
      const res = await getAllDocs(id);
      return res;
    }
  );
  const { data: user, isLoading: isLoading2 } = useQuery("profile", getUser);

  //sending email after message request is being sent
  const sendEmailNotify = (receiver) => {
    var data = {
      service_id: "service_cpytsjm",
      template_id: "template_0jmwqsd",
      user_id: "F3rrwZwcav-0a-BOW",
      template_params: {
        name: receiver?.display_name,
        companyName: "VendorContacts",
        email: receiver?.email,
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
    console.log(receiver);
  };

  // Mutation for sending chat request to a user
  const send_chat_request_mutation = useMutation(sendChatRequest, {
    onSuccess: (data) => {
      if (data) {
        toast("Chat request sent!", { type: "success" });
      } else {
        toast("Chat request failed", { type: "error" });
      }
    },
  });
  async function handleChatClick(reciver_id, user_id) {
    if (!reciver_id || !user_id) return;
    try {
      let { status, data } = await isChatExist(reciver_id, user_id);
      if (!status) {
        setShowModal(true);
        return;
      }
      navigate("/chats", {
        state: {
          data,
        },
      });
    } catch (err) {}
  }

  if (isLoading || isLoading2) {
    return (
      <>
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
            <p>
              {profile?.display_name} &nbsp;
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                }}
                onClick={() => {
                  handleChatClick(profile?.id, user?.id);
                }}
              >
                <WechatOutlined className="chat-icn" />
              </button>{" "}
            </p>

            <p>{profile?.location}</p>
            {id === user?.id ? (
              <p onClick={() => navigate("/edit")}>
                Edit profile{" "}
                <button onClick={() => navigate("/edit")}>
                  <AiFillEdit />
                </button>
              </p>
            ) : null}
          </div>
        </div>
        <div className="profile-box-container">
          <div className="profile-box">
            <div className="line"></div>
            <p>{profile?.quote ? profile?.quote : "**Update your quote**"}</p>
          </div>
          {/* id !== user?.id ? (
            <div
              className="chat-icon"
              onClick={() => {
                if (user) {
                  create_chat_mutation.mutateAsync({
                    reciver: profile,
                    user,
                  });
                }
              }}
            >
              <BsFillChatDotsFill />
            </div>
          ) : null */}
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
              return <PdfCard doc={doc} key={doc.id} showDelete={false} />;
            })}
          </div>
        </div>
      </div>
      <Modal
        open={showModal}
        title="Chat with Vendor"
        onOk={() => {
          console.log(user);
          send_chat_request_mutation.mutateAsync({
            reciver: profile,
            sender: user,
          });
          sendEmailNotify(profile);
          setShowModal(false);
        }}
        okText="Yes"
        cancelText="No"
        onCancel={() => {
          setShowModal(false);
        }}
      >
        <p>
          Chat with {profile?.display_name} didn't exist do you want to send
          invite?
        </p>
      </Modal>
      <Footer />
    </>
  );
};

export default Profile;
