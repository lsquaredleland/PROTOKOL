import { GovernanceInfo } from 'contexts/Protocols/types';
import styled from 'styled-components'
import { useProtocols } from 'contexts/Protocols'

interface CircleProps {
  active: Boolean;
}

const Circle = styled.img<CircleProps>`
  height: 50px;
  width: 50px;
  background-color: #bbb;
  border-radius: 50%;
  margin: 0 auto;
  display: grid;
  opacity: ${p => p.active ? '100%' : '50%'};
  border: ${p => p.active ? '2px solid orange' : 'none'};

  &:hover {
    border: 2px solid orange
  }
`

const ProtocolRow = styled.div`
  display: flex;
`

const ProtocolIconWrapper = styled.div`
  width: 80px;

  @media (max-width: 425px) {
    width: 55px;
  }
`;

type ProtocolIconProps = {
  protocol: GovernanceInfo;
  isActive: Boolean;
  onClick: (arg0: GovernanceInfo, arg1: Boolean) => void
}

const ProtocolIcon = ({ protocol, isActive, onClick }: ProtocolIconProps) => (
  <ProtocolIconWrapper>
    <Circle
      src={protocol.logo}
      alt={protocol.name}
      active={isActive}
      onClick={() => onClick(protocol, isActive)}
    />
  </ProtocolIconWrapper>
)

export default function ProtocolSelector() {
  const { activeProtocols, setActiveProtocols, allProtocols } = useProtocols();

  // Users should be able to select 0 protocols
  const handleProtocolToggle = (protocol: GovernanceInfo, isActive: Boolean) => {
    if (isActive) { // Remove protocol
      setActiveProtocols(activeProtocols.filter(({id}) => id !== protocol.id));
    } else {
      setActiveProtocols(activeProtocols.concat(protocol));
    }
  }

  return (
    <ProtocolRow>
      {allProtocols.map((protocol: GovernanceInfo) => (
        <ProtocolIcon
          key={protocol.id}
          protocol={protocol}
          isActive={activeProtocols.map(({id}) => id).indexOf(protocol.id) !== -1}
          onClick={handleProtocolToggle}
        />
      ))}
    </ProtocolRow>
  )
}