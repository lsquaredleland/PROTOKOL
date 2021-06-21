import { createContext } from "react";
import { GovernanceInfo } from "contexts/Protocols/types";

interface LeaderboardContext {
  setActiveLeaderboard: (update: Array<GovernanceInfo>) => void;
}

const Context = createContext<LeaderboardContext>({
  setActiveLeaderboard: (update: Array<GovernanceInfo>) => {}
});

export default Context;