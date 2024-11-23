import "./Navigation.css";
import PropTypes from "prop-types";

const OrderNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: "all", label: "Tất cả" },
    { key: "pending", label: "Chờ thanh toán" },
    { key: "shipping", label: "Vận chuyển" },
    { key: "delivered", label: "Hoàn thành" },
    { key: "cancelled", label: "Đã hủy" },
  ];

  return (
    <div className="navigation">
      <ul className="nav-tabs">
        {tabs.map((tab) => (
          <li
            key={tab.key}
            className={`nav-item ${activeTab === tab.key ? "active" : ""}`}
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

OrderNavigation.proptypes = { 
  activeTab: PropTypes.string.isRequired, 
  setActiveTab: PropTypes.func.isRequired
}
