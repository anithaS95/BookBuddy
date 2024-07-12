import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const notifySuccess = (message) => {
  toast.success(message, {
    autoClose: 3000,
  });
};

export const notifyError = (message) => {
  toast.error(message, {
    autoClose: 3000,
  });
};
