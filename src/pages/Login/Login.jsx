import Input from "../../components/Input";
import Button from "../../components/Button";
import { loginSchema } from "../../validations/LoginValidations";
import { useContext } from "react";
import { AppContext } from "../../contexts/app.context";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { isAxiosUnprocessableEntityError } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import authApi from "../../apis/auth.api";


export default function Login() {
  const { setIsAuthenticated, setProfile, setCart } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState : {errors}
  } = useForm({
    resolver: yupResolver(loginSchema)
  })
  

  const loginMutation = useMutation({
    mutationFn: (body) => authApi.login(body),
  });


  const onSubmit = handleSubmit((body) => {
    console.log(body);
    loginMutation.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true);
        setProfile(data.data.data.user);
        setCart(data.data.data.cartTotal)
        navigate(
          window.location.href.split("=")[1]
            ? window.location.href.split("=")[1]
            : "/"
        );
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError(error)) {
          const formError = error.response?.data.data;
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key, {
                message: formError[key],
                type: "Server",
              });
            });
          }
        }
      },
    });
  });
  return (
    <div className="w-full bg-background h-full flex justify-center">
      <div className="w-full md:w-2/3 xl:w-1/2 2xl:w-1/3 bg-white m-8 rounded-2xl p-10 sm:px-20 lg:px-40">
        {/* <div className="p-10 sm:px-40 lg:px-60"> */}
          <div className=" text-center">
            <h2 className="font-bold text-2xl">Chào mừng bạn trở lại</h2>
            <p className="text-gray">Vui lòng nhập thông tin của bạn để đăng nhập</p>
          </div>
          <form onSubmit={onSubmit}>
            <div>
              <Input
                className="mt-8"
                type="text"
                placeholder="Enter your username..."
                name="username"
                register=  {register}
                errorMessage={errors.username?.message}
              />
              <Input
                 className='mt-2'
                type='password'
                placeholder= 'password'
                name='password'
                register={register}
                errorMessage={errors.password?.message}
                autoComplete='on'
                classNameEye='absolute right-[5px] top-[12px] h-5 w-5 cursor-pointer'
              />
            </div>
            <div className="flex justify-between mb-2">
              <div>
                <input
                  type="checkbox"
                  name="rememberCheck"
                  id="rememberCheck"
                />
                <span>
                  <strong>Nhớ mật khẩu</strong>
                </span>
              </div>
              <div>
                <span className="text-gray underline">Quên mật khẩu?</span>
              </div>
            </div>
            <div>
              <Button
                isLoading={loginMutation.isLoading}
                disabled={loginMutation.isLoading}
                type="submit"
                className="flex w-full items-center justify-center rounded-[15px] bg-primary bg-opacity-70 px-2 py-4 text-center text-sm uppercase text-white hover:cursor-pointer hover:bg-primary"
              >
                Đăng nhập
              </Button>
            </div>
            <div className="text-center mt-4">
              <span className="text-gray">Bạn chưa có tài khoản?</span>
              <button>Tạo ngay</button>
            </div>
          </form>
        {/* </div> */}
      </div>
    </div>
  );
}