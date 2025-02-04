/*=======================
    NFT CARD COMPONENT
========================*/
// components/nft/NFTCard/NFTCard.js

'use client';
import './NFTCard.scss';

const NFTCard = ({ nft }) => {
  return (
    <div className="nft-card">
      <div className="nft-card__image-container">
        <img 
          src={nft.image_url} 
          alt={nft.title}
          className="nft-card__image"
        />
      </div>
      <div className="nft-card__content">
        <h3 className="nft-card__title">{nft.title}</h3>
        <p className="nft-card__category">{Array.isArray(nft.category) ? nft.category.join(', ') : nft.category}</p>
        <div className="nft-card__description">
          <p>{nft.headline}</p>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;