import { createContext } from "react";
import NotificationData from "./types";

interface NotificationContext {
  notification: NotificationData;
  updateNotification: (update: NotificationData) => void;
}

const Context = createContext<NotificationContext>({
  notification: {
    message: "",
    title: "",
    copy: "",
    child: undefined,
  },
  updateNotification: (update: NotificationData) => {}
});

export default Context;