import http from "src/utils/http";
import { composeQueryUrl } from "../utils/utils";
const URL = "api/orders";

const orderApi = {
  createOrder: (body) =>  http.post(URL, body),
  getPageOrderByUserIdAndState : (userId, page, amount, state)=>{
    const url = composeQueryUrl(URL, {userId, page,amount,state})
   
    return http.get(url);
  },
};

export default orderApi;
