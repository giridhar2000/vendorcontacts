import React, { useContext, useEffect, useRef, memo, useMemo } from "react";
import "./Chats.css";
import { debounce } from "lodash";
import $ from "jquery";
import {
  AiOutlinePlusCircle,
  AiOutlineUser,
  AiOutlineSend,
  AiOutlineSearch,
  AiOutlinePlus,
} from "react-icons/ai";
import {
  UserAddOutlined,
  PlusOutlined,
  PlusCircleOutlined,
  RightOutlined,
  UsergroupAddOutlined,
  FolderAddOutlined,
} from "@ant-design/icons";
import {
  BsThreeDotsVertical,
  BsMicFill,
  BsSkipBackwardCircleFill,
} from "react-icons/bs";
import { MdOutlineNavigateNext } from "react-icons/md";
import { Switch, Empty, Modal, Spin, message, Avatar, Tabs, Badge } from "antd";
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
  sendProjectRequest,
  readMessage,
  readAllMesseges,
  getUnreadCount,
} from "../../utils/chat_helper";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "react-query";
import UserContext from "../../contexts/userContext";
// import ScrollToBottom from "react-scroll-to-bottom";
import {
  getAllUsers,
  getAllUsersOfSameCompany,
} from "../../utils/profile_helper";
import {
  createProject,
  createGroupToProject,
  createMembers,
  getGroups,
  updateStatus,
  getMembers,
  getMembersOfProject,
  getGroupInfo,
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
  const [addMemberToGroup, setAddMemberToGroup] = useState(false);
  const [memberAdding, setMemberAdding] = useState(false);
  const [groupAdding, setGroupAdding] = useState(false);
  const [createGroup, setCreateGroup] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedChatIds, setSelectedChatIds] = useState([]);
  const [selectedChatTypes, setSelectedChatTypes] = useState([]);
  const [selectedChats, setSelectedChats] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [input, setInput] = useState("");
  const [inputSameCompany, setInputSameCompany] = useState("");
  // const [chats, setChats] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(true);
  const [page, setPage] = useState(0);

  const [openPopOver, setOpenPopOver] = useState(false);

  const [openInvite, setOpenInvite] = useState(false);
  const [vendorDetails, setVendorDetails] = useState({});

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

  const onVendorDetailsChange = (e) => {
    setVendorDetails({ ...vendorDetails, [e.target.name]: e.target.value });
  };

  async function readMesseges(chat_id, user_id) {
    try {
      await readAllMesseges(chat_id, user_id);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    readMesseges(selectedChat?.chat_id, profile?.id);
    queryClient.invalidateQueries(["unread_messages", profile?.id]);
  }, [selectedChat]);

  useEffect(() => {
    if (input === "") {
      setFilteredProfiles([]);
      return;
    }
    setFilteredProfiles((old) => {
      return profiles?.filter((value, i) =>
        value?.display_name?.toLowerCase()?.includes(input?.toLowerCase())
      );
    });
  }, [input]);

  useEffect(() => {
    if (inputSameCompany === "") {
      setFilteredProfiles([]);
      return;
    }
    if (createGroup || addMemberToGroup) {
      setFilteredProfiles((old) => {
        return projectMembers?.filter((value) =>
          value?.display_name
            ?.toLowerCase()
            ?.includes(inputSameCompany?.toLowerCase())
        );
      });
    } else {
      setFilteredProfiles((old) => {
        return profilesOfSameCompanny?.filter((value) =>
          value?.display_name
            ?.toLowerCase()
            ?.includes(inputSameCompany?.toLowerCase())
        );
      });
    }
  }, [inputSameCompany]);

  //Fetching all profiles
  const { data: profiles, isLoading: isLoading4 } = useQuery(
    ["users", profile?.id],
    async () => {
      let data = await getAllUsers(profile?.id, profile?.type);
      return data;
    }
  );

  //Fetching all members of a particular project
  const { data: projectMembers, isLoading: isLoading6 } = useQuery(
    ["projectMembers", selectedProject?.project_id],
    async () => {
      let data = await getMembersOfProject(selectedProject?.project_id);
      return data;
    },
    {
      enabled: selectedProject != null,
    }
  );

  //Fetching profiles of a particular user with same company name
  const { data: profilesOfSameCompanny, isLoading: isLoading5 } = useQuery(
    ["usersSameCompany", profile?.id],
    async () => {
      let data = await getAllUsersOfSameCompany(
        profile?.id,
        profile?.type,
        profile?.company
      );
      return data;
    }
  );

  //Fetching chats of a particular user
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
      enabled: selectedProject !== null,
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

  // Fetching all members from a group
  let { data: groupMembers } = useQuery(
    ["memberList", selectedGroup?.group_id],
    () => getMembers(selectedGroup?.group_id),
    {
      enabled: selectedGroup !== null,
    }
  );

  // Fetching group information
  let { data: groupData } = useQuery(
    ["grpData", profile?.id],
    () => getGroupInfo(profile?.id),
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

  // // Mutation for Creating chat
  // const create_chat_mutation = useMutation(createChat, {
  //   onSuccess: (data) => {
  //     if (data) {
  //       queryClient.invalidateQueries(["chats", profile?.id]);
  //       setSelectedChat(data);
  //       setAddChat(false);
  //     }
  //   },
  // });

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
        setSelectedChatTypes([]);
        setProjectName("");
        setAddProject(false);
        setInputSameCompany("");
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
        queryClient.invalidateQueries(["groups", selectedProject?.project_id]);
        setSelectedChats([]);
        setSelectedChatIds([]);
        setSelectedChatTypes([]);
        setGroupName("");
        setCreateGroup(false);
        setInputSameCompany("");
        setGroupAdding(false);
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
  // Mutation for sending project request to a user
  const send_project_request_mutation = useMutation(sendProjectRequest, {
    onSuccess: (data) => {
      if (data) {
        toast("Project request sent!", { type: "success" });
      } else {
        toast("Project request failed", { type: "error" });
      }
      setVendorDetails({
        VendorName: "",
        VendorEmail: "",
        ProjectLoc: "",
      });
      setOpenInvite(false);
    },
  });

  const sendInvite = async () => {
    // if (vendorDetails?.VendorEmail === "" || vendorDetails?.VendorName === "") {
    //   toast("Please fill all the details", { type: "error" });
    //   return;
    // }
    // if (
    //   !/^([\w.-]+)@(\[(\d{1,3}\.){3}|(?!hotmail|gmail|yahoo)(([a-zA-Z\d-]+\.)+))([a-zA-Z]{2,4}|\d{1,3})(\]?)$/.test(
    //     vendorDetails?.VendorEmail
    //   )
    // ) {
    //   toast("Please use your company mail", { type: "error" });
    //   return;
    // }
    send_project_request_mutation.mutateAsync({
      reciver: {
        display_name: vendorDetails?.VendorName,
        email: vendorDetails?.VendorEmail,
      },
      sender: profile,
      project: {
        project_name: selectedProject?.name,
        project_id: selectedProject?.project_id,
        project_location: vendorDetails?.ProjectLoc,
      },
    });
    var data = {
      service_id: "service_cpytsjm",
      template_id: "template_tix5nmp",
      user_id: "F3rrwZwcav-0a-BOW",
      template_params: {
        name: vendorDetails?.VendorName,
        email: vendorDetails?.VendorEmail,
        projectName: selectedProject?.name,
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
  };

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
  };

  // Fetching chats and messages info in real time
  useEffect(() => {
    const chats = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          if (payload.new.reciver_id === profile?.id) {
            if (payload?.new?.chat_id === selectedChat?.chat_id) {
              await readMessage(payload.new.id);
            }
          }

          queryClient.invalidateQueries([
            "messaagelist",
            payload?.new?.group_id,
          ]);
        }
      )

      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chats" },
        (payload) => {
          // console.log(selectedChat);
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

      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "groups" },
        (payload) => {
          // console.log(payload);
          queryClient.invalidateQueries([
            "groups",
            selectedProject?.project_id,
          ]);
          queryClient.invalidateQueries(["memberList", payload?.new?.group_id]);
          queryClient.invalidateQueries(["grpData", profile?.id]);
        }
      )

      .subscribe();
    return () => {
      chats.unsubscribe();
      // setSelectedChat(null);
    };
  }, [selectedChat]);

  //Handling selection of chats in creating a new project
  function handleSelectChats(profile) {
    let bool = false;
    if (selectedChatIds.includes(profile?.id)) {
      setSelectedChats((old) => {
        return old?.filter((item) => item.id !== profile.id);
      });
      setSelectedChatIds((old) => {
        return old?.filter((item) => item !== profile?.id);
      });
      setSelectedChatTypes((old) => {
        return old?.filter((item) => item !== profile?.type);
      });
      return;
    }

    if (profile?.type === "vendor" && !createGroup && !addMemberToGroup) {
      if (projectMembers) {
        if (projectMembers?.some((val) => val.type === "vendor")) {
          toast("Can't add more than 1 vendor", { type: "warning" });
          return;
        } else {
          setSelectedChatTypes((old) => {
            return [...old, profile?.type];
          });
          setSelectedChatTypes((old) => {
            if (old?.length <= 1) {
              setSelectedChatIds((old) => {
                return [...old, profile?.id];
              });
              setSelectedChats((old) => {
                return [...old, profile];
              });
            } else {
              toast("Can't add more than 1 vendor", { type: "warning" });
            }
            return old;
          });
        }
      } else {
        setSelectedChatTypes((old) => {
          return [...old, profile?.type];
        });
        setSelectedChatTypes((old) => {
          if (old?.length <= 1) {
            setSelectedChatIds((old) => {
              return [...old, profile?.id];
            });
            setSelectedChats((old) => {
              return [...old, profile];
            });
          } else {
            toast("Can't add more than 1 vendor", { type: "warning" });
          }
          return old;
        });
      }
    } else {
      setSelectedChatIds((old) => {
        return [...old, profile?.id];
      });
      setSelectedChats((old) => {
        return [...old, profile];
      });
    }
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
      message.error("provide group name");
    }
  }

  function handleAddMemberToGroup(group_id) {
    if (selectedChats?.length === 0) return;
    setMemberAdding(true);
    // console.log(project_id);
    const pr = new Promise((resolve, reject) => {
      selectedChats.forEach((chat, index, array) => {
        create_members_mutation.mutateAsync({
          reciver: chat,
          group_id,
        });
        if (index === array?.length - 1) resolve();
      });
    });
    pr.then(() => {
      queryClient.invalidateQueries(["memberList", selectedGroup?.group_id]);
      setMemberAdding(false);
      setSelectedChats([]);
      setInput("");
      setInputSameCompany("");
      setSelectedChatIds([]);
      setSelectedChatTypes([]);
      setAddMemberToGroup(false);
    });
  }

  function handleAddChatToProject(project_id) {
    if (selectedChats?.length === 0) return;
    setProjectAdding(true);
    // console.log(project_id);
    const pr = new Promise((resolve, reject) => {
      selectedChats.forEach((chat, index, array) => {
        create_chats_mutation.mutateAsync({
          reciver: chat,
          user: profile,
          project_id,
        });
        if (index === array?.length - 1) {
          queryClient.invalidateQueries([
            "chatsOfProject",
            profile?.id,
            selectedProject?.project_id,
          ]);
          resolve();
        }
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
      setInput("");
      setInputSameCompany("");
      setSelectedChatIds([]);
      setSelectedChatTypes([]);
      setAddChatToProject(false);
    });
  }

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

  const Projects = memo(() => {
    return (
      <div className="projects-body" onScroll={handleDebouncedScrollProjects}>
        {profile?.type === "vendor" ? null : (
          <div className="create-project-btn" onClick={() => {
            setOpenPopOver(false);
            setAddProject(true);
          }}>
            <p style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}>
              <FolderAddOutlined />
              &nbsp; Create project
            </p>
          </div>
        )}
        <hr style={{ maxWidth: "100%", margin: 0, background: "#f0f0f0" }} />

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
                      Date.parse(b.created_at) - Date.parse(a.created_at)
                  )
                  ?.map((project, i) => {
                    return (
                      <Project
                        key={i}
                        index={i}
                        last={projects?.pages[projects?.length - 1]?.length - 1}
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
    );
  }, [profile?.id, projects, isFetchingNextPageProjects]);

  const People = memo(() => {
    return (
      <div className="projects-body" onScroll={handleDebouncedScroll}>
        <div
          className="create-project-btn"
          onClick={() => {
            setOpenPopOver(false);
            setAddChat(true);
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <PlusCircleOutlined />
              &nbsp; Invite people
            </p>
          </div>
        </div>
        <hr style={{ maxWidth: "100%", margin: 0, background: "#f0f0f0" }} />
        {!chats || chats?.pages[0]?.length === 0 ? (
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
                        setSelectedGroup={setSelectedGroup}
                        profile={profile}
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
    );
  });

  const items = useMemo(() => {
    return [
      {
        key: "1",
        label: "People",
        children: <People />,
      },
      {
        key: "2",
        label: "Projects",
        children: <Projects />,
      },
    ];
  }, [projects, chats]);

  const tabStyle = {
    width: "100%",
  };

  //Returning loading indicator
  if (isLoading || isLoading3 || isLoading4) {
    return (
      <div className="loading-screen">
        <p>
          <Spin />
          &nbsp; Loading....
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="messages-container">
        {!selectedProject ? (
          <div className="messages-box-container message-box-container-sc">
            <p
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* <BsSkipBackwardCircleFill
              onClick={() => {
                setSelectedChat(false);
                setSelectedGroup(null);
                setSelectedProject(null);
              }}
              style={{ marginRight: ".4rem", cursor: "pointer" }}
            />{" "} */}
              Messages
            </p>

            <div className="messages-box messages-box-sc">
              <div className="projects projects-sc">
                <Tabs
                  defaultActiveKey="1"
                  tabBarStyle={tabStyle}
                  items={items}
                  indicator={"50%"}
                  centered={true}
                  onChange={() => {
                    setSelectedProject(null);
                    setSelectedGroup(null);
                    setSelectedChat(null);
                  }}
                />
                {/*
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
                */}
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
                {!selectedChat && !selectedGroup ? null : (
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
                      {/* <button>
                        <BsMicFill />
                      </button> */}
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
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="messages-box-container message-box-container-sc mt-1">
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
                  {profile?.type === "architect" ? (
                    <div className="header-icons">
                      <AiOutlinePlusCircle
                        onClick={() => {
                          if (selectedGroup) setAddMemberToGroup(true);
                          else setAddChatToProject(true);
                        }}
                      />
                    </div>
                  ) : null}
                </div>
                <div
                  className="projects-body"
                  onScroll={handleDebouncedScrollChatsOfProject}
                >
                  {/* {groups?.length === 0 ? ( */}

                  <>
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
                    {profile?.type === "architect" ? (
                      <div className="create-project-btn" onClick={() => setCreateGroup(true)}>
                        <p style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}>
                          <UsergroupAddOutlined /> &nbsp; Create group
                        </p>
                      </div>
                    ) : (
                      groups?.length === 0 && (
                        <p style={{ textAlign: "center" }}>No groups</p>
                      )
                    )}
                  </>

                  {groups
                    ?.sort(
                      (a, b) =>
                        Date.parse(b.created_at) - Date.parse(a.created_at)
                    )
                    ?.filter((group) => {
                      let isSee = group?.created_by === profile?.id;
                      groupData?.forEach((member) => {
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
                    {!selectedChat && !selectedGroup ? null : (
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
                          {/* <button>
                            <BsMicFill />
                          </button> */}
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
                    )}
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
                      groupMembers={groupMembers}
                      createdBy={selectedGroup?.profiles?.display_name}
                      groupMode
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
                        {/* <button>
                          <BsMicFill />
                        </button> */}
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
          afterClose={() => {
            setSelectedChats([]);
            setSelectedChatIds([]);
            setSelectedChatTypes([]);
            setInput("");
            setInputSameCompany("");
            setFilteredProfiles([]);
          }}
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
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  setFilteredProfiles(profiles);
                }
              }}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          {filteredProfiles
            ?.filter((reciver) => reciver?.type !== profile?.type)
            ?.filter((_, i) => i < 8)
            ?.map((reciver, i) => {
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
                      sendEmailNotify(reciver);
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
                      {reciver?.bio ? reciver?.bio?.substring(0, 52) : null}
                    </p>
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
                  <PlusOutlined />
                  &nbsp; Add
                </>
              )}
            </button>,
            <button
              className="create-project"
              onClick={() => {
                if (
                  projectMembers?.some((val, i, arr) => val.type === "vendor")
                ) {
                  toast("Already have 1 vendor", { type: "warning" });
                } else {
                  setOpenInvite(true);
                }
              }}
            >
              {projectAdding ? (
                <>
                  Sending... <Spin />
                </>
              ) : (
                <>
                  <UserAddOutlined />
                  &nbsp; Invite
                </>
              )}
            </button>,
          ]}
          open={addChatToProject}
          afterClose={() => {
            setSelectedChats([]);
            setSelectedChatIds([]);
            setSelectedChatTypes([]);
            setInput("");
            setInputSameCompany("");
            setFilteredProfiles([]);
          }}
          onCancel={() => setAddChatToProject(false)}
          bodyStyle={{
            maxHeight: "500px",
            overflowY: "auto",
          }}
        >
          <div className="search-chat-input">
            <AiOutlineSearch />
            <input
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  setFilteredProfiles(profilesOfSameCompanny);
                }
              }}
              type="text"
              placeholder="Search here"
              onChange={(e) => setInputSameCompany(e.target.value)}
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
                  className={`projects-chat ${selectedChatIds.includes(reciver.id) ? "bg-dark" : ""
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
                    <p>
                      {reciver?.display_name}{" "}
                      <span
                        className={`badge ${reciver.type === "vendor"
                          ? "bg-vendor"
                          : "bg-designer"
                          }`}
                      >
                        {reciver?.type}
                      </span>
                    </p>
                    <p>
                      {reciver?.bio ? reciver?.bio?.substring(0, 52) : null}
                    </p>
                  </div>
                </div>
              );
            })}
        </Modal>

        <Modal
          title={"Invite a vendor to " + selectedProject?.name}
          footer={[
            <button className="create-project" onClick={() => sendInvite()}>
              Send Invite
            </button>,
          ]}
          afterClose={() => {
            setVendorDetails({
              VendorName: "",
              VendorEmail: "",
              ProjectLoc: "",
            });
          }}
          open={openInvite}
          onCancel={() => setOpenInvite(false)}
        >
          <form className="invite-ip">
            <input type={"text"} value={selectedProject?.name} disabled />
            <input
              type={"text"}
              value={vendorDetails?.VendorName}
              placeholder="Vendor Name"
              onChange={(e) => onVendorDetailsChange(e)}
              name="VendorName"
            />
            <input
              type={"text"}
              value={vendorDetails?.VendorEmail}
              placeholder="Vendor Email"
              onChange={(e) => onVendorDetailsChange(e)}
              name="VendorEmail"
            />
            <input
              type={"text"}
              value={vendorDetails?.ProjectLoc}
              placeholder="Project Location"
              onChange={(e) => onVendorDetailsChange(e)}
              name="ProjectLoc"
            />
          </form>
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
                  Create project <RightOutlined />
                </>
              )}
            </button>,
          ]}
          afterClose={() => {
            setSelectedChats([]);
            setSelectedChatIds([]);
            setSelectedChatTypes([]);
            setInput("");
            setInputSameCompany("");
            setFilteredProfiles([]);
          }}
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
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  setFilteredProfiles(profilesOfSameCompanny);
                }
              }}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>

          <h3 style={{ margin: "0" }}>Select Members</h3>
          <p style={{ margin: "0", fontSize: ".6rem", color: "red" }}>
            ** You can select max of 1 vendor and multiple designers
          </p>
          <p style={{ margin: "0", fontSize: ".6rem", color: "red" }}>
            ** You can only add people from your company
          </p>
          <div className="search-chat-input">
            <AiOutlineSearch />
            <input
              type="text"
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  setFilteredProfiles(profilesOfSameCompanny);
                }
              }}
              placeholder="Search here"
              onChange={(e) => setInputSameCompany(e.target.value)}
            />
          </div>

          {filteredProfiles?.map((reciver, i) => {
            return (
              <div
                key={reciver?.id}
                className={`projects-chat ${selectedChatIds.includes(reciver.id) ? "bg-dark" : ""
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
                  <p>
                    {reciver?.display_name}
                    <span
                      className={`badge ${reciver.type === "vendor" ? "bg-vendor" : "bg-designer"
                        }`}
                    >
                      {reciver?.type}
                    </span>
                  </p>
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
          afterClose={() => {
            setSelectedChats([]);
            setSelectedChatIds([]);
            setSelectedChatTypes([]);
            setInput("");
            setInputSameCompany("");
            setFilteredProfiles([]);
          }}
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
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  setFilteredProfiles(projectMembers);
                }
              }}
            />
          </div>

          <h3>Select Members</h3>
          <div className="search-chat-input">
            <AiOutlineSearch />
            <input
              type="text"
              placeholder="Search here"
              onChange={(e) => setInputSameCompany(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  setFilteredProfiles(projectMembers);
                }
              }}
            />
          </div>
          {filteredProfiles
            ?.filter((_, i) => i < 5)
            ?.map((reciver, i) => {
              return (
                <div
                  key={reciver?.id}
                  className={`projects-chat ${selectedChatIds.includes(reciver.id) ? "bg-dark" : ""
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
                    <p>
                      {reciver?.display_name}
                      <span
                        className={`badge ${reciver.type === "vendor"
                          ? "bg-vendor"
                          : "bg-designer"
                          }`}
                      >
                        {reciver?.type}
                      </span>
                    </p>
                    <p>
                      {reciver?.bio ? reciver?.bio?.substring(0, 52) : null}
                    </p>
                  </div>
                </div>
              );
            })}
        </Modal>

        <Modal
          title={"Add member to " + selectedGroup?.name}
          footer={[
            <button
              className="create-project"
              onClick={() => {
                handleAddMemberToGroup(selectedGroup?.group_id);
              }}
              disabled={memberAdding}
            >
              {memberAdding ? (
                <>
                  Adding... <Spin />
                </>
              ) : (
                <>
                  <PlusOutlined />
                  &nbsp; Add
                </>
              )}
            </button>,
          ]}
          open={addMemberToGroup}
          afterClose={() => {
            setSelectedChats([]);
            setSelectedChatIds([]);
            setSelectedChatTypes([]);
            setInput("");
            setInputSameCompany("");
            setFilteredProfiles([]);
          }}
          onCancel={() => setAddMemberToGroup(false)}
          bodyStyle={{
            maxHeight: "500px",
            overflowY: "auto",
          }}
        >
          <div className="search-chat-input">
            <AiOutlineSearch />
            <input
              type="text"
              placeholder="Search member here"
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  setFilteredProfiles(projectMembers);
                }
              }}
              onChange={(e) => setInputSameCompany(e.target.value)}
            />
          </div>
          {filteredProfiles
            ?.filter((value) => {
              let memberIds = groupMembers?.reduce((acc, obj) => {
                acc.push(obj.user_id);
                return acc;
              }, []);
              if (!memberIds?.some((v) => v === value?.id)) return value;
            })

            ?.map((reciver, i) => {
              return (
                <div
                  key={reciver?.id}
                  className={`projects-chat ${selectedChatIds.includes(reciver.id) ? "bg-dark" : ""
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
                    <p>
                      {reciver?.display_name}{" "}
                      <span
                        className={`badge ${reciver.type === "vendor"
                          ? "bg-vendor"
                          : "bg-designer"
                          }`}
                      >
                        {reciver?.type}
                      </span>
                    </p>
                    <p>
                      {reciver?.bio ? reciver?.bio?.substring(0, 52) : null}
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

const Messeges = memo(
  ({
    messages,
    profile,
    groupMode = false,
    groupMembers = null,
    createdBy = null,
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
            {groupMode && groupMembers?.length !== 0 ? (
              <p style={{ textAlign: "center", fontSize: ".6rem" }}>
                {createdBy} created this group with{" "}
                {groupMembers?.map((mem, i) => {
                  return (
                    <span>
                      {mem.user_name +
                        `${i !== groupMembers?.length - 1 ? ", " : ""}`}
                    </span>
                  );
                })}
              </p>
            ) : null}
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
                          className={`${message?.sender_id === profile?.id
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

const Chat = memo(
  ({
    index,
    last,
    chat,
    user_id,
    selectedChat,
    setSelectedChat,
    setSelectedGroup = null,
    profile,
  }) => {
    let {
      sender_id,
      reciver_id,
      sender_name,
      reciver_name,
      sender_image,
      reciver_image,
      updated_at,
    } = chat;

    function formatSupabaseTimestamp(supabaseTimestamp) {
      // Convert Supabase timestamp to JavaScript Date object
      const date = new Date(supabaseTimestamp);

      // Get hours and minutes
      let hours = date.getHours();
      let minutes = date.getMinutes();

      // Convert hours to 12-hour format
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be displayed as 12

      // Pad single-digit minutes with a leading zero
      minutes = minutes < 10 ? "0" + minutes : minutes;

      // Format the time
      const formattedTime = `${hours}:${minutes} ${ampm}`;

      return formattedTime;
    }
    const [unreadCount, setUnreadCount] = useState(0);
    async function getCountOfUnreadMessages(chat_id) {
      try {
        const data = await getUnreadCount(chat_id);
        setUnreadCount(data?.unread_messages);
      } catch (err) {
        console.log(err);
      }
    }
    useEffect(() => {
      getCountOfUnreadMessages(chat.chat_id);
    }, []);
    return (
      <div
        className={`projects-chat ${selectedChat?.id === chat?.id ? "bg-dark" : ""
          } ${last === index ? "" : "border-bottom"} chats`}
        onClick={() => {
          setSelectedChat(chat);
          setSelectedGroup(null);
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
          <p
            className={
              unreadCount > 0 && chat.reciver_id === profile.id && "font-bold"
            }
          >
            {chat?.recent_message
              ? chat?.recent_message?.substring(0, 7) + " ...."
              : "New chat"}
          </p>
        </div>
        <div className="chat-time">
          <p>{formatSupabaseTimestamp(updated_at)}</p>
        </div>{" "}
        &nbsp;
        {unreadCount > 0 && chat.reciver_id === profile.id && (
          <Badge count={unreadCount} />
        )}
      </div>
    );
  }
);
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
      className={`projects-chat ${selectedGroup?.group_id === group?.group_id ? "bg-dark" : ""
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
    </div>
  );
}

const Project = memo(
  ({ index, last, project, user_id, setSelectedProject }) => {
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
          {pic ? <img src={pic} /> : <Avatar>{name[0]?.toUpperCase()}</Avatar>}
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
        </div>
      </div>
    );
  }
);

export default Chats;
