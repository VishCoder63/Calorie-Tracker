import axios from "axios";
const BASE_URL = "http://localhost:8000";

export class FoodService {
  static getFoods = async (token, user, filterObj) => {
    // console.log(token);
    let queryString = "?";
    for (const key in filterObj) {
      if (filterObj[key]) queryString += `${key}=${filterObj[key]}&`;
    }
    // console.log(filterObj, queryString.slice(0, -1));
    // console.log("logged in: ", user.role);
    return axios.get(`${BASE_URL}/foods/${queryString.slice(0, -1)}`, {
      headers: {
        jwt: token,
      },
    });
  };
  static deleteFood = async (foodId, token) => {
    return axios.delete(`${BASE_URL}/foods/${foodId}`, {
      headers: {
        jwt: token,
      },
    });
  };

  static updateFood = async (foodId, values, token) => {
    return axios.put(`${BASE_URL}/foods/${foodId}`, values, {
      headers: {
        jwt: token,
      },
    });
  };
  static addFood = async (values, token) => {
    if (values.email === "") delete values.email;
    return axios.post(`${BASE_URL}/foods/`, values, {
      headers: {
        jwt: token,
      },
    });
  };

  static getStats = async (token) => {
    return axios.get(`${BASE_URL}/foods/stats`, {
      headers: {
        jwt: token,
      },
    });
  };
}
