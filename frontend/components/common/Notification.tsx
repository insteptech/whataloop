import { FC, useEffect } from "react";
import { ToastContainer, toast, ToastPosition } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type NotificationProps = {
  title: string;
  message?: string;
  type: "success" | "error" | "info" | "warning";
  position?: ToastPosition;
};

const Notification: FC<NotificationProps> = ({
  title,
  message = "",
  type,
  position = "top-right",
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
      }
    );
  }, [title, message, type, position]);

  return <ToastContainer />;
};

export default Notification;
