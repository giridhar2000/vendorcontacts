import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import supabase from "./supabase.config";

//  Function for creating a new project   ------------------>     returns < new project id > || null

export async function createProject({ user_id, name }) {
  try {
    const { data, error } = await supabase
      .from("projects")
      .insert([{ created_by: user_id, name }])
      .select("project_id");

    if (error) throw new Error(error);

    return data[0]?.project_id;
  } catch (err) {
    return null;
  }
}

// Function for creating a new group in a project ------------------->      returns < new group id > || null

export async function createGroupToProject({ user_id, project_id, name }) {
  try {
    const { data, error } = await supabase
      .from("groups")
      .insert([{ created_by: user_id, project_id, name }])
      .select("group_id");

    if (error) throw new Error(ErrorBoundary);
    return data[0]?.group_id;
  } catch (err) {
    return null;
  }
}

// Function for creating a new member of a group  --------------------->    returns < new member id > || null

export async function createMembers({ reciver, group_id }) {
  try {
    const { data, error } = await supabase
      .from("group_members")
      .insert([
        {
          id: reciver?.id + group_id,
          user_id: reciver?.id,
          group_id,
          user_name: reciver?.display_name,
          user_pic: reciver?.profile_pic,
        },
      ])
      .select("id");
    if (error) throw new Error(error);
    return data[0]?.id;
  } catch (err) {
    return null;
  }
}


// Function for getting groups of a project by project id -------------------->  returns [ < groups of project id > ] || []

export async function getGroups(project_id) {
  try {
    const { data, error } = await supabase
      .from("groups")
      .select("id,project_id,created_at,created_by,group_id,name")
      .eq("project_id", project_id);
    if (error) throw new Error(error);
    return data;
  } catch (err) {
    // console.log(err);
    return [];
  }
}

// Function for getting groups of a user from their id -------------------->   returns [ < groups of a user > ] || []

export async function getMembers(user_id) {
  try {
    const { data, error } = await supabase
      .from("group_members")
      .select("user_id,group_id,user_name,user_pic")
      .eq("user_id", user_id);
    if (error) throw new Error(error);
    return data;
  } catch (err) {
    // console.log(err);
    return [];
  }
}
