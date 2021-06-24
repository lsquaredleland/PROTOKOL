import { createContext } from "react";
import { GovernanceInfo } from "contexts/Protocols/types";
import { DelegateDataMulti } from './types'


interface LeaderboardContext {
  setActiveLeaderboard: (update: Array<GovernanceInfo>) => void;
  leaderboardRankings: DelegateDataMulti[];
  loading: boolean;
  error: string;
}

const Context = createContext<LeaderboardContext>({
  setActiveLeaderboard: (update: Array<GovernanceInfo>) => {},
  leaderboardRankings: [],
  loading: true,
  error: ""
});

export default Context;