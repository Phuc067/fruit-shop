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
import {Pagination} from "antd";
import ProductCard from "../../components/ProductCard";

export default function Home() {

  const numberItemInPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: ["products", currentPage, numberItemInPage],
    queryFn: () => productApi.getPageProducts(currentPage - 1, numberItemInPage, "", ""),
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000,
    select: (result) => result.data.data,
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
                    <ProductCard item={item}/>
                </Link>
              ))}
          </div>
          <div className="w-full flex justify-center mt-4">
            <Pagination total={data?.totalElements} current={currentPage} pageSize={numberItemInPage} onChange={handlePageChange} />
          </div>
        </div>}
    </>
  );
}
