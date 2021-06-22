import { useEffect } from 'react';
import { useProtocols } from 'contexts/Protocols'
import { useLeaderboard } from 'contexts/Leaderboard';
import { DelegateDataMulti, DelegateDataPrice } from 'contexts/Leaderboard/types';
import styled from 'styled-components';
import { formatPrice } from 'utils/misc';


const LeaderBoardBox = styled.div`
  width: 90%;
  overflow: hidden;
`

const ScrollArea = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding-right: 17px; /* Increase/decrease this value for cross-browser compatibility */
  box-sizing: content-box; 
`

const Row = styled.div`
  height: 50px;
  display: flex;
  justify-content: space-between;

`
const Address = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 150px;
`;

type LeaderboardRowProps = {
  rank: number,
  data: DelegateDataMulti,
}

const totalVotes = (perProtocol: DelegateDataPrice[]) : number => {
  return perProtocol.reduce((accumulator: number, current: DelegateDataPrice) => {
    return accumulator + current.votes.length
  }, 0)
}

const LeaderboardRow = ({ rank, data }: LeaderboardRowProps) => {
  const { id, value, handle, perProtocol } = data;
  return (
    <Row>
      <div>{rank}</div>
      <Address>{handle || id}</Address>
      <div>{formatPrice(value)}</div>
      <div>{Object.keys(perProtocol).length}</div> 
      <div>{totalVotes(Object.values(perProtocol))}</div>
    </Row>
  )
}

export default function Leaderboard() {
  const { activeProtocols } = useProtocols();
  const { setActiveLeaderboard, leaderboardRankings } = useLeaderboard();

  useEffect(() => {
    // Thoughts passing values to Context vs pulling data from context directly?
    setActiveLeaderboard(activeProtocols);
  }, [activeProtocols, setActiveLeaderboard])

  return (
    <LeaderBoardBox>
      <ScrollArea>
        {leaderboardRankings.slice(0, 50).map((data: DelegateDataMulti, i: number) => (
          <LeaderboardRow key={data.id} rank={i + 1} data={data} />
        ))}
      </ScrollArea>
    </LeaderBoardBox>
  )
}