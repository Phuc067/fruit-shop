import { NavLink, useLocation } from 'react-router-dom';
import path from '../../constants/path';
export default function Header() {
  const location = useLocation();
  const pathname = location.pathname;

  const shouldShowNav = [path.home, path.productList].includes(pathname);

  if (!shouldShowNav) return null;

  return (
    <div className="w-full flex justify-center bg-white shadow-md " >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-start space-x-8 h-14">
          <NavLink 
            to={path.home}
            className={({ isActive }) => 
              `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
              ${isActive 
                ? 'border-indigo-500 text-gray-900' 
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`
            }
          >
            Trang chủ
          </NavLink>

          <NavLink
            to={path.productList}
            className={({ isActive }) => 
              `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
              ${isActive 
                ? 'border-indigo-500 text-gray-900' 
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`
            }
          >
            Sản phẩm
          </NavLink>
        </div>
      </div>
    </div>
  );
}
