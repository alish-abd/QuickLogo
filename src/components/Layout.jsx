import { useState, useEffect } from 'react';
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
    border-top: 1px solid #ddd;
    margin-top: 10px;
    position: fixed;
    bottom: 0;
    left: 0;
    background: white;
    z-index: 100;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
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

  @media (max-width: 724px) {
    border: none;
    border-top: 2px solid ${props => props.active ? '#2196f3' : 'transparent'};
    border-radius: 0 !important;
    
    &:first-child {
      border-top-left-radius: 0;
    }

    &:last-child {
      border-top-right-radius: 0;
    }
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
  height: 100%;

  @media (max-width: 724px) {
    width: 100%;
    display: ${props => props.activeTab === 'icon' ? 'flex' : 'none'};
    order: 2;
    height: calc(100dvh - 350px);
    margin-bottom: 60px; /* Add space for the bottom tabs */
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
  position: relative;

  @media (max-width: 724px) {
    padding: 10px;
    min-height: 250px;
    max-height: 250px;
    order: 1;
    display: ${props => (props.activeTab === 'icon' || props.activeTab === 'settings') ? 'flex' : 'none'};
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
    max-height: calc(100dvh - 350px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    order: 2;
    margin-bottom: 60px; /* Add space for the bottom tabs */
  }
`;

function Layout({ leftSidebar, canvas, rightSidebar, activeTab = 'icon', onTabChange }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 724);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 724);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Use the provided tab state if available, otherwise use internal state
  const handleTabChange = tab => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <LayoutContainer>
      {isMobile ? (
        <>
          {/* Canvas comes first in mobile */}
          <CanvasArea activeTab={activeTab}>
            {canvas}
          </CanvasArea>
          
          <LeftSidebar activeTab={activeTab}>
            {leftSidebar}
          </LeftSidebar>
          
          <RightSidebar activeTab={activeTab}>
            {rightSidebar}
          </RightSidebar>
          
          {/* Move TabContainer to the end (bottom) */}
          <TabContainer>
            <Tab 
              active={activeTab === 'icon'} 
              onClick={() => handleTabChange('icon')}
            >
              Select icon
            </Tab>
            <Tab 
              active={activeTab === 'settings'} 
              onClick={() => handleTabChange('settings')}
            >
              Settings
            </Tab>
          </TabContainer>
        </>
      ) : (
        <>
          <LeftSidebar>
            {leftSidebar}
          </LeftSidebar>
          
          <CanvasArea>
            {canvas}
          </CanvasArea>
          
          <RightSidebar>
            {rightSidebar}
          </RightSidebar>
        </>
      )}
    </LayoutContainer>
  );
}

export default Layout; 