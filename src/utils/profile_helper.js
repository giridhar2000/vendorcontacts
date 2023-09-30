import supabase from "./supabase.config";

// getting current user information ------------------->    returns { < current user info > } || null

export async function getUser() {
  try {
    let { data } = await supabase.auth.getUser();
    let user = data?.user;
    let { data: profile, error } = await supabase
      .from("profiles")
      .select(
        "id,email,display_name,profile_pic,bio,type,location,quote,status,type,cover_pic"
      )
      .eq("id", user?.id)
      .single();
    if (error) throw new Error(error);
    return profile;
  } catch (err) {
    // console.log(err);
    return null;
  }
}

// getting current user information by user id ------------------->           returns { <  user info by id > } || null

export async function getUserById(id) {
  try {
    let { data: profile, error } = await supabase
      .from("profiles")
      .select(
        "id,email,display_name,profile_pic,bio,location,quote,type,status,cover_pic"
      )
      .eq("id", id)
      .single();
    if (error) throw new Error(error);
    return profile;
  } catch (err) {
    // console.log(err);
    return null;
  }
}

// Updating user profile   ------------->     returns true || false

export async function updateUserProfile(
  url,
  name,
  email,
  location,
  quote,
  bio,
  cover
) {
  try {
    let { data: user } = await supabase.auth.getUser();
    let id = user?.user?.id;

    const { error } = await supabase
      .from("profiles")
      .update({
        profile_pic: url,
        bio,
        location,
        quote,
        email,
        display_name: name,
        cover_pic:cover
      })
      .eq("id", id);
    if (error) throw new Error(error);
    return true;
  } catch (err) {
    // console.log(err);
    return false;
  }
}

// Getting vendors by range ------------------>      returns [ < vendors > ] || []

export async function getVendors(start, end) {
  try {
    const { data, count, error } = await supabase
      .from("profiles")
      .select("id,profile_pic,display_name,location,bio,cover_pic", { count: "exact" })
      .range(start, end)
      .eq("type", "vendor");

    if (error) throw new Error(error);
   
    return data;
  } catch (err) {
    // console.log(err);
    return [];
  }
}

// Getting all the users except current user by their type ------------->       returns [ < users by their type > ] || null

export async function getAllUsers(id, type) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id,profile_pic,display_name,bio")
      .neq("id", id)
      .neq("type", type);
    if (error) throw new Error(error);
    return data;
  } catch (err) {
    // console.log(err);
    return null;
  }
}

// Getting all documents of a user by user id --------------->          returns [ < docs of a user > ] || null

export async function getAllDocs(id) {
  try {
    const { data, error } = await supabase
      .from("files")
      .select("created_at,file,user_id,name")
      .eq("user_id", id);
    if (error) throw new Error(error);
    return data;
  } catch (err) {
    // console.log(err);
    return null;
  }
}
