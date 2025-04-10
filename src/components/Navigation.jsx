import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

const NavContainer = styled.nav`
  position: absolute; 
  top: 30px; 
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px; 
  padding: 6px; 
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  backdrop-filter: blur(4px);
`;

const NavLink = styled(Link)`
  padding: 8px 16px; 
  border: none;
  border-radius: 6px;
  background: ${props => props.active ? '#2196f3' : 'transparent'};
  color: ${props => props.active ? 'white' : '#555'}; 
  font-size: 14px; 
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px; 
  text-decoration: none;

  &:hover {
    background: ${props => props.active ? '#1976d2' : 'rgba(0, 0, 0, 0.05)'};
  }

  svg {
    width: 16px; 
    height: 16px; 
  }
`;

function Navigation() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <NavContainer>
      <NavLink
        to="/"
        active={currentPath === '/' ? 'true' : undefined}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        Logo
      </NavLink>
      <NavLink
        to="/screen"
        active={currentPath === '/screen' ? 'true' : undefined}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        Screenshot
      </NavLink>
    </NavContainer>
  );
}

export default Navigation; 