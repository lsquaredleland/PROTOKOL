import styled from "styled-components";

export const Row = styled.div`
  height: 50px;
  line-height: 50px;
  display: flex;
  justify-content: space-between;
  text-align: right;
`

export const User = styled.div`
  width: 10rem;
  display: flex;

  // HACK
  @media (max-width: 425px) {
    width: 40%
  }
`;

export const VoteWeight = styled.div`
  width: 140px;
  direction: rtl;

  // Compress margin when smaller device
  @media (max-width: 425px) {
    width: 50px;
  }
`

export const SmallNumber = styled.div`
  min-width: 30px;
`

export const RankNumber = styled.div`
  width: 20px;
  text-align: left;
`