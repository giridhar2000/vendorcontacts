import supabase from "./supabase.config";

export async function getUser() {
  let { data } = await supabase.auth.getUser();
  let user = data?.user;
  let { data: profile, error } = await supabase
    .from("profiles")
    .select('*')
    .eq("id", user?.id)
    .single();
  if (error) return error;
  return profile;
}
