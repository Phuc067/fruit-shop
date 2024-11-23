import axios from "axios";
import { toast } from "react-toastify";
import HttpStatusCode from "../constants/httpStatusCode.enum";
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setProfileToLS,
  setCartToLS,
  setRefreshTokenToLS,
} from "./auth";
import config from "../constants/config";
import {
  URL_LOGIN,
  URL_LOGOUT,
  URL_REFRESH_TOKEN,
  URL_VERIFY,
} from "../apis/auth.api";
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from "./utils";

export class Http {
  instance;
  accessToken;
  refreshToken;
  refreshTokenRequest;
  constructor() {
    this.accessToken = getAccessTokenFromLS();
    this.refreshToken = getRefreshTokenFromLS();
    this.refreshTokenRequest = null;
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        //'expire-access-token': 10,
        //'expire-refresh-token': 60 * 60
      },
    });

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.authorization = this.accessToken;
          return config;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config;
        if (url === URL_LOGIN || url === URL_VERIFY) {
          const data = response.data;
          this.accessToken = data.data.accessToken;
          this.refreshToken = data.data.refreshToken;
          setAccessTokenToLS(this.accessToken);
          setRefreshTokenToLS(this.refreshToken);
          setProfileToLS(data.data.user);
          setCartToLS(data.data.cartTotal);
        } else if (url === URL_LOGOUT) {
          this.accessToken = "";
          this.refreshToken = "";
          clearLS();
        }
        return response;
      },
      (error) => {
        //Chỉ toast lỗi khác 422 và 401
        if (
          ![
            HttpStatusCode.UnprocessableEntity,
            HttpStatusCode.Unauthorized,
          ].includes(error.response?.status)
        ) {
          const data = error.response?.data;
          const message = data?.message || error.message;
          toast.error(message);
        }
        //Nếu là lỗi 401
        if (isAxiosUnauthorizedError(error)) {
          const config = error.response?.config || { headers: {} };
          const { url } = config;
          //Trường hợp Token hết hạn và request đó không phải là request refresh token
          //thì chúng ta mới tiến hành gọi refresh token
          if (isAxiosExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  //Giữ refreshTokenRequest trong 10s cho nhưng request tiếp theo nếu có 401 thì dùng
                  setTimeout(() => {
                    this.refreshTokenRequest = null;
                  }, 10000);
                });
            return this.refreshTokenRequest.then((accessToken) => {
              //Gọi lại request cũ bị lỗi
              return this.instance({
                ...config,
                headers: { ...config.headers, authorization: accessToken },
              });
            });
          }

          //Còn những trường hợp như token không đúng
          //không truyền token
          //refresh token hết hạn
          //thì tiến hành xoá local storage và toast message
          this.accessToken = "";
          this.refreshToken = "";
          clearLS();
          toast.error(
            error.response?.data.data?.message || error.response?.data.message
          );
          //window.location.reload()
        }
        return Promise.reject(error);
      }
    );
  }
  handleRefreshToken() {
    return this.instance
      .post(URL_REFRESH_TOKEN, {
        refreshToken: this.refreshToken,
      })
      .then((res) => {
        const accessToken = res.data?.data;
        if (!accessToken) {
          console.error("Access token not found in response:", res.data);
          throw new Error("Access token is missing");
        }
        setAccessTokenToLS(accessToken);
        this.accessToken = accessToken;
        return accessToken;
      })
      .catch((error) => {
        this.accessToken = "";
        this.refreshToken = "";
        clearLS();
        throw error;
      });
  }
}

const http = new Http().instance;

export default http;
