import { useRef } from 'react';
import styled from 'styled-components'

import useOutsideAlerter from 'hooks/useOutsideAlerter';
import { useState } from 'react';
import isAddress from 'utils/isAddress';
import { useLeaderboard } from 'contexts/Leaderboard';
import { useEffect } from 'react';


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

const Input = styled.input`
  type: text;
  font-size: 1em;
  font-family: 'Audiowide';
  width: 100%;
`;

const ErrorText = styled.span`
  color: maroon;
`

interface SearchModalProps {
  active: boolean;
  deactivate: () => void;
}

export default function SearchModal({ active, deactivate }: SearchModalProps) {
  const [searchAddressLocal, setSearchAddressLocal] = useState<string>('');

  const { setSearchAddress } = useLeaderboard();

  useEffect(() =>{
    if (isAddress(searchAddressLocal)) {
      setSearchAddress(searchAddressLocal)
    } else {
      setSearchAddress('')
    }
  }, [searchAddressLocal, setSearchAddress])

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, deactivate);

  if (!active) {
    return null
  }

  return (
    <Wrapper ref={wrapperRef}>
      <Window>
        <Input
          placeholder="Search for an address 0x000..."
          value={searchAddressLocal}
          onChange={(
            ev: React.ChangeEvent<HTMLInputElement>,
          ): void => setSearchAddressLocal(ev.target.value)}
        />
        <ErrorText>
          {!isAddress(searchAddressLocal) && searchAddressLocal !== "" ? "invalid address" : null}
        </ErrorText>
      </Window>
    </Wrapper>
  )
}