import PropTypes from "prop-types";
import { ORDER_TABS } from "../../../../constants/orderTab";

const OrderNavigation = ({ activeTab, setActiveTab }) => {
 

  return (
    <div className="bg-white shadow-sm container mt-4 text-sm md:text-base sticky top-[88px] z-50">
      <ul className="flex justify-between space-x-4 py-3">
        {ORDER_TABS.map((tab) => (
          <li
            key={tab.key}
            className={`cursor-pointer px-4 py-2 rounded-lg font-medium ${
              activeTab === tab.key
                ? "text-secondary border-b-2 border-secondary"
                : "text-gray hover:text-secondary"
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
