import { useContext } from "react";
import { NotificationContext } from ".";


const useNotification = () => {
  return {
    ...useContext(NotificationContext),
  };
};

export default useNotification;