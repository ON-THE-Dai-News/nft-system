/*=======================
  MAIN LAYOUT COMPONENT
=======================*/
//js-integration/components/layout/MainLayout.js

import Header from './Header'
import Footer from './Footer'
import LandingPage from '../nft/LandingPage/LandingPage.js';

export const MainLayout = () => {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        <LandingPage />
      </main>
      <Footer />
    </div>
  );
};