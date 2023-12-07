import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode as jwt_decode } from "jwt-decode";
import Cookies from "js-cookie";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ todo: "", uid: "", orgid: "" });
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      const token = await Cookies.get("token");
      const userData = await jwt_decode(token);

      const response = await axios.get(
        `http://localhost:3001/api/todo/${userData.id}_${userData.orgid}`
      );

      setNewTodo({
        ...newTodo,
        uid: userData.id,
        orgid: userData.orgid,
      });

      setTodos(response.data);
      console.log(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    try {
      console.log(newTodo);
      await axios.post("http://localhost:3001/api/todo", newTodo);
      fetchTodos();
      setNewTodo({ todo: "" });
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleTodo = async (id) => {
    try {
      // await axios.put(`/api/todos/${id}`);

      const response = await axios.get("/api/todos");
      setTodos(response.data);
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const deleteTodo = async (id, orgid) => {
    try {
      await axios.delete(`http://localhost:3001/api/todo/${id}_${orgid}`);

      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6">Your Todo List</h2>

      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Add New Todo</h3>
        <div className="flex">
          <input
            type="text"
            value={newTodo.todo}
            onChange={(e) => setNewTodo({ ...newTodo, todo: e.target.value })}
            placeholder="Enter your todo..."
            className="flex-grow border border-gray-300 p-2 rounded-l"
          />
          <button
            onClick={addTodo}
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-2">Your Todos</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="list-disc pl-6">
            {todos &&
              todos.map((todo) => (
                <li key={todo.id} className="mb-2 flex items-center">
                  <span
                    className={`flex-grow ${
                      todo.completed ? "line-through" : ""
                    }`}
                  >
                    {todo.todo}
                  </span>
                  {/* <button
                  onClick={() => toggleTodo(todo.todo.id)}
                  className={`text-green-500 hover:text-green-600 ${
                    todo.completed ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                  disabled={todo.completed}
                >
                  Mark Complete
                </button> */}
                  <button
                    onClick={() => deleteTodo(todo.id, todo.orgid)}
                    className="text-red-500 hover:text-red-600 ml-2"
                  >
                    Delete
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Todo;
