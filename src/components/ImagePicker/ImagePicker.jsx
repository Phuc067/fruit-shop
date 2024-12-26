import { useState, useRef, useEffect } from "react";
import { Modal } from "antd"

import PropTypes from "prop-types";
import showToast from "../ToastComponent";

export default function ImagePicker({ open, onSubmit, onClose }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const dropZoneRef = useRef();

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];

      if (file) {
        const fileType = file.type;
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (validImageTypes.includes(fileType)) {
          setSelectedImage(file);
        } else {
          showToast('File không phải là ảnh hợp lệ.', 'warn');
        }
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropZoneRef.current.classList.add("dragging");
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropZoneRef.current.classList.remove("dragging");
  };

  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        setSelectedImage(file);
      }
    }
  };

  useEffect(() => {

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  useEffect(() => {
    if (selectedImage ) {
      const previewURL = URL.createObjectURL(selectedImage);
      setImagePreview(previewURL);
      return () => {
        URL.revokeObjectURL(previewURL);
      };
    }
  }, [selectedImage]);


  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const fileType = file.type;
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

      if (validImageTypes.includes(fileType)) {
        setSelectedImage(file);
      } else {
        showToast('File không phải là ảnh hợp lệ.', 'warn');
      }
    }
  };

  const handleSubmit = () => {
    onSubmit(selectedImage);
    setImagePreview("");
    setSelectedImage("");
    onClose();
  }
  return <>
    <Modal

      className=""
      open={open}
      onCancel={onClose}
      width={1000}
      title=<div className="justify-center flex py-4">Chọn ảnh trái cây</div>
      footer={[]}
    >
      <div className="w-full flex justify-center items-center flex-col min-h-96">
        <p>Kéo thả ảnh vào khung dưới đây hoặc bấm vào khung để chọn ảnh từ thiết bị</p>
        <div ref={dropZoneRef}
          onClick={() => dropZoneRef.current.querySelector("input").click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className="flex w-80 h-80 border-2 border-dotted border-smokeBlack items-center justify-center my-20 cursor-pointer overflow-hidden z-50 p-5" >
          <input
            type="file"
            onChange={handleImageChange}
            className="hidden"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Selected"
              className="w-full h-full object-contain"
            />
          )}
        </div>
        <button
          className="border-primary"
          onClick={() => handleSubmit()}
        >
          Xác nhận 
        </button>

        {/* <canvas
          ref={previewCanvasRef}
          className="hidden border border-smokeBlack object-contain"
        /> */}
      </div>
    </Modal>
  </>
}

ImagePicker.propTypes = {
  open: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
}
