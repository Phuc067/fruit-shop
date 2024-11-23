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
    .min(3, "Mật khẩu phải có ít nhất 3 ký tự"),
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
