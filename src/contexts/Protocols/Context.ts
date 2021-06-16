import { createContext } from "react";
import { UNISWAP_GOVERNANCE } from "./data";
import { GovernanceInfo } from "./types";

interface ProtocolsContext {
  activeProtocols: Array<GovernanceInfo>;
  setActiveProtocols: (update: Array<GovernanceInfo>) => void;
  allProtocols: Array<GovernanceInfo>; // Might want to move this elsewhere
}

const Context = createContext<ProtocolsContext>({
  activeProtocols: [],
  setActiveProtocols: (update: Array<GovernanceInfo>) => {},
  allProtocols: [] // what's the point of content here when it has to repopulatedlater?
});

export default Context;