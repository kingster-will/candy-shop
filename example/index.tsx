import { WalletModalProvider } from '@solana/wallet-adapter-ant-design';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import {
  getLedgerWallet,
  getMathWallet,
  getPhantomWallet,
  getSolflareWallet,
  getSolletWallet,
  getSolongWallet,
  getTorusWallet,
} from '@solana/wallet-adapter-wallets';
import { web3 } from "@project-serum/anchor";
import React, { useMemo } from 'react';
import 'react-app-polyfill/ie11';
import ReactDOM from 'react-dom';
import { CandyShopContent } from './CandyShopContent';
import { TORUS_WALLET_CLIENT_ID } from './constant/clientId';

const App = () => {
  const network = WalletAdapterNetwork.Mainnet;

  // const endpoint = useMemo(() => web3.clusterApiUrl(network), [network]);
  const endpoint = useMemo(() => "https://weathered-holy-river.solana-mainnet.quiknode.pro/" , [network]);

  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      getSolflareWallet(),
      getTorusWallet({
        options: {
          clientId: TORUS_WALLET_CLIENT_ID,
        },
      }),
      getLedgerWallet(),
      getSolongWallet(),
      getMathWallet(),
      getSolletWallet(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <CandyShopContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
