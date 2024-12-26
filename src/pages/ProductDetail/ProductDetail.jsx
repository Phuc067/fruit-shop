import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import cartApi from "../../apis/cart.api";
import path from "../../constants/path";
import productApi from "../../apis/product.api";
import Loading from "../../components/Loading";
import { formatCurrency, formatTime } from "../../utils/utils";
import { setCartToLS } from "../../utils/auth";
import { useContext } from "react";
import { AppContext } from "../../contexts/app.context";
import BackButton from "../../components/BackButton";
export default function ProductDetail() {

  const { profile, setCart } = useContext(AppContext);
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };
  const queryClient = useQueryClient();

  console.log('Product ID:', id);

  const { data: product = {}, isLoading } =
    useQuery({
      queryKey: ["product", id],
      queryFn: () => productApi.getProductDetail(id),
      keepPreviousData: true,
      select: (result) => result?.data?.data
    });

  console.log(product);


  const cartMutation = useMutation({
    mutationFn: (body) => cartApi.addToCart(body),
  });

  const handleChange = (event) => {
    const value = event.target.value;

    if (/^\d*$/.test(value)) {
      setQuantity(Number(value));
    }
  };

  const handleBlur = (event) => {
    const value = event.target.value;
    if (value === "" || value.Number <= 0) {
      setQuantity(1);
      return;
    }
    if (value > product.quantity) {
      toast.error("Số lượng của sản phẩm không còn đủ cho bạn");
      return;
    }
    setQuantity(value);
  };


  const handleAddToCart = (id, quantity) => {
    if (profile === null) navigator(path.login)
    let body = {
      userId: profile.id,
      productId: id,
      quantity: quantity,
    };
    console.log(body);
    cartMutation.mutate(body, {
      onSuccess: (result) => {
        if (result.data.data) {
          queryClient.invalidateQueries(["carts", profile.id]);
          setCart(result.data.data);
          setCartToLS(result.data.data);
          setQuantity(1);
          toast.success(result.data.message);
        }
        else {
          toast.error(result.data.message);
        }
      },
    });
  };
  return <>
    {isLoading && <Loading />}
    {product ? <div className="bg-white container w-full mt-1">
      <BackButton/>
      <div className="flex flex-col md:flex-row border-y border-background">
        <div className="w-full md:w-2/5 p-5  md:border-r border-background">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        <div className="flex-grow flex flex-col p-5 justify-center">
          <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
          <div className="mt-5 text-gray-600">
            <span className="font-semibold">Danh mục:</span> {product.category ? product.category.name : 'Không có thông tin'}
          </div>
          <div className="mt-5 text-gray-600">
            <span className="font-semibold">Xuất xứ:</span> {product.origin}
          </div>
          <div className="flex items-center gap-2 mt-5">
            <span className="font-semibold">Giá:</span>
            <span className="text-xl font-semibold text-primary">{formatCurrency(product.price)}</span>
          </div>
          {product.discountPercentage > 0 &&
            (
              <>
                <div>
                  <div>
                    <span className="font-semibold">Giảm giá: </span>
                    <span className="text-xl font-semibold text-primary">product.discountPercentage</span>
                  </div>
                  <div>
                    <span className="font-semibold">Thời gian hết hạn: </span>
                    <span className="text-xl font-semibold text-secondary"> {formatTime(product.discountExpired)}</span>
                  </div>
                </div>
                <div>
                  <span className="text-lg line-through text-gray-500">
                    {product.price * (1 - product.discountPercentage / 100)} VND
                  </span>

                </div>
              </>
            )}


          <div className="mt-5 text-gray-600">
            <span className="font-semibold">Số lượng còn lại:</span> {product.quantity}
          </div>
          <div className="mt-5 text-gray-600 flex">
            <button
              className="w-5 border border-gray text-xl"
              onClick={() =>
                setQuantity(quantity - 1)
              }
            >
              -
            </button>
            <input
              className="block w-10  text-center border-t border-b border-gray"
              type="text"
              min={1}
              value={quantity}
              onChange={(event) => handleChange(event)}
              onBlur={(event) => handleBlur(event)}
            />
            <button
              className="w-5 border border-gray text-xl"
              onClick={() =>
                setQuantity(quantity + 1)
              }
            >
              +
            </button>
          </div>
          <div className="flex items-center mt-5 gap-4">
            <button onClick={() => handleAddToCart(product.id, quantity)} className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark">
              Thêm vào giỏ hàng
            </button>


          </div>
        </div>
      </div>
      <div className="pb-5">
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Thông tin chi tiết sản phẩm</h2>
          <p className="text-gray-600">{product.description}</p>
        </div>
        <div className="mt-4 text-gray-600">
          <span className="font-semibold">Xuất xứ:</span> {product.origin ? product.origin : 'Không có thông tin'}
        </div>
      </div>
    </div> :
      (<Loading />)
    }
  </>
}