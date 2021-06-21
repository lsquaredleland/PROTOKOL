import { GovernanceInfo } from 'contexts/Protocols/types';
import styled from 'styled-components'
import { useProtocols } from '../contexts/Protocols'

const Circle = styled.img`
  height: 50px;
  width: 50px;
  background-color: #bbb;
  border-radius: 50%;
  width: 50%;
  margin: 0 auto;
`

const ProtocolRow = styled.div`
  display: flex
`

const ProtocolIconWrapper = styled.div`
  width: 100px
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
      style={{border: isActive ? '2px solid orange' : 'none'}}
      onClick={() => onClick(protocol, isActive)}
    />
    {protocol.name}
  </ProtocolIconWrapper>
)

export default function ProtocolSelector() {
  const { activeProtocols, setActiveProtocols, allProtocols } = useProtocols();

  // Question: Should user be able to select 0 protocols?
  const handleProtocolToggle = (protocol: GovernanceInfo, isActive: Boolean) => {
    if (isActive && activeProtocols.length > 1) {
      // Remove protocol
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