import { useState, useEffect, useContext } from "react";
import { Modal } from "antd";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";
import PropTypes from "prop-types";
import shippingInformationApi from "../../../../apis/shippingInformation.api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AppContext } from "../../../../contexts/app.context";
import HttpStatusCode from "../../../../constants/httpStatusCode.enum";

export const ShippingAddressModal = ({
  open,
  onSubmit,
  onClose,
  shippingInfo,
}) => {
  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const { profile } = useContext(AppContext);
  useEffect(() => {
    if (shippingInfo) {
      setRecipientName(shippingInfo.recipientName);
      setPhone(shippingInfo.phone);
      setAddress(shippingInfo.shippingAdress);
      setIsPrimary(shippingInfo.isPrimary);
    } else {
      setRecipientName("");
      setPhone("");
      setAddress("");
    }
  }, [shippingInfo]);

  const addMutation = useMutation({
    mutationFn: (body) =>
      shippingInformationApi.createShippingInformation(body),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }) =>
      shippingInformationApi.updateShippingInformation(id, body),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => shippingInformationApi.deleteShippingInformation(id),
  });
  const handleCreateShippingAddress = () => {
    const body = {
      recipientName,
      phone,
      shippingAdress: address,
      userId: profile.id,
    };

    console.log(body);
    addMutation.mutate(body, {
      onSuccess: (result) => {
        toast.success(result.data.message);
        let data = result.data.data;
        onSubmit(data);
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  const handleUpdateShippingAdrress = () => {
    const body = {
      recipientName,
      phone,
      shippingAdress: address,
      isPrimary: isPrimary,
    };
    console.log(body);
    const id = shippingInfo.id;
    updateMutation.mutate(
      { id, body },
      {
        onSuccess: (result) => {
          let data = result.data.data;
          if (data) {
            console.log(data);
            onSubmit(id, data);
            toast.success(result.data.message);
          } else {
            toast.error(result.data.message);
          }
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );
  };

  const handleDeleteShippingAddress = () => {
    deleteMutation.mutate(shippingInfo.id, {
      onSuccess: (result) => {
        const statusCode = result.data.status;
        console.log("HTTP Code:", statusCode);
        console.log("enum", HttpStatusCode.Accepted);
        if (statusCode == HttpStatusCode.Accepted) {
          onSubmit(shippingInfo.id, null);
          toast.success(result.data.message);
        }
        onClose();
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  const handleSubmit = () => {
    shippingInfo
      ? handleUpdateShippingAdrress()
      : handleCreateShippingAddress();
    handleClose();
  };

  const handleClose = () => {
    setRecipientName("");
    setPhone("");
    setAddress("");
    setIsPrimary(false);
    onClose();
  };
  return (
    <>
      <Modal
        open={open}
        title={shippingInfo ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
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
            <Button
              key="submit"
              type="primary"
              loading={addMutation.isLoading || updateMutation.isLoading}
              onClick={handleSubmit}
              className="w-32 p-2 text-white bg-secondary border border-secondary rounded-sm"
            >
              Xác nhận
            </Button>
          </div>,
        ]}
      >
        <div>
          <div className="flex gap-2 pt-4">
            <div className="relative flex-grow">
              <span className="absolute z-10 top-[-12px] left-2 bg-white px-1">
                Họ và tên
              </span>
              <Input
                value={recipientName}
                name="recipientName"
                onChange={(e) => setRecipientName(e.target.value)}
              />
            </div>
            <div className="relative">
              <span className="absolute z-10 top-[-12px] left-2 bg-white px-1">
                Số điện thoại
              </span>
              <Input
                value={phone}
                name="phone"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="relative">
            <span className="absolute z-10 top-[-12px] left-2 bg-white px-1">
              Địa chỉ nhận hàng
            </span>
            <Input
              value={address}
              name="address"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
        {shippingInfo && (
          <div className="flex justify-between">
            <div>
              <input
                type="checkbox"
                name="isPrimary"
                checked={isPrimary}
                onClick={() => {
                  setIsPrimary(!isPrimary);
                }}
              />
              <span>Đặt làm địa chỉ mặc định</span>
            </div>
            <div>
              <Button
                className={"text-red-500"}
                onClick={handleDeleteShippingAddress}
              >
                Xóa
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

ShippingAddressModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  shippingInfo: PropTypes.shape({
    id: PropTypes.number,
    recipientName: PropTypes.string,
    phone: PropTypes.string,
    shippingAdress: PropTypes.string,
    isPrimary: PropTypes.bool,
  }),
};
