
import http from "src/utils/http";
import { getAccessTokenFromLS, getRefreshTokenFromLS } from "../utils/auth";

export const URL_REGISTER = "auth/register";
export const URL_VERIFY = "auth/verify";
export const URL_LOGIN = "auth/login";
export const URL_LOGOUT = "auth/logout";
export const URL_REFRESH_TOKEN = "auth/refresh-token";
export const URL_FORGOT_PASS = "auth/forgot-password";
export const URL_FORGOT_PASS_CONFIRM = "auth/forgot-password-confirm";

const accessToken = getAccessTokenFromLS();
const refreshToken = getRefreshTokenFromLS();

const authApi = {
  register: (body) =>http.post(URL_REGISTER, body),
  login: (body) =>http.post(URL_LOGIN, body),
  logout: () => http.post(URL_LOGOUT, { accessToken, refreshToken }),
};



export default authApi;
