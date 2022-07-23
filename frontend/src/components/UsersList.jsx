import axios from "axios";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";

const dummyUsers = [
  {
    id: 1,
    name: "hello",
    email: "hello@gmail.com",
    role: "admin",
  },
  {
    id: 1,
    name: "hello",
    email: "hello@gmail.com",
    role: "admin",
  },
  {
    id: 1,
    name: "hello",
    email: "hello@gmail.com",
    role: "admin",
  },
  {
    id: 1,
    name: "hello",
    email: "hello@gmail.com",
    role: "admin",
  },
  {
    id: 1,
    name: "hello",
    email: "hello@gmail.com",
    role: "admin",
  },
];
export const UsersList = () => {
  const [users, setUsers] = useState(dummyUsers);
  //   useEffect(() => {
  //     axios
  //       //   .get(`${process.env.REACT_BACKEND_LINK}/users`)
  //       .get(`${process.env.REACT_APP_BACKEND_LINK}/users`)
  //       .then((res) => {
  //         setUsers(res.data);
  //       })
  //       .catch((err) => {
  //         console.log(err.response);
  //       });
  //   }, []);
  return users.map((user) => <UserCard user={user} />);
};
