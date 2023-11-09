import supabase from "./supabase.config";

export async function getNotifications(id,email) {
  try {
    let { data, error } = await supabase
      .from("notifications")
      .select(
        "id,sender_id,sender_name,sender_image,reciver_id,reciver_name,reciver_image,type,project_id,project_name"
      )
      .or(`reciver_id.eq.${id},reciver_email.eq.${email}`);
      

    if (error) throw new Error(error);

    return data;
  } catch (err) {
    // console.log(err);
    return null;
  }
}
export async function deleteNotification(id) {
  try {
    let {  error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error);

    return true;
  } catch (err) {
    // console.log(err);
    return false;
  }
}
