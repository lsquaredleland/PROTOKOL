import React, { useState } from "react";
import Context from "./Context";
import NotificationData from "./types";

const Provider: React.FC = ({ children }) => {
  const defaultNotification = ({
    message: "",
    title: "",
    copy: "",
    child: undefined,
  });
  
  const [notification, setNotification] = useState<NotificationData>(defaultNotification);

  const updateNotification = (update: NotificationData) => {
    setNotification({ ...notification, ...update });
  }

  return (
    <Context.Provider
      value={{
        notification,
        updateNotification,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;