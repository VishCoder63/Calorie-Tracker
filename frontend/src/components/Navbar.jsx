import { Button } from "antd";
import React, { useContext } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../contexts/user.context";
import styles from "./styles/navbar.module.css";
import { Role } from "../enums/roles.enum.ts";

export const Navbar = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["token", "user"]);

  const navigate = useNavigate();
  const { loggedInUser, setLoggedInUser } = useContext(userContext);

  return (
    loggedInUser && (
      <div className={styles.navbarContainer}>
        <ul className={styles.navlist}>
          <li>
            <Link to="/">Home</Link>
          </li>
          {loggedInUser && loggedInUser.role === Role.Admin && (
            <li>
              <Link to="/stats">View Stats</Link>
            </li>
          )}
          <li>
            <Link to="/invite">Invite a Friend</Link>
          </li>
        </ul>
        <Button
          type="primary"
          onClick={() => {
            setLoggedInUser(null);
            removeCookie("user");
            removeCookie("token");
            console.log("after del: ", cookies);
            navigate("/signin");
          }}
        >
          Signout
        </Button>
      </div>
    )
  );
};
