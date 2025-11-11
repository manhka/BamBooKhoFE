import { Toast } from "bootstrap";

export const showAlert = (message, type = "success") => {
  const toastEl = document.getElementById("app-toast");
  const msgEl = document.getElementById("app-toast-msg");

  if (!toastEl || !msgEl) {
    console.warn("Toast element not found in DOM");
    return;
  }

  msgEl.innerText = message;
  toastEl.className = `toast align-items-center text-bg-${type} border-0`;

  const toast = new Toast(toastEl);
  toast.show();
};
