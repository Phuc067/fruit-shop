export const localStorageEventTarget = new EventTarget();

export const setAccessTokenToLS = (accessToken) => {
  localStorage.setItem("accessToken", accessToken);
};

export const setRefreshTokenToLS = (refreshToken) => {
  localStorage.setItem("refreshToken", refreshToken);
};

export const clearLS = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("profile");
  localStorage.removeItem("cart");
  sessionStorage.removeItem("listSelectedCart");
  const clearLSEvent = new Event("clearLS");
  localStorageEventTarget.dispatchEvent(clearLSEvent);
};

export const getAccessTokenFromLS = () =>
  localStorage.getItem("accessToken") || "";
export const getRefreshTokenFromLS = () =>
  localStorage.getItem("refreshToken") || "";

export const setProfileToLS = (profile) => {
  localStorage.setItem("profile", JSON.stringify(profile));
};

export const getProfileFromLS = () => {
  const result = localStorage.getItem("profile");
  return result ? JSON.parse(result) : null;
};

export const setCartToLS = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const getCartFromLS = () => {
  const result = localStorage.getItem("cart");
  return result ? JSON.parse(result) : null;
};

export const setSelectedCartToSS = (listSelectedCart) =>{
  sessionStorage.setItem("listSelectedCart", JSON.stringify(listSelectedCart));
}

export const getSelectedCartFromSS = () =>{
  const result =  sessionStorage.getItem("listSelectedCart")
  return result ? JSON.parse(result) : null;
}

export const removeSelectedCartFromSS = () =>{
  sessionStorage.removeItem("listSelectedCart");
  console.log(`listcart:  ${sessionStorage.getItem("listSelectedCart")}`)
}