import supabase from "./supabase.config";

// Helper function for time format ----------->

export function formatSupabaseTimestampToTime(timestamp) {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Helper function for creating chat id   -------->

export function createChatId(reciver_id, sender_id) {
  return reciver_id > sender_id
    ? reciver_id + sender_id
    : sender_id + reciver_id;
}

// Helper function for checking is chat already exist or not if exist return chat   -------->  returns {  status:Boolean, data: <chat> }

export async function checkIsChatExist(chat_id) {
  try {
    let { data, count, error } = await supabase
      .from("chats")
      .select("*", { count: "exact" })
      .eq("chat_id", chat_id);

    if (error) throw new Error(error);

    if (count > 0) return { status: true, data };
    else return { status: false, data: {} };
  } catch (err) {
    // console.log(err);
    return { status: false, data: {} };
  }
}

// Functions for creating chat   -------->      returns {  < Chat data > }  ||  null

export async function createChat({ reciver, user, project_id = false }) {
  if (!reciver?.id || !user?.id) return null;

  try {
    // Inserting vendor id to map table for assuring that this vendor is under any project
    if (project_id) {
      const { error: error2 } = await supabase
        .from("v_p")
        .insert([{ vendor_id: reciver?.id, project_id }]);
      if (error2) throw new Error(error2);
    }

    let chatId = createChatId(reciver.id, user.id); // Getting chat id from recuver & sender id's
    if (project_id) chatId = chatId + project_id; // If chat is under any project then attach the project id to chat id
    let { status, data } = await checkIsChatExist(chatId); // If chat is exist then return chat or return status:false otherwise

    // If chat is already exist
    if (status) {
      // updating chat's project id column
      const { error } = await supabase
        .from("chats")
        .update({ project_id: project_id || "NA" })
        .eq("chat_id", data[0].chat_id);

      if (error) throw new Error(error);

      return data[0]; // return chat data
    }

    // If chat is not already exist
    else {
      let sender = user;

      // creating a new chat to DB
      const { data, error } = await supabase
        .from("chats")
        .insert([
          {
            chat_id: chatId,
            created_by: sender?.id,
            sender_id: sender?.id,
            sender_name: sender?.display_name,
            sender_image: sender?.profile_pic,
            reciver_id: reciver?.id,
            reciver_name: reciver?.display_name,
            reciver_image: reciver?.profile_pic,
            project_id: project_id || "NA",
          },
        ])
        .select();

      if (error) throw new Error(error);

      return data[0];
    }
  } catch (err) {
    // console.log(err)
    return null;
  }
}

// Getting all chats from DB if thers project id in parameter then it should fetch all the chats under that project -------->   returns [ < All chats > ] || []

export async function getAllChats(user_id, project_id = null, page = 0) {
  try {
    let from, to;
    const loadMoreData = () => {
      var ITEM_PER_PAGE = 7;
      from = page * ITEM_PER_PAGE;
      to = from + ITEM_PER_PAGE;
      if (page > 0) {
        from += 1;
      }
    };
    loadMoreData();
    if (!user_id) throw new Error("User id is null");
    let { data, error } = await supabase
      .from("chats")
      .select(
        "id,chat_id,sender_id,sender_name,sender_image,reciver_id,reciver_name,reciver_image,recent_message,updated_at"
      )
      .eq("project_id", project_id || "NA")
      .or(`sender_id.eq.${user_id},reciver_id.eq.${user_id}`)
      .order("updated_at", { ascending: false })
      // .limit(5)
      .range(from, to);

    if (error) throw new Error(error);
    return data;
  } catch (err) {
    // console.log(err);
    return [];
  }
}

// Getting all the projects of current user  ----------->        returns [ < All projects > ] || []

export async function getAllProjects(user_id, page = 0) {
  var myData;
  try {
    let from, to;
    const loadMoreData = () => {
      var ITEM_PER_PAGE = 7;
      from = page * ITEM_PER_PAGE;
      to = from + ITEM_PER_PAGE;
      if (page > 0) {
        from += 1;
      }
    };
    loadMoreData();
    // Fetching projects who is joined a projects of current user
    let { data: v_p, error } = await supabase
      .from("v_p")
      .select(`projects (id,project_id,name,created_at,is_active)`)
      .eq("vendor_id", user_id)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw new Error(error);

    myData = v_p.map((d) => {
      return d.projects;
    });

    // fetching projects which has created by current user
    let { data, error: error2 } = await supabase
      .from("projects")
      .select("id,project_id,name,created_at,created_by,is_active")
      .eq("created_by", user_id)
      .order("created_at", { ascending: false })

      .range(from, to);
    if (error2) throw new Error(error2);

    if (myData) return [...myData, ...data];
    return data;
  } catch (err) {
    // console.log(err);
    return [];
  }
}

// Displays chat name to user  -------->

export function printName(
  sender_id,
  sender_name,
  reciver_name,
  current_user_id
) {
  return current_user_id === sender_id ? reciver_name : sender_name;
}

// Displays chat pic to user --------->

export function printPic(sender_id, sender_pic, reciver_pic, current_user_id) {
  return current_user_id === sender_id ? reciver_pic : sender_pic;
}

// Getting reciver details from chat data & current user  -------------->

export function getReciverDetails(sender_id, chatData, current_user_id) {
  if (!chatData || !current_user_id || !sender_id) return null;
  return current_user_id === sender_id
    ? {
        reciver_id: chatData.reciver_id,
        reciver_name: chatData.reciver_name,
        reciver_image: chatData.reciver_image,
      }
    : {
        reciver_id: chatData.sender_id,
        reciver_name: chatData.sender_name,
        reciver_image: chatData.sender_image,
      };
}

// Getting sender details from chat data & current user  -------------->

export function getSenderDetails(sender_id, chatData, current_user_id) {
  if (!chatData || !current_user_id || !sender_id) return null;
  return current_user_id === sender_id
    ? {
        sender_id: chatData.sender_id,
        sender_name: chatData.sender_name,
        sender_image: chatData.sender_image,
      }
    : {
        sender_id: chatData.reciver_id,
        sender_name: chatData.reciver_name,
        sender_image: chatData.reciver_image,
      };
}

// Function for sending message  ---------------->           returns true || false

export async function sendMessage({ chatData, text, user_id }) {
  if (!text || !user_id || !chatData) return false;

  try {
    // getting sender details
    const { sender_id, sender_name, sender_image } = getSenderDetails(
      chatData.sender_id,
      chatData,
      user_id
    );

    // getting reciver details
    const { reciver_id, reciver_name, reciver_image } = getReciverDetails(
      chatData.sender_id,
      chatData,
      user_id
    );

    // creating a new message object
    let message = {
      chat_id: chatData?.chat_id,
      text,
      sender_id,
      sender_name,
      sender_image,
      reciver_id,
      reciver_name,
      reciver_image,
    };

    // storing message into DB
    const { error } = await supabase.from("messages").insert([message]);

    if (error) throw new Error(error);

    return true;
  } catch (err) {
    // console.log(err)
    return false;
  }
}

// Send message to a group   -------------------->        returns true || false

export async function sendMessageToGroup({ groupData, text, profile }) {
  if (!text) return false;
  try {
    // creating a new message with group id
    let message = {
      group_id: groupData?.group_id,
      text,
      sender_id: profile?.id,
      sender_name: profile?.display_name,
      sender_image: profile?.profile_pic,
    };
    const { error } = await supabase.from("messages").insert([message]);
    if (error) throw new Error(error);

    return true;
  } catch (err) {
    // console.log(err);
    return false;
  }
}

// getting all messages from chat id  ------------------>             returns [ < messages > ] || []

export async function getMessages(chat_id, page = 0) {
  try {
    // let from, to;
    // const loadMoreData = () => {
    //   var ITEM_PER_PAGE = 7;
    //   from = page * ITEM_PER_PAGE;
    //   to = from + ITEM_PER_PAGE;
    //   if (page > 0) {
    //     from += 1;
    //   }
    // };
    // loadMoreData();
    const { data, error } = await supabase
      .from("messages")
      .select(
        "id,created_at,text,sender_id,sender_name,sender_image,reciver_id,reciver_name,reciver_image"
      )
      .eq("chat_id", chat_id)
      .order("created_at", { ascending: false })
      .limit(50)
      // .range(from, to);

    if (error) throw new Error(error);
    data?.reverse()
    return data;
  } catch (err) {
    // console.log(err);
    return [];
  }
}

// getting all messages from group id  ------------------>        returns [ < messages of group > ] || []

export async function getMessagesFromGroup(group_id) {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select(
        "id,created_at,text,sender_id,sender_name,sender_image,reciver_id,reciver_name,reciver_image"
      )
      .eq("group_id", group_id);
    if (error) throw error;
    return data;
  } catch (err) {
    // console.log(err);
    return [];
  }
}
