import React, { useEffect, useState } from "react";
import Uppy from "@uppy/core";
import { DashboardModal } from "@uppy/react";
import XHRUpload from "@uppy/xhr-upload";
import Cookies from "js-cookie";

// Don't forget the CSS: core and the UI components + plugins you are using.
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/webcam/dist/style.min.css";

const Uploader = ({ handleClose, open, fetchFiles }) => {
  const uppy = new Uppy();

  uppy.on("file-added", (file) => {
    console.log("Added file", file);
  });

  const fetchHeader = (file) => {
    const token = Cookies.get("token");
    return {
      authorization: `Bearer ${token}`,
    };
  };

  uppy.use(XHRUpload, {
    endpoint: "http://localhost:3001/upload",
    fieldName: "file",
    headers: fetchHeader,
  });

  uppy.on("upload-success", (file, response) => {
    console.log(`Upload successful for file ${file.name}`);
    console.log("Server response:", response);
    fetchFiles();
    handleClose();
    // window.location.reload();
  });
  return (
    <DashboardModal uppy={uppy} open={open} onRequestClose={handleClose} />
  );
};

export default Uploader;
