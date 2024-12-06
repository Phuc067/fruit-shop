import { useContext, useRef, useState, useEffect } from "react";
import { AppContext } from "../../contexts/app.context";
import cartApi from "../../apis/cart.api";
import { formatCurrency } from "../../utils/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import Button from "../../components/Button/Button";
import Loading from "../../components/Loading";
import { setCartToLS, setSelectedCartToSS } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import path from "../../constants/path";
import BackButton from "../../components/BackButton";

export default function Cart() {
  const { profile, cart, setCart } = useContext(AppContext);

  const queryClient = useQueryClient();
  const inputRefs = useRef([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const navigate = useNavigate();

  const { data: carts = [], refetch, isLoading } = useQuery({
    queryKey: ["carts", profile.id],
    queryFn: () => cartApi.getCart(profile.id),
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000,
    select: (result) => result?.data?.data
  }
  );

  console.log(carts)
  const handleChange = (event, index) => {
    const value = event.target.value;

    if (/^\d*$/.test(value)) {
      inputRefs.current[index].value = value;
    } else {
      inputRefs.current[index].value = inputRefs.current[index].value.replace(
        /[^\d]/g,
        ""
      );
    }
  };

  const handleBlur = (event, index) => {
    const value = event.target.value;
    if (value === "" || value.Number === 0)
      inputRefs.current[index].value = carts[index].quantity;
    else updateProductQuantity(carts[index].id, Number(value));
  };

  const updateCartMutation = useMutation({
    mutationFn: ({ id, body }) => cartApi.updateProductQuantity(id, body),
  });

  const deleteProductMutation = useMutation({
    mutationFn: ({ id }) => cartApi.deleteProduct(id),
  });

  const deleteMultipleMutation = useMutation({
    mutationFn: (data) => cartApi.deleteProducts(data),
  });

  const updateProductQuantity = (id, quantity) => {
    if (quantity < 1) toast.warning("Số lượng không đuợc nhỏ hơn 1!");
    else {
      updateCartMutation.mutate(
        { id, body: { value: quantity } },
        {
          onSuccess: (data) => {
            if (data.data.data) {
              const cartItem = carts.find((item) => item.id === id);
              if (cartItem) {
                cartItem.quantity = data.data.data.quantity;
                inputRefs.current[
                  carts.findIndex((item) => item.id === id)
                ].value = data.data.data.quantity;
              }
            } else {
              toast.isActive()
              toast.error(data.data.message);
              inputRefs.current[
                carts.findIndex((item) => item.id === id)
              ].value =
                carts[carts.findIndex((item) => item.id === id)].quantity;
            }
          },
          onError: () => {
            toast.error("Cập nhật số lượng sản phẩm thất bại");
          },
        }
      );
    }
  };

  const removeItemInCarts = (listId) => {
    queryClient.setQueryData(["carts", profile.id], (oldCarts) => {
      if (oldCarts && Array.isArray(oldCarts.data.data)) {
        let newCarts = oldCarts.data.data.filter((item) => !listId.includes(item.id));
        return {
          ...oldCarts,
          data: {
            ...oldCarts.data,
            data: newCarts,
          },
        };
      }
      return oldCarts;
    });
  };

  const handleDeleteProduct = (id) => {
    deleteProductMutation.mutate(
      { id },
      {
        onSuccess: (data) => {
          if (data.data.data) {
            setCart(cart - 1);
            setCartToLS(cart - 1);
            removeItemInCarts([id]);
          } else {
            toast.error(data.data.message);
          }
        },
        onError: () => {
          toast.error("Xóa sản phẩm thất bại");
        },
      }
    );
  };

  const handleSelectProduct = (index) => {
    setSelectedItems((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleSelectAll = () => {
    setIsSelectAll(!isSelectAll);
    if (!isSelectAll) {
      const allIndexes = carts.map((_, index) => index);
      setSelectedItems(allIndexes);
    } else {
      setSelectedItems([]);
    }
  };

  const handleDeleteSelected = () => {
    const listSelectedCartId = selectedItems.map(index => carts[index].id);
    console.log(listSelectedCartId);
    deleteMultipleMutation.mutate(listSelectedCartId, {
      onSuccess: (data) => {
        if (data.data.data) {
          toast.success("Xóa sản phẩm thành công");
          setCart(cart - listSelectedCartId.length);
          setCartToLS(cart - listSelectedCartId.length);
          removeItemInCarts(listSelectedCartId);
          setSelectedItems([]);
        } else {
          toast.error(data.data.message);
        }
      },
      onError: () => {
        toast.error("Xóa sản phẩm thất bại");
      },
    });
  }

  const totalSelectedPrice = selectedItems.reduce(
    (total, index) =>
      total +
      carts[index].quantity *
      (carts[index].product.price -
        (carts[index].product.price *
          carts[index].product.discountPercentage) /
        100),
    0
  );

  const handleOrder = () => {
    const listSelectedCart = selectedItems.map(index => carts[index]);
    if (listSelectedCart.length === 0) {
      toast.warning("Vui lòng chọn sản phẩm để mua hàng");
    } else {
      setSelectedCartToSS(listSelectedCart);
      navigate(path.order);
    }
  }

  return (
    <>
      {isLoading ? <Loading /> :
        carts.length !== 0 ?
          <div className="text-xs md:text-sm lg:text-base">
            <div className="container bg-white mt-1 ">
            <BackButton/>
              <div className="grid grid-cols-[3%_50%_1fr_1fr_12%_7%] text-gray pb-5   rounded-md shadow-ct content-center">
                <div className="pl-[1%]">
                  <input
                    type="checkbox"
                    checked={isSelectAll}
                    onChange={(e) => setIsSelectAll(e.target.checked)}
                    onClick={handleSelectAll}
                  />
                </div>
                <div className="border-r border-smokeBlack">Sản Phẩm </div>
                <div className="text-center border-r border-smokeBlack">Đơn giá</div>
                <div className="text-center border-r border-smokeBlack">Số lượng</div>
                <div className="text-center border-r border-smokeBlack">Số tiền</div>
                <div className="text-center">Thao tác</div>
              </div>
            </div>
            <div className="container relative bg-white mb-4">
              {carts.map((item, index) => (
                <div
                  className="grid grid-cols-[3%_50%_1fr_1fr_12%_7%] items-center bg-white mt-3  rounded-md "
                  key={item.id}
                >
                  <div className="pl-[1%]">
                    <input
                      className=""
                      checked={selectedItems.includes(index)}
                      onChange={() => handleSelectProduct(index)}
                      type="checkbox"
                    />
                  </div>
                  <div className="h-[120px] flex items-center overflow-hidden ">
                    <img
                      src={item.product.image}
                      className="object-cover h-full"
                      alt=""
                    />
                    <span className="text-sm ">{item.product.title}</span>
                  </div>
                  <div className="text-center border-x border-smokeBlack">
                    {item.product.discountPercentage > 0 && (
                      <span className="line-through">
                        formatCurrency({item.product.price * item.quantity})
                      </span>
                    )}
                    <span>
                      {formatCurrency(
                        item.product.price -
                        (item.product.price * item.product.discountPercentage) /
                        100
                      )}
                    </span>
                  </div>
                  <div className="text-center flex justify-center border-r border-smokeBlack">
                    <button
                      className="w-5 border border-gray text-xl"
                      onClick={() =>
                        updateProductQuantity(item.id, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <input
                      ref={(i) => (inputRefs.current[index] = i)}
                      className="block w-10  text-center border-t border-b border-gray"
                      type="text"
                      min={1}
                      defaultValue={item.quantity}
                      onChange={(event) => handleChange(event, index)}
                      onBlur={() => handleBlur(event, index)}
                    />
                    <button
                      className="w-5 border border-gray text-xl"
                      onClick={() =>
                        updateProductQuantity(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <div className="text-center border-r border-smokeBlack">
                    {formatCurrency(
                      (item.product.price -
                        (item.product.price * item.product.discountPercentage) /
                        100) *
                      item.quantity
                    )}
                  </div>
                  <div className="text-center">
                    <Button
                      className="p-2 text-secondary"
                      isLoading={deleteProductMutation.isLoading}
                      onClick={() => handleDeleteProduct(item.id)}
                      disabled={deleteProductMutation.isLoading}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              ))}

              <div className="sticky bottom-0 text-gray left-0 right-0 flex shadow-ct bg-white mt-3 rounded-md py-5 align-center justify-between">
                <div>
                  <div
                    onClick={handleSelectAll}
                    className="cursor-pointer inline-block mr-5 py-2"
                  >
                    <input
                      className="mr-2"
                      type="checkbox"
                      checked={isSelectAll}
                      onChange={(e) => setIsSelectAll(e.target.checked)}
                    />
                    <span>Chọn tất cả</span>
                  </div>
                  <div className="inline-block px-5 py-2">
                    <Button onClick={handleDeleteSelected}>Xoá</Button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex px-5 py-2  flex-wrap">
                    <span className="mr-2">Tổng tiền</span>
                    <span className="text-secondary font-semibold">
                      {formatCurrency(totalSelectedPrice)}
                    </span>
                  </div>
                  <div className="flex  align-center">
                    <Button className="text-white bg-primary py-2 px-5 rounded-3xl" onClick={handleOrder}>
                      Mua hàng
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          : (
            <div className="flex justify-center items-center flex-col container bg-white text-gray-800 my-6 py-24 bg-gradient-to-r from-orange-300 via-orange-200 to-orange-100 shadow-xl h-96 rounded-3xl">
              <p className="mb-6 text-lg font-semibold">
                Không có sản phẩm nào. Quay về trang sản phẩm để tiếp tục mua sắm nhé!
              </p>
              <Button
                className="bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 px-5 border border-gray-300 rounded-md shadow-md transition-all duration-300"
                onClick={() => navigate(path.home)}
              >
                Trở về trang chủ
              </Button>
            </div>
          )}
    </>
  );
}
