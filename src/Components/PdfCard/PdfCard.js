import React, { useState } from "react";
import "./PdfCard.css";
import { BsDownload } from "react-icons/bs";
import { DeleteOutlined } from "@ant-design/icons";
import bg1 from "../../Assets/img/img1.jpg";
import supabase from "../../utils/supabase.config";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { removeDoc } from "../../utils/profile_helper";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";

const PdfCard = ({ doc, showDelete,id }) => {
  const queryClient=useQueryClient();
  const [modal, contextHolder] = Modal.useModal();

  async function deleteDoc() {
    try {
      let res = await removeDoc(doc?.id, doc?.name);
      if (res) toast("Deleted", { type: "success" });
      else toast("Failed", { type: "error" });
      queryClient.invalidateQueries(["docs", id]);
    } catch (err) {
      toast("Failed", { type: "error" });
    }
  }
  const confirm = () => {
    modal.confirm({
      title: "Delete the document",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure to delete this documnet?",
      okText: "Yes",
      cancelText: "No",
      onOk: deleteDoc,
    });
  };

  async function download() {
    const filePath = `public/${doc.name}`;
    const { data, error } = await supabase.storage
      .from("profile_docs")
      .download(filePath);
    if (error) {
      console.log(error);
    }
    if (data) {
      console.log(data);
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
          <a
            target="_blank"
            href={`https://kzthdyjkhdwyqztvlvmp.supabase.co/storage/v1/object/public/profile_docs/public/${doc?.name}`}
            download
          >
            <BsDownload />
          </a>
          {showDelete && (
            <button style={{ border: "0" }} onClick={confirm}>
              <DeleteOutlined className="delIcon" />
            </button>
          )}
        </div>
      </div>
      <div className="pdf-card-image">
        <img src={bg1} alt="card img" />
      </div>

      {contextHolder}
    </div>
  );
};

export default PdfCard;
