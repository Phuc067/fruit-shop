import http from "src/utils/http";

const URL = "api/orders";

const orderApi = {
  createOrder: (body) =>  http.post(URL, body),
};

export default orderApi;