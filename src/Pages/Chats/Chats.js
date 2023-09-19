import React, { useContext, useEffect } from "react";
import "./Chats.css";
import Header from "../../Components/Header/Header";
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
import { MdOutlineNavigateNext } from "react-icons/md";
import { Switch, Empty, Modal, Spin } from "antd";
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
  createChat,
  getAllChatsByProjectId
} from "../../utils/chat_helper";
import { useQuery, useMutation, useQueryClient } from "react-query";
import UserContext from "../../contexts/userContext";
import ScrollToBottom from "react-scroll-to-bottom";
import { getAllUsers } from "../../utils/profile_helper";
import { createProject } from "../../utils/project_helper";
const onChange = (checked) => {
  console.log(`switch to ${checked}`);
};
const Chats = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [selectedChat, setSelectedChat] = useState(location?.state?.data);
  const [selectedProject, setSelectedProject] = useState(null);
  const [profile, isLoading] = useContext(UserContext);
  const [text, setText] = useState("");
  const [addChat, setAddChat] = useState(false);
  const [addProject, setAddProject] = useState(false);
  const [addChatToProject, setAddChatToProject] = useState(false);
  const [projectAdding, setProjectAdding] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [selectedChatIds, setSelectedChatIds] = useState([]);
  const [selectedChats, setSelectedChats] = useState([]);

  //Fetching chats of a particular user
  const { data: profiles, isLoading: isLoading4 } = useQuery(
    ["users", profile?.id],
    async () => {
      let data = await getAllUsers(profile?.id, profile?.type);
      return data;
    }
  );

  //Fetching chats of a particular user
  const { data: chats, isLoading: isLoading2 } = useQuery(
    ["chats", profile?.id],
    async () => {
      let data = await getAllChats(profile?.id);
      return data;
    }
  );
  //Fetching chats of a particular project
  const { data: chatsOfProject, isLoading: isLoading5 } = useQuery(
    ["chatsOfProject", profile?.id,selectedProject?.project_id],
    async () => {
      let data = await getAllChatsByProjectId(profile?.id,selectedProject?.project_id);
      return data;
    },{
      enabled:selectedProject?.project_id !== null
    }
  );

  // Fetching projects of a particular user
  const { data: projects, isLoading: isLoading3 } = useQuery(
    ["projects", profile?.id],
    async () => {
      let data = await getAllProjects(profile?.id,profile?.type);
      return data;
    }
  );


  // Fetching all messages from a chat
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

  // Mutation for Creating chat
  const create_chat_mutation = useMutation(createChat, {
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries(["chats", profile?.id]);
        setSelectedChat(data);
        setAddChat(false);
      }
    },
  });

  // Mutation for Creating a project
  const create_project_mutation = useMutation(createProject, {
    onSuccess: (data) => {
      if (data) {
        selectedChats.forEach((chat) => {
          create_chats_mutation.mutateAsync({
            reciver: chat,
            user: profile,
            project_id: data,
          });
        });
        setProjectAdding(false);
        setSelectedChats([]);
        setSelectedChatIds([]);
        setProjectName("");
        setAddProject(false);
      }
    },
  });
  // Mutation for Creating chats in a project
  const create_chats_mutation = useMutation(createChat, {
    onSuccess: (data) => {
      if (data) {
      }
    },
  });

  // Fetching chats and messages info in real time
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
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        (payload) => {
          queryClient.invalidateQueries(["projects", profile?.id]);
        }
      )

      .subscribe();
    return () => {
      chats.unsubscribe();
      setSelectedChat(null);
    };
  }, []);

  //Handling selection of chats in creating a new project
  function handleSelectChats(profile) {
    if (selectedChatIds.includes(profile?.id)) {
      setSelectedChats((old) => {
        return old.filter((item) => item.id !== profile.id);
      });
      setSelectedChatIds((old) => {
        return old.filter((item) => item !== profile?.id);
      });
      return;
    }
    setSelectedChatIds((old) => {
      return [...old, profile?.id];
    });
    setSelectedChats((old) => {
      return [...old, profile];
    });
  }

  //Returning loading indicator
  if (isLoading || isLoading3 || isLoading2 || isLoading4) {
    return <p>Loading....</p>;
  }

  async function handleAddProject() {
    setProjectAdding(true);
    create_project_mutation.mutateAsync({
      user_id: profile?.id,
      name: projectName,
    });
  }
  return (
    <>
      <Header />
      <div className="messages-container">
        {!selectedChat && !selectedProject ? (
          <div className="messages-box-container">
            <p>Messages</p>
            <div className="messages-box">
              <div className="projects">
                <div className="projects-header">
                  <p>Projects</p>
                  <div className="header-icons">
                    <AiOutlinePlusCircle onClick={() => setAddProject(true)} />
                  </div>
                </div>
                <div className="projects-body">
                  {!projects || projects?.length === 0 ? (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={"No projects"}
                    />
                  ) : (
                    projects
                      ?.sort(
                        (a, b) =>
                          Date.parse(b.created_at) - Date.parse(a.created_at)
                      )
                      ?.map((project, i) => {
                        return (
                          <Project
                            index={i}
                            last={projects?.length - 1}
                            project={project}
                            user_id={profile?.id}
                            key={project?.id}
                            setSelectedProject={setSelectedProject}
                          />
                        );
                      })
                  )}
                </div>
              </div>
              <div className="vendors">
                <div className="vendors-header">
                  <p>{profile?.type === "vendor" ? "Architects" : "Vendors"}</p>
                  <div className="header-icons">
                    <AiOutlinePlusCircle onClick={() => setAddChat(true)} />
                  </div>
                </div>
                <div className="vendors-body">
                  {chats && chats?.length === 0 ? (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={"No chats"}
                    />
                  ) : (
                    chats
                      ?.sort(
                        (a, b) =>
                          Date.parse(b.updated_at) - Date.parse(a.updated_at)
                      )
                      ?.map((chat, i) => {
                        return (
                          <Chat
                            index={i}
                            last={chats?.length - 1}
                            chat={chat}
                            user_id={profile?.id}
                            key={chat?.id}
                            selectedChat={selectedChat}
                            setSelectedChat={setSelectedChat}
                          />
                        );
                      })
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : selectedProject === null ? (
          <div className="messages-box-container message-box-container-sc">
            <p
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <BsSkipBackwardCircleFill
                onClick={() => {
                  setSelectedChat(false);
                  setSelectedProject(null)
                }}
                style={{ marginRight: ".4rem", cursor: "pointer" }}
              />{" "}
              Messages
            </p>
            <div className="messages-box messages-box-sc">
              <div className="projects projects-sc">
                <div className="projects-header">
                  <p>Chats</p>
                  <div className="header-icons">
                    <AiOutlinePlusCircle onClick={() => setAddChat(true)} />
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
        ) : (
          <div className="messages-box-container message-box-container-sc">
            <p
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <BsSkipBackwardCircleFill
                onClick={() => {
                  setSelectedProject(null);
                  setSelectedChat(false)
                }}
                style={{ marginRight: ".4rem", cursor: "pointer" }}
              />{" "}
              Chats
            </p>
            <div className="messages-box messages-box-sc">
              <div className="projects projects-sc">
                <div className="projects-header">
                  <p>{selectedProject?.name}</p>
                  <div className="header-icons">
                    <AiOutlinePlusCircle onClick={() => setAddChatToProject(true)} />
                  </div>
                </div>
                <div className="projects-body">
                  {chatsOfProject
                    ?.sort(
                      (a, b) =>
                        Date.parse(b.updated_at) - Date.parse(a.updated_at)
                    )
                    .map((chat) => {
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
        <Modal
          title={
            profile?.type === "vendor"
              ? "Select Architect to chat"
              : "Select Vendor to chat"
          }
          centered
          footer={null}
          open={addChat}
          onCancel={() => setAddChat(false)}
          bodyStyle={{
            maxHeight: "500px",
            overflowY: "auto",
          }}
        >
          {profiles
            ?.sort(
              (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
            )
            ?.map((reciver, i) => {
              return (
                <div
                  key={reciver?.id}
                  className={`projects-chat`}
                  onClick={() => {
                    if (profile) {
                      create_chat_mutation.mutateAsync({
                        reciver,
                        user: profile,
                      });
                    }
                  }}
                >
                  <div className="chat-pic">
                    {reciver?.profile_pic ? (
                      <img src={reciver?.profile_pic} />
                    ) : (
                      <AiOutlineUser />
                    )}
                  </div>
                  <div className="chat-info">
                    <p>{reciver?.display_name}</p>
                    <p>
                      {reciver?.bio
                        ? reciver?.bio?.substring(0, 52)
                        : null}
                    </p>
                  </div>
                </div>
              );
            })}
        </Modal>
        <Modal
          title={
            "Add chat to " +selectedProject?.name
          }
          centered
          footer={null}
          open={addChatToProject}
          onCancel={() => setAddChatToProject(false)}
          bodyStyle={{
            maxHeight: "500px",
            overflowY: "auto",
          }}
        >
          {profiles
            ?.sort(
              (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
            )
            ?.map((reciver, i) => {
              return (
                <div
                  key={reciver?.id}
                  className={`projects-chat`}
                  onClick={() => {
                    if (profile) {
                      create_chat_mutation.mutateAsync({
                        reciver,
                        user: profile,
                      });
                    }
                  }}
                >
                  <div className="chat-pic">
                    {reciver?.profile_pic ? (
                      <img src={reciver?.profile_pic} />
                    ) : (
                      <AiOutlineUser />
                    )}
                  </div>
                  <div className="chat-info">
                    <p>{reciver?.display_name}</p>
                    <p>
                      {reciver?.bio
                        ? reciver?.bio?.substring(0, 52)
                        : null}
                    </p>
                  </div>
                </div>
              );
            })}
        </Modal>
        <Modal
          title={
            profile?.type === "vendor"
              ? "Select Architects in Project "+ projectName
              : "Select Vendors in Project "+ projectName 
          }
          centered
          footer={[
            <button
              className="create-project"
              onClick={handleAddProject}
              disabled={projectAdding}
            >
              {projectAdding ? (
                <>
                  Creating project <Spin />
                </>
              ) : (
                <>
                  Create project <MdOutlineNavigateNext />
                </>
              )}
            </button>,
          ]}
          open={addProject}
          onCancel={() => setAddProject(false)}
          bodyStyle={{
            maxHeight: "500px",
            overflowY: "auto",
          }}
        >
          <div className="nameip project-input">
            <input
              value={projectName}
              placeholder="Project Name"
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <h3>Select Members</h3>

          {profiles
            ?.sort(
              (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
            )
            ?.map((reciver, i) => {
              return (
                <div
                  key={reciver?.id}
                  className={`projects-chat ${
                    selectedChatIds.includes(reciver.id) ? "bg-dark" : ""
                  }`}
                  onClick={() => {
                    handleSelectChats(reciver);
                  }}
                >
                  <div className="chat-pic">
                    {reciver?.profile_pic ? (
                      <img src={reciver?.profile_pic} />
                    ) : (
                      <AiOutlineUser />
                    )}
                  </div>
                  <div className="chat-info">
                    <p>{reciver?.display_name}</p>
                    <p>
                      {reciver?.bio
                        ? reciver?.bio?.substring(0, 52)
                        : null}
                    </p>
                  </div>
                </div>
              );
            })}
        </Modal>
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

function Chat({ index, last, chat, user_id, selectedChat, setSelectedChat }) {
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
            ? chat?.recent_message?.substring(0, 10)
            : ""}
        </p>
      </div>
      <div className="chat-time">
        <p>08:30 PM</p>
      </div>
    </div>
  );
}
function Project({ index, last, project, user_id,setSelectedProject }) {
  let { name, pic } = project;

  return (
    <div className={`projects-chat ${last === index ? "" : "border-bottom"}`} onClick={()=>setSelectedProject(project)}>
      <div className="chat-pic">
        {pic ? <img src={pic} /> : <AiOutlineUser />}
      </div>
      <div className="chat-info">
        <p>{name}</p>
      </div>
      <div className="chat-time">
        <Switch defaultChecked onChange={onChange} size="small" />

        <p>08:30 PM</p>
      </div>
    </div>
  );
}
export default Chats;
