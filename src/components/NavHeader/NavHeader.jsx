import { Link, NavLink } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState, useRef } from "react";
import { AppContext } from "src/contexts/app.context";
import { useMutation } from "@tanstack/react-query";
import ImagePicker from "../ImagePicker";

import path from "src/constants/path";
import authApi from "src/apis/auth.api";
import Popover from "../Popover";

export default function NavHeader() {
  const { isAuthenticated, setIsAuthenticated, profile, setProfile, cart } =
    useContext(AppContext);
  const inputRef = useRef("");
  const [isImagePickerOpen, setImagePickerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const pagesWithoutSearch = ["/product", "/cart", "/order"];

  const shouldHideSearch = pagesWithoutSearch.includes(location.pathname);

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
  });

  const handleLogout = () => {
    logoutMutation.mutate();
    setIsAuthenticated(false);
    setProfile(null);
  };

  const handleClickSelectImage = () => {
    setImagePickerOpen(!isImagePickerOpen);
  }

  const handleImagePickerSubmit = (image) => {
    console.log("data:", image.name);
    const data ={
      "image": image
    }
    navigate(path.productList, {state: data});
  }
  const handleImagePickerCancel = () => {
    setImagePickerOpen(false);
  }

  const handleSearchChange = (keyword) => {
    const data = {
      "keyword": keyword
    }
    navigate(path.productList, {state: data});
  };
  return (
    <>
      <div className="shadow-ct bg-white sticky top-0 z-50">
        <div className="container py-5">
          <div className="flex items-center justify-between">
            <Link to={path.home}>
              <div className="w-fit bg-gradient-to-r from-primary to-secondary bg-clip-text text-xl font-bold text-transparent lg:text-2xl">
                Fruit shop
              </div>
            </Link>
            {!shouldHideSearch && (
              <form className="hidden w-[350px] md:block h-8">
                <div className="flex rounded-full border-2 border-primary w-[350px] bg-white p-1 h-12 items-center">
                  <input
                    type="text"
                    className='w-full flex-grow  rounded-full border-none bg-transparent px-3 py-1 text-black outline-none transition-all duration-300'
                    placeholder="Tìm kiếm sản phẩm"
                    ref={inputRef}
                    onChange={(e) => {
                      inputRef.current = e.target.value;
                    }}
                  />
                  
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
                <ImagePicker open={isImagePickerOpen} onSubmit={handleImagePickerSubmit} onClose={handleImagePickerCancel} />
              </form>)}
            <div className="flex items-center">
              {isAuthenticated && (
                <Popover
                  className="ml-6 flex cursor-pointer items-center py-1 hover:text-white/70"
                  renderPopover={
                    <div className="relative rounded-[10px] border  border-gray-200 bg-transparent/80 text-white shadow-md transition-all">
                      <Link
                        to={path.profile}
                        className="block w-full py-3 pl-4 pr-8 text-left hover:text-primary"
                      >
                        Tài khoản
                      </Link>
                      <Link
                        to={path.orderHistory}
                        className="block w-full py-3 pl-4 pr-8 text-left hover:text-primary"
                      >
                        Đơn hàng đã mua
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full py-3 pl-4 pr-8 text-left hover:text-primary"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  }
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
                      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <Link
                    to={path.profile}
                    className="hidden text-base md:flex  hover:text-primary/70"
                  >
                    {profile?.name ?? profile?.email}
                  </Link>
                </Popover>
              )}
              {!isAuthenticated && (
                <div className="flex items-center">
                  <Link
                    to={path.register}
                    className="mx-3 capitalize hover:text-primary/70"
                  >
                    Đăng ký
                  </Link>
                  <div className="h-4 border-r-[1px] border-r-white/40 "></div>
                  <Link
                    to={path.login}
                    className="mx-3 capitalize hover:text-primary/70"
                  >
                    Đăng nhập
                  </Link>
                </div>
              )}
              {isAuthenticated && (
                <div className="flex items-center hover:text-primary/70 relative">
                  <Link to={path.cart} className="mx-3 capitalize">
                    {cart > 0 && (
                      <span className="absolute top-[-50%] right-0 bg-red-500 text-white text-xs rounded-xl h-5 w-5 flex items-center justify-center">
                        {cart}
                      </span>
                    )}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                      />
                    </svg>
                  </Link>
                </div>
              )}
              {/* <HiBars3
                className="ml-6 h-6 w-6 md:hidden"
                onClick={() => setIsOpenMenu(true)}
              /> */}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <form className="w-full md:hidden">
            <div className="flex rounded-full border-2 border-primary bg-white p-1">
                <input
                  type="text"
                  className="flex-grow rounded-full border-none bg-transparent px-3 py-1 text-black outline-none"
                  placeholder="tìm kiếm sản phẩm"
                />
                <button
                  type="submit"
                  className="flex-shrink-0 rounded-full bg-primary px-4 py-1 hover:opacity-90"
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
            </form>
            <div className="ml-4 md:hidden">{/* <Notification /> */}</div>
          </div>
          {/* <button
            className={classNames(
              "fixed right-0 top-0 z-[9] h-screen w-screen bg-quaternary/70",
              {
                hidden: !isOpenMenu,
              }
            )}
            onClick={() => setIsOpenMenu(false)}
          ></button>
          <div
            className={classNames(
              "fixed left-0 top-0 z-[9] flex h-screen w-[70%] flex-col bg-secondary/90 transition-all",
              {
                "translate-x-[-100%]": !isOpenMenu,
                "translate-x-0": isOpenMenu,
              }
            )}
          >
            <div className="flex w-full justify-end p-2">
              <AiOutlineClose
                className="h-6 w-6"
                onClick={() => setIsOpenMenu(false)}
              />
            </div>
            <NavLink
              to={path.home}
              className={({ isActive }) =>
                classNames(
                  "relative justify-self-center p-[10px] text-[14px] uppercase transition-colors hover:bg-primary",
                  {
                    "bg-primary": isActive,
                  }
                )
              }
            >
              Trang chủ
            </NavLink>
            <NavLink
              to={path.movie}
              className={({ isActive }) =>
                classNames(
                  "relative justify-self-center p-[10px] text-[14px] uppercase transition-colors hover:bg-primary",
                  {
                    "bg-primary": isActive,
                  }
                )
              }
            >
              Sản phẩm
            </NavLink>
            <NavLink
              to={path.showtimes}
              className={({ isActive }) =>
                classNames(
                  "relative justify-self-center p-[10px] text-[14px] uppercase transition-colors hover:bg-primary",
                  {
                    "bg-primary": isActive,
                  }
                )
              }
            >
              Đơn hàng
            </NavLink>
            <NavLink
              to={path.fare}
              className={({ isActive }) =>
                classNames(
                  "relative justify-self-center p-[10px] text-[14px] uppercase transition-colors hover:bg-primary",
                  {
                    "bg-primary": isActive,
                  }
                )
              }
            >
              Giỏ hàng
            </NavLink>
            <NavLink
              to={path.member}
              className={({ isActive }) =>
                classNames(
                  "relative justify-self-center p-[10px] text-[14px] uppercase transition-colors hover:bg-primary",
                  {
                    "bg-primary": isActive,
                  }
                )
              }
            >
              Tài khoản
            </NavLink>
          </div> */}
        </div>
      </div>
    </>
  );
}
