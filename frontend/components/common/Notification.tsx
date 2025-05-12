import { FC, useEffect } from "react";
import { ToastContainer, toast, ToastPosition } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type NotificationProps = {
  title: string;
  message?: string;
  type: "success" | "error" | "info" | "warning";
  position?: ToastPosition;
  onClose?: () => void; 
};

const Notification: FC<NotificationProps> = ({
  title,
  message = "",
  type,
  position = "top-right",
  onClose
}) => {
  useEffect(() => {
    toast[type](
      <div>
        <strong>{title}</strong>
        {message && <div>{message}</div>}
      </div>,
      {
        position,
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => {
          if (onClose) onClose(); 
        },
      }
    );
  }, [title, message, type, position, onClose]);

  return <ToastContainer />;
};

export default Notification;
