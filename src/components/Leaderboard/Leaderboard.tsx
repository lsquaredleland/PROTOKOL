import { useEffect } from 'react';
import { useProtocols } from 'contexts/Protocols'
import { useLeaderboard } from 'contexts/Leaderboard';
import { DelegateDataMulti, DelegateDataPrice } from 'contexts/Leaderboard/types';
import styled from 'styled-components';
import { formatPrice } from 'utils/misc';
import { useTwitterProfileData } from 'hooks/social';


const LeaderBoardBox = styled.div`
  width: 90%;
  overflow: hidden;
  font-family: monospace;

  // Compress margin when smaller device
  @media (max-width: 425px) {
    width: 95%
  }
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
  line-height: 50px;
  display: flex;
  justify-content: space-between;
  text-align: right;
`
const Header = styled(Row)`
  pointer-events: none;
  text-align: center;

  // All seems hacky
  position: sticky;
  top: 0px;
  background-color: white;
  height: 30px;
  line-height: 30px;
  border-bottom: 2px solid black;
`

const User = styled.div`
  width: 35%;
  min-width: 120px;
  display: flex
`;

const Address = styled.div`
  min-width: 80px;
  text-align: left;
  float:right;
  margin-left: 10px
`;

const VoteWeight = styled.div`
  width: 140px;
  direction: rtl;
`

const SmallNumber = styled.div`
  min-width: 30px;
`

type LeaderboardRowProps = {
  rank: number,
  data: DelegateDataMulti,
}

const totalVotes = (perProtocol: DelegateDataPrice[]) : number => {
  return perProtocol.reduce((accumulator: number, current: DelegateDataPrice) => {
    return accumulator + current.votes.length
  }, 0)
}

const totalConstituents = (perProtocol: DelegateDataPrice[]) : number => {
  return perProtocol.reduce((accumulator: number, current: DelegateDataPrice) => {
    return accumulator + current.tokenHoldersRepresentedAmount
  }, 0)
}

const LeaderBoardTitle = () => (
  <Header>
    <SmallNumber>🏆</SmallNumber>
    <Address>📛</Address>
    <VoteWeight>💪</VoteWeight>
    <SmallNumber>👥</SmallNumber>
    <SmallNumber>🏛️</SmallNumber> 
    <SmallNumber>🗳️</SmallNumber> 
  </Header>
)

const Avatar = styled.img` // could extend Circle in ProtocolSelector
  height: 40px;
  width: 40px;
  background-color: #bbb;
  border-radius: 50%;
  float: left;
  margin: auto 0;
`

const formatAddress = (address: string) => {
  return `${address.slice(0,6)}...${address.slice(-4)}`
}

const LeaderboardRow = ({ rank, data }: LeaderboardRowProps) => {
  const { id, value, handle, perProtocol } = data;
  const handleOrAddress = handle ? `@${handle}` : formatAddress(id);

  const twitterData = useTwitterProfileData(handle);
  const imageURL: string | undefined = twitterData?.profileURL

  return (
    <Row>
      <SmallNumber>{rank}</SmallNumber>
      <User>
        <Avatar src={imageURL} />
        <Address>{handleOrAddress}</Address>
      </User>
      <VoteWeight>{formatPrice(value)}</VoteWeight>
      <SmallNumber>{totalConstituents(Object.values(perProtocol))}</SmallNumber>
      <SmallNumber>{Object.keys(perProtocol).length}</SmallNumber> 
      <SmallNumber>{totalVotes(Object.values(perProtocol))}</SmallNumber>
    </Row>
  )
}

// Look into animations https://itnext.io/animating-list-reordering-with-react-hooks-aca5e7eeafba
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
        <LeaderBoardTitle />
        {leaderboardRankings.slice(0, 50).map((data: DelegateDataMulti, i: number) => (
          <LeaderboardRow key={data.id} rank={i + 1} data={data} />
        ))}
      </ScrollArea>
    </LeaderBoardBox>
  )
}