import logo from "./logo.svg";
import "./App.css";
import { Signin } from "./components/Signin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Outlet, Route, Routes } from "react-router-dom";
import { userContext } from "./contexts/user.context";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "./components/Navbar";
import { Signup } from "./components/Signup";
import { FoodsList } from "./components/FoodsList";
import { Forbidden } from "./components/Forbidden";
import { useCookies } from "react-cookie";
function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["token", "user"]);

  useEffect(() => {
    if (cookies.user) setLoggedInUser(cookies.user);
  }, [cookies.token]);

  return (
    <userContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/foods" element={<FoodsList />} />
        {/* <Route path="/stats" element={<UsersLis />} /> */}
        <Route path="*" element={<Forbidden />} />
      </Routes>
    </userContext.Provider>
  );
}

export default App;
