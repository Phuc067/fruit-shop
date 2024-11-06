import shippingInformationApi from "../../apis/shippingInformation.api";
import { AppContext } from "../../contexts/app.context";
import { useContext, useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { formatCurrency } from "../../utils/utils";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";
import ShippingAddressModal from "./components/ShippingAddressModal";
import Button from "../../components/Button";
import paymentMethods from "../../constants/paymentMethod";
import { Select } from "antd";
import { useMutation } from "@tanstack/react-query";
import orderApi from "../../apis/order.api";
import { getSelectedCartFromSS, removeSelectedCartFromLS, setCartToLS } from "../../utils/auth";

export default function Order() {
  const { profile , cart, setCart} = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentShippingInformation, setCurrentShippingInformation] =
    useState(null);
  const [listShippingInformation, setListShippingInformation] = useState([]);
  const [shippingAddressModalOpen, setShippingAddressModalOpen] =
    useState(false);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].value);
  const shippingInfoRef = useRef(null);

  const listSelectedCart = getSelectedCartFromSS();
  const navigate = useNavigate();
  useEffect(() => {
    const getPrimaryShippingInformation = async () => {
      try {
        const response =
          await shippingInformationApi.getPrimaryShippingInformation(
            profile.id
          );
        if (response.data.data) {
          setCurrentShippingInformation(response.data.data);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Failed to fetch primary shipping information", error);
        toast.error("Không thể lấy dữ liệu địa chỉ nhận hàng");
      }
    };
    getPrimaryShippingInformation();
  }, [profile.id]);

  const showModal = async () => {
    try {
      const response = await shippingInformationApi.getShippingInformations(
        profile.id
      );

      if (response.data.data) {
        setListShippingInformation(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch shipping information list", error);
      toast.error("Không thể lấy danh sách địa chỉ nhận hàng");
    }
    setOpen(true);
  };

  const handleRadioChange = (shippingInfo) => {
    shippingInfoRef.current = shippingInfo;
  };

  const handleOk = () => {
    setLoading(true);
    setCurrentShippingInformation(shippingInfoRef.current);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const showUpdateModal = (shippingInfo) => {
    shippingInfoRef.current = shippingInfo;
    setShippingAddressModalOpen(true);
  };

  const handleShippingAddressModalClose = () => {
    setShippingAddressModalOpen(false);
    shippingInfoRef.current = null;
  };

  const handleUpdateShippingAdrress = (id, data) => {
    if (data.isPrimary) {
      setListShippingInformation((prevList) =>
        prevList.map((item) =>
          item.id === id ? { ...item, ...data } : { ...item, isPrimary: false }
        )
      );
    } else {
      setListShippingInformation((prevList) => {
        const index = prevList.findIndex((item) => item.id === id);
        if (index !== -1) {
          const updatedList = [
            ...prevList.slice(0, index),
            { ...prevList[index], ...data },
            ...prevList.slice(index + 1),
          ];
          return updatedList;
        }
        return prevList;
      });
    }
    console.log(listShippingInformation);
  };

  const showCreateModal = () => {
    shippingInfoRef.current = null;
    setShippingAddressModalOpen(true);
  };

  const handleAddShippingAddress = (data) => {
    if (data) setListShippingInformation([...listShippingInformation, data]);
  };

  const totalPayment = listSelectedCart.reduce(
    (total, item) =>
      total +
      item.quantity *
        (item.product.price -
          (item.product.price * item.product.discountPercentage) / 100),
    0
  );

  const createOrderMutation = useMutation({
    mutationFn:(body) =>{
        orderApi.createOrder(body)
    }
  })



  const handleOrder = ()=>{
    const cartIds = listSelectedCart.map(item => item.id);

    const body = {
      userId: profile.id,
      shippingInformationId: currentShippingInformation.id,
      paymentMethod,
      cartList: cartIds
    }

    console.log(body);
    createOrderMutation.mutate(body,{
      onSuccess:(result )=> {
        let data = result.data.data;
        const itemInCardWasRemove = cartIds.size;
        const itemInCard = cart -itemInCardWasRemove;
        setCart(itemInCard);
        setCartToLS(itemInCard);
        removeSelectedCartFromLS();
        navigate('/payment', { state: { orderData: data } });
      },
      onError:(error)=>{
        toast.error(error);
      }
    })
  }

  return (
    <>
      <div className="container bg-white rounded-sm pt-7 pb-6 mt-3">
        <div className="flex gap-2 mb-5 text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>
          <h2 className="text-xl font-semibold">Địa chỉ nhận hàng</h2>
        </div>
        <div className="">
          {currentShippingInformation ? (
            <div className="flex gap-2 pl-1 text-xs md:text-sm">
              <div className="flex gap-2">
                <div className="flex gap-1">
                  <strong className="text-bold">
                    {currentShippingInformation.recipientName}
                  </strong>
                  <strong>{currentShippingInformation.phone}</strong>
                </div>

                <div className="flex gap-2 ml-3 items-center w-[80%]">
                  <span>{currentShippingInformation.shippingAdress}</span>
                  {currentShippingInformation.isPrimary && (
                    <span className=" flex items-center text-[8px] md:text-[10px] border border-secondary text-secondary rounded-sm px-1 flex-shrink-0 h-5">
                      Mặc Định
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-shrink-0 items-center">
                <Button className="text-blue-500 md:ml-5" onClick={showModal}>
                  Thay đổi
                </Button>
                <Modal
                  open={open}
                  title="Địa chỉ của tôi"
                  closable={false}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  footer={[
                    <div
                      key="footer"
                      className="flex justify-end border-t border-smokeBlack h-16 items-center"
                    >
                      <Button
                        key="back"
                        onClick={handleCancel}
                        className=" w-32 p-2 border-smokeBlack  border mr-2  rounded-sm"
                      >
                        Hủy
                      </Button>
                      <Button
                        key="submit"
                        type="primary"
                        loading={loading}
                        onClick={handleOk}
                        className="w-32 p-2 text-white bg-secondary border border-secondary rounded-sm"
                      >
                        Xác nhận
                      </Button>
                    </div>,
                  ]}
                >
                  <div className="max-h-96 overflow-auto  scrollbar-hidden">
                    {listShippingInformation &&
                      listShippingInformation.map((item) => {
                        return (
                          <div key={item.id}>
                            {" "}
                            <div className="flex gap-2 border-t border-smokeBlack py-4 text-smokeBlack">
                              <div className="w-6 h-6">
                                <input
                                  type="radio"
                                  name="shippingInfo"
                                  defaultChecked={
                                    item.id === currentShippingInformation.id
                                  }
                                  onChange={() => handleRadioChange(item)}
                                  className="relative appearance-none w-4 h-4 rounded-full border-2 border-smokeBlack checked:border-secondary checked:before:content-[''] checked:before:block checked:before:w-2 checked:before:h-2 checked:before:bg-secondary checked:before:rounded-full checked:before:absolute checked:before:top-1/2 checked:before:left-1/2 checked:before:transform checked:before:translate-x-[-50%] checked:before:translate-y-[-50%]"
                                />
                              </div>
                              <div className="flex flex-col gap-2 flex-grow">
                                <div className="flex gap-1 justify-end">
                                  <div className="flex-grow">
                                    <strong className="text-bold border-r text-gray border-smokeBlack pr-2">
                                      {item.recipientName}
                                    </strong>
                                    <span className="pl-2">{item.phone}</span>
                                  </div>
                                  <div>
                                    <Button
                                      className="text-blue-600 font-medium px-2"
                                      onClick={() => showUpdateModal(item)}
                                    >
                                      Cập nhật
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex gap-2  w-[80%]">
                                  <span>{item.shippingAdress}</span>
                                </div>
                                <div>
                                  {item.isPrimary && (
                                    <span className="inline-flex items-center text-sm border border-secondary text-secondary rounded-sm px-1 flex-shrink-0 ">
                                      Mặc Định
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    <div className="border-t border-smokeBlack">
                      <Button
                        className={"pt-5 px-8 mb-2 text-blue-600 font-medium"}
                        onClick={showCreateModal}
                      >
                        Thêm địa chỉ
                      </Button>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 ml-3 text-xs md:text-sm">
              <span>Bạn chưa có địa chỉ nhận hàng</span>
              <Button>Thêm địa chỉ</Button>
            </div>
          )}
          <ShippingAddressModal
            open={shippingAddressModalOpen}
            onClose={handleShippingAddressModalClose}
            onSubmit={
              shippingInfoRef.current
                ? handleUpdateShippingAdrress
                : handleAddShippingAddress
            }
            shippingInfo={shippingInfoRef.current}
          />
        </div>
      </div>
      <div className="container bg-white rounded-sm py-1 mt-3">
        <div className="grid grid-cols-[50%_1fr_10%_1fr] text-gray pb-3 px-1 mt-5 bg-white rounded-md shadow-ct content-center text-sm md:text-base">
          <div className="">Sản Phẩm </div>
          <div className="text-center">Đơn giá</div>
          <div className="text-center">Số lượng</div>
          <div className="text-center">Số tiền</div>
        </div>

        {listSelectedCart.map((item) => (
          <div
            className="grid grid-cols-[50%_1fr_10%_1fr] items-center bg-white px -1 rounded-md "
            key={item.id}
          >
            <div className="h-[120px] flex items-center overflow-hidden gap-1 md:gap-2">
              <img
                src={item.product.image}
                className="object-cover h-full"
                alt=""
              />
              <span className="text-xs md:text-base">{item.product.title}</span>
            </div>
            <div className="text-center text-xs md:text-sm">
              {item.product.discountPercentage > 0 && (
                <span className="line-through">
                  formatCurrency({item.product.price * item.quantity})
                </span>
              )}
              <span>
                {formatCurrency(
                  item.product.price -
                    (item.product.price * item.product.discountPercentage) / 100
                )}
              </span>
            </div>
            <div className="text-center flex justify-center text-xs md:text-sm">
              <span className="block w-10  text-center ">{item.quantity}</span>
            </div>
            <div className="text-center font-semibold text-xs md:text-sm">
              {formatCurrency(
                (item.product.price -
                  (item.product.price * item.product.discountPercentage) /
                    100) *
                  item.quantity
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="container bg-white rounded-sm py-1 mt-3 border-b-2 border-background">
        <div className="flex gap-2 py-5 items-center">
          <span>Phương Thức thanh toán</span>

          <Select
            defaultValue= {paymentMethods[0].value}
            style={{
              width: 220,
            }}
            size="middle"
            onChange={(key) => {
              setPaymentMethod(key);
            }}
            options={paymentMethods}
          />
        </div>
      </div>
      <div className="container bg-white rounded-sm py-2 border-b-2 border-background grid grid-cols-[1fr_200px_200px] gap-2">
        <div></div>
        <span>Tổng thanh toán</span>
        <span className="text-end text-secondary font-semibold text-xl">
          {formatCurrency(totalPayment)}
        </span>
      </div>
      <div className="container bg-white rounded-sm p-5 mt-3 border-b-2 border-background flex justify-end">
        <Button className={"bg-secondary text-white px-8 py-2 rounded-sm"} onClick = {handleOrder}>
          Đặt hàng
        </Button>
      </div>
    </>
  );
}
