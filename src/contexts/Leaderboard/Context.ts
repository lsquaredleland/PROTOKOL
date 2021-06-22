import { createContext } from "react";
import { GovernanceInfo } from "contexts/Protocols/types";
import { DelegateDataMulti } from './types'


interface LeaderboardContext {
  setActiveLeaderboard: (update: Array<GovernanceInfo>) => void;
  leaderboardRankings: DelegateDataMulti[];
}

const Context = createContext<LeaderboardContext>({
  setActiveLeaderboard: (update: Array<GovernanceInfo>) => {},
  leaderboardRankings: []
});

export default Context;