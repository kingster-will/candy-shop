import React, { useEffect, useMemo, useState } from 'react';
import { web3 } from '@project-serum/anchor';
import { CandyShop } from '@liqnft/candy-shop-sdk';

import { LiqImage } from 'components/LiqImage';
import { NftStat } from 'components/NftStat';
import { NftAttributes } from 'components/NftAttributes';

import { Nft, Order as OrderSchema } from 'solana-candy-shop-schema/dist';

export interface BuyModalDetailProps {
  order: OrderSchema;
  buy: () => void;
  walletPublicKey: web3.PublicKey | undefined;
  walletConnectComponent: React.ReactElement;
  candyShop: CandyShop;
}

const BuyModalDetail: React.FC<BuyModalDetailProps> = ({
  order,
  buy,
  walletPublicKey,
  walletConnectComponent,
  candyShop
}) => {
  const [loadingNftInfo, setLoadingNftInfo] = useState(false);
  const [nftInfo, setNftInfo] = useState<Nft | null>(null);

  useEffect(() => {
    if (order) {
      setLoadingNftInfo(true);
      candyShop
        .nftInfo(order.tokenMint)
        .then((nft) => setNftInfo(nft))
        .catch((err) => {
          console.info('fetchNftByMint failed:', err);
        })
        .finally(() => {
          setLoadingNftInfo(false);
        });
    }
  }, [order, candyShop]);

  const orderPrice = useMemo(() => {
    if (!order?.price) return null;

    return (
      Number(order.price) / candyShop.baseUnitsPerCurrency
    ).toLocaleString(undefined, {
      minimumFractionDigits: candyShop.priceDecimals,
      maximumFractionDigits: candyShop.priceDecimals
    });
  }, [candyShop.baseUnitsPerCurrency, candyShop.priceDecimals, order?.price]);

  return (
    <>
      <div>
        <div className="candy-buy-modal-thumbnail">
          <LiqImage
            src={order?.nftImageLink || ''}
            alt={order?.name}
            fit="contain"
          />
        </div>
      </div>
      <div className="candy-buy-modal-container">
        <div className="candy-title">{order?.name}</div>
        <div className="candy-buy-modal-control">
          <div>
            <div className="candy-label">PRICE</div>
            <div className="candy-price">
              {orderPrice ? `${orderPrice} ${candyShop.currencySymbol}` : 'N/A'}
            </div>
          </div>
          {!walletPublicKey ? (
            walletConnectComponent
          ) : (
            <button
              className="candy-button candy-buy-modal-button"
              onClick={buy}
            >
              Buy Now
            </button>
          )}
        </div>
        {order.nftDescription && (
          <div className="candy-stat">
            <div className="candy-label">DESCRIPTION</div>
            <div className="candy-value">{order?.nftDescription}</div>
          </div>
        )}
        <NftStat
          owner={order.walletAddress}
          tokenMint={order.tokenMint}
          edition={order.edition}
        />
        <NftAttributes
          loading={loadingNftInfo}
          attributes={nftInfo?.attributes}
        />
      </div>
    </>
  );
};

export default BuyModalDetail;
