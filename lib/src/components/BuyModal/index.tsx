import { BN } from '@project-serum/anchor';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import Modal from 'components/Modal';
import Processing from 'components/Processing';
import { CandyShop } from 'core/CandyShop';
import React, { useState } from 'react';
import { Order as OrderSchema } from 'solana-candy-shop-schema/dist';
import { notification } from 'utils/rc-notification';
import { TransactionState } from '../../model';
import BuyModalConfirmed from './BuyModalConfirmed';
import BuyModalDetail from './BuyModalDetail';
import './style.less';

export interface BuyModalProps {
  order: OrderSchema;
  onClose: any;
  candyShop: CandyShop;
  walletConnectComponent: React.ReactElement;
}

export const BuyModal: React.FC<BuyModalProps> = ({
  order,
  onClose,
  candyShop,
  walletConnectComponent,
}) => {
  const [step, setStep] = useState(TransactionState.DISPLAY);
  const [hash, setHash] = useState(''); // txHash
  const wallet = useAnchorWallet();

  const buy = async () => {
    if (wallet) {
      setStep(TransactionState.PROCESSING);
      return candyShop
        .buy(
          new PublicKey(order.walletAddress),
          new PublicKey(order.tokenAccount),
          new PublicKey(order.tokenMint),
          new BN(order.price),
          wallet
        )
        .then((txHash) => {
          setHash(txHash);
          console.log('Buy order made with transaction hash', txHash);

          setStep(TransactionState.CONFIRMED);
        })
        .catch((err) => {
          console.log({ err });
          notification('Transaction failed. Please try again later.', 'error');
          setStep(TransactionState.DISPLAY);
        });
    }
  };

  return (
    <>
      <Modal onCancel={onClose} width={step !== 0 ? 600 : 1000}>
        <div className="buy-modal">
          {step === 0 && (
            <BuyModalDetail
              order={order}
              buy={buy}
              walletPublicKey={wallet?.publicKey}
              walletConnectComponent={walletConnectComponent}
              candyShop={candyShop}
            />
          )}
          {step === 1 && <Processing text="Processing purchase" />}
          {step === 2 && (
            <BuyModalConfirmed
              walletPublicKey={wallet?.publicKey}
              order={order}
              txHash={hash}
            />
          )}
        </div>
      </Modal>
    </>
  );
};
