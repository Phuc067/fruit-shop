import { toast } from 'react-toastify';
import { Bounce } from 'react-toastify';

const activeToasts = new Map();

const showToast = (message, type = 'default') => {
  const options = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
    onClose: () => {
      activeToasts.delete(message);
    },
  };

  if (activeToasts.has(message)) {
    toast.dismiss(activeToasts.get(message));
  }

  let toastId;
  switch (type) {
    case 'success':
      toastId = toast.success(message, options);
      break;
    case 'error':
      toastId = toast.error(message, options);
      break;
    case 'info':
      toastId = toast.info(message, options);
      break;
    case 'warn':
      toastId = toast.warn(message, options);
      break;
    default:
      toastId = toast(message, options);
      break;
  }

  activeToasts.set(message, toastId);
};

export default showToast;
