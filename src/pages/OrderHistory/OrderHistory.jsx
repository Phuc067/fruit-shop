import { useState, useEffect, useContext } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import orderApi from "../../apis/order.api";
import OrderNavigation from "./components/OrderNavigation";
import { formatCurrency } from "../../utils/utils";
import Loading from "../../components/Loading";
import StateAction from "./components/StateAction/StateAction";
import { AppContext } from "../../contexts/app.context";

export default function OrderHistory() {
  const {profile} = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("");
  const userId = profile?.id;
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["orders", userId, activeTab],
      queryFn: async ({ pageParam = 0 }) => {
        const response = await orderApi.getPageOrderByUserIdAndState(
          userId,
          pageParam,
          5,
          activeTab
        );
        return response.data;
      },
      getNextPageParam: (lastPage) =>
        lastPage?.data?.last ? undefined : lastPage?.data?.number + 1,
    });

  const computeTotalPrice = (order) =>
    order.orderDetails.reduce(
      (total, orderDetail) =>
        total + orderDetail.salePrice * orderDetail.quantity,
      0
    );

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  console.log(data);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isFetchingNextPage, hasNextPage]);

  return (
    <>
      <div className="container  mb-4 ">
        <OrderNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="w-full bg-background ">
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {" "}
              {data?.pages?.[0]?.data?.content?.length === 0 && (
                <div className="text-center py-10 bg-white mt-4">
                  <span className="text-gray-500 text-lg">
                    Không có đơn hàng nào.
                  </span>
                </div>
              )}
              {data?.pages?.map((page, pageIndex) =>
                page?.data?.content?.map((order, orderIndex) => (
                  <div
                    key={`${pageIndex}-${orderIndex}`}
                    className="w-full mt-4 pl-2 bg-white py-2 text-sm md:text-base"
                  >
                    {order.orderDetails.map((orderDetail, detailIndex) => (
                      <div key={detailIndex} className="flex">
                        <div className="object-cover w-24 h-24">
                          <img src={orderDetail.product.image} alt="" />
                        </div>
                        <div className="flex flex-col justify-between py-4 grow">
                          <span className="text-base md:text-lg">
                            {orderDetail.product.title}
                          </span>
                          <span>x{orderDetail.quantity}</span>
                        </div>
                        <div className="flex items-center gap-2 mr-3 md:mr-10">
                          {orderDetail.price !== orderDetail.salePrice && (
                            <span className="line-through">
                              {formatCurrency(orderDetail.price)}
                            </span>
                          )}
                          <span>{formatCurrency(orderDetail.salePrice)}</span>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end">
                      <div className="flex mr-10 gap-2">
                        <span>Thành tiền</span>
                        <span className="text-secondary font-semibold">
                          {formatCurrency(computeTotalPrice(order))}
                        </span>
                      </div>
                    </div>
                    <StateAction order={order} />
                  </div>
                ))
              )}
            </>
          )}
          {isFetchingNextPage && <Loading />}
        </div>
      </div>
    </>
  );
}
