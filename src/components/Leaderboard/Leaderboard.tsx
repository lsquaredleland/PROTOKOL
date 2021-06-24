import { useEffect } from 'react';
import { useProtocols } from 'contexts/Protocols'
import { useLeaderboard } from 'contexts/Leaderboard';
import { DelegateDataMulti, DelegateDataPrice } from 'contexts/Leaderboard/types';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';
import { formatPrice, nFormatter } from 'utils/misc';
import { useTwitterProfileData } from 'hooks/social';
import emptyURL from 'assets/images/emptyprofile.png';


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
  width: 10rem;
  display: flex;

  // HACK
  @media (max-width: 425px) {
    width: 40%
  }
`;

const Address = styled.a`
  min-width: 80px;
  text-align: left;
  float:right;
  margin-left: 20px;
  color: inherit;
  text-decoration: inherit;
`;

const VoteWeight = styled.div`
  width: 140px;
  direction: rtl;

  // Compress margin when smaller device
  @media (max-width: 425px) {
    width: 50px;
  }
`

const SmallNumber = styled.div`
  min-width: 30px;
`

const RankNumber = styled.div`
  min-width: 20px;
  text-align: left;
`

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
    <RankNumber>🏆</RankNumber>
    <User>📛</User>
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

type LeaderboardRowProps = {
  rank: number,
  data: DelegateDataMulti,
  visible: boolean,
}

const LeaderboardRow = ({ rank, data, visible }: LeaderboardRowProps) => {
  const { id, value, handle, perProtocol } = data;
  const handleOrAddress = handle ? `@${handle}` : formatAddress(id);
  const link = handle ? `https://twitter.com/${handle}` : `https://etherescan.io/address/${id}`;

  const twitterData = useTwitterProfileData(handle);
  const imageURL: string | undefined = twitterData?.profileURL;

  // For vote weight formatting => should isMobile be dynamic?
  // could u/ a useWindowDimensions() hook...

  return (
    <Row style={{visibility: visible ? 'visible' : 'hidden'}}>
      <RankNumber>{rank}</RankNumber>
      <User>
        <Avatar
          src={imageURL || emptyURL}
          style={{opacity: imageURL ? '100%' : '20%'}}
        />
        <Address
          href={link}
          target={'_blank'}
        >{handleOrAddress}</Address>
      </User>
      <VoteWeight>{isMobile ? nFormatter(value, 1) : formatPrice(value)}</VoteWeight>
      <SmallNumber>{totalConstituents(Object.values(perProtocol))}</SmallNumber>
      <SmallNumber>{Object.keys(perProtocol).length}</SmallNumber> 
      <SmallNumber>{totalVotes(Object.values(perProtocol))}</SmallNumber>
    </Row>
  )
}

// Look into animations https://itnext.io/animating-list-reordering-with-react-hooks-aca5e7eeafba
export default function Leaderboard() {
  const { activeProtocols } = useProtocols();
  const { setActiveLeaderboard, leaderboardRankings, loading, error } = useLeaderboard();

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
        {leaderboardRankings.slice(0, 50).map((data: DelegateDataMulti, i: number) => (
          <LeaderboardRow
            key={data.id}
            rank={i + 1}
            data={data}
            visible={!loading}
          />
        ))}
      </ScrollArea>
    </LeaderBoardBox>
  )
}