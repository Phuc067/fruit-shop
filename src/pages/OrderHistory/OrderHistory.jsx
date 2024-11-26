import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import orderApi from "../../apis/order.api";
import OrderNavigation from "./components/OrderNavigation";
import { AppContext } from "../../contexts/app.context";

export default function OrderHistory() {
  const [activeTab, setActiveTab] = useState("");
  const {profile} = useContext(AppContext);
  const {
    data: orders = [],
    isLoading,
  } = useQuery({
    queryKey: ["orders", activeTab],
    queryFn: async () => {
      const response = await orderApi.getListOrder(profile.id, activeTab === "" ? null : activeTab);
      console.log(response);
      return response.data;
    },
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000,
    select: (result) => result.data,
  });

  console.log(orders);

  return (
    <>
      <div>
        <OrderNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="container">
          {isLoading ? (
            <p>Đang tải dữ liệu...</p>
          ) : orders?.length > 0 ? (
            orders.map((order, index) => (
              <div key={index} className="order-item">
                {order.orderDetails[0].product.title}
              </div>
            ))
          ) : (
            <p>Không có đơn hàng nào.</p>
          )}
        </div>
      </div>
    </>
  );
}
