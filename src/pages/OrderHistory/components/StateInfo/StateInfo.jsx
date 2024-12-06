import PropTypes from "prop-types";
import { formatTime } from "../../../../utils/utils";

const StateInfo = ({ order }) => {

  const stateInfo = {
    pending: () => (
      <span>
        {order.orderLog?.log}  vào lúc {formatTime(order.orderDate)}.
      </span>
    ),
    awaitingPayment: () => (
      <span>
        {order.orderLog?.log} vào lúc {formatTime(order.orderLog?.time)}.
      </span>
    ),
    preparing: () => (
      <div className="flex gap-5">
        <span>
          {order.orderLog?.log} : {formatTime(order.orderLog?.time)}.
        </span>
        {
          order?.isPaid && <span className="bg-primary text-white rounded-md px-2">
            Đã thanh toán
          </span>
        }

      </div>

    ),
    shipping: () => (
      <span>
        {order.orderLog?.log} : {formatTime(order.orderLog?.time)}.
      </span>
    ),
    returned: () => (
      <span>
        {order.orderLog?.log} : {formatTime(order.orderLog?.time)}.
      </span>
    ),
    refunded: () => (
      <span>
        {order.orderLog?.log} : {formatTime(order.orderLog?.time)}.
      </span>
    ),
  };

  return stateInfo[order.state] ? stateInfo[order.state]() : null;
};

export default StateInfo;


StateInfo.propTypes = {
  order: PropTypes.object.isRequired,
}