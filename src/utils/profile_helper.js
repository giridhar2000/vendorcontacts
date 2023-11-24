import supabase from "./supabase.config";

// getting current user information ------------------->    returns { < current user info > } || null

export async function getUser() {
  try {
    let { data } = await supabase.auth.getUser();
    let user = data?.user;
    let { data: profile, error } = await supabase
      .from("profiles")
      .select(
        "id,email,display_name,profile_pic,bio,type,location,quote,status,type,cover_pic,company"
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
        "id,email,display_name,profile_pic,bio,location,quote,type,status,cover_pic,company"
      )
      .eq("id", id)
      .single();
      if (error){
        // console.log(error);
        throw new Error(error);
      } 
    // console.log(profile);
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
  cover,
  company
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
        cover_pic: cover,
        company: company,
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

export async function getVendors(page = 0, sortBy) {
  console.log(sortBy);
  try {
    let from, to;
    const loadMoreData = () => {
      var ITEM_PER_PAGE = 2;
      from = page * ITEM_PER_PAGE;
      to = from + ITEM_PER_PAGE;
      if (page > 0) {
        from += 1;
      }
    };
    loadMoreData();
    const { data, count, error } = await supabase
      .from("profiles")
      .select("*", {
        count: "exact",
      })
      .range(from, to)
      .order( sortBy.column, {
        ascending:sortBy.ascending,
      })
      .eq("type", "vendor");

    if (error) throw new Error(error);

    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
}

// Getting all the users except current user by their type ------------->       returns [ < users by their type > ] || null

export async function getAllUsers(id, type) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id,profile_pic,display_name,bio,company,type")
      .neq("id", id);
    // .neq("type", type);
    if (error) throw new Error(error);
    return data;
  } catch (err) {
    // console.log(err);
    return null;
  }
}

// Getting all the users from same company ------------->       returns [ < users with same company > ] || null

export async function getAllUsersOfSameCompany(id, type, company) {
  if (!company) return null;
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id,profile_pic,display_name,bio,type,company")
      .neq("id", id)
      .eq("company", company);
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
      .select("id,created_at,file,user_id,name")
      .eq("user_id", id);
    if (error) throw new Error(error);
    return data;
  } catch (err) {
    // console.log(err);
    return null;
  }
}

// Deleting  document of a user by doc id --------------->          returns true || false

export async function removeDoc(id, name) {
  try {
    const { data, error } = await supabase.storage
      .from("profile_docs")
      .remove([`public/${name}`]);
    if (error) throw new Error(error);

    const { error: error2 } = await supabase
      .from("files")
      .delete()
      .eq("id", id);

    if (error2) throw new Error(error);
    return true;
  } catch (err) {
    // console.log(err);
    return false;
  }
}
