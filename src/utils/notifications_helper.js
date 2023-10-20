import supabase from "./supabase.config";

export async function getNotifications(id) {
  try {
    let { data, error } = await supabase
      .from("notifications")
      .select(
        "id,sender_id,sender_name,sender_image,reciver_id,reciver_name,reciver_image,type"
      )
      .eq("reciver_id", id);

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
