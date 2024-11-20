import { useContext } from "react";
import { AppContext } from "../../contexts/app.context";
import { maskEmail, maskPhone } from "../../utils/utils";
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

export default function Profile() {
  const { profile } = useContext(AppContext);
  console.log(profile);

  const dateFormat = 'YYYY/MM/DD';

  return (
    <>
      <div className="container flex flex-col bg-white mt-5 mb-10">
        <div className="p-4 ">
          <h2 className="text-xl border-b border-smokeBlack pb-5">
            Thông tin tài khoản
          </h2>
        </div>
        <div className="flex p-4">
          <div className="w-[66%] flex flex-col  rounded-md gap-y-6 items-center">
            <div className="flex gap-x-4 w-full">
              <label className="w-[30%] block text-smokeBlack">
                Tên đăng nhập
              </label>
              <span className="text-gray-900">phuc051102no1</span>
            </div>

            <div className="flex gap-x-4 w-full">
              <label className="w-[30%] block text-smokeBlack flex-shrink-0">Tên</label>
              <input
                type="text"
                defaultValue={profile.firstName || ""}
                className="min-w-30 w-[35%] p-1 border rounded-md"
              />
              <input
                type="text"
                defaultValue={profile.lastName || ""}
                className="min-w-30 w-[35%] p-1 border rounded-md"
              />
            </div>

            <div className="flex gap-x-4 w-full">
              <label className="w-[30%] block text-smokeBlack">Email</label>
              {profile.email ? (
                <div className="flex gap-x-4">
                  <span>{maskEmail(profile.email)}</span>
                  <button className="text-blue-500">thay đổi</button>
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
                  <button className="text-blue-500">thay đổi</button>
                </div>
              ) : (
                <button className="text-blue-500">Thêm</button>
              )}
            </div>

            <div className="flex gap-x-4 w-full">
              <label className="w-[30%] block text-smokeBlack">Giới tính</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="nam"
                    defaultChecked={profile.gender === "nam"}
                    className="mr-2"
                  />
                  Nam
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="nu"
                    defaultChecked={profile.gender === "nu"}
                    className="mr-2"
                  />
                  Nữ
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="khac"
                    defaultChecked={profile.gender === "khac"}
                    className="mr-2"
                  />
                  Khác
                </label>
              </div>
            </div>

            <div className="flex gap-x-4 w-full">
              <label className="w-[30%] block text-smokeBlack">Ngày sinh</label>
              <DatePicker defaultValue={dayjs(profile.birthDay, dateFormat)} format={dateFormat} />
            </div>

            <button className="w-40 bg-secondary text-white p-2 rounded-md hover:bg-secondary">
              Lưu
            </button>
          </div>

          <div className="flex-1">
            <img src="" alt="" />
            Anh
          </div>
        </div>
      </div>
    </>
  );
}
