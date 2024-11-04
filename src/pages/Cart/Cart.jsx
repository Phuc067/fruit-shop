import { useContext, useRef, useState, useEffect } from "react";
import { AppContext } from "../../contexts/app.context";
import cartApi from "../../apis/cart.api";
import { formatCurrency } from "../../utils/utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import Button from "../../components/Button/Button";
import { setCartToLS } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import path from "../../constants/path";

export default function Cart() {
  const { profile, cart, setCart } = useContext(AppContext);

  const queryClient = useQueryClient();
  const inputRefs = useRef([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const navigate = useNavigate();

  const [carts, setCarts] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await cartApi.getCart(profile.id);
        setCarts(response.data.data); 
      } catch (error) {
        console.error("Failed to fetch cart", error);
        toast.error("Không thể lấy dữ liệu giỏ hàng");
      }
    };

    fetchCart();
  }, [profile.id]); 
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
                cartItem.quantity = quantity;
                inputRefs.current[
                  carts.findIndex((item) => item.id === id)
                ].value = quantity;
              }
            } else {
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
      sessionStorage.setItem("listSelectedCart", JSON.stringify(listSelectedCart));
      navigate(path.order);
    }
  }

  return (
    <>
      <div className="text-xs md:text-sm lg:text-base">
        <div className="container">
          <div className="grid grid-cols-[3%_50%_1fr_1fr_12%_7%] text-gray py-5 px-[1%] mt-5 bg-white rounded-md shadow-ct content-center">
            <div className="pl-[1%]">
            <input
                  type="checkbox"
                  checked={isSelectAll}
                  onChange={(e) => setIsSelectAll(e.target.checked)}
                  onClick={handleSelectAll}
                />
            </div>
            <div className="">Sản Phẩm </div>
            <div className="text-center">Đơn giá</div>
            <div className="text-center">Số lượng</div>
            <div className="text-center">Số tiền</div>
            <div className="text-center">Thao tác</div>
          </div>
        </div>
        <div className="container relative">
          {carts.map((item, index) => (
            <div
              className="grid grid-cols-[3%_50%_1fr_1fr_12%_7%] items-center bg-white mt-3 px-[1%] rounded-md "
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
              <div className="h-[120px] flex items-center overflow-hidden">
                <img
                  src={item.product.image}
                  className="object-cover h-full"
                  alt=""
                />
                <span className="text-sm">{item.product.title}</span>
              </div>
              <div className="text-center">
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
              <div className="text-center flex justify-center ">
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
              <div className="text-center">
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

          <div className="sticky bottom-0 text-gray left-0 right-0 flex shadow-ct bg-white mt-3 px-[1%] rounded-md py-5 align-center justify-between">
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
    </>
  );
}
