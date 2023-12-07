import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Uploader from "./Uploader";
import Cookies from "js-cookie";
import io from "socket.io-client";

const List = () => {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [open, setOpen] = useState(false);
  const imageRef = useRef();

  const socket = io("http://localhost:3001", { transports: ["websocket"] });

  const handleClose = () => {
    setOpen(!open);
  };

  // useEffect(() => {

  //   // return () => {
  //   //   socket.disconnect();
  //   // };
  // }, []);

  const handleDelete = async (filename) => {
    const token = Cookies.get("token");
    try {
      const response = await axios.get(
        `http://localhost:3001/upload/${filename}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchFiles();
    } catch (error) {
      console.error("API Error:", error.message);
    }
  };
  const fetchFiles = async () => {
    try {
      const token = Cookies.get("token");

      const response = await axios.get("http://localhost:3001/upload/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFiles(response.data.images);
    } catch (error) {
      console.error("Error fetching files:", error.message);
    }
  };

  useEffect(() => {
    socket.on("statusUpdate", (data) => {
      const rows = document.querySelectorAll("tr");

      rows.forEach((row) => {
        const file = row.querySelector(".filename");
        if (file && file.innerHTML === data.fileName) {
          const targetTd = row.querySelector(`.size${data.size}`);

          targetTd.textContent = data.status;
        }
      });
    });

    fetchFiles();
    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  return (
    <>
      <div className="overflow-x-auto">
        <Uploader
          handleClose={handleClose}
          open={open}
          fetchFiles={fetchFiles}
        />
        <div className="flex h-12 space-x-2 items-center mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2"
            onClick={handleClose}
          >
            Upload
          </button>
        </div>

        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 bg-gray-200 text-left">Sr. No.</th>
              <th className="px-4 py-2 bg-gray-200 text-left" colSpan={7}>
                File Name
              </th>
              <th className="px-4 py-2 bg-gray-200 text-left">800/600</th>
              <th className="px-4 py-2 bg-gray-200 text-left">600/400</th>
              <th className="px-4 py-2 bg-gray-200 text-left">400/300</th>
              <th className="px-4 py-2 bg-gray-200 text-left">100/80</th>
              <th className="pl-4 py-2 bg-gray-200 text-left">Delete</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 filename" colSpan={7}>
                  {/* {file.split("_")[1]} */}
                  {file.fileName}
                </td>
                <td className="px-4 py-2 size800600">Pending</td>
                <td className="px-4 py-2 size600400">Pending</td>
                <td className="px-4 py-2 size400300">Pending</td>
                <td className="px-4 py-2 size10080">Pending</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() =>
                      handleDelete(`${file.fileId}_${file.fileName}`)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default List;
