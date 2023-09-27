import supabase from "./supabase.config";

// Helper function for creating chat
export function createChatId(reciver_id, sender_id) {
  if (reciver_id > sender_id) {
    return reciver_id + sender_id;
  } else {
    return sender_id + reciver_id;
  }
}

export async function checkIsChatExist(chat_id) {
  try {
    let { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("chat_id", chat_id);
    if (error) {
      return { status: false, data: {} };
    }
    if (data && data?.length !== 0) return { status: true, data };
    else return { status: false, data: {} };
  } catch (err) {
    alert("Something went wrong");
    return { status: false, data: {} };
  }
}

// Functions for creating chat
export async function createChat({ reciver, user, project_id }) {
  if (!reciver?.id || !user?.id) {
    return false;
  }
  if (user) {
    try {
      let chatId = createChatId(reciver.id, user.id);
      chatId = chatId + project_id || "";
      let isChatExist = await checkIsChatExist(chatId);

      if (isChatExist.status) {
        let { data } = isChatExist;
        if (project_id) {
          const { data: data2, error } = await supabase
            .from("chats")
            .update({ project_id })
            .eq("chat_id", data[0].chat_id)
            .select();
          const { data: data3, error: error2 } = await supabase
            .from("v_p")
            .insert([{ vendor_id: reciver?.id, project_id }])
            .select();
        } else {
          const { data: data2, error } = await supabase
            .from("chats")
            .update({ project_id: "NA" })
            .eq("chat_id", data[0].chat_id)
            .select();
        }
        return data[0];
      } else {
        let sender = user;
        const { data, error } = await supabase
          .from("chats")
          .insert([
            {
              chat_id: chatId,
              created_by: sender.id,
              sender_id: sender.id,
              sender_name: sender.display_name,
              sender_image: sender.profile_pic,
              reciver_id: reciver.id,
              reciver_name: reciver.display_name,
              reciver_image: reciver.profile_pic,
              project_id: project_id || "NA",
            },
          ])
          .select();
        if (project_id) {
          const { data: data3, error: error2 } = await supabase
            .from("v_p")
            .insert([{ vendor_id: reciver?.id, project_id }])
            .select();
        }
        if (error) {
          return null;
        }
        if (data) {
          return data[0];
        }
      }
    } catch (err) {
      return null;
    }
  }
}

export async function getAllChats(user_id) {
  try {
    let { data, error } = await supabase
      .from("chats")
      .select(
        "id,chat_id,sender_id,sender_name,sender_image,reciver_id,reciver_name,reciver_image,recent_message,updated_at"
      )
      .eq("project_id", "NA")
      .or(`sender_id.eq.${user_id},reciver_id.eq.${user_id}`);
    if (error) {
      return [];
    }
    return data;
  } catch (err) {
    alert("Something went wrong");
    return [];
  }
}
export async function getAllChatsByProjectId(user_id, project_id) {
  try {
    let { data, error } = await supabase
      .from("chats")
      .select(
        "id,chat_id,sender_id,sender_name,sender_image,reciver_id,reciver_name,reciver_image,recent_message,updated_at"
      )
      .eq("project_id", project_id)
      .or(`sender_id.eq.${user_id},reciver_id.eq.${user_id}`);

    if (error) {
      return [];
    }
    return data;
  } catch (err) {
    alert("Something went wrong");
    return [];
  }
}

export async function getAllProjects(user_id, type) {
  var myData;
  try {
    let { data: v_p, error } = await supabase
      .from("v_p")
      .select(`projects (project_id,name,created_at)`)
      .eq("vendor_id", user_id);
    if (error) return [];
    myData = v_p.map((key) => {
      return key.projects;
    });

    let { data, error: error2 } = await supabase
      .from("projects")
      .select("*")
      .eq("created_by", user_id);

    if (error) {
      return [];
    }

    if (myData) return [...myData, ...data];
    return data;
  } catch (err) {
    console.log(err);
    alert("Something went wrong");
    return [];
  }
}

export function printName(id1, id2, name1, name2, user_id) {
  if (user_id === id1) {
    return name2;
  } else {
    return name1;
  }
}

export function printPic(id1, id2, pic1, pic2, user_id) {
  if (user_id === id1) {
    return pic2;
  } else {
    return pic1;
  }
}

export function getReciverDetails(id1, id2, chatData, user_id) {
  if (user_id === id1) {
    return {
      reciver_id: chatData.reciver_id,
      reciver_name: chatData.reciver_name,
      reciver_image: chatData.reciver_image,
    };
  } else {
    return {
      reciver_id: chatData.sender_id,
      reciver_name: chatData.sender_name,
      reciver_image: chatData.sender_image,
    };
  }
}
export function getSenderDetails(id1, id2, chatData, user_id) {
  if (user_id === id1) {
    return {
      sender_id: chatData.sender_id,
      sender_name: chatData.sender_name,
      sender_image: chatData.sender_image,
    };
  } else {
    return {
      sender_id: chatData.reciver_id,
      sender_name: chatData.reciver_name,
      sender_image: chatData.reciver_image,
    };
  }
}

// Function for sending message

export async function sendMessage({ chatData, text, user_id }) {
  if (!text) return;
  const { sender_id, sender_name, sender_image } = getSenderDetails(
    chatData.sender_id,
    chatData.reciver_id,
    chatData,
    user_id
  );
  const { reciver_id, reciver_name, reciver_image } = getReciverDetails(
    chatData.sender_id,
    chatData.reciver_id,
    chatData,
    user_id
  );
  let message = {
    chat_id: chatData.chat_id,
    text,
    sender_id,
    sender_name,
    sender_image,
    reciver_id,
    reciver_name,
    reciver_image,
  };
  const { data, error } = await supabase.from("messages").insert([message]);
  if (data) {
    return data[0];
  } else return {};
}

export async function sendMessageToGroup({ groupData, text, profile }) {
  if (!text) return;

  let message = {
    group_id: groupData?.group_id,
    text,
    sender_id: profile?.id,
    sender_name: profile?.display_name,
    sender_image: profile?.profile_pic,
  };
  const { data, error } = await supabase.from("messages").insert([message]);
  console.log(data, error);
  if (data) {
    return data[0];
  } else return {};
}

export async function getMessages(chat_id) {
  const { data, error } = await supabase
    .from("messages")
    .select(
      "id,created_at,text,sender_id,sender_name,sender_image,reciver_id,reciver_name,reciver_image"
    )
    .eq("chat_id", chat_id);
  if (error) throw error;
  return data;
}
export async function getMessagesFromGroup(group_id) {
  const { data, error } = await supabase
    .from("messages")
    .select(
      "id,created_at,text,sender_id,sender_name,sender_image,reciver_id,reciver_name,reciver_image"
    )
    .eq("group_id", group_id);
  if (error) throw error;
  return data;
}
