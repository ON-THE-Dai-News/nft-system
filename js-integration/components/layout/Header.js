/*==================
  HEADER COMPONENT
==================*/
//js-integration/components/layout/Header.js

"use client";

import WalletConnect from '../shared/WalletConnect';  // Changed from { WalletConnect }

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h1>OTDNews NFT System</h1>
        </div>
        <WalletConnect />
      </div>
    </header>
  );
};

export default Header;