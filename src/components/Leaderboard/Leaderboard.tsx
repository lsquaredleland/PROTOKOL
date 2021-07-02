import { useEffect } from 'react';
import { useProtocols } from 'contexts/Protocols'
import { useLeaderboard } from 'contexts/Leaderboard';
import { DelegateDataMulti } from 'contexts/Leaderboard/types';
import styled from 'styled-components';

import { LeaderboardRow } from './LeaderboardRow';
import { RankNumber, User, VoteWeight, SmallNumber, Row } from './styles';



const LeaderBoardBox = styled.div`
  width: 90%;
  overflow: hidden;
  font-family: Sevastopol Interface, monospace;
  font-size: x-large;

  overflow-x: scroll;
  white-space: nowrap;

  // Compress margin when smaller device
  @media (max-width: 425px) {
    width: 95%
  }

  // Hiding scroll bars
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */

  ::-webkit-scrollbar {
    display: none;
  }
`

const ScrollArea = styled.div`
  height: 100%;
  overflow-y: scroll;
  box-sizing: content-box; 
  display: inline-block;
  width: max(100%,500px);

  // Hiding scroll bars
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */

  ::-webkit-scrollbar {
    display: none;
  }
`

const Header = styled(Row)`
  pointer-events: none;
  text-align: center;
  z-index: 100;

  // All seems hacky
  position: sticky;
  top: 0px;
  background-color: white;
  height: 30px;
  line-height: 30px;
  border-bottom: 2px solid black;
`

// TODO: impliment tooltips
const LeaderBoardTitle = () => (
  <Header>
    <RankNumber>🏆</RankNumber>
    <User>📛</User>
    <VoteWeight title="Vote weight -> Σ votes delegated * token value">💪</VoteWeight>
    <SmallNumber title="Total number of delegates">👥</SmallNumber>
    <SmallNumber title="Total number of votes">🗳️</SmallNumber> 
    <SmallNumber title="Total number of protocols active in">🏛️</SmallNumber>
  </Header>
)

const LeaderboardItems = () => {
  const { leaderboardRankings, loading } = useLeaderboard();

  return (
    <>
      {leaderboardRankings.slice(0, 100).map((data: DelegateDataMulti, i: number) => (
        <LeaderboardRow
          key={data.id}
          rank={i + 1}
          data={data}
          visible={!loading}
        />
      ))}
    </>
  )
}

const SearchResultItem = () => {
  const { leaderboardRankings, searchRankings } = useLeaderboard();

  const rank = leaderboardRankings.slice(0).reduce((accumulator: number, current: DelegateDataMulti, i: number, arr: DelegateDataMulti[]) => {
    if (searchRankings[0].id === current.id) {
      arr.splice(1); // Exit early if in the top 100
    }
    return i + 1
  }, 0)

  return (
    <>
      <LeaderboardRow
        key={searchRankings[0].id}
        rank={rank > 100 ? -1 : rank}
        data={searchRankings[0]}
        visible={true}
      />
      {rank > 100 ?
        <h3 style={{fontSize: 'medium'}}>Unranked: Not in the top 100</h3>
        : null
      }
    </>
  )
}

// Look into animations https://itnext.io/animating-list-reordering-with-react-hooks-aca5e7eeafba
export default function Leaderboard() {
  const { activeProtocols } = useProtocols();
  const { setActiveLeaderboard, leaderboardRankings, loading, error, searchRankings } = useLeaderboard();

  const areSearchResults = searchRankings.length > 0;

  useEffect(() => {
    // Thoughts passing values to Context vs pulling data from context directly?
    setActiveLeaderboard(activeProtocols);
  }, [activeProtocols, setActiveLeaderboard])

  return (
    <LeaderBoardBox>
      <ScrollArea>
        <LeaderBoardTitle />
        {loading || error ? <div>loading...{error}</div> : null}
        {!loading && leaderboardRankings.length === 0 ? <div>Please select a protocol above</div> : null}
        {areSearchResults ? 
          <SearchResultItem />
          : <LeaderboardItems />
        }
      </ScrollArea>
    </LeaderBoardBox>
  )
}