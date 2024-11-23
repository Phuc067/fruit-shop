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
  return `đ ${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
};

export function maskEmail(email) {
  const [localPart, domain] = email.split("@");
  if (localPart.length <= 2) {
    return `${localPart}...@${domain}`;
  }
  return `${localPart[0]}***${localPart[localPart.length - 1]}@${domain}`;
}

export function maskPhone(phone){
  return `********${phone.slice(-2)}`;
}

export async function generateHash(file) {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}