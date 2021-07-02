import styled from "styled-components";
import { ExpandAlt } from '@styled-icons/boxicons-regular/ExpandAlt'


// HACK: Keep or discard this type of nav?
// Ideally would have this ancillary components on the side
const Max = styled(ExpandAlt)`
  height: 15px;
  padding-left: 10px;
`;

const NavBarStyle = styled.div`
  line-height: 30px;
  width: 100%
`;

const InfoTab = styled.div`
  border-left: 2px solid black;
  border-bottom: 2px solid black;
  padding: 0 10px;
  float: right
`

interface NarBarProps {
  setModalActive: (activeModal: boolean) => void;
  setSearchActive: (activeModal: boolean) => void;
}

export default function NavBar({ setModalActive, setSearchActive } : NarBarProps) {
  return (
    <NavBarStyle>
      <InfoTab>
        Info / Legend<Max onClick={() => setModalActive(true)}/>
      </InfoTab>
      <InfoTab onClick={() => setSearchActive(true)}>
        space + p = search
      </InfoTab>
    </NavBarStyle>
  )
}
