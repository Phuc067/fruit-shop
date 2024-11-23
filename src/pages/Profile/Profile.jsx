import { useContext , useState} from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchemas } from "../../validations/ValidationSchemas";
import { AppContext } from "../../contexts/app.context";
import { DatePicker } from "antd";
import { maskEmail, maskPhone } from "../../utils/utils";
import { deleteImageFromFS, uploadImageToFS } from "../../services/FirebaseStorage/FirebaseStorage";
import Input from "../../components/Input";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import userApi from "../../apis/user.api";
import HttpStatusCode from "../../constants/httpStatusCode.enum";
import { toast } from "react-toastify";
import { setProfileToLS } from "../../utils/auth";


const schema = yup.object({
  firstName: validationSchemas.firstName,
  lastName: validationSchemas.lastName,
  birthDay: validationSchemas.date,
})

export default function Profile() {
  const { profile, setProfile } = useContext(AppContext);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      email: profile.email || "",
      phone: profile.phone || "",
      gender: profile.gender || "khac",
      birthDay: profile.birthDay || dayjs().format("YYYY/MM/DD"),
    },
    resolver: yupResolver(schema)
  });

  const handleImageChange = (e) => {
   
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.warn("File được chọn không phải là ảnh!");
    }
    else {
      const imageURL = URL.createObjectURL(file);
      setAvatarPreview(imageURL); 
    }
  };

  const handleChangeEmail =()=>{}

  const updateMutation = useMutation({
    mutationFn: ({id, body}) => userApi.updateUserProfile(id, body),
  })

  const onSubmit = async (data) => {
    try {
      console.log(data)
      let avatarUrl = avatarPreview; 

      if (avatarPreview.startsWith("blob:")) {

        const response = await uploadImageToFS(  
          document.querySelector('input[type="file"]').files[0]
        );
        avatarUrl = response; 
        if(avatarUrl !== profile.avatar) await deleteImageFromFS(profile.avatar);
      }
      const id = profile.id;
      const body = { ...data, avatar: avatarUrl };
      console.log(body);
      updateMutation.mutate(
        {id , body}, {
          onSuccess: (response)=>{
            if(response.data.status === HttpStatusCode.Accepted)
            {
              const updatedProfile = {id, ...body};
              setProfileToLS(updatedProfile);
              setProfile(updatedProfile);
              toast.success(response.data.message);
            }
            else toast.error(response.data.message)
          }
        }
      )
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <form
      className="container flex flex-col bg-white mt-5 mb-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="p-4 ">
        <h2 className="text-xl border-b border-background pb-5">
          Thông tin tài khoản
        </h2>
      </div>
      <div className="flex p-4">
        <div className="w-[66%] flex flex-col rounded-md gap-y-6 items-center">
          <div className="flex gap-x-4 w-full">
            <label className="w-[30%] block text-smokeBlack">
              Tên đăng nhập
            </label>
            <span className="text-gray-900">phuc051102no1</span>
          </div>

          <div className="flex gap-x-4 w-full">
            <label className="w-[30%] block text-smokeBlack flex-shrink-0">Tên</label>
            <Input
              name="firstName"
              register={register}
              className="min-w-30 w-[35%]"
              errorMessage={errors.firstName?.message}
            />

            <Input
              name="lastName"
              register={register}
              className="min-w-30 w-[35%]"
              errorMessage={errors.lastName?.message}
            />
          </div>

          <div className="flex gap-x-4 w-full">
            <label className="w-[30%] block text-smokeBlack">Email</label>
            {profile.email ? (
              <div className="flex gap-x-4">
                <span>{maskEmail(profile.email)}</span>
                <button type="button" className="text-blue-500" onClick={handleChangeEmail}>thay đổi</button>
              </div>
            ) : (
              <button className="text-blue-500">Thêm</button>
            )}
          </div>

          <div className="flex gap-x-4 w-full">
            <label className="w-[30%] block text-smokeBlack">
              Số điện thoại
            </label>
            {profile.phone ? (
              <div className="flex gap-x-4">
                <span>{maskPhone(profile.phone)}</span>
                <button type="button" className="text-blue-500">thay đổi</button>
              </div>
            ) : (
              <button className="text-blue-500">Thêm</button>
            )}
          </div>

          <div className="flex gap-x-4 w-full">
            <label className="w-[30%] block text-smokeBlack">Giới tính</label>
            <div className="flex items-center space-x-4">
              {["nam", "nu", "khac"].map((gender) => (
                <label key={gender} className="flex items-center">
                  <input
                    {...register("gender")}
                    type="radio"
                    value={gender}
                    className="mr-2"
                  />
                  {gender === "nam" ? "Nam" : gender === "nu" ? "Nữ" : "Khác"}
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-x-4 w-full">
            <label className="w-[30%] block text-smokeBlack">Ngày sinh</label>
            <Controller
              control={control}
              name="birthDay"
              render={({ field }) => (
                <DatePicker
                  {...field}
                  value={dayjs(field.value)}
                  format="YYYY/MM/DD"
                  onChange={(date, dateString) => field.onChange(dateString)}
                />
              )}
            />
          </div>

          <button
            type="submit"
            className="w-40 bg-secondary text-white p-2 rounded-md hover:bg-secondary"
          >
            Lưu
          </button>
        </div>
        <div className="border-l border-background ml-5 pl-5 flex-grow items-center flex justify-center flex-col gap-4">
          <div className="w-40 h-40 rounded-full overflow-hidden">
            <img
              src={avatarPreview}
              className="w-full h-full object-cover"
            />
          </div>
          <label className="border rounded-md px-4 py-1 border-background text-gray cursor-pointer">
            Chọn ảnh
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>
    </form>
  );
}
