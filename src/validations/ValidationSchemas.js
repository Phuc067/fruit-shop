import * as yup from "yup";

export const validationSchemas = {
  firstName: yup
    .string()
    .required("Vui lòng nhập tên")
    .max(50, "Tên quá dài"),
  lastName: yup
    .string()
    .required("Vui lòng nhập họ")
    .max(50, "Họ quá dài"),
  username: yup
    .string()
    .required("Vui lòng nhập tên đăng nhập")
    .min(3, "Tên đăng nhập quá ngắn")
    .max(20, "Tên đăng nhập quá dài"),
  password: yup
  .string()
  .required("Vui lòng nhập mật khẩu")
  .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
  .matches(/[a-z]/, "Mật khẩu phải có ít nhất một chữ cái viết thường")
  .matches(/[A-Z]/, "Mật khẩu phải có ít nhất một chữ cái viết hoa")
  .matches(/[0-9]/, "Mật khẩu phải có ít nhất một chữ số")
  .matches(/[@$!%*?&]/, "Mật khẩu phải có ít nhất một ký tự đặc biệt (@, $, !, %, *, ?, &)")
  .matches(/^\S*$/, "Mật khẩu không được chứa khoảng trắng"),
  confirmPassword: yup
  .string()
  .required("Vui lòng xác nhận mật khẩu")
  .oneOf([yup.ref('password'), null], "Mật khẩu xác nhận không khớp"),
  email: yup
  .string()
  .required("Vui lòng nhập email")
  .matches(/^\S+@\S+\.\S+$/, "Email không hợp lệ")
  .max(100, "Email quá dài"),
  phone: yup
    .string()
    .required("Vui lòng nhập số điện thoại")
    .matches(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"),
  date: yup
    .date()
    .required("Vui lòng chọn ngày"),
};
