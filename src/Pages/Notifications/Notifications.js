import React, { useContext, useEffect } from "react";
import "./Notifications.css";
import { AiOutlineUser } from "react-icons/ai";
import { TiTick, TiTimes } from "react-icons/ti";
import {
  getNotifications,
  deleteNotification,
} from "../../utils/notifications_helper";

import { useQuery, useQueryClient, useMutation } from "react-query";
import UserContext from "../../contexts/userContext";
import supabase from "../../utils/supabase.config";
import { Empty } from "antd";
import { createChat } from "../../utils/chat_helper";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [profile, isLoading] = useContext(UserContext);
  //Fetching notifications of a particular user
  const { data: notifications, isLoading: isLoading2 } = useQuery(
    ["notifications", profile?.id],
    async () => {
      let data = await getNotifications(profile?.id, profile?.email);
      return data;
    },
    {
      enabled: profile?.id !== null,
    }
  );
  function printHeading(type) {
    switch (type) {
      case "chat_request":
        return "invited you for a chat";
      case "project_request":
        return "invited you for a project";
      case "group_request":
        return "invited you for a group";
      default:
        return "invited you for a chat";
    }
  }

  async function createChatByNotification(notification) {
    let not = notification;
    await deleteNotification(notification?.id);
    create_chat_mutation.mutateAsync({
      reciver: profile,
      user: {
        id: not?.sender_id,
        display_name: not?.sender_name,
        profile_pic: not?.sender_image,
      },
    });
  }
  async function acceptProject(notification) {
    let not = notification;
    // console.log(not);
    await deleteNotification(notification?.id);
    create_chat_mutation.mutateAsync({
      reciver: profile,
      user: {
        id: not?.sender_id,
        display_name: not?.sender_name,
        profile_pic: not?.sender_image,
      },
      project_id:not?.project_id
    });
  }
  

  // Fetching notifications in real time
  useEffect(() => {
    const notifications = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        (payload) => {
          queryClient.invalidateQueries(["notifications", profile?.id]);
        }
      )
      .subscribe();
    return () => {
      notifications.unsubscribe();
    };
  }, []);

  // Mutation for Creating chat
  const create_chat_mutation = useMutation(createChat, {
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries(["chats", profile?.id]);
        navigate("/chats", {
          state: {
            data,
          },
        });
      }
    },
  });

  if (isLoading || isLoading2) return <p>Loading....</p>;
  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {notifications && notifications?.length === 0 && (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={"No notifications"}
        />
      )}
      {notifications
        ?.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
        ?.map((notification, i) => {
          return (
            <div className="notification-box projects-chat" key={i}>
              <div className="chat-pic">
                {notification?.sender_image ? (
                  <img src={notification?.sender_image} />
                ) : (
                  <AiOutlineUser />
                )}
              </div>

              <div className="chat-info">
                <p style={{ fontSize: ".8rem" }}>
                  <span style={{ fontSize: ".9rem" }}>
                    {notification.sender_name}{" "}
                  </span>
                  {printHeading(notification.type)}
                  {
                    notification?.type==='project_request' ? <span style={{ fontSize: ".9rem" }}> {notification.project_name}</span> : null
                  }
                </p>
                <div className="notification-buttons">
                  {notification.type === "chat_request" ? (
                    <>
                      <button
                        onClick={() => {
                          if (profile) {
                            createChatByNotification(notification);
                          }
                        }}
                      >
                        <TiTick style={{ color: "green" }} />
                        Accept
                      </button>
                      <button
                        onClick={async () => {
                          await deleteNotification(notification?.id);
                        }}
                      >
                        <TiTimes style={{ color: "red" }} />
                        Decline
                      </button>
                    </>
                  ) : null}
                  {notification.type === "project_request" ? (
                    <>
                      <button
                        onClick={() => {
                          if (profile) {
                            acceptProject(notification);
                          }
                        }}
                      >
                        <TiTick style={{ color: "green" }} />
                        Accept
                      </button>
                      <button
                        onClick={async () => {
                          await deleteNotification(notification?.id);
                        }}
                      >
                        <TiTimes style={{ color: "red" }} />
                        Decline
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
              <div className="chat-time">
                <p>08:30 PM</p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Notifications;
