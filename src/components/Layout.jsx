import { useState } from 'react';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
  height: 100dvh;
  padding: 20px;
  background-color: #f8f8f8;
  background-image: radial-gradient(#cccccc 1px, transparent 1px);
  background-size: 15px 15px;
  overflow: hidden;
  gap: 20px;

  @media (max-width: 724px) {
    flex-direction: column;
    padding: 10px;
    gap: 10px;
  }
`;

const TabContainer = styled.div`
  display: none;
  
  @media (max-width: 724px) {
    display: flex;
    width: 100%;
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px;
  }
`;

const Tab = styled.button`
  flex: 1;
  padding: 12px;
  background: ${props => props.active ? '#f0f0f0' : 'white'};
  border: 1px solid #ddd;
  border-bottom: none;
  color: ${props => props.active ? '#333' : '#666'};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s;

  &:first-child {
    border-top-left-radius: 8px;
  }

  &:last-child {
    border-top-right-radius: 8px;
  }

  &:hover {
    background: #f0f0f0;
  }
`;

const LeftSidebar = styled.div`
  width: 250px;
  flex-shrink: 0;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  @media (max-width: 724px) {
    width: 100%;
    display: ${props => props.activeTab === 'icon' ? 'flex' : 'none'};
  }
`;

const CanvasArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border-radius: 10px;

  @media (max-width: 724px) {
    padding: 10px;
    min-height: 250px;
    max-height: 250px;
  }
`;

const RightSidebar = styled.div`
  width: 300px;
  flex-shrink: 0;
  border-radius: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  @media (max-width: 724px) {
    width: 100%;
    display: ${props => props.activeTab === 'settings' ? 'flex' : 'none'};
    max-height: calc(100vh - 400px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
`;

function Layout({ leftSidebar, canvas, rightSidebar }) {
  const [activeTab, setActiveTab] = useState('icon');

  return (
    <LayoutContainer>
      <TabContainer>
        <Tab 
          active={activeTab === 'icon'} 
          onClick={() => setActiveTab('icon')}
        >
          Select icon
        </Tab>
        <Tab 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </Tab>
      </TabContainer>
      <LeftSidebar activeTab={activeTab}>
        {leftSidebar}
      </LeftSidebar>
      <CanvasArea>
        {canvas}
      </CanvasArea>
      <RightSidebar activeTab={activeTab}>
        {rightSidebar}
      </RightSidebar>
    </LayoutContainer>
  );
}

export default Layout; 