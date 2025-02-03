/*==================
  HEADER COMPONENT
==================*/
//js-integration/components/layout/Header.js

"use client";

import Image from 'next/image';
import WalletConnect from '../shared/WalletConnect';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-container">
          <Image
            src="/assets/logo.png"
            alt="OTD News Logo"
            fill
            sizes="1000px"
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        <WalletConnect />
      </div>
    </header>
  );
};

export default Header;