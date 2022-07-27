import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { userContext } from "../contexts/user.context";

export const Auth = ({ allowedRole, children }) => {
  const { loggedInUser } = useContext(userContext);

  if (!loggedInUser) return <Navigate to="/signin" />;
  //   navigate("/sigin");
  if (!allowedRole) return children;
  if (allowedRole && loggedInUser && loggedInUser.role === allowedRole)
    return children;
  else return <Navigate to="/*" />;
};
