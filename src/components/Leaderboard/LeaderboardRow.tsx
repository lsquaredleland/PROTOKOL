import { useState } from 'react';
import { DelegateDataMulti, DelegateDataPrice } from 'contexts/Leaderboard/types';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';
import { formatPrice, nFormatter } from 'utils/misc';
import { useTwitterProfileData } from 'hooks/social';
import emptyURL from 'assets/images/emptyprofile.png';
import { Row, VoteWeight, RankNumber, SmallNumber } from './styles';
import { GovernanceInfo } from 'contexts/Protocols/types';
import { CURRENT_SUPPORTED_PROTOCOLS } from 'contexts/Protocols/data';

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

const Avatar = styled.img` // could extend Circle in ProtocolSelector
  height: 40px;
  width: 40px;
  background-color: #bbb;
  border-radius: 50%;
  float: left;
  margin: auto 0;
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

const formatAddress = (address: string) => {
  return `${address.slice(0,6)}...${address.slice(-4)}`
}

type LeaderboardRowProps = {
  rank: number,
  data: DelegateDataMulti,
  visible: boolean,
}

const ExpandedRow = ({ perProtocol }: { perProtocol: DelegateDataPrice[] }) => {
  return (
    <div>
      <div>protocol</div>
      <div>Vote Weight (Votes)</div>
      <div>Proposals Voted</div>
      <div>Token holders represented</div>
      {perProtocol.map((protocol: DelegateDataPrice, i: number) => {
        const { protocolId, value, delegatedVotes, votes, tokenHoldersRepresentedAmount } = protocol;

        const symbol = CURRENT_SUPPORTED_PROTOCOLS.find((supported: GovernanceInfo) => supported.id === protocolId)?.token?.symbol
        return (
          <div key={i}>
            <div>{protocolId}</div>
            <div>{formatPrice(value)} ({Math.floor(delegatedVotes)} {symbol})</div>
            <div>{votes.length}</div>
            <div>{tokenHoldersRepresentedAmount}</div>
          </div>
        )
      })}
    </div>
  )
}

export function LeaderboardRow({ rank, data, visible }: LeaderboardRowProps) {
  const { id, value, handle, perProtocol } = data;
  const handleOrAddress = handle ? `@${handle}` : formatAddress(id);
  const link = handle ? `https://twitter.com/${handle}` : `https://etherescan.io/address/${id}`;

  const twitterData = useTwitterProfileData(handle);
  const imageURL: string | undefined = twitterData?.profileURL;
  
  const [expanded, setExpanded] = useState<boolean>(false);

  // For vote weight formatting => should isMobile be dynamic?
  // could u/ a useWindowDimensions() hook...

  return (
    <>
      <Row
        style={{visibility: visible ? 'visible' : 'hidden'}}
        onClick={() => setExpanded(!expanded)}
      >
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
      {expanded ? 
        <ExpandedRow perProtocol={Object.values(perProtocol)} />
      : null}
    </>
  )
}