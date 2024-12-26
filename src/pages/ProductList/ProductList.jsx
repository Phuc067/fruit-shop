import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import fruitApi from "../../apis/fruit.api";
import productApi from "../../apis/product.api";
import ImagePicker from "../../components/ImagePicker";
import Loading from "../../components/Loading";
import { Link, useLocation } from "react-router-dom";
import path from "../../constants/path";
import { Pagination } from "antd";
import ProductCard from "../../components/ProductCard";


export default function ProductList() {
  const [keyword, setKeyword] = useState("");
  const inputRef = useRef("");
  const numberItemInPage = 4;
  const [sortType, setSortType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isImagePickerOpen, setImagePickerOpen] = useState(false);
  const [imageSearch, setImageSearch] = useState("");

  const location = useLocation();
  const searchData = location.state;

  useEffect(() => {
    if (searchData) {
      if (searchData.keyword) {
        setKeyword(searchData.keyword);
      }
      if (searchData.image) {
        setImageSearch(searchData.image);
      }
    }
  }, [searchData]);
  const { data, isLoading, isError, refetch } =
    useQuery({
      queryKey: ["products", currentPage, keyword, imageSearch?.name || imageSearch, sortType],
      queryFn: () => {
        if (imageSearch) {
          return fruitApi.searchProduct(currentPage - 1, numberItemInPage, imageSearch, sortType);
        } else {
          return productApi.getPageProducts(currentPage - 1, numberItemInPage, keyword, sortType);
        }
      }
      ,
      keepPreviousData: true,
      select:(result) => result.data.data
    });

  // console.log(data);


  const handleSearchChange = () => {
    setKeyword(inputRef.current.value);  
    setCurrentPage(1);
    setImageSearch("");
  };

  const handleClickSelectImage = () => {
    setImagePickerOpen(!isImagePickerOpen);
  }

  const handleImagePickerSubmit = (image) => {
    setCurrentPage(1);
    setImageSearch(image);
    setKeyword("");
  }
  const handleImagePickerCancel = () => {
    setImagePickerOpen(false);
  }

  const handleSortChange = (e) => {
    setSortType(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return <>
    <div className="container">
      <div className="w-full flex items-center mt-4 flex-col ">
        <div className="w-full flex pt-4 pb-6 gap-2 lg:px-4 ">
        <div className="w-[70%] flex gap-4 items-center flex-wrap  justify-center">
              <div className="flex rounded-full border-2 border-primary w-[350px] bg-white p-1 h-12 items-center">
                <input
                  type="text"
                  className={`${imageSearch ? 'w-0' : 'w-full flex-grow '} rounded-full border-none bg-transparent px-3 py-1 text-black outline-none transition-all duration-300`}
                  placeholder="Tìm kiếm sản phẩm"
                  ref={inputRef}
                  onChange={(e) => {
                    inputRef.current = e.target.value;
                  }}
                />
                {imageSearch && (
                  <div className="flex flex-grow">
                    <span className="text-sm flex items-center text-gray-700">{imageSearch.name} <button
                      onClick={() => setImageSearch("")}
                      className="ml-2 items-center text-red-500  transition-all duration-300 ease-in-out transform hover:scale-105 text-sm"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button></span>

                  </div>
                )}
                <div className="mx-2 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 text-primary " onClick={handleClickSelectImage}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                  </svg>
                </div>

                <button
                  onClick={handleSearchChange}
                  type="submit"
                  className="flex-shrink-0 transition-all duration-300 ease-in-out transform hover:scale-105 rounded-full bg-primary px-4 py-1 hover:opacity-90"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex items-center space-x-3 flex-1 justify-center">
                <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                  Sắp xếp theo:
                </label>
                <select
                  id="sort"
                  name="sort"
                  onChange={handleSortChange}
                  className="border border-gray-300 transition-all duration-300 ease-in-out transform hover:scale-105 rounded-full px-4 py-1 text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value=""></option>
                  <option value="price_asc">Giá thấp đến cao</option>
                  <option value="price_desc">Giá cao đến thấp</option>
                  <option value="discount_asc">Giảm giá thấp đến cao</option>
                  <option value="discount_desc">Giảm giá cao đến thấp</option>
                </select>
              </div>
            </div>

        </div>
        <ImagePicker open={isImagePickerOpen} onSubmit={handleImagePickerSubmit} onClose={handleImagePickerCancel} />
        <div className="container">
          <h2>Danh sách sản phẩm</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-2 mt-5">
            {isLoading && <Loading />}

            {isError && <div>Đã xảy ra lỗi khi tải danh sách sản phẩm:  Không thể kết nối đến server.</div>}

            {!isLoading && !isError && (!data?.content || data.content.length === 0) && (
              <div>Danh sách sản phẩm trống.</div>
            )}

            {data?.content?.map((item, index) => (
              <Link key={index} to={path.productDetail.replace(':id', item.id)
              }>
                <ProductCard item={item} />
              </Link>
            ))}
          </div>

        </div>
        <div className="mt-4">
          <Pagination total={data?.totalElements} current={currentPage} pageSize={numberItemInPage} onChange={handlePageChange} />
        </div>

      </div>
    </div>
  </>
}