import Button from "../../../../components/Button";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { AppContext } from "../../../../contexts/app.context";
import PropTypes from "prop-types";
import orderApi from "../../../../apis/order.api"
import paymentApi from "../../../../apis/payment.api";
import StateInfo from "../StateInfo";
import showToast from "../../../../components/ToastComponent";
import { Popconfirm } from "antd";

export default function StateAction({ order, onAction }) {

  const { profile } = useContext(AppContext);
  const userId = profile?.id;

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (id) => orderApi.updateStatus(id),
  })

  const cancelMutation = useMutation({
    mutationFn: (id) => orderApi.cancelOrder(id),
  })

  const handleUpdateState = (order) => {
    const id = order.id;
    console.log(id);
    updateMutation.mutate(id, {
      onSuccess: (response) => {
        if (response.data.data) {
          queryClient.invalidateQueries(["orders", userId, order.state]);
          queryClient.invalidateQueries(["orders", userId, response.data.data]);
          showToast(response.data.message, "success");
        }
      }
    })
  };

  const handleCancelOrder = (order) => {
    const id = order.id;
    console.log(id);
    cancelMutation.mutate(id, {
      onSuccess: (response) => {
        if (response.data.data) {
          queryClient.invalidateQueries(["orders", order.state]);
          queryClient.invalidateQueries(["orders", response.data.data]);
          showToast(response.data.message, "success");
        }
      }
    })
  };

  const createPaymentUrlMutation = useMutation({
    mutationFn: (orderId) => paymentApi.createPaymentUrl(orderId),
    onSuccess: (res) => {
      window.location.href = res.data.data;
    },
  });

  const handlePayment = (order) => {
    createPaymentUrlMutation.mutate(order.id);
  }
  const stateButtons = {
    pending: [
      {
        label: "Huỷ",
        className: "bg-white border border-smokeBlack rounded-md px-10 py-2 transition-all duration-300 ease-in-out transform hover:scale-105",
        onClick: (order) => handleCancelOrder(order),
        isCancel: true,
      },
    ],
    awaitingPayment: [
      {
        label: "Thanh toán ngay",
        className: "bg-secondary text-white px-4 py-2 rounded transition-all duration-300 ease-in-out transform hover:scale-105",
        onClick: (order) => handlePayment(order),
      },
      {
        label: "Huỷ",
        className: "bg-white border border-smokeBlack rounded-md px-10 py-2 transition-all duration-300 ease-in-out transform hover:scale-105",
        onClick: (order) => handleCancelOrder(order),
        isCancel: true,
      },


    ],
    // preparing: [
    //   {
    //     label: "Huỷ",
    //     className: "bg-white border border-smokeBlack rounded-md px-10 py-2",
    //     onClick: () => handleTransferState("cancelled"),
    //   },
    // ],
    shipping: [
      {
        label: "Xác nhận giao hàng thành công",
        className: "bg-secondary text-white px-4 py-2 rounded transition-all duration-300 ease-in-out transform hover:scale-105",
        onClick: (order) => handleUpdateState(order),
      },
      // {
      //   label: "Trả hàng",
      //   className: "bg-white border border-smokeBlack rounded-md px-10 py-2 transition-all duration-300 ease-in-out transform hover:scale-105",
      //   onClick: () => handleTransferState("returned"),
      // },
    ],
    // delivered: [
    //   {
    //     label: "Đã nhận hàng",
    //     className: "bg-gray-500 text-white px-4 py-2 rounded",
    //     onClick: () => handleTransferState("delivered"),
    //   },

    // ],
    returned: [
      {
        label: "Xác nhận hoàn hàng",
        className: "bg-gray-500 text-white px-4 py-2 rounded",
        onClick: () => handleTransferState("pending"),
      },
    ],
  };
  const handleTransferState = () => { };

  const buttonsForState = stateButtons[order.state] || [];

  return (
    <div className="w-full flex justify-between py-4 pr-10 pl-2">
      <div className="flex items-center">
        <StateInfo order={order} />
      </div>
      <div className="flex gap-2">
        {buttonsForState.map((button, index) => button.isCancel ? (
          <Popconfirm
            key={index}
            title="Bạn có chắc chắn muốn hủy đơn hàng này không?"
            onConfirm={() => button.onClick(order)}
            okText="Có"
            cancelText="Không"
          >
            <Button className={button.className}>
              {button.label}
            </Button>
          </Popconfirm>
        ) : (
          <Button
            key={index}
            onClick={() => button.onClick(order)}
            className={button.className}
          >
            {button.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

StateAction.propTypes = {
  order: PropTypes.object.isRequired,
  onAction: PropTypes.func,
};
