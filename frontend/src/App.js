import "./App.css";
import { Signin } from "./components/Signin";
import { Navbar } from "./components/Navbar";

import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import { userContext } from "./contexts/user.context";
import { useEffect, useState } from "react";

import { useCookies } from "react-cookie";
import { FoodEntriesPage } from "./pages/FoodEntriesPage";
import { StatsPage } from "./pages/StatsPage";
import { InviteFriendPage } from "./pages/InviteFriendPage";
import { Auth } from "./components/Auth";
import { Role } from "./enums/roles.enum.ts";
import { PageNotFound } from "./components/PageNotFound";
function App() {
  const [cookies, setCookie, removeCookie] = useCookies(["token", "user"]);
  const [loggedInUser, setLoggedInUser] = useState(cookies.user);
  useEffect(() => {
    if (cookies.user) setLoggedInUser(cookies.user);
  }, []);

  return (
    <userContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      <Navbar />
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route
          path="/"
          element={
            <Auth>
              <FoodEntriesPage />
            </Auth>
          }
        >
          <Route
            path="foods"
            element={
              <Auth>
                <FoodEntriesPage />
              </Auth>
            }
          />
        </Route>
        <Route
          path="/stats"
          element={
            <Auth allowedRole={Role.Admin}>
              <StatsPage />
            </Auth>
          }
        />
        <Route
          path="/invite"
          element={
            <Auth>
              <InviteFriendPage />
            </Auth>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </userContext.Provider>
  );
}

export default App;
