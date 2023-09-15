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
      return { status: false, data };
    }
    if (data?.length !== 0) return { status: true, data };
    else return { status: false, data };
  } catch (err) {
    alert("Something went wrong");
    console.log(err);
    return { status: false, data: {} };
  }
}

// Functions for creating chat
export async function createChat({ reciver, user }) {
  console.log("Hi");
  if (!reciver?.id || !user?.id) {
    console.log("No id found");
    return false;
  }
  if (user) {
    try {
      let chatId = createChatId(reciver.id, user.id);
      let isChatExist = await checkIsChatExist(chatId);
      console.log(chatId, isChatExist);
      if (isChatExist.status) {
        let { data } = isChatExist;
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
            },
          ])
          .select();
        console.log("data", data);
        if (error) {
          console.log(error);
          return null;
        }
        if (data) {
          return data[0];
        }
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}

export async function getAllVendorsChats(user_id) {
  try {
    let { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("type", "vendor")
      .or(`sender_id.eq.${user_id},reciver_id.eq.${user_id}`);
    if (error) {
      return [];
    }
    return data;
  } catch (err) {
    alert("Something went wrong");
    console.log(err);
    return [];
  }
}

export async function getAllProjectsChats(user_id) {
  try {
    let { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("type", "project")
      .or(`sender_id.eq.${user_id},reciver_id.eq.${user_id}`);
    if (error) {
      return [];
    }
    return data;
  } catch (err) {
    alert("Something went wrong");
    console.log(err);
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

export async function getMessages(chat_id) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chat_id);
  if (error) throw error;
  return data;
}
