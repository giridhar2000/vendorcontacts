import React from "react";
import "./Chats.css";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import {
  AiOutlinePlusCircle,
  AiOutlineUser,
  AiOutlineSend,
} from "react-icons/ai";
import { BsThreeDotsVertical, BsMicFill } from "react-icons/bs";
import { Switch } from "antd";
import { useState } from "react";
const onChange = (checked) => {
  console.log(`switch to ${checked}`);
};
const Chats = () => {
  const [selectedChat, setSelectedChat] = useState(true);
  return (
    <>
      <Header />
      <div className="messages-container">
        {!selectedChat ? (
          <div className="messages-box-container">
            <p>Messages</p>
            <div className="messages-box">
              <div className="projects">
                <div className="projects-header">
                  <p>Projects</p>
                  <div className="header-icons">
                    <AiOutlinePlusCircle />
                    <BsThreeDotsVertical />
                  </div>
                </div>
                <div className="projects-body">
                  <Chat />
                  <Chat />
                  <Chat />
                  <Chat />
                </div>
              </div>
              <div className="vendors">
                <div className="vendors-header">
                  <p>Vendors</p>
                  <div className="header-icons">
                    <AiOutlinePlusCircle />
                    <BsThreeDotsVertical />
                  </div>
                </div>
                <div className="vendors-body">
                  <Chat isSwitch={false} />
                  <Chat isSwitch={false} />
                  <Chat isSwitch={false} />
                  <Chat isSwitch={false} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="messages-box-container message-box-container-sc">
            <p>Messages</p>
            <div className="messages-box messages-box-sc">
              <div className="projects projects-sc">
                <div className="projects-header">
                  <p>Projects</p>
                  <div className="header-icons">
                    <AiOutlinePlusCircle />
                    <BsThreeDotsVertical />
                  </div>
                </div>
                <div className="projects-body">
                  <Chat />
                  <Chat />
                  <Chat />
                  <Chat />
                </div>
              </div>
              <div className="vendors vendors-sc">
                <div className="vendors-body vendors-body-sc">
                  <div className="mine">
                    <p>simply dummy text of the industry's standard.</p>
                    <p>08:00 PM</p>
                  </div>
                  <div className="others">
                    <p>simply dummy text of the industry's standard.</p>
                    <p>08:00 PM</p>
                  </div>
                  <div className="mine">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s
                    </p>
                    <p>08:00 PM</p>
                  </div>
                  <div className="others">
                    <p>simply dummy text of the industry's standard.</p>
                    <p>08:00 PM</p>
                  </div>
                  <div className="mine">
                  <p>simply dummy text of the industry's standard.</p>
                  <p>08:00 PM</p>
                </div>
                <div className="mine">
                <p>simply dummy text of the industry's standard.</p>
                <p>08:00 PM</p>
              </div>
              <div className="mine">
              <p>simply dummy text of the industry's standard.</p>
              <p>08:00 PM</p>
            </div>
                </div>
                <div className="chat-input">
                  <form className="header-form">
                    <button>
                      <BsMicFill />
                    </button>
                    <input
                      className="header-input"
                      placeholder="Write your message..."
                      required
                      type="text"
                    />
                    <button>
                      <div className="form-button">
                        <AiOutlineSend />
                      </div>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    
    </>
  );
};
function Chat({ isSwitch = true }) {
  return (
    <div className="projects-chat">
      <div className="chat-pic">
        <AiOutlineUser />
      </div>
      <div className="chat-info">
        <p>Project A</p>
        <p>we need to recoznize ...</p>
      </div>
      <div className="chat-time">
        {isSwitch ? (
          <Switch defaultChecked onChange={onChange} size="small" />
        ) : null}

        <p>08:30 PM</p>
      </div>
    </div>
  );
}
export default Chats;
