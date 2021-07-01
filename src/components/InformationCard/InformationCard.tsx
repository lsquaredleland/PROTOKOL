import { useRef } from "react";
import styled from "styled-components";
import useOutsideAlerter from 'hooks/useOutsideAlerter';
import { Minimize2 } from '@styled-icons/feather/Minimize2'
import { ExpandAlt } from '@styled-icons/boxicons-regular/ExpandAlt'

const Wrapper = styled.div`
  position: absolute;
  z-index: 100;
  top: 20%;
  left: 0;
  bottom: 0;
  right: 0;
  text-align: center;
  max-width: 500px;
  height: fit-content;
  background-color: ${({ theme }) => theme.bg1};
  border: 2px solid black;
  margin: 0 auto;

  // Compress margin when smaller device
  @media (max-width: 425px) {
    width: 95%
  }
`;

const Window = styled.article`
  padding: 20px 30px;
  position: relative;

  p, li {
    text-align: left;
    font-size: x-large;
  }
`;

const StyledLi = styled.li`
  list-style-type: none;
`;

const Min = styled(Minimize2)`
  height: 20px;
`;

const Max = styled(ExpandAlt)`
  height: 20px;
`;

const IconLoc = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  height: 20px;
`;

const AlertText: React.FC = () => (
  <>
    <h1>ALERT</h1>
    <p><strong>Definition:</strong> "PROTOKOL" is a portmanteau of protocol and KOL (key opinion leader), the latter term is interchangeable with influencer. </p>
    <p>Here we wanted to see who are the crypto KOLs in governance, who has the most influence. We use a simple metric of summing the total tokens delegated per delegate multiplied by the market price of the tokens. Although ultimately this number itself is meaningless.</p>
    <p>Are you in the PROTOKOL 100?</p>
  </>
)

interface InformationCardProps {
  active: boolean;
  setActive: (active: boolean) => void;
}

export default function InformationCard({ active, setActive} : InformationCardProps) {

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, () => setActive(false));

  if (!active) {
    return null;
  }

  return (
    <Wrapper ref={wrapperRef}>
      <Window>
        <IconLoc onClick={() => setActive(!active)}>
          {active ? <Min /> : <Max />}
        </IconLoc>
        { active ? <AlertText /> : null}
        <h3>Legend</h3>
        <StyledLi>🏆 Rank</StyledLi>
        <StyledLi>📛 Address or Twitter handle (via <a href="https://sybil.org">Sybil.org)</a></StyledLi>
        <StyledLi> 💪 Vote weight (Σ votes delegated x token value)</StyledLi>
        <StyledLi> 👥 Total number of delegates</StyledLi>
        <StyledLi>🗳️ Total number of votes</StyledLi> 
        <StyledLi> 🏛️ Total number of protocols delegate is active in</StyledLi>
      </Window>
    </Wrapper>
  )
}