import { useContext } from "react";
import Context from "./Context";

const useSocial = () => {
  return {
    ...useContext(Context),
  };
};

export default useSocial;
