import React, { useState, useContext, useEffect } from "react";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import bg1 from "../../Assets/img/img1.jpg";
import { ImPencil } from "react-icons/im";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { FiCamera } from "react-icons/fi";
import { TiTick } from "react-icons/ti";
import "./Edit.css";
import supabase from "../../utils/supabase.config";
import { toast } from "react-toastify";
import { getUser, updateUserProfile } from "../../utils/profile_helper";
import { useNavigate } from "react-router-dom";
import UserContext from "../../contexts/userContext";
import { UploadOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import { Button, message, Upload, Select, Spin } from "antd";
import usePlacesAutocomplete from "use-places-autocomplete";

const Edit = () => {
  const { data: profile, isLoading } = useQuery("profile", getUser);
  let navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [location, setLocation] = useState(null);
  const [quote, setQuote] = useState(null);
  const [bio, setBio] = useState(null);
  const [cover, setCover] = useState(null);
  const [docUrls, setDocUrls] = useState([]);
  const [company, setCompany] = useState(null);

  const {
    ready,
    value,
    suggestions: { status, data, loading },
    setValue,
    init,
    clearSuggestions,
  } = usePlacesAutocomplete({
    initOnMount: true,
    requestOptions: {
      types: ["locality"],
    },
    debounce: 500,
  });

  useEffect(() => {
    let fName = profile?.display_name.split(" ")[0];
    let lName = profile?.display_name.split(" ")[1];
    setFirstName(fName);
    setLastName(lName);
  }, [profile]);

  // Functions for suggestion in places
  useEffect(() => {
    if (window?.google && window?.google?.maps) {
      console.log("maps", window?.google?.maps);
      init();
    }
  }, [window?.google?.maps]);

  // Function for handling suggestions places worked in
  const handlePlacesWorkedInChange2 = (e) => {
    console.log("on key down", data);
    setTimeout(() => {
      setValue(e.target.value);
    }, 1000);
  };

  // Function for address worked in
  const handleAddressChange = (value) => {
    // console.log("value", value);
    clearSuggestions();
    setLocation(value);
  };

  const checkFileExists = async (bucketName, filePath) => {
    // console.log(bucketName, filePath);
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .list("public", {
          search: filePath,
        });
      // console.log(data);
      if (error) throw new Error(error);
      return data.length > 0;
    } catch (err) {
      // console.log(err);
      return false;
    }
  };

  // async function handleFileUpload(e) {
  //   let file;
  //   if (e.file) {
  //     file = e.file;
  //   }
  //   const fileExists = await checkFileExists(
  //     "profile_pics",
  //     `public/${file.name}`
  //   );
  //   if (fileExists) {
  //     const { data, error } = await supabase.storage
  //       .from("profile_pics")
  //       .update("public/" + file?.name, file, {
  //         cacheControl: "3600",
  //         upsert: true,
  //       });

  //     return;
  //   }
  // }

  async function handleUpload(e) {
    const maxSize = 5 * 1024 * 1024; // 5mb
    if (e.target.files[0]?.size > maxSize) {
      e.target.value = "";
      toast("Max size limit is 5MB", { type: "error" });
      return;
    }
    let file;
    if (e.target.files && e.target?.files?.length) {
      file = e.target.files[0];
    }

    const fileExists = await checkFileExists("profile_pics", file.name);
    if (fileExists) {
      const { data, error } = await supabase.storage
        .from("profile_pics")
        .update("public/" + file?.name, file, {
          cacheControl: "3600",
          upsert: true,
        });

      return;
    }

    const { data, error } = await supabase.storage
      .from("profile_pics")
      .upload("public/" + file?.name, file);
    setUrl(
      `https://kzthdyjkhdwyqztvlvmp.supabase.co/storage/v1/object/public/profile_pics/public/${file.name}`
    );
  }
  async function handleCoverUpload(e) {
    const maxSize = 5 * 1024 * 1024; // 5mb
    if (e.target.files[0]?.size > maxSize) {
      e.target.value = "";
      toast("Max size limit is 5MB", { type: "error" });
      return;
    }
    let file;
    if (e.target.files && e.target?.files?.length) {
      file = e.target.files[0];
    }

    const fileExists = await checkFileExists(
      "cover_pics",
      `public/${file.name}`
    );
    if (fileExists) {
      const { data, error } = await supabase.storage
        .from("cover_pics")
        .update("public/" + file?.name, file, {
          cacheControl: "3600",
          upsert: true,
        });

      return;
    }

    const { data, error } = await supabase.storage
      .from("cover_pics")
      .upload("public/" + file?.name, file);
    setCover(
      `https://kzthdyjkhdwyqztvlvmp.supabase.co/storage/v1/object/public/cover_pics/public/${file.name}`
    );
  }

  async function updateProfile() {
    try {
      let name;

      name = firstName + " " + lastName;

      const res = await updateUserProfile(
        url || profile?.profile_pic,
        name,
        email || profile?.email,
        location || profile?.location,
        quote || profile?.quote,
        bio || profile?.bio,
        cover || profile?.cover_pic,
        company || profile?.company
      );
      // console.log(docUrls);
      let pr = new Promise((resolve, reject) => {
        if (docUrls.length === 0) resolve();
        docUrls.forEach(async (doc, index, array) => {
          const { error } = await supabase
            .from("files")
            .insert([{ file: doc, user_id: profile?.id, name: doc?.name }]);
          if (error) reject(error);
          if (index === array.length - 1) resolve();
        });
      });

      pr.then(() => {
        if (res) {
          toast("Profile updated", { type: "success" });
          navigate("/profile");
        } else {
          toast("Profile not updated", { type: "error" });
        }
      }).catch((err) => {
        throw new Error(err);
      });
    } catch (err) {
      toast("Profile not updated", { type: "error" });
    }
  }

  async function handleDocUpload(info) {
    // console.log(info);
    let onSuccess = info?.onSuccess;
    let file = info.file;
    try {
      const fileExists = await checkFileExists("profile_docs", file.name);
      console.log(fileExists);
      if (fileExists) {
        const { error } = await supabase.storage
          .from("profile_docs")
          .update("public/" + file?.name, file, {
            cacheControl: "3600",
            upsert: true,
          });
        setDocUrls([
          ...docUrls,
          {
            file: `https://kzthdyjkhdwyqztvlvmp.supabase.co/storage/v1/object/public/profile_pics/public/${file.name}`,
            name: file?.name,
          },
        ]);
        if (error) throw new Error(error);
        console.log(info);
        // return;
        if (onSuccess) onSuccess(file);
      } else {
        const { error } = await supabase.storage
          .from("profile_docs")
          .upload("public/" + file?.name, file);
        setDocUrls([
          ...docUrls,
          {
            file: `https://kzthdyjkhdwyqztvlvmp.supabase.co/storage/v1/object/public/profile_pics/public/${file.name}`,
            name: file?.name,
          },
        ]);

        if (error) throw new Error(error);
        if (onSuccess) onSuccess(file);
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async function handleRemove(file) {
    try {
      const { data, error } = await supabase.storage
        .from("profile_docs")
        .remove([`public/${file?.name}`]);

      setDocUrls((old) => {
        return old.filter((obj) => obj.name !== file.name);
      });
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  const props = {
    name: "file",
    headers: {
      authorization: "authorization-text",
    },
    beforeUpload: (file) => {
      const isPNG = file.type === "application/pdf";
      if (file.size > 5000000) {
        message.error(`${file.name} should be less than 5mb`);
        return false;
      }
      if (!isPNG) {
        message.error(`${file.name} is not a PDF file`);
      }
      return isPNG || Upload.LIST_IGNORE;
    },
    onChange(info) {
      console.log(info);
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  if (isLoading) {
    return <div className="loading-screen"><p><Spin />&nbsp; Loading....</p></div>;
  }
  return (
    <>
      <div className="cover-pic">
        {cover ? (
          <img src={cover} alt="cover" />
        ) : profile?.cover_pic ? (
          <img src={profile?.cover_pic} alt="bg" />
        ) : (
          <img src={bg1} alt="bg" />
        )}

        <input
          type="file"
          name="cover"
          id="cover"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleCoverUpload}
        />

        <label className="coverbtn" htmlFor={"cover"}>
          <p><FiCamera />&nbsp;  Change Photo</p>
        </label>
      </div>
      <div className="edit">
        <div className="editContainer">
          <div className="editform">
            <div className="photo">
              <input
                type="file"
                accept="image/*"
                id="profile_pic"
                onChange={handleUpload}
              />
              <label htmlFor="profile_pic" className="profile_pic_label">
                {url ? (
                  <img src={url} />
                ) : profile?.profile_pic ? (
                  <img src={profile?.profile_pic} />
                ) : (
                  <AiOutlineCloudUpload />
                )}
              </label>
              <p>{url ? "Uploaded" : "Upload your image here"}</p>
            </div>
            <button className="editbtn" onClick={updateProfile}>
              <ImPencil />
              &nbsp; Save Profile
            </button>
            <div className="editnames">
              <div className="editnameip">
                <input
                  placeholder="First name"
                  value={
                    profile?.display_name && firstName === null
                      ? profile?.display_name?.split(" ")[0]
                      : firstName
                  }
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="editnameip">
                <input
                  placeholder="Last name"
                  value={
                    profile?.display_name && lastName === null
                      ? profile?.display_name?.split(" ")[1]
                      : lastName
                  }
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="email edit-ip">
              <div className="editbio">Business Email</div>
              <div className="editemailip">
                <input
                  placeholder="Buisness Email"
                  value={
                    profile?.email && email === null ? profile?.email : email
                  }
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="company edit-ip">
              <div className="editbio">Company</div>
              <div className="editemailip">
                <input
                  placeholder="Company"
                  value={
                    profile?.company && company === null
                      ? profile?.company
                      : email
                  }
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
            </div>

            <div className="location edit-ip">
              <div className="editbio">Location</div>
              <div className="editemailip mt-1">

                <Select
                  showSearch
                  style={{
                    width: "100%",
                  }}
                  size="large"
                  notFoundContent={!loading ? <div className={{ padding: '4rem', display: 'grid', placeItems: 'center' }}><p>No data</p></div> : <Spin />}
                  options={data
                    ?.filter((d) => {
                      return d?.types?.includes("locality");
                    })
                    ?.map((suggestion) => {
                      const {
                        place_id,
                        structured_formatting: { main_text, secondary_text },
                      } = suggestion;

                      return {
                        label: main_text,
                        value: main_text + ", " + secondary_text,
                      };
                    })}
                  onInputKeyDown={handlePlacesWorkedInChange2}
                  placeholder={
                    profile?.location && location === null
                      ? profile?.location
                      : "Location"
                  }
                  onChange={handleAddressChange}
                />
              </div>
            </div>

            <div className="pq edit-ip">
              <div className="editbio">Profile Quote</div>
              <div className="editemailip">
                <input
                  placeholder="Profile Quote"
                  value={
                    profile?.quote && quote === null ? profile?.quote : quote
                  }
                  onChange={(e) => setQuote(e.target.value)}
                />
              </div>
            </div>

            <div className="bio edit-ip">
              <div className="editbio">Bio</div>
              <textarea
                class="textarea"
                id="txtInput"
                maxLength="500"
                value={profile?.bio && bio === null ? profile?.bio : bio}
                onChange={(e) => setBio(e.target.value)}
              ></textarea>
            </div>
            {profile?.type === "architect" ? null : (
              <>
                <div className="editbio">Attachment</div>
                <div className="attachment">
                  <Upload
                    {...props}
                    accept=".pdf"
                    customRequest={handleDocUpload}
                    onRemove={handleRemove}
                    multiple
                    maxCount={5}
                  >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </div>
              </>
            )}

            <script
              src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js"
              type="text/javascript"
            ></script>
            <script>$("#txtInput").autogrow();</script>
          </div>
        </div>
      </div>
    </>
  );
};

export default Edit;
