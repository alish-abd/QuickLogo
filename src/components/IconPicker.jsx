import { useState } from 'react';
import styled from 'styled-components';
import * as TablerIcons from '@tabler/icons-react';
import { iconTranslations } from '../utils/iconTranslations';

const IconPickerContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  flex-shrink: 0;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 15px;
  border-bottom: 1px solid #ddd;
  flex-shrink: 0;
`;

const Tab = styled.button`
  padding: 8px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#2196f3' : 'transparent'};
  color: ${props => props.active ? '#2196f3' : '#666'};
  cursor: pointer;
  font-size: 14px;
  font-weight: ${props => props.active ? '600' : '400'};
  transition: all 0.2s;

  &:hover {
    color: #2196f3;
  }
`;

const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  gap: 10px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  flex: 1;
  min-height: 0;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  aspect-ratio: 1;
  width: 100%;
  height: auto;
  background: ${props => props.selected ? '#e3f2fd' : 'white'};
  border: 1px solid ${props => props.selected ? '#2196f3' : '#ddd'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
    border-color: #2196f3;
  }

  & > svg {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }
`;

const Title = styled.h3`
  margin-bottom: 15px;
  color: #333;
  flex-shrink: 0;
`;

function IconPicker({ onSelectIcon }) {
  const [search, setSearch] = useState('');
  const [selectedIconName, setSelectedIconName] = useState('');
  const [activeTab, setActiveTab] = useState('outline'); // 'outline' or 'filled'

  const lowerCaseSearch = search.toLowerCase();

  // Filter icons based on search and tab selection
  const icons = Object.entries(TablerIcons)
    .filter(([name]) => {
      // Basic filtering (must be an icon, not a brand icon)
      if (!name.startsWith('Icon') || name.startsWith('IconBrand')) {
        return false;
      }

      // Filter based on tab selection
      const isFilled = name.endsWith('Filled');
      if (activeTab === 'filled' && !isFilled) return false;
      if (activeTab === 'outline' && isFilled) return false;

      const baseName = name.replace(/^Icon/, '').replace(/Filled$/, ''); // Get base name without 'Filled'
      const lowerCaseBaseName = baseName.toLowerCase();
      
      // Check if search term matches English name
      if (lowerCaseBaseName.includes(lowerCaseSearch)) {
        return true;
      }

      // Check if search term matches any Russian keywords
      const russianKeywords = iconTranslations[baseName];
      if (russianKeywords && Array.isArray(russianKeywords)) {
        return russianKeywords.some(keyword => 
          keyword.toLowerCase().includes(lowerCaseSearch)
        );
      }

      return false;
    });

  const handleIconSelect = (IconComponent, name) => {
    setSelectedIconName(name);
    const isFilled = name.endsWith('Filled');
    onSelectIcon(IconComponent, isFilled);
  };

  return (
    <IconPickerContainer>
      <Title>Select Icon</Title>
      <SearchInput
        type="text"
        placeholder="Search icons (English/Русский)..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <TabContainer>
        <Tab 
          active={activeTab === 'outline'} 
          onClick={() => setActiveTab('outline')}
        >
          Outline
        </Tab>
        <Tab 
          active={activeTab === 'filled'} 
          onClick={() => setActiveTab('filled')}
        >
          Filled
        </Tab>
      </TabContainer>
      <IconGrid>
        {icons.map(([name, IconComponent]) => (
          <IconButton
            key={name}
            selected={name === selectedIconName}
            onClick={() => handleIconSelect(IconComponent, name)}
            title={name.replace('Icon', '').replace(/Filled$/, '')}
          >
            <IconComponent size={24} />
          </IconButton>
        ))}
      </IconGrid>
    </IconPickerContainer>
  );
}

export default IconPicker; 