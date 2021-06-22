import { useEffect } from 'react';
import { useProtocols } from 'contexts/Protocols'
import { useLeaderboard } from 'contexts/Leaderboard';

export default function Leaderboard() {
  const { activeProtocols } = useProtocols();
  const { setActiveLeaderboard } = useLeaderboard();

  useEffect(() => {
    // Fetch data on visible protocols
    // Behind the scenes don't actively fetch() -> check if cached
    setActiveLeaderboard(activeProtocols);
  }, [activeProtocols, setActiveLeaderboard])

  return (
    <div>Leaderboard</div>
  )
}