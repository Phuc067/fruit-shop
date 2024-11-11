import http from "src/utils/http";

const URL = "api/payments"

const paymentApi = {
  createPaymentUrl: ( orderId ) =>  http.post(`${URL}/create-payment-url`,{"data":orderId})
  ,
  sendPaymentInfo: (body) =>  http.post(`${URL}/info`, body)
  
}

export default paymentApi;