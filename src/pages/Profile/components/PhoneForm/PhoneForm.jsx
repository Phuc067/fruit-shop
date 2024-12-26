import { useMutation } from "@tanstack/react-query";
import PropTypes from "prop-types";
import userApi from "../../../../apis/user.api";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import { Modal } from "antd";
export default function PhoneForm({
  open,
  onSubmit,
  onClose,
  phoneNumber,
}){

  const checkPhoneMutation = useMutation(
    userApi.checkPhoneNumber
  )

  const handleClose = () =>{

  }
  return <><Modal
  open={open}
  title={phoneNumber ? "Cập nhật số điện thoại" : "Thêm số điện thoại"}
  closable={false}
  onOk={onSubmit}
  onCancel={handleClose}
  footer={[
    <div
      key="footer"
      className="flex justify-end border-t border-smokeBlack h-16 items-center"
    >
      <Button
        key="back"
        onClick={onClose}
        className=" w-32 p-2 border-smokeBlack  border mr-2  rounded-sm"
      >
        Hủy
      </Button>
    </div>,
  ]}
>

  <Input />
  
</Modal></>
}

PhoneForm.propTypes ={
  open:PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  phoneNumber: PropTypes.string,
}