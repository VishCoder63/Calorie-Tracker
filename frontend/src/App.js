import logo from "./logo.svg";
import "./App.css";
import { Signin } from "./components/Signin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Outlet, Route, Routes } from "react-router-dom";
import { userContext } from "./contexts/user.context";
import { useState } from "react";
import axios from "axios";
import { Navbar } from "./components/Navbar";
import { Signup } from "./components/Signup";
import { UsersList } from "./components/UsersList";
import { Forbidden } from "./components/Forbidden";

function App() {
  const [loggedInUser, setLoggedInUser] = useState({
    name: "",
    token: "",
    role: "",
  });

  const onLogin = ({ email, password }) => {
    //api request to get role and token
    //success
    return new Promise((res, rej) => rej());
    // setLoggedInUser();
    //failure
  };

  const onLogout = () => {
    setLoggedInUser(null);
  };

  const onSignup = (values) => {
    console.log(JSON.stringify(values));
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_LINK}/register`,
        JSON.stringify(values)
      )
      .then((res) => console.log(res))
      .catch((err) => console.log(err.response));
  };

  return (
    // <div>
    //   <userContext.Provider
    //     value={{ loggedInUser, onLogin, onLogout, onSignup }}
    //   >
    //     <Navbar />
    //     <Outlet />
    //     <ToastContainer />
    //   </userContext.Provider>
    // </div>
    <Routes>
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/users" element={<UsersList />} />
      <Route path="*" element={<Forbidden />} />
    </Routes>
  );
}

export default App;
