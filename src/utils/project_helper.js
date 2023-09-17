import supabase from "./supabase.config";

//Function for creating a new project
export async function createProject({user_id,name}) {
  const { data, error } = await supabase
    .from("projects")
    .insert([{ created_by:user_id,name }])
    .select();
    if(error){
        return null;
    }
   return data[0]?.project_id;
}
