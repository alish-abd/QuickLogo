import styled from 'styled-components';

const ControlsContainer = styled.div`
  margin-bottom: 20px;
`;

const ControlGroup = styled.div`
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #666;
  font-size: 14px;
  font-weight: 500;
`;

const Slider = styled.input`
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  background: #ddd;
  border-radius: 2px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: #007bff;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.1);
    }
  }
`;

const Value = styled.span`
  font-size: 12px;
  color: #666;
  text-align: right;
`;

const ColorPicker = styled.input`
  width: 100%;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  -webkit-appearance: none;
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  &::-webkit-color-swatch {
    border: 1px solid #ddd;
    border-radius: 4px;
  }
`;

const SectionTitle = styled.h4`
  color: #333;
  margin: 20px 0 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
`;

function StyleControls({ settings, onSettingsChange }) {
  const handleChange = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <ControlsContainer>
      <SectionTitle>Size & Layout</SectionTitle>
      <ControlGroup>
        <Label>Size</Label>
        <Slider
          type="range"
          min="100"
          max="500"
          value={settings.size}
          onChange={(e) => handleChange('size', Number(e.target.value))}
        />
        <Value>{settings.size}px</Value>
      </ControlGroup>

      <ControlGroup>
        <Label>Padding</Label>
        <Slider
          type="range"
          min="0"
          max="100"
          value={settings.padding}
          onChange={(e) => handleChange('padding', Number(e.target.value))}
        />
        <Value>{settings.padding}px</Value>
      </ControlGroup>

      <ControlGroup>
        <Label>Rotation</Label>
        <Slider
          type="range"
          min="0"
          max="360"
          value={settings.rotate}
          onChange={(e) => handleChange('rotate', Number(e.target.value))}
        />
        <Value>{settings.rotate}°</Value>
      </ControlGroup>

      <SectionTitle>Container Style</SectionTitle>
      <ControlGroup>
        <Label>Background Color</Label>
        <ColorPicker
          type="color"
          value={settings.backgroundColor}
          onChange={(e) => handleChange('backgroundColor', e.target.value)}
        />
      </ControlGroup>

      <ControlGroup>
        <Label>Border Width</Label>
        <Slider
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={settings.containerBorderWidth}
          onChange={(e) => handleChange('containerBorderWidth', Number(e.target.value))}
        />
        <Value>{settings.containerBorderWidth}px</Value>
      </ControlGroup>

      <ControlGroup>
        <Label>Border Color</Label>
        <ColorPicker
          type="color"
          value={settings.containerBorderColor}
          onChange={(e) => handleChange('containerBorderColor', e.target.value)}
        />
      </ControlGroup>

      <SectionTitle>Icon Style</SectionTitle>
      <ControlGroup>
        <Label>Border Width</Label>
        <Slider
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={settings.iconBorderWidth}
          onChange={(e) => handleChange('iconBorderWidth', Number(e.target.value))}
        />
        <Value>{settings.iconBorderWidth}px</Value>
      </ControlGroup>

      <ControlGroup>
        <Label>Border Color</Label>
        <ColorPicker
          type="color"
          value={settings.iconBorderColor}
          onChange={(e) => handleChange('iconBorderColor', e.target.value)}
        />
      </ControlGroup>

      <ControlGroup>
        <Label>Fill Opacity</Label>
        <Slider
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={settings.fillOpacity}
          onChange={(e) => handleChange('fillOpacity', Number(e.target.value))}
        />
        <Value>{settings.fillOpacity}</Value>
      </ControlGroup>
    </ControlsContainer>
  );
}

export default StyleControls; 