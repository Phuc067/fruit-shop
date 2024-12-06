import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import productApi from "../../apis/product.api";
import Button from "../../components/Button/Button";
import Loading from "../../components/Loading"
import cartApi from "../../apis/cart.api";
import { Carousel } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AppContext } from "../../contexts/app.context";
import { toast } from "react-toastify";
import { setCartToLS } from "../../utils/auth";
import { Link, useNavigate } from "react-router-dom";
import path from "../../constants/path";
import { formatCurrency } from "../../utils/utils";

export default function Home() {
  const { profile, setCart } = useContext(AppContext);
  const navigator = useNavigate();

  const numberItemInPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const {
    data,
    isLoading,
    // error,
  } = useQuery({
    queryKey: ["products", currentPage, numberItemInPage],
    queryFn: () => productApi.getPageProducts(currentPage - 1, numberItemInPage, "", ""),
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000,
    select: (result) => result.data.data,
  });

  console.log(data);
  const cartMutation = useMutation({
    mutationFn: (body) => cartApi.addToCart(body),
  });


  const handleAddToCart = (id) => {
    if (profile === null) navigator(path.login)
    let body = {
      userId: profile.id,
      productId: id,
      quantity: 1,
    };
    console.log(body);
    cartMutation.mutate(body, {
      onSuccess: (result) => {
        if (result.data.data) {
          queryClient.invalidateQueries(["carts", profile.id]);
          setCart(result.data.data);
          setCartToLS(result.data.data);
          toast.success(result.data.message);
        }
      },
    });
  };
  const contentStyle = {
    height: '240px',
    color: '#fff',
    lineHeight: '240px',
    textAlign: 'center',
    background: '#364d79',
  };

  return (
    <>
      <div className=" overflow-hidden">
        <Carousel autoplay arrows autoplaySpeed={2000}>
          <div className="h-[500px] overflow-hidden">
            <img src="/slide-1.jpg" alt="" className="w-full h-full object-cover object-center" />
          </div>
          <div className="h-[500px] overflow-hidden">
            <img src="/slide-2.jpg" alt="" className="w-full h-full object-cover object-center" />
          </div>
          <div className="h-[500px] overflow-hidden">
            <img src="/slide-3.jpg" alt="" className="w-full h-full object-cover object-center" />
          </div>
          <div className="h-[500px] overflow-hidden">
            <img src="/slide-4.jpg" alt="" className="w-full h-full object-cover object-center" />
          </div>
        </Carousel>
      </div>

      {isLoading ? <Loading /> :
        <div className="container">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-2 mt-5">
            {data?.content &&
              data?.content.map((item) => (
                <Link key={item.id} to={path.productDetail.replace(":id", item.id)}>
                  <div
                    className="flex flex-col rounded-lg overflow-hidden cursor-pointer bg-white mb-5"

                  >
                    <div className="w-full">
                      <img
                        className="w-full aspect-square object-cover"
                        src={item.image}
                        alt=""
                      />
                      {item.discountPercentage ? (
                        <span className="absolute top-[-5px] right-[-5px] bg-secondary p-4">
                          {item.discountPercentage} %
                        </span>
                      ) : (
                        <></>
                      )}

                      <div className="flex flex-col px-5 mb-2 ">
                        <h3 className="text-primary">{item.title}</h3>

                        <div className="flex flex-wrap justify-end">
                          {item.discountPercentage ? (
                            <span className="text-decoration-line-through">
                              {item.price}{" "}
                            </span>
                          ) : (
                            <></>
                          )}
                          <span className="text-secondary mb-1">
                            {formatCurrency(
                              item.price -
                              item.price * item.discountPercentage
                            )}
                          </span>

                          <div className="w-full text-center rounded  py-1 px-3">
                            <Button
                              isLoading={cartMutation.isLoading}
                              disabled={cartMutation.isLoading}
                              onClick={() => handleAddToCart(item.id)}
                              className="flex w-full items-center justify-center rounded-[15px] bg-primary  px-2 py-4 text-center text-sm uppercase text-white hover:cursor-pointer hover:bg-primary hover:bg-opacity-70"
                            >
                              Thêm vào giỏ hàng
                            </Button>
                            <div />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>}
    </>
  );
}
