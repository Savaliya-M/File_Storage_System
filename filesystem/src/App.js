import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Signupp from "./Pages/Signupp";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Loginn from "./Pages/Loginn";
import CreateOrganization from "./Pages/CreateOrganization";
import Organization from "./Pages/Oraganization";
import Home_Org from "./Pages/Home_Org";

function App() {
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      navigate("/");
    } else {
      setUser(token);
    }
  }, []);

  return (
    <>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/" element={<Loginn />} />
        <Route exact path="/createorg" element={<CreateOrganization />} />
        <Route exact path="/signup/:id" element={<Signupp />} />
        <Route exact path="/organizations" element={<Organization />} />
        <Route exact path="/dashboard/*" element={<Home_Org />} />
        {user ? <Route exact path="/home" element={<Home />} /> : <></>}
      </Routes>
    </>
  );
}

export default App;
