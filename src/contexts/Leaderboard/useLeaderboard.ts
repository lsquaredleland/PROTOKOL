import { useContext } from "react";

import { LeaderboardContext } from "contexts/Leaderboard";

const useLeaderboard = () => {
  return {
    ...useContext(LeaderboardContext),
  };
};

export default useLeaderboard;
