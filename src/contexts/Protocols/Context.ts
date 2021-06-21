import { createContext } from "react";
import { GovernanceInfo } from "./types";

interface ProtocolsContext {
  activeProtocols: Array<GovernanceInfo>;
  setActiveProtocols: (update: Array<GovernanceInfo>) => void;
  allProtocols: Array<GovernanceInfo>; // Make this a const instead and move out
}

const Context = createContext<ProtocolsContext>({
  activeProtocols: [],
  setActiveProtocols: (update: Array<GovernanceInfo>) => {},
  allProtocols: []
});

export default Context;