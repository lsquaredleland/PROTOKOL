import { createContext } from "react";
import { GovernanceInfo } from "contexts/Protocols/types";
import { DelegateDataMulti } from './types'


interface LeaderboardContext {
  setActiveLeaderboard: (update: Array<GovernanceInfo>) => void;
  setSearchAddress: (update: string) => void;
  leaderboardRankings: DelegateDataMulti[];
  searchRankings: DelegateDataMulti[];
  searchAddress: string,
  loading: boolean;
  error: string;
}

const Context = createContext<LeaderboardContext>({
  setActiveLeaderboard: (update: Array<GovernanceInfo>) => {},
  setSearchAddress: (update: string) => {},
  leaderboardRankings: [],
  searchRankings: [],
  searchAddress: '',
  loading: true,
  error: ""
});

export default Context;