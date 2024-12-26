import PropTypes from 'prop-types';
import { useContext } from 'react';
import { AppContext } from '../../contexts/app.context';
import { formatCurrency } from '../../utils/utils';
import Button from '../Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setCartToLS } from "../../utils/auth";
import cartApi from '../../apis/cart.api';
import path from '../../constants/path';
import showToast from '../ToastComponent';


export default function ProductCard({ item }) {
  const { profile, setCart } = useContext(AppContext);
  const queryClient = useQueryClient();
  const cartMutation = useMutation({
    mutationFn: (body) => cartApi.addToCart(body),
  });
  
  
  const handleAddToCart = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
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
          showToast(result.data.message, "success");
        }
      },
    });
  };
  return <>
    <div
      className="flex flex-col rounded-lg  cursor-pointer bg-white mb-5"
    >
      <div className="w-full relative">
        <img
          className="w-full aspect-square object-cover rounded-md"
          src={item?.image}
          alt=""
        />
        {item?.discountPercentage ? (
          <span className="absolute top-[-10px] right-[-5px] bg-secondary opacity-70 rounded-full p-4">
            - {item?.discountPercentage} %
          </span>
        ) : (
          <></>
        )}

        <div className="flex flex-col px-5 my-2">
          <h3 className="text-primary h-10">{item?.title}</h3>

          <div className="flex flex-wrap justify-end">
            {item?.discountPercentage ? (
              <span className="line-through">
                {item?.price}{" "}
              </span>
            ) : (
              <></>
            )}
            <span className="ml-2 text-secondary mb-1">
              {formatCurrency(
                item?.price -
                item?.price * item?.discountPercentage / 100
              )}
            </span>

            <div className="w-full text-center rounded  py-1 px-3">
              <Button
                isLoading={cartMutation.isLoading}
                disabled={cartMutation.isLoading}
                onClick={(e) => handleAddToCart(e, item.id)}
                className="flex w-full items-center  justify-center rounded-[15px] bg-primary  px-2 py-4 text-center text-xs md:text-sm text-white hover:cursor-pointer hover:bg-primary hover:bg-opacity-70"
              >
                Thêm vào giỏ hàng
              </Button>
              <div />
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
}

ProductCard.propTypes ={
  item:PropTypes.object.isRequired,
}