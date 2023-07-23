import { toast } from "react-toastify";

export const showToast = (message, options = {}) => {
  toast(message, options);
};

export const showSuccessToast = (message) => {
  showToast(message, { type: "success" });
};

export const showErrorToast = (message) => {
  showToast(message, { type: "error" });
};
