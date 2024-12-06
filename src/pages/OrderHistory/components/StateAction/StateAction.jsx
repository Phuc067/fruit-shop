import Button from "../../../../components/Button";
import PropTypes from "prop-types";
import StateInfo from "../StateInfo";

export default function StateAction({ order, onAction }) {

  const stateButtons = {
    pending: [
      {
        label: "Huỷ",
        className: "bg-white border border-smokeBlack rounded-md px-10 py-2",
        onClick: () => handleTransferState("cancelled"),
      },
    ],
    awaitingPayment: [
      {
        label: "Huỷ",
        className: "bg-white border border-smokeBlack rounded-md px-10 py-2",
        onClick: () => handleTransferState("cancelled"),
      },
    ],
    preparing: [
      {
        label: "Huỷ",
        className: "bg-white border border-smokeBlack rounded-md px-10 py-2",
        onClick: () => handleTransferState("cancelled"),
      },
    ],
    shipping: [
      {
        label: "Xác nhận giao hàng thành công",
        className: "bg-gray-500 text-white px-4 py-2 rounded",
        onClick: () => handleTransferState("delivered"),
      },
    ],
    delivered: [
      {
        label: "Đã nhận hàng",
        className: "bg-gray-500 text-white px-4 py-2 rounded",
        onClick: () => handleTransferState("delivered"),
      },
      {
        label: "Trả hàng",
        className: "bg-white border border-smokeBlack rounded-md px-10 py-2",
        onClick: () => handleTransferState("returned"),
      },
    ],
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
        {buttonsForState.map((button, index) => (
          <Button
            key={index}
            onClick={button.onClick}
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
