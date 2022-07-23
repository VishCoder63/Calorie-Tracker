import { createContext } from "react";

const loggedInUser = {
  name: "",
  token: "",
  role: "",
};

export const userContext = createContext(loggedInUser);
