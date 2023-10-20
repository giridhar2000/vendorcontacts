import React, { useContext, useEffect, useRef, memo } from "react";
import "./Chats.css";
import Header from "../../Components/Header/Header";
import { debounce } from "lodash";
import {
  AiOutlinePlusCircle,
  AiOutlineUser,
  AiOutlineSend,
  AiOutlineSearch,
  AiOutlinePlus,
} from "react-icons/ai";
import {
  BsThreeDotsVertical,
  BsMicFill,
  BsSkipBackwardCircleFill,
} from "react-icons/bs";
import { MdOutlineNavigateNext } from "react-icons/md";
import { Switch, Empty, Modal, Spin, message, Avatar, Popover } from "antd";
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
  sendMessageToGroup,
  getMessagesFromGroup,
  formatSupabaseTimestampToTime,
  getSenderDetails,
  getReciverDetails,
  sendChatRequest,
} from "../../utils/chat_helper";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "react-query";
import UserContext from "../../contexts/userContext";
// import ScrollToBottom from "react-scroll-to-bottom";
import { getAllUsers } from "../../utils/profile_helper";
import {
  createProject,
  createGroupToProject,
  createMembers,
  getGroups,
  updateStatus,
  getMembers,
} from "../../utils/project_helper";
import { toast } from "react-toastify";

