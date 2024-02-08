import supabase from "./supabase.config";

export async function getCompanies() {
  try {
    const { data, error } = await supabase
      .from("companies")
      .select("company_name");

    if (error) throw new Error(error);
    let companies = data.reduce((acc, curr) => {
      if (!acc.includes(curr.company_name)) {
        acc.push(curr.company_name);
      }
      return acc;
    }, []);
    return companies;
  } catch (err) {
    console.log(err);
    return null;
  }
}
export async function insertCompany(companyName) {
  try {
    const { error } = await supabase
      .from("companies")
      .insert([{ company_name: companyName }]);

    if (error) throw new Error(error);

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
