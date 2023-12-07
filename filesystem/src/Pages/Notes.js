import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { jwtDecode as jwt_decode } from "jwt-decode";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [newNoteData, setNewNoteData] = useState({
    uid: "",
    orgid: "",
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      const token = await Cookies.get("token");
      const userData = await jwt_decode(token);

      const response = await axios.get(
        `http://localhost:3001/api/notes/${userData.id}_${userData.orgid}`
      );

      setNewNoteData({
        ...newNoteData,
        uid: userData.id,
        orgid: userData.orgid,
      });

      setNotes(response.data);
      console.log(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async () => {
    try {
      console.log(newNoteData, "in add function");
      await axios.post("http://localhost:3001/api/notes", newNoteData);

      fetchNotes();

      setNewNoteData({ title: "", description: "" });
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const deleteNote = async (id, uid) => {
    try {
      await axios.delete(`http://localhost:3001/api/notes/${id}_${uid}`);

      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6">Your Notes</h2>

      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Add New Note</h3>
        <div className="flex">
          <input
            type="text"
            value={newNoteData.title}
            onChange={(e) =>
              setNewNoteData({ ...newNoteData, title: e.target.value })
            }
            placeholder="Enter title..."
            className="flex-grow border border-gray-300 p-2 rounded-l"
          />
          <input
            type="text"
            value={newNoteData.description}
            onChange={(e) =>
              setNewNoteData({ ...newNoteData, description: e.target.value })
            }
            placeholder="Enter your note..."
            className="flex-grow border border-gray-300 p-2 rounded-l"
          />
          <button
            onClick={addNote}
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-2">Your Notes</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Title</th>
                <th className="p-2">Note</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-300 text-center"
                >
                  <td className="p-2">{note.title}</td>
                  <td className="p-2">{note.description}</td>
                  <td className="p-2">
                    <button
                      onClick={() => deleteNote(note.id, note.uid)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Notes;
