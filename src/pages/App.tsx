import React, { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import ProposalDetails from './ProposalDetails'
import ProtocolSelector from 'components/ProtocolSelector'
import Leaderboard from 'components/Leaderboard'
import Web3ReactManager from 'components/Web3ReactManager'

const SiteWrapper = styled.div`
  height: 100vh;
  width: 100%;
  display: grid;
  // grid-template-columns: auto 1fr;
  // grid-gap: 1.5em;
  overflow: auto;
  @media (max-width: 1080px) {
    display: flex;
    flex-flow: column;
    align-items: flex-start;
    overflow-x: hidden;
    // grid-gap: 0;
  }
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: min(600px,99%);
  margin: 0 auto;
  border: 2px solid black; /* To remove */
  margin-top: 32px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 2rem 0 0 0;
  `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 1rem 0 0 0;
  `};
`

const SmallMarginer = styled.div`
  margin-top: 2.5rem;
`

const Blank = () => {
  return (
    <>
      <h2>ProtoKOLs</h2>
      <h3>Who are the governance KOLs?</h3>
      <ProtocolSelector />
      <SmallMarginer />
      <Leaderboard />
    </>
  )
}

export default function App() {
  return (
    <Suspense fallback={null}>
      <SiteWrapper>
        {/* <SideMenu /> */}
        <ContentWrapper>
          {/* <Web3Status />
          <Popups />
          <Polling />
          <Overview />
          <TopLevelModals /> */}
          <Web3ReactManager>
            <Switch>
              {/* <Route exact strict path="/delegates/:protocolID" component={Delegates} />
              <Route exact strict path="/proposals/:protocolID" component={Proposals} /> */}
              <Route exact strict path="/proposals/:protocolID/:proposalID" component={ProposalDetails} />
              {/* <Route exact strict path="/delegates/:protocolID/:delegateAddress" component={DelegateInfo} /> */}
              <Route path="/" component={Blank} />
            </Switch>
          </Web3ReactManager>
        </ContentWrapper>
        <SmallMarginer />
      </SiteWrapper>
    </Suspense>
  )
}