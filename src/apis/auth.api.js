import http from "src/utils/http";

export const URL_REGISTER = "oauth/register";
export const URL_VERIFY = "oauth/verify";
export const URL_LOGIN = "oauth/login";
export const URL_LOGOUT = "oauth/logout";
export const URL_REFRESH_TOKEN = "oauth/refresh-token";
export const URL_FORGOT_PASS = "oauth/forgot-password";
export const URL_FORGOT_PASS_CONFIRM = "oauth/forgot-password-confirm";

const authApi = {
  registerAccount: (body) => http.post(URL_REGISTER, body),
};

export default authApi;
