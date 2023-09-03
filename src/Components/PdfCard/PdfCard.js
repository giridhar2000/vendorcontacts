import React from "react";
import "./PdfCard.css";
import { BsDownload } from "react-icons/bs";
import bg1 from "../../Assets/img/img1.jpg";
const PdfCard = () => {
  return (
    <div className="pdf-card">
      <div className="pdf-card-row1">
        <div className="pdf">PDF</div>
        <p>List of Materials</p>
        <BsDownload />
      </div>
      <div className="pdf-card-image">
        <img src={bg1} alt="card img" />
      </div>
    </div>
  );
};

export default PdfCard;
