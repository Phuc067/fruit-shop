import { createContext, useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";

import { getAccessTokenFromLS, getProfileFromLS } from "src/utils/auth";

export const getInitialAppContext = () => ({
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  reset: () => null,
});

const initialAppContext = getInitialAppContext();

export const AppContext = createContext(initialAppContext);

export const AppProvider = ({ children, defaultValue = initialAppContext }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    defaultValue.isAuthenticated
  );
  const [profile, setProfile] = useState(defaultValue.profile);

  const reset = useCallback(() => {
    setIsAuthenticated(false);
    setProfile(null);
  }, [setIsAuthenticated, setProfile]);

  const value = useMemo(() => {
    return {
      isAuthenticated,
      setIsAuthenticated,
      profile,
      setProfile,
      reset,
    };
  }, [isAuthenticated, setIsAuthenticated, profile, setProfile, reset]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultValue: PropTypes.shape({
    isAuthenticated: PropTypes.bool,
    profile: PropTypes.object,
  }),
};
