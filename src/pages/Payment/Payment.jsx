import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import paymentApi from "../../apis/payment.api";
import { useEffect, useState } from "react";
import getMessageReturned from "../../constants/VNPayResponseCode";
import HttpStatusCode from "../../constants/httpStatusCode.enum";
import { toast } from "react-toastify";
import Button from "../../components/Button";
import path from "../../constants/path";
export default function Payment() {
  /**	https://localhost:3000/payment/public/products?vnp_Amount=4000000&vnp_BankCode=NCB
		&vnp_BankTranNo=VNP14658165&vnp_CardType=ATM&vnp_OrderInfo=Thanh+toan+don+hang10
		&vnp_PayDate=20241108104836&vnp_ResponseCode=00&vnp_TmnCode=KLREQLOL
		&vnp_TransactionNo=14658165&vnp_TransactionStatus=00&vnp_TxnRef=86882767
		&vnp_SecureHash=c93063f272c5445d3145c21b22b04a71793e8fcd1262ced601a80d0e3582b8e308038ad5679fb6b4f1bfbbcd3cd36692e339870274d5046391708bf87926c61b
	**/
  const location = useLocation();
  const [data, setData] = useState();
  
  const sendInfoMutation = useMutation({
    mutationFn: (body) => paymentApi.sendPaymentInfo(body),
    onSuccess: (result) => {
      if (result.data.status === HttpStatusCode.Created)
        toast.success(result.data.message);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const body = {};
    for (let [key, value] of params.entries()) {
      console.log(`${key}: ${value}`);
      body[key] = value;
    }
    setData(body);
    sendInfoMutation.mutate(body);
  }, [location]);


  console.log(data);
  return (
    <>
      {data ? (
        <div className="container flex flex-col gap-y-2 justify-center rounded-md items-center py-16 bg-secondary text-white">
          <span>{getMessageReturned(data.vnp_ResponseCode)}</span>
          <Button className={"bg-white rounded-md text-gray px-3 py-1"} onClick= {()=> navigate(path.home)}>Trở về trang chủ</Button>
        </div>
      ) : (
        <div>Đang chờ phản hồi từ máy chủ</div>
      )}
    </>
  );
}
