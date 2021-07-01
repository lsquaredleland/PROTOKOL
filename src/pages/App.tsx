import { Suspense, useState } from 'react'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import ProposalDetails from './ProposalDetails'
import ProtocolSelector from 'components/ProtocolSelector'
import Leaderboard from 'components/Leaderboard'
import Web3ReactManager from 'components/Web3ReactManager'
import ErrorWindow from 'components/ErrorWindow'
import InformationCard from 'components/InformationCard'
import Footer from 'pages/Footer'
import NavBar from 'pages/NavBar'


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
    padding: 0 0 0 0;
  `};
`

const SmallMarginer = styled.div`
  margin-top: 2.5rem;
`

const MainPage = () => {
  return (
    <>
      <ErrorWindow />
      <h2>PROTOKOL 100</h2>
      <h3>Who are the governance influences?</h3>
      <ProtocolSelector />
      <SmallMarginer />
      <Leaderboard />
    </>
  )
}

export default function App() {
  const [modalActive, setModalActive] = useState<boolean>(true);

  return (
    <Suspense fallback={null}>
      <SiteWrapper>
        {/* <SideMenu /> */}
        <InformationCard active={modalActive} setActive={setModalActive} />
        <ContentWrapper>
          <NavBar setModalActive={setModalActive} />
          {/* <Web3Status />
          <Popups />
          <Polling />
          <Overview />
          <TopLevelModals /> */}
          <Web3ReactManager>
            <Switch>
              <Route exact strict path="/proposals/:protocolID/:proposalID" component={ProposalDetails} />
              <Route path="/" component={MainPage} />
            </Switch>
          </Web3ReactManager>
        </ContentWrapper>
        {/* <SmallMarginer /> */}
        <Footer />
      </SiteWrapper>
    </Suspense>
  )
}