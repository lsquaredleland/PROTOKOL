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
}

const ProtocolIcon = ({ protocol, isActive }: ProtocolIconProps) => (
  <ProtocolIconWrapper>
    <Circle
      src={protocol.logo}
      alt={protocol.name}
      style={{border: isActive ? '2px solid orange' : 'none'}}
    />
    {protocol.name}
  </ProtocolIconWrapper>
)

export default function ProtocolSelector() {
  const { activeProtocols, setActiveProtocols, allProtocols } = useProtocols();

  return (
    <ProtocolRow>
      {allProtocols.map((protocol: GovernanceInfo) => (
        <ProtocolIcon
          protocol={protocol}
          isActive={activeProtocols.map(({id}) => id).indexOf(protocol.id) !== -1}
        />
      ))}
    </ProtocolRow>
  )
}