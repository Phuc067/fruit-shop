import PropTypes from "prop-types";

const OrderNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: "", label: "Tất cả" },
    { key: "pending", label:"Chờ xác nhận"},
    { key: "awaitingPayment", label: "Chờ thanh toán" },
    { key: "shipping", label: "Vận chuyển" },
    { key: "delivered", label: "Hoàn thành" },
    { key: "cancelled", label: "Đã hủy" },
  ];

  return (
    <div className="bg-white shadow-sm container mt-4">
      <ul className="flex justify-between space-x-4 py-3">
        {tabs.map((tab) => (
          <li
            key={tab.key}
            className={`cursor-pointer px-4 py-2 rounded-lg font-medium ${
              activeTab === tab.key
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-600 hover:text-orange-600"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderNavigation;

OrderNavigation.propTypes = { 
  activeTab: PropTypes.string.isRequired, 
  setActiveTab: PropTypes.func.isRequired
}
