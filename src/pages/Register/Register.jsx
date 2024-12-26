import Input from "../../components/Input";
import Button from "../../components/Button";
import { useContext } from "react";
import { AppContext } from "../../contexts/app.context";
import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import authApi from "../../apis/auth.api";
import { validationSchemas } from "../../validations/ValidationSchemas";
import path from "../../constants/path";
import { HttpStatusCode } from "axios";

const registerSchema = yup.object({
  username: validationSchemas.username,
  password: validationSchemas.password,
  email: validationSchemas.email,
  confirmPassword: validationSchemas.confirmPassword
})


export default function Register() {

  const navigate = useNavigate();
  const { setIsAuthenticated, setProfile, setCart } = useContext(AppContext);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(registerSchema)
  })

  const registerMutation = useMutation({
    mutationFn: (body) => authApi.register(body),
  });

  const onSubmit = handleSubmit((body) => {
    const { confirmPassword, ...bodyWithoutConfirmPassword } = body;
    registerMutation.mutate(bodyWithoutConfirmPassword, {
      onSuccess: (result) => {
        const data = result.data;
        console.log(data.status);
        if(data.status === HttpStatusCode.UnprocessableEntity)
          {
            const formError = data.data;
            if (formError) {
              Object.keys(formError).forEach((key) => {
                setError(key, {
                  message: formError[key],
                  type: "Server",
                });
              });
            }
          }
        else{
          setIsAuthenticated(true);
          setProfile(result.data.data.user);
          setCart(result.data.data.cartTotal)
          navigate(
            window.location.href.split("=")[1]
              ? window.location.href.split("=")[1]
              : "/"
          );
        }
      },
      onError: (error) => {
        
      },
    });
  });
  return <> <div className="w-full bg-background h-full flex justify-center">
    <div className="w-full md:w-2/3 xl:w-1/2 2xl:w-1/3 bg-white m-8 rounded-2xl p-10 sm:px-20 lg:px-40">
      <div className=" text-center">
        <h2 className="font-bold text-2xl">Đăng Ký Tài Khoản</h2>
        <p className="text-gray">Tạo tài khoản mới để trải nghiệm các dịch vụ của chúng tôi</p>
      </div>
      <form onSubmit={onSubmit}>
        <div>
          <Input
            className="mt-8"
            type="text"
            placeholder="Enter your email..."
            name="email"
            register={register}
            errorMessage={errors.email?.message}
          />
          <Input
            className="mt-2"
            type="text"
            placeholder="Enter your username..."
            name="username"
            register={register}
            errorMessage={errors.username?.message}
          />
          <Input
            className='mt-2'
            type='password'
            placeholder='password'
            name='password'
            register={register}
            errorMessage={errors.password?.message}
            autoComplete='on'
          />
          <Input
            className='mt-2'
            type='password'
            placeholder='confirm password'
            name='confirmPassword'
            register={register}
            errorMessage={errors.confirmPassword?.message}
            autoComplete='on'
          />
        </div>
        {/* <div className="flex justify-between mb-2">
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
        </div> */}
        <div>
          <Button
            isLoading={registerMutation.isLoading}
            disabled={registerMutation.isLoading}
            type="submit"
            className="flex w-full items-center justify-center rounded-[15px] bg-primary  px-2 py-4 text-center text-sm uppercase text-white hover:cursor-pointer hover:bg-primary-light"
          >
            Đăng ký
          </Button>
        </div>
        <div className="text-center mt-4">
          <span className="text-gray">Bạn đã có tài khoản?</span>
          <button onClick={() => navigate(path.login)}>Đăng nhập </button>
        </div>
      </form>
      {/* </div> */}
    </div>
  </div> </>
}