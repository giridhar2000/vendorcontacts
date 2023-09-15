import React, { useContext, useEffect } from "react";
import "./Chats.css";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import {
  AiOutlinePlusCircle,
  AiOutlineUser,
  AiOutlineSend,
} from "react-icons/ai";
import {
  BsThreeDotsVertical,
  BsMicFill,
  BsSkipBackwardCircleFill,
} from "react-icons/bs";
import { Switch } from "antd";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import supabase from "../../utils/supabase.config";
import {
  getAllVendorsChats,
  getAllProjectsChats,
  printName,
  printPic,
  sendMessage,
  getMessages,
} from "../../utils/chat_helper";
import { useQuery, useMutation, useQueryClient } from "react-query";
import UserContext from "../../contexts/userContext";
import ScrollToBottom from "react-scroll-to-bottom";
const onChange = (checked) => {
  console.log(`switch to ${checked}`);
};
const Chats = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [selectedChat, setSelectedChat] = useState(location?.state?.data);
  const [profile, isLoading] = useContext(UserContext);
  const [text, setText] = useState("");
  const { data: vendors_chat, isLoading: isLoading2 } = useQuery(
    `vendors/${profile?.id}`,
    async ()=>{
      let data= await getAllVendorsChats(profile?.id);
      return data;
    }
  );
  const { data: projects_chat, isLoading: isLoading3 } = useQuery(
    `projects/${profile?.id}`,
    async()=>{
      let data= await getAllProjectsChats(profile?.id);
      return data;
    }
  );

  let { data: messages } = useQuery(
    ["messaagelist", selectedChat?.chat_id],
    () => getMessages(selectedChat?.chat_id),
    {
      enabled: selectedChat !== null,
    }
  );
  // Mutation for sending message
  const send_message_mutation = useMutation(sendMessage, {
    onSuccess: (data) => {
      setText("");
      // Invalidate and refetch
      // queryClient.invalidateQueries(['messaagelist', chatData?.chat_id])
      // update_latest_message_mutation.mutate({ text: textRef.current.value, chatData })
      // add_chat_notification.mutate({ reciver_id: data?.reciver_id, chat_id: data?.chat_id, message_id: data?.id })
    },
  });

  useEffect(() => {
    const messages = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload) => {
          queryClient.invalidateQueries([
            "messaagelist",
            payload?.new?.chat_id,
          ]);
          console.log(payload);
        }
      )
      .subscribe();
    return () => {
      messages.unsubscribe();
    };
  }, []);

  if (isLoading || isLoading3 || isLoading2) {
    return <p>Loading....</p>;
  }
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
                  {projects_chat?.map((chat) => {
                    return (
                      <Chat
                        chat={chat}
                        user_id={profile?.id}
                        key={chat?.id}
                        selectedChat={selectedChat}
                        setSelectedChat={setSelectedChat}
                      />
                    );
                  })}
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
                  {vendors_chat?.map((chat) => {
                    return (
                      <Chat
                        isSwitch={false}
                        chat={chat}
                        user_id={profile?.id}
                        key={chat?.id}
                        selectedChat={selectedChat}
                        setSelectedChat={setSelectedChat}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="messages-box-container message-box-container-sc">
            <p
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <BsSkipBackwardCircleFill
                onClick={() => setSelectedChat(false)}
                style={{ marginRight: ".4rem", cursor: "pointer" }}
              />{" "}
              Messages
            </p>
            <div className="messages-box messages-box-sc">
              <div className="projects projects-sc">
                <div className="projects-header">
                  <p>
                    {selectedChat?.type === "vendor" ? "Vendors" : "Projects"}
                  </p>
                  <div className="header-icons">
                    <AiOutlinePlusCircle />
                    <BsThreeDotsVertical />
                  </div>
                </div>
                <div className="projects-body">
                  {selectedChat?.type === "vendor"
                    ? vendors_chat?.map((chat) => {
                        return (
                          <Chat
                            isSwitch={false}
                            chat={chat}
                            user_id={profile?.id}
                            key={chat?.id}
                            selectedChat={selectedChat}
                            setSelectedChat={setSelectedChat}
                          />
                        );
                      })
                    : projects_chat.map((chat) => {
                        return <Chat chat={chat} />;
                      })}
                </div>
              </div>
              <div className="vendors vendors-sc">
                <div className="vendors-body vendors-body-sc">
                  <ScrollToBottom
                    className="scroll"
                    checkInterval={17}
                    sticky={true}
                  >
                    {messages?.map((message) => {
                      return (
                        <div key={message.id} className={`${message?.sender_id===profile?.id ? 'mine' :'others'}`}>
                          <p>{message?.text}</p>
                          <p>08:00 PM</p>
                        </div>
                      );
                    })}
                    
                  </ScrollToBottom>
                </div>
                <div className="chat-input">
                  <div
                    className="header-form"
                    onKeyDown={(e) => {
                      if (e.key == "Enter") {
                        send_message_mutation.mutate({
                          chatData: selectedChat,
                          text,
                          user_id: profile?.id,
                        });
                      }
                    }}
                  >
                    <button>
                      <BsMicFill />
                    </button>
                    <input
                      value={text}
                      className="header-input"
                      placeholder="Write your message..."
                      required
                      type="text"
                      onChange={(e) => setText(e.target.value)}
                    />
                    <button
                      onClick={() => {
                        send_message_mutation.mutate({
                          chatData: selectedChat,
                          text,
                          user_id: profile?.id,
                        });
                      }}
                    >
                      <div className="form-button">
                        <AiOutlineSend />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
function Chat({
  isSwitch = true,
  chat,
  user_id,
  selectedChat,
  setSelectedChat,
}) {
  let {
    sender_id,
    reciver_id,
    sender_name,
    reciver_name,
    sender_image,
    reciver_image,
  } = chat;
  return (
    <div
      className={`projects-chat ${
        selectedChat?.id === chat?.id ? "bg-dark" : ""
      }`}
      onClick={() => setSelectedChat(chat)}
    >
      <div className="chat-pic">
        {printPic(
          sender_id,
          reciver_id,
          sender_image,
          reciver_image,
          user_id
        ) ? (
          <img
            src={printPic(
              sender_id,
              reciver_id,
              sender_image,
              reciver_image,
              user_id
            )}
          />
        ) : (
          <AiOutlineUser />
        )}
      </div>
      <div className="chat-info">
        <p>
          {printName(sender_id, reciver_id, sender_name, reciver_name, user_id)}
        </p>
        <p>
          {chat?.recent_message
            ? chat?.recent_message?.substring(0, 10) + "..."
            : ""}
        </p>
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
