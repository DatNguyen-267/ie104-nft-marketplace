const buttons = document.querySelectorAll(".buttons .btn");
const notifications = document.querySelector(".notifications") ;

const removeToast = (toast) => {
  toast.classList.add("remove");
  setTimeout(() => toast.remove(), 5000);
};

const toastDetails = {
  success: {
    icon: "fa-check-circle",
    title: "Success :",
  },
  error: {
    icon: "fa-times-circle",
    title: "Error :",
  },
  warning: {
    icon: "fa-exclamation-circle",
    title: "Warning :",
  },
  info: {
    icon: "fa-info-circle",
    title: "Warning :",
  },
};
const handleCreateToast = (id, message) => {
  const { icon, title } = toastDetails[id];
  
  const toast = document.createElement('li');
  
  toast.className = `toast toast-${id}`;
  toast.innerHTML = `
  <div class="toast-column">
          <i class="fa ${icon}"></i>
          <span>${title} ${message}</span>
        </div>
  `;
  notifications.insertBefore(toast, notifications.children[0]);
  // setTimeout(() => removeToast(toast), 500);
};
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    handleCreateToast(button.id, 'abc');
  });
});
