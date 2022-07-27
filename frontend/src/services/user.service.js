import axios from "axios";

const BASE_URL = "http://localhost:8000";
export const loginService = async ({ email, password }) => {
  return axios.post(`${BASE_URL}/users/signin`, {
    email,
    password,
  });
};

export const inviteFriend = async ({ name, email }) => {
  return axios.post(`${BASE_URL}/users/invite`, {
    email,
    name,
  });
};
