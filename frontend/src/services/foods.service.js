import axios from "axios";
const BASE_URL = "http://localhost:8000";

export class FoodService {
  static getFoods = async (token) => {
    console.log(token);
    return axios.get(`${BASE_URL}/foods`, {
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
}
