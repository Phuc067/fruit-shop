import axios from "axios";
import { HttpStatusCode } from "axios";

export function isAxiosError(error){
  
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError(error) {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity;
}

export function isAxiosUnauthorizedError(error) {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized;
}

export function isAxiosExpiredTokenError(error) {
  return (
    isAxiosUnauthorizedError(error) &&
    error.response?.data.message === 'jwt expired'
  );
}

export function formatCurrency(num){
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
