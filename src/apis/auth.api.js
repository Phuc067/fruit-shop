import http from "src/utils/http";

export const URL_REGISTER = "auth/register";
export const URL_VERIFY = "auth/verify";
export const URL_LOGIN = "auth/login";
export const URL_LOGOUT = "auth/logout";
export const URL_REFRESH_TOKEN = "auth/refresh-token";
export const URL_FORGOT_PASS = "auth/forgot-password";
export const URL_FORGOT_PASS_CONFIRM = "auth/forgot-password-confirm";

const authApi = {
  registerAccount: (body) => http.post(URL_REGISTER, body),
  login: (body) => http.post(URL_LOGIN, body),
};

export default authApi;
