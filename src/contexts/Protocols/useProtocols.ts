import { useContext } from "react";

import { ProtocolsContext } from "contexts/Protocols";

const useProtocols = () => {
  return {
    ...useContext(ProtocolsContext),
  };
};

export default useProtocols;
