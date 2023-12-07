import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Route, Routes } from "react-router-dom";
import Notes from "./Notes";
import Todo from "./Todo";
import { jwtDecode as jwt_decode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";

const Home_Org = () => {
  const [user, setUser] = useState({});
  const [subscription, setSubscription] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await Cookies.get("token");
        const userData = jwt_decode(token);

        const sub = await axios.get(
          `http://localhost:3001/api/subscription/${userData.orgid}`
        );

        setUser(userData);
        setSubscription(sub.data.products);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex">
      <Sidebar length={subscription.length} />
      <div className="flex flex-col w-full">
        <Navbar userName={user.name} />
        <div className="p-4">
          <Routes>
            {subscription && subscription.length === 1 ? (
              <Route exact path="/notes" element={<Notes />} />
            ) : (
              <>
                <Route exact path="/notes" element={<Notes />} />
                <Route exact path="/todo" element={<Todo />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Home_Org;
