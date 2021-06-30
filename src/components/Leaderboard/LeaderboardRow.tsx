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

const MainRow = styled(Row)`
  :hover {
    background-color: pink;
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

const VoteWeightMod = styled(VoteWeight)`
  text-align: right;
  white-space: nowrap;
  direction: revert;
`;

const ExpandedRowStyle = styled.div`
  border: 1.5px solid black;
  border-top: none;
`;

const Weak = styled.span`
  opacity: 50%;
`;

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
    <ExpandedRowStyle>
      {perProtocol.map((protocol: DelegateDataPrice, i: number) => {
        const { protocolId, value, delegatedVotes, votes, tokenHoldersRepresentedAmount } = protocol;

        const protocolInfo = CURRENT_SUPPORTED_PROTOCOLS.find((supported: GovernanceInfo) => supported.id === protocolId)
        const symbol = protocolInfo?.token?.symbol
        return (
          <Row key={i}>
            <RankNumber></RankNumber>
            <User>
              <Avatar src={protocolInfo?.logo}/>
            </User>
            <VoteWeightMod>
              <span style={{float:'right'}}>
                {formatPrice(value)} <Weak>({nFormatter(delegatedVotes, 0, "")} {symbol})</Weak>
              </span>
            </VoteWeightMod>
            <SmallNumber>{tokenHoldersRepresentedAmount}</SmallNumber>
            <SmallNumber>{votes.length}</SmallNumber>
            <SmallNumber />
          </Row>
        )
      })}
    </ExpandedRowStyle>
  )
}

export function LeaderboardRow({ rank, data, visible }: LeaderboardRowProps) {
  const { id, value, handle, perProtocol } = data;
  const handleOrAddress = handle ? `@${handle}` : formatAddress(id);
  const link = handle ? `https://twitter.com/${handle}` : `https://etherscan.io/address/${id}`;

  const twitterData = useTwitterProfileData(handle);
  const imageURL: string | undefined = twitterData?.profileURL;
  
  const [expanded, setExpanded] = useState<boolean>(false);

  // For vote weight formatting => should isMobile be dynamic?
  // could u/ a useWindowDimensions() hook...

  return (
    <>
      <MainRow
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
        <SmallNumber>{totalVotes(Object.values(perProtocol))}</SmallNumber>
        <SmallNumber>{Object.keys(perProtocol).length}</SmallNumber> 
      </MainRow>
      {expanded ? 
        <ExpandedRow perProtocol={Object.values(perProtocol)} />
      : null}
    </>
  )
}