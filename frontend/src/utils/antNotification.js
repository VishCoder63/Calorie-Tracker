import { notification } from "antd";

export const openNotification = (message, description) => {
  notification.open({
    duration: 3,
    message: message,
    description: description,
    onClick: () => {
      console.log("Notification Clicked!");
    },
  });
};
