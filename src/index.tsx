import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Web3ReactProvider } from '@web3-react/core'
import { HashRouter } from 'react-router-dom'
import App from './pages/App'
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from './theme'
import getLibrary from './utils/getLibrary'
import { ProtocolsProvider } from 'contexts/Protocols';
import { LeaderboardProvider } from 'contexts/Leaderboard';
import { PricesProvider } from 'contexts/Prices';
import { SocialProvider } from 'contexts/Social';
import { NotificationProvider } from 'contexts/Notification';


const Providers: React.FC = ({ children }) => {
  return (
    <NotificationProvider>
      <SocialProvider>
        <PricesProvider>
          <ProtocolsProvider>
            <LeaderboardProvider>
              {children}
            </LeaderboardProvider>
          </ProtocolsProvider>
        </PricesProvider>
      </SocialProvider>
    </NotificationProvider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <FixedGlobalStyle />
    <Web3ReactProvider getLibrary={getLibrary}>
      {/* <Web3ProviderNetwork getLibrary={getLibrary}> */}
        <Providers>
          {/* <Updaters /> */}
          <ThemeProvider>
            <ThemedGlobalStyle />
            <HashRouter>
              <App />
            </HashRouter>
          </ThemeProvider>
        </Providers>
      {/* </Web3ProviderNetwork> */}
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
