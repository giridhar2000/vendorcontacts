import supabase from "./supabase.config";

export async function getUser() {
  let { data } = await supabase.auth.getUser();
  let user = data?.user;
  let { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();
  if (error) return error;
  return profile;
}
export async function getUserById(id) {
  let { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return error;
  return profile;
}

export async function updateUserProfile(
  url,
  name,
  email,
  location,
  quote,
  bio
) {
  let { data:user } = await supabase.auth.getUser();
  let id = user?.user?.id;
  
  const { data, error } = await supabase
    .from("profiles")
    .update({ profile_pic: url,bio,location,quote,email,display_name:name })
    .eq("id", id)
   if(error){
    return false;
   }
   return true;
}


export async function getVendors(start,end){
  const { data, error } = await supabase
    .from("profiles")
    .select('*')
    .range(start,end)
    .eq("type", 'vendor')
   if(error){
    return false;
   }
   return data;
}
