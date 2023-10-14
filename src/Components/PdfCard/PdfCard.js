import React from "react";
import "./PdfCard.css";
import { BsDownload } from "react-icons/bs";
import { DeleteOutlined } from "@ant-design/icons"
import bg1 from "../../Assets/img/img1.jpg";
import supabase from "../../utils/supabase.config";

const PdfCard = ({ doc }) => {
  async function download() {
    const filePath = `public/${doc.name}`;
    const { data, error } = await supabase.storage
      .from("profile_docs")
      .download(filePath);
    if (error) {
      console.log(error)
    }
    if (data) {
      console.log(data)
    }
  }
  return (
    <div className="pdf-card">
      <div className="pdf-card-row1">
        <div className="pdf-card-row1">
          <div className="pdf">PDF</div>
          <p>{doc?.name}</p>
        </div>
        <div className="pdf-card-row1">
          <a target="_blank" href={`https://kzthdyjkhdwyqztvlvmp.supabase.co/storage/v1/object/public/profile_docs/public/${doc?.name}`} download><BsDownload /></a>
          <a target="_blank" ><DeleteOutlined className="delIcon"/></a>
        </div>
      </div>
      <div className="pdf-card-image">
        <img src={bg1} alt="card img" />
      </div>
    </div>
  );
};

export default PdfCard;
