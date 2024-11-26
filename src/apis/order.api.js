import http from "src/utils/http";

const URL = "api/orders";

const orderApi = {
  createOrder: (body) =>  http.post(URL, body),
  getListOrder: (userId, state) => {
    const url = state 
      ? `${URL}?userId=${userId}&state=${state}` 
      : `${URL}?userId=${userId}`;
      
    return http.get(url); 
  }
};

export default orderApi;
