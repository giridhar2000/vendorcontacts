import supabase from "./supabase.config";

//Function for creating a new project
export async function createProject({ user_id, name, type }) {
  const { data, error } = await supabase
    .from("projects")
    .insert([{ created_by: user_id, name }])
    .select();

  if (error) {
    return null;
  }


  return data[0]?.project_id;
}
//Function for creating a new group
export async function createGroupToProject({ user_id, project_id, name }) {
  const { data, error } = await supabase
    .from("groups")
    .insert([{ created_by: user_id, project_id, name }])
    .select();
  console.log(data);
  if (error) {
    return null;
  }
  return data[0]?.group_id;
}
//Function for creating a new member
export async function createMembers({ reciver, user, group_id }) {
  console.log(reciver);
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
    .select();
  if (error) {
    return [];
  }
  console.log(data, error);
  if (error) {
    return null;
  }
  return data[0]?.id;
}
//Function for getting groups
export async function getGroups(project_id, user_id) {
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .eq("project_id", project_id);
  if (error) return [];
  return data;
  // return newData;
}
//Function for getting groups
export async function getMembers(user_id) {
  const { data, error } = await supabase
    .from("group_members")
    .select("user_id,group_id,user_name,user_pic")
    .eq("user_id", user_id);
  console.log(data, error);
  if (error) {
    return [];
  }
  return data;
}