const Chats = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [selectedChat, setSelectedChat] = useState(location?.state?.data);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [profile, isLoading] = useContext(UserContext);
  const [text, setText] = useState("");
  const [addChat, setAddChat] = useState(false);
  const [addProject, setAddProject] = useState(false);
  const [addChatToProject, setAddChatToProject] = useState(false);
  const [projectAdding, setProjectAdding] = useState(false);
  const [groupAdding, setGroupAdding] = useState(false);
  const [createGroup, setCreateGroup] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedChatIds, setSelectedChatIds] = useState([]);
  const [selectedChats, setSelectedChats] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [input, setInput] = useState("");
  // const [chats, setChats] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(true);
  const [page, setPage] = useState(0);

  // Fetching all messages from a chat
  let {
    fetchNextPage: fetchNextPageMessages,
    hasNextPage: hasNextPageMessages,
    isFetchingNextPage: isFetchingNextPageMessages,
    data: messages,
  } = useInfiniteQuery(
    ["messaagelist", selectedChat?.chat_id],
    ({ pageParam = 0 }) => getMessages(selectedChat?.chat_id, pageParam),
    {
      enabled: selectedChat?.chat_id != null,
      getNextPageParam: (lastPage, allPages) => {
        return allPages?.length;
      },
    }
  );

  // Fetching all messages from a group
  let {
    fetchNextPage: fetchNextPageMessagesGroup,
    hasNextPage: hasNextPageMessagesGroup,
    isFetchingNextPage: isFetchingNextPageMessagesGroup,
    data: messagesOfGroup,
  } = useInfiniteQuery(
    ["messaagelist", selectedGroup?.group_id],
    ({ pageParam = 0 }) =>
      getMessagesFromGroup(selectedGroup?.group_id, pageParam),
    {
      enabled: selectedGroup?.group_id != null,
      getNextPageParam: (lastPage, allPages) => {
        return allPages?.length;
      },
    }
  );

  useEffect(() => {
    if (input === "") {
      setFilteredProfiles([]);
      return;
    }
    setFilteredProfiles((old) => {
      return profiles?.filter((value) =>
        value?.display_name?.toLowerCase()?.includes(input?.toLowerCase())
      );
    });
  }, [input]);

  //Fetching chats of a particular user
  const { data: profiles, isLoading: isLoading4 } = useQuery(
    ["users", profile?.id],
    async () => {
      let data = await getAllUsers(profile?.id, profile?.type);
      return data;
    }
  );

  // //Fetching chats of a particular user
  // const { data: chats, isLoading: isLoading2 } = useQuery(
  //   ["chats", profile?.id, page],
  //   async () => {
  //     const { from, to } = loadMoreData();
  //     console.log(from, to);
  //     let data = await getAllChats(profile?.id, null, from, to);
  //     // setChats((old) => [...data, ...old]);
  //     setIsChatLoading(false);
  //     return data;
  //   }
  // );

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data: chats,
  } = useInfiniteQuery(
    ["chats", profile?.id],
    ({ pageParam = 0 }) => getAllChats(profile?.id, null, pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        return allPages?.length;
      },
    }
  );

  //Fetching chats of a particular project
  const {
    fetchNextPage: fetchNextPageChatsOfProject,
    hasNextPage: hasNextPageChatsOfProject,
    isFetchingNextPage: isFetchingNextPageChatsOfProject,
    data: chatsOfProject,
  } = useInfiniteQuery(
    ["chatsOfProject", profile?.id, selectedProject?.project_id],
    ({ pageParam = 0 }) =>
      getAllChats(profile?.id, selectedProject?.project_id, pageParam),
    {
      enabled: selectedProject?.project_id !== null,
      getNextPageParam: (lastPage, allPages) => {
        return allPages?.length;
      },
    }
  );

  // Fetching projects of a particular user
  const {
    fetchNextPage: fetchNextPageProjects,
    hasNextPage: hasNextPageProjects,
    isFetchingNextPage: isFetchingNextPageProjects,
    data: projects,
    isLoading: isLoading3,
  } = useInfiniteQuery(
    ["projects", profile?.id],
    ({ pageParam = 0 }) => getAllProjects(profile?.id, pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        // console.log("Next page");
        return allPages?.length;
      },
    }
  );

  // Fetching all groups from a project
  let { data: groups } = useQuery(
    ["groups", selectedProject?.project_id],
    () => getGroups(selectedProject?.project_id),
    {
      enabled: selectedProject?.project_id != null && profile?.id !== null,
    }
  );

  // Fetching all messages from a chat
  let { data: groupMembers } = useQuery(
    ["memberList", profile?.id],
    () => getMembers(profile?.id),
    {
      enabled: profile?.id != null,
    }
  );

  // Mutation for sending message
  const send_message_mutation = useMutation(sendMessage, {
    onMutate: async () => {
      if (!text) return;
      try {
        await queryClient.cancelQueries([
          "messaagelist",
          selectedChat?.chat_id,
        ]);
        const prevMsg = queryClient.getQueryData([
          "messaagelist",
          selectedChat?.chat_id,
        ]);

        // getting sender details
        const { sender_id, sender_name, sender_image } = getSenderDetails(
          selectedChat.sender_id,
          selectedChat,
          profile?.id
        );

        // getting reciver details
        const { reciver_id, reciver_name, reciver_image } = getReciverDetails(
          selectedChat.sender_id,
          selectedChat,
          profile?.id
        );
        let newMsg = {
          created_at: new Date().toISOString().toLocaleString("zh-TW"),
          chat_id: selectedChat?.chat_id,
          reciver_id,
          reciver_name,
          reciver_image,
          sender_id,
          sender_name,
          sender_image,
          text,
        };
        let newData = [[...prevMsg?.pages[prevMsg?.pages?.length - 1], newMsg]];
        queryClient.setQueryData(
          ["messaagelist", selectedChat?.chat_id],
          (oldData) => ({
            pages: [...newData],
            pageParams: [...oldData.pageParams, prevMsg.pageParams[0] + 1],
          })
        );
        setText("");
        return { prevMsg };
      } catch (err) {
        // console.log(err);
      }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        ["messaagelist", selectedChat?.chat_id],
        () => context?.prevMsg
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(["messaagelist", selectedChat?.chat_id]);
    },
  });

  // Mutation for sending message to group
  const send_message_to_group_mutation = useMutation(sendMessageToGroup, {
    onMutate: async () => {
      if (!text) return;
      try {
        await queryClient.cancelQueries([
          "messaagelist",
          selectedGroup?.group_id,
        ]);
        const prevMsg = queryClient.getQueryData([
          "messaagelist",
          selectedGroup?.group_id,
        ]);

        let newMsg = {
          created_at: new Date().toISOString().toLocaleString("zh-TW"),
          group_id: selectedGroup?.group_id,
          sender_id: profile?.id,
          sender_name: profile?.display_name,
          sender_image: profile?.profile_pic,
          text,
        };
        let newData = [[...prevMsg?.pages[prevMsg?.pages?.length - 1], newMsg]];
        queryClient.setQueryData(
          ["messaagelist", selectedGroup?.group_id],
          (oldData) => ({
            pages: [...newData],
            pageParams: [...oldData.pageParams, prevMsg.pageParams[0] + 1],
          })
        );
        setText("");
        return { prevMsg };
      } catch (err) {
        // console.log(err);
      }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        ["messaagelist", selectedGroup?.group_id],
        () => context?.prevMsg
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(["messaagelist", selectedGroup?.group_id]);
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
  const create_members_mutation = useMutation(createMembers, {
    onSuccess: (data) => {
      if (data) {
      }
    },
  });

  // Mutation for Creating a group
  const create_group_mutation = useMutation(createGroupToProject, {
    onSuccess: (data) => {
      console.log(data);
      if (data) {
        console.log(data);
        selectedChats.forEach((chat) => {
          create_members_mutation.mutateAsync({
            reciver: chat,
            group_id: data,
          });
        });
        setGroupAdding(false);
        setSelectedChats([]);
        setSelectedChatIds([]);
        setGroupName("");
        setCreateGroup(false);
        setInput("");
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

  // Mutation for sending chat request to a user
  const send_chat_request_mutation = useMutation(sendChatRequest, {
    onSuccess: (data) => {
      if (data) {
        toast("Chat request sent!", { type: "success" });
      } else {
        toast("Chat request failed", { type: "error" });
      }
      setAddChat(false);
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
            payload?.new?.group_id,
          ]);
          queryClient.invalidateQueries([
            "messaagelist",
            payload?.new?.group_id,
          ]);
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "groups" },
        (payload) => {
          console.log(payload);
          queryClient.invalidateQueries([
            "groups",
            selectedProject?.project_id,
          ]);
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chats" },
        (payload) => {
          queryClient.invalidateQueries([
            "messaagelist",
            selectedChat?.chat_id,
          ]);
          queryClient.invalidateQueries(["chats", profile?.id]);
          queryClient.invalidateQueries([
            "chatsOfProject",
            profile?.id,
            selectedProject?.project_id,
          ]);
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
        return old?.filter((item) => item.id !== profile.id);
      });
      setSelectedChatIds((old) => {
        return old?.filter((item) => item !== profile?.id);
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

  async function handleAddProject() {
    if (projectName) {
      setProjectAdding(true);
      create_project_mutation.mutateAsync({
        user_id: profile?.id,
        name: projectName,
      });
    } else {
      setProjectAdding(false);
      message.error("provide project name");
    }
  }
  async function handleAddGroup() {
    if (groupName) {
      setGroupAdding(true);
      create_group_mutation.mutateAsync({
        user_id: profile?.id,
        project_id: selectedProject?.project_id,
        name: groupName,
      });
    } else {
      setGroupAdding(false);
      message.error("provide project name");
    }
  }
  function handleAddChatToProject(project_id) {
    if (!input) return;
    setProjectAdding(true);
    // console.log(project_id);
    const pr = new Promise((resolve, reject) => {
      selectedChats.forEach((chat, index, array) => {
        create_chats_mutation.mutateAsync({
          reciver: chat,
          user: profile,
          project_id,
        });
        if (index === array.length - 1) resolve();
      });
    });
    pr.then(() => {
      queryClient.invalidateQueries([
        "chatsOfProject",
        profile?.id,
        project_id,
      ]);
      setProjectAdding(false);
      setSelectedChats([]);
      setSelectedChatIds([]);
      setAddChatToProject(false);
    });
  }

  const content = (
    <div>
      <p
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        onClick={() => setCreateGroup(true)}
      >
        Create group
      </p>
    </div>
  );

  // Infinite scrolling logic ---------------------->

  async function handleScroll(e) {
    try {
      let fetching = false;
      const { scrollHeight, scrollTop, clientHeight } = e.target;
      if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.2) {
        fetching = true;
        if (hasNextPage) {
          await fetchNextPage();
        }

        fetching = false;
      }
    } catch (err) {
      // console.log(err)
    }
  }
  async function handleScrollChatsOfProject(e) {
    try {
      let fetching = false;
      const { scrollHeight, scrollTop, clientHeight } = e.target;
      if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.2) {
        fetching = true;
        if (hasNextPageChatsOfProject) {
          await fetchNextPageChatsOfProject();
        }

        fetching = false;
      }
    } catch (err) {
      // console.log(err)
    }
  }
  async function handleScrollProjects(e) {
    try {
      let fetching = false;
      const { scrollHeight, scrollTop, clientHeight } = e.target;
      if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.2) {
        fetching = true;
        if (hasNextPageProjects) {
          await fetchNextPageProjects();
        }

        fetching = false;
      }
    } catch (err) {
      // console.log(err)
    }
  }
  const handleDebouncedScroll = debounce((e) => handleScroll(e), 1000);
  const handleDebouncedScrollChatsOfProject = debounce(
    (e) => handleScrollChatsOfProject(e),
    1500
  );
  const handleDebouncedScrollProjects = debounce(
    (e) => handleScrollProjects(e),
    2000
  );

  //Returning loading indicator
  if (isLoading || isLoading3 || isLoading4) {
    return <p>Loading....</p>;
  }

  return (
    <>
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
                <div
                  className="projects-body"
                  onScroll={handleDebouncedScrollProjects}
                >
                  {!projects || projects?.pages[0]?.length === 0 ? (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={"No projects"}
                    />
                  ) : (
                    projects?.pages?.map((page) => {
                      return (
                        <>
                          {page
                            ?.sort(
                              (a, b) =>
                                Date.parse(b.created_at) -
                                Date.parse(a.created_at)
                            )
                            ?.map((project, i) => {
                              return (
                                <Project
                                  key={i}
                                  index={i}
                                  last={
                                    projects?.pages[projects?.length - 1]
                                      ?.length - 1
                                  }
                                  project={project}
                                  user_id={profile?.id}
                                  setSelectedProject={setSelectedProject}
                                />
                              );
                            })}
                        </>
                      );
                    })
                  )}
                  {isFetchingNextPageProjects ? (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Spin />
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="vendors">
                <div className="vendors-header">
                  <p>{profile?.type === "vendor" ? "Designers" : "Vendors"}</p>
                  {profile?.type === "vendor" && (
                    <div className="header-icons">
                      <AiOutlinePlusCircle onClick={() => setAddChat(true)} />
                    </div>
                  )}
                </div>
                <div className="vendors-body" onScroll={handleDebouncedScroll}>
                  {chats?.pages[0]?.length === 0 ? (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={"No chats"}
                    />
                  ) : (
                    chats?.pages?.map((page) => {
                      return (
                        <>
                          {page
                            ?.sort(
                              (a, b) =>
                                Date.parse(b.updated_at) -
                                Date.parse(a.updated_at)
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
                                  setSelectedGroup={setSelectedGroup}
                                />
                              );
                            })}
                        </>
                      );
                    })
                  )}
                  {isFetchingNextPage ? (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Spin />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : selectedProject === null && selectedChat ? (
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
                  setSelectedGroup(null);
                  setSelectedProject(null);
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
                <div className="projects-body" onScroll={handleDebouncedScroll}>
                  {chats?.pages?.map((page) => {
                    return (
                      <>
                        {page
                          ?.sort(
                            (a, b) =>
                              Date.parse(b.updated_at) -
                              Date.parse(a.updated_at)
                          )
                          ?.map((chat) => {
                            return (
                              <Chat
                                chat={chat}
                                user_id={profile?.id}
                                key={chat?.id}
                                selectedChat={selectedChat}
                                setSelectedChat={setSelectedChat}
                                setSelectedGroup={setSelectedGroup}
                              />
                            );
                          })}
                      </>
                    );
                  })}
                  {isFetchingNextPage ? (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Spin />
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="vendors vendors-sc">
                <Messeges
                  messages={messages}
                  profile={profile}
                  hide={!selectedChat && !selectedGroup}
                  fetchNextPageMessages={fetchNextPageMessages}
                  hasNextPageMessages={hasNextPageMessages}
                  isFetchingNextPageMessages={isFetchingNextPageMessages}
                />
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
                  setSelectedGroup(false);
                  setSelectedChat(false);
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
                    <AiOutlinePlusCircle
                      onClick={() => setAddChatToProject(true)}
                    />
                    <Popover
                      placement="bottomRight"
                      content={content}
                      trigger="click"
                    >
                      <BsThreeDotsVertical />
                    </Popover>
                  </div>
                </div>
                <div
                  className="projects-body"
                  onScroll={handleDebouncedScrollChatsOfProject}
                >
                  {groups && groups?.length >= 0 ? (
                    <p
                      style={{
                        borderBottom: "1px solid #000",
                        margin: "10px",
                        marginTop: "20px",
                        paddingBottom: "7px",
                        fontSize: ".7rem",
                      }}
                    >
                      Groups
                    </p>
                  ) : null}
                  {groups
                    ?.sort(
                      (a, b) =>
                        Date.parse(b.created_at) - Date.parse(a.created_at)
                    )
                    ?.filter((group) => {
                      let isSee = group?.created_by === profile?.id;
                      groupMembers?.forEach((member) => {
                        if (member?.group_id === group?.group_id) isSee = true;
                      });
                      return isSee;
                    })
                    ?.map((group) => {
                      return (
                        <Group
                          group={group}
                          user_id={profile?.id}
                          key={group?.id}
                          selectedGroup={selectedGroup}
                          setSelectedGroup={setSelectedGroup}
                          setSelectedChat={setSelectedChat}
                        />
                      );
                    })}
                  <p
                    style={{
                      borderBottom: "1px solid #000",
                      margin: "10px",
                      marginTop: "20px",
                      paddingBottom: "7px",
                      fontSize: ".7rem",
                    }}
                  >
                    Chats
                  </p>
                  {chatsOfProject?.pages?.map((page) => {
                    return (
                      <>
                        {page
                          ?.sort(
                            (a, b) =>
                              Date.parse(b.updated_at) -
                              Date.parse(a.updated_at)
                          )
                          ?.map((chat) => {
                            return (
                              <Chat
                                chat={chat}
                                user_id={profile?.id}
                                key={chat?.id}
                                selectedChat={selectedChat}
                                setSelectedChat={setSelectedChat}
                                setSelectedGroup={setSelectedGroup}
                              />
                            );
                          })}
                      </>
                    );
                  })}

                  {isFetchingNextPageChatsOfProject ? (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Spin />
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="vendors vendors-sc">
                {selectedGroup === null ? (
                  <>
                    <Messeges
                      messages={messages}
                      profile={profile}
                      hide={!selectedChat && !selectedGroup}
                      fetchNextPageMessages={fetchNextPageMessages}
                      hasNextPageMessages={hasNextPageMessages}
                      isFetchingNextPageMessages={isFetchingNextPageMessages}
                    />
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
                  </>
                ) : (
                  <>
                    <Messeges
                      messages={messagesOfGroup}
                      profile={profile}
                      hide={!selectedChat && !selectedGroup}
                      fetchNextPageMessages={fetchNextPageMessagesGroup}
                      hasNextPageMessages={hasNextPageMessagesGroup}
                      isFetchingNextPageMessages={
                        isFetchingNextPageMessagesGroup
                      }
                    />
                    <div className="chat-input">
                      <div
                        className="header-form"
                        onKeyDown={(e) => {
                          if (e.key == "Enter") {
                            send_message_to_group_mutation.mutate({
                              groupData: selectedGroup,
                              text,
                              profile,
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
                            send_message_to_group_mutation.mutate({
                              groupData: selectedGroup,
                              text,
                              profile,
                            });
                          }}
                        >
                          <div className="form-button">
                            <AiOutlineSend />
                          </div>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        <Modal
          title={
            profile?.type === "vendor"
              ? "Select Designer to send chat request"
              : "Select Vendor to send chat request"
          }
          footer={null}
          open={addChat}
          onCancel={() => setAddChat(false)}
          bodyStyle={{
            maxHeight: "500px",
            overflowY: "auto",
          }}
        >
          <div className="search-chat-input">
            <AiOutlineSearch />
            <input
              type="text"
              placeholder="Search here"
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          {filteredProfiles?.map((reciver, i) => {
            return (
              <div
                key={reciver?.id}
                className={`projects-chat`}
                onClick={() => {
                  if (profile) {
                    send_chat_request_mutation.mutateAsync({
                      reciver,
                      sender: profile,
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
                  <p>{reciver?.bio ? reciver?.bio?.substring(0, 52) : null}</p>
                </div>
              </div>
            );
          })}
        </Modal>

        <Modal
          title={"Add chat to " + selectedProject?.name}
          footer={[
            <button
              className="create-project"
              onClick={() => {
                handleAddChatToProject(selectedProject?.project_id);
              }}
              disabled={projectAdding}
            >
              {projectAdding ? (
                <>
                  Adding... <Spin />
                </>
              ) : (
                <>
                  <AiOutlinePlus /> Add
                </>
              )}
            </button>,
          ]}
          open={addChatToProject}
          onCancel={() => setAddChatToProject(false)}
          bodyStyle={{
            maxHeight: "500px",
            overflowY: "auto",
          }}
        >
          <div className="search-chat-input">
            <AiOutlineSearch />
            <input
              type="text"
              placeholder="Search here"
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          {filteredProfiles
            ?.filter((value) => {
              let bool = false;
              chatsOfProject?.pages?.map((page) => {
                page?.map((val) => {
                  if (val.chat_id.includes(value.id)) {
                    bool = true;
                  }
                });
              });

              if (!bool) return value;
            })
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
                      {reciver?.bio ? reciver?.bio?.substring(0, 52) : null}
                    </p>
                  </div>
                </div>
              );
            })}
        </Modal>

        <Modal
          title={
            profile?.type === "vendor"
              ? "Select Architects in Project " + projectName
              : "Select Vendors in Project " + projectName
          }
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
              required
            />
          </div>

          <h3>Select Members</h3>
          <div className="search-chat-input">
            <AiOutlineSearch />
            <input
              type="text"
              placeholder="Search here"
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          {filteredProfiles?.map((reciver, i) => {
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
                  <p>{reciver?.bio ? reciver?.bio?.substring(0, 52) : null}</p>
                </div>
              </div>
            );
          })}
        </Modal>
        <Modal
          title={
            profile?.type === "vendor"
              ? "Select Architects in Group " + groupName
              : "Select Vendors in Group " + groupName
          }
          footer={[
            <button
              className="create-project"
              onClick={handleAddGroup}
              disabled={groupAdding}
            >
              {groupAdding ? (
                <>
                  Creating group <Spin />
                </>
              ) : (
                <>
                  Create group <MdOutlineNavigateNext />
                </>
              )}
            </button>,
          ]}
          open={createGroup}
          onCancel={() => setCreateGroup(false)}
          bodyStyle={{
            maxHeight: "500px",
            overflowY: "auto",
          }}
        >
          <div className="nameip project-input">
            <input
              value={groupName}
              placeholder="Group Name"
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>

          <h3>Select Members</h3>
          <div className="search-chat-input">
            <AiOutlineSearch />
            <input
              type="text"
              placeholder="Search here"
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          {filteredProfiles?.map((reciver, i) => {
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
                  <p>{reciver?.bio ? reciver?.bio?.substring(0, 52) : null}</p>
                </div>
              </div>
            );
          })}
        </Modal>
      </div>
    </>
  );
};

const Messeges = memo(
  ({
    messages,
    profile,
    groupMode = false,
    hide = true,
    fetchNextPageMessages,
    hasNextPageMessages,
    isFetchingNextPageMessages,
  }) => {
    const ref = useRef(null);

    useEffect(() => {
      // console.log('pages',messages?.pages)
      if (messages?.pages[messages?.pages?.length - 1]?.length) {
        ref?.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, [messages?.pages]);

    async function handleScroll(e) {
      if (e.target.scrollTop === 0) {
        if (hasNextPageMessages) {
          await fetchNextPageMessages();
        }
      }
    }
    return (
      <div className="vendors-body vendors-body-sc" onScroll={handleScroll}>
        {isFetchingNextPageMessages ? <Spin /> : null}
        {hide ? (
          <p
            style={{
              width: "100%",
              height: "90%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Please select a chat
          </p>
        ) : (
          <div>
            {messages?.pages?.reverse()?.map((page) => {
              return (
                <div>
                  {page
                    ?.sort(
                      (a, b) =>
                        Date.parse(a.created_at) - Date.parse(b.created_at)
                    )
                    // // ?.reverse()
                    ?.map((message) => {
                      return (
                        <div
                          key={message.id}
                          className={`${
                            message?.sender_id === profile?.id
                              ? "mine"
                              : "others"
                          }`}
                        >
                          <p>{message?.text}</p>
                          <p>
                            {groupMode ? (
                              <span>
                                {message?.sender_name}
                                <br />
                              </span>
                            ) : null}
                            {formatSupabaseTimestampToTime(message?.created_at)}
                          </p>
                        </div>
                      );
                    })}
                  <div ref={ref} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

function Chat({
  index,
  last,
  chat,
  user_id,
  selectedChat,
  setSelectedChat,
  setSelectedGroup = null,
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
      onClick={() => {
        setSelectedGroup(null);
        setSelectedChat(chat);
      }}
    >
      <div className="chat-pic">
        {printPic(sender_id, sender_image, reciver_image, user_id) ? (
          <img
            src={printPic(sender_id, sender_image, reciver_image, user_id)}
          />
        ) : (
          <AiOutlineUser />
        )}
      </div>
      <div className="chat-info">
        <p>{printName(sender_id, sender_name, reciver_name, user_id)}</p>
        <p>
          {chat?.recent_message ? chat?.recent_message?.substring(0, 10) : ""}
        </p>
      </div>
      <div className="chat-time">
        <p>08:30 PM</p>
      </div>
    </div>
  );
}
function Group({
  index,
  last,
  group,
  user_id,
  selectedGroup,
  setSelectedGroup,
  setSelectedChat,
}) {
  return (
    <div
      className={`projects-chat ${
        selectedGroup?.group_id === group?.group_id ? "bg-dark" : ""
      } ${last === index ? "" : "border-bottom"}`}
      onClick={() => {
        setSelectedChat(null);
        setSelectedGroup(group);
      }}
    >
      <div className="chat-pic">
        <Avatar>{group?.name?.substring(0, 1)}</Avatar>
      </div>
      <div className="chat-info">
        <p>{group?.name}</p>
        <p>
          {group?.recent_message ? group?.recent_message?.substring(0, 10) : ""}
        </p>
      </div>
      <div className="chat-time">
        <p>08:30 PM</p>
      </div>
    </div>
  );
}
function Project({ index, last, project, user_id, setSelectedProject }) {
  let { project_id, name, pic, is_active } = project;
  const onChange = async (id, checked) => {
    try {
      await updateStatus(id, checked);
    } catch (err) {
      // console.log(err)
    }
  };
  return (
    <div className={`projects-chat ${last === index ? "" : "border-bottom"}`}>
      <div className="chat-pic" onClick={() => setSelectedProject(project)}>
        {pic ? <img src={pic} /> : <AiOutlineUser />}
      </div>
      <div className="chat-info" onClick={() => setSelectedProject(project)}>
        <p>{name}</p>
      </div>
      <div className="chat-time">
        <Switch
          defaultChecked={is_active}
          onChange={(c) => onChange(project_id, c)}
          size="small"
        />

        <p>08:30 PM</p>
      </div>
    </div>
  );
}

export default Chats;
