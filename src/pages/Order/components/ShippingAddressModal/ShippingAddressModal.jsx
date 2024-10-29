import { useState, useEffect } from "react";
import { Modal } from "antd";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";
import PropTypes from "prop-types";

export const ShippingAddressModal = ({
  open,
  isLoading,
  onSubmit,
  onClose,
  shippingInfo,
}) => {
  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (shippingInfo) {
      setRecipientName(shippingInfo.recipientName);
      setPhone(shippingInfo.phone);
      setAddress(shippingInfo.shippingAdress);
    }
  }, [shippingInfo]);

  const handleSubmit = () => {
    const body = {
      recipientName,
      phone,
      shippingAdress: address,
    };

    if (shippingInfo) {
      onSubmit(shippingInfo.id, body);
    }

    onClose();
  };
  return (
    <>
      <Modal
        open={open}
        title={shippingInfo ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
        closable={false}
        onOk={onSubmit}
        onCancel={onClose}
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
            <Button
              key="submit"
              type="primary"
              loading={isLoading}
              onClick={handleSubmit}
              className="w-32 p-2 text-white bg-secondary border border-secondary rounded-sm"
            >
              Xác nhận
            </Button>
          </div>,
        ]}
      >
        <div>
          <Input
            placeholder="Tên người nhận"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
          />
          <Input
            placeholder="Số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            placeholder="Địa chỉ nhận hàng"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      </Modal>
    </>
  );
};

ShippingAddressModal.propTypes = {
  open: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  shippingInfo: PropTypes.shape({
    id: PropTypes.number,
    recipientName: PropTypes.string,
    phone: PropTypes.string,
    shippingAdress: PropTypes.string,
  }),
};
