import { createContext, useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";

import { getAccessTokenFromLS, getProfileFromLS } from "src/utils/auth";
import { getCartFromLS } from "../utils/auth";

// Hàm để lấy dữ liệu khởi tạo ban đầu cho context
export const getInitialAppContext = () => ({
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  reset: () => null,
  cart: getCartFromLS(),
  setCart: () => null
});

const initialAppContext = getInitialAppContext();

export const AppContext = createContext(initialAppContext);

export const AppProvider = ({ children, defaultValue = initialAppContext }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    defaultValue.isAuthenticated
  );
  const [profile, setProfile] = useState(defaultValue.profile);
  const [cart, setCart] = useState(defaultValue.cart);

  const reset = useCallback(() => {
    setIsAuthenticated(false);
    setProfile(null);
    setCart(null); 
  }, [setIsAuthenticated, setProfile]);


  const value = useMemo(() => ({
    isAuthenticated,
    setIsAuthenticated,
    profile,
    setProfile,
    cart,
    reset,
    setCart
  }), [
    isAuthenticated,
    setIsAuthenticated,
    profile,
    setProfile,
    cart,
    reset,
    setCart
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultValue: PropTypes.shape({
    isAuthenticated: PropTypes.bool,
    profile: PropTypes.object,
    cart: PropTypes.number
  }),
};
