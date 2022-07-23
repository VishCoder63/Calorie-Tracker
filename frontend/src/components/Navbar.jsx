import { Button } from "antd";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../contexts/user.context";
import styles from "./styles/navbar.module.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { onLogout } = useContext(userContext);

  return (
    <div className={styles.navbarContainer}>
      <ul className={styles.navlist}>
        <li>
          <Link to="/users">All users</Link>
        </li>
        <li>About</li>
        <li>Contact Us</li>
      </ul>
      <Button
        type="primary"
        onClick={() => {
          onLogout();
          navigate("/signup");
        }}
      >
        Signout
      </Button>
    </div>
  );
};

export { Navbar };
