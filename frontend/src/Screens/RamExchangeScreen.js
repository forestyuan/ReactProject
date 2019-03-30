import React from 'react';
import SyncScatter from '../Components/RamExchange/SyncScatter';
import SideNav from '../Components/SideNav';
import TopNav from '../Components/RamExchange/TopNav';
import TradePanel from '../Components/RamExchange/TradePanel';
import RamPriceHistory from '../Components/RamExchange/RamPriceHistory';
import LatestTransaction from '../Components/RamExchange/LatestTransaction';

const RamExchangeScreen = () => {
  return (
    <div className="app">
      <SideNav/>
      <section className="trade">
        <header>
          <TopNav/>
          <TradePanel/>
        </header>
        <section className='chart'>
          <RamPriceHistory/>
        </section>
        <section className="hide-gt-sm">
          <LatestTransaction/>
        </section>
      </section>
      <section className='hide-lt-md side-tool'>
        <div style={{ height: '232px' }}>
          <SyncScatter/>
        </div>
        <LatestTransaction/>
      </section>
    </div>
  );
};

export default RamExchangeScreen;
