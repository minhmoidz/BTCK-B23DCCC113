import React from 'react';
import Navbar from './Navbar';
import Banner from './Banner';
import NewsList from './NewsList';
import IndustryInfo from './IndustryInfo';
import Guide from './Guide';
import FooterPTIT from '../../component/dunglai/FooterPTIT';
import ChatWidget from '../../component/user/chat/ChatWidget';

const Home: React.FC = () => (
  <>
    <Navbar />
    <Banner />
    <div style={{ maxWidth: 1300, margin: '0 auto', padding: '32px 16px 0 16px' }}>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: 350 }}>
          <IndustryInfo />
          <Guide />
        </div>
        <div style={{ flex: 1, minWidth: 320 }}>
          <NewsList />
        </div>
      </div>
    </div>
    <FooterPTIT />
    <ChatWidget />
  </>
);

export default Home;