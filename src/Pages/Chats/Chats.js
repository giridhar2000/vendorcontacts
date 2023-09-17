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
  getAllChats,
  getAllProjects,
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

  const { data: chats, isLoading: isLoading2 } = useQuery(
    ["chats", profile?.id],
    async () => {
      let data = await getAllChats(profile?.id);
      return data;
    }
  );
  const { data: projects, isLoading: isLoading3 } = useQuery(
    ["projects", profile?.id],
    async () => {
      let data = await getAllProjects(profile?.id);
      return data;
    }
  );

  let { data: messages } = useQuery(
    ["messaagelist", selectedChat?.chat_id],
    () => getMessages(selectedChat?.chat_id),
    {
      enabled: selectedChat?.chat_id != null,
    }
  );

  // Mutation for sending message
  const send_message_mutation = useMutation(sendMessage, {
    onSuccess: (data) => {
      setText("");
    },
  });

  useEffect(() => {
    const chats = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload) => {
          queryClient.invalidateQueries([
            "messaagelist",
            payload?.new?.chat_id,
          ]);
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chats" },
        (payload) => {
          queryClient.invalidateQueries(["chats", profile?.id]);
        }
      )

      .subscribe();
    return () => {
      chats.unsubscribe();
      setSelectedChat(null);
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
                  {projects
                    ?.sort(
                      (a, b) =>
                        Date.parse(b.updated_at) - Date.parse(a.updated_at)
                    )
                    ?.map((chat) => {
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
                  <p>{profile?.type === "vendor" ? "Architects" : "Vendors"}</p>
                  <div className="header-icons">
                    <AiOutlinePlusCircle />
                    <BsThreeDotsVertical />
                  </div>
                </div>
                <div className="vendors-body">
                  {chats
                    ?.sort(
                      (a, b) =>
                        Date.parse(b.updated_at) - Date.parse(a.updated_at)
                    )
                    ?.map((chat, i) => {
                      return (
                        <Chat
                          index={i}
                          last={chats?.length - 1}
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
                  <p>Chats</p>
                  <div className="header-icons">
                    <AiOutlinePlusCircle />
                    <BsThreeDotsVertical />
                  </div>
                </div>
                <div className="projects-body">
                  {chats
                    ?.sort(
                      (a, b) =>
                        Date.parse(b.updated_at) - Date.parse(a.updated_at)
                    )
                    .map((chat) => {
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
              <div className="vendors vendors-sc">
                <Messeges messages={messages} profile={profile} />
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

function Messeges({ messages, profile }) {
  return (
    <div className="vendors-body vendors-body-sc">
      <ScrollToBottom className="scroll" checkInterval={17} sticky={true}>
        {messages?.map((message) => {
          return (
            <div
              key={message.id}
              className={`${
                message?.sender_id === profile?.id ? "mine" : "others"
              }`}
            >
              <p>{message?.text}</p>
              <p>08:00 PM</p>
            </div>
          );
        })}
      </ScrollToBottom>
    </div>
  );
}

function Chat({
  index,
  last,
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
      } ${last === index ? "" : "border-bottom"}`}
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
