import styled from 'styled-components';

const ControlsContainer = styled.div`
  margin-bottom: 20px;
`;

const ControlGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #333;
  font-size: 14px;
`;

const Slider = styled.input`
  width: 100%;
  margin: 5px 0;
`;

const ColorInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
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
      <SectionTitle>Size & Rotation</SectionTitle>
      <ControlGroup>
        <Label>Size (px)</Label>
        <Slider
          type="range"
          min="50"
          max="800"
          value={settings.size}
          onChange={(e) => handleChange('size', parseInt(e.target.value))}
        />
        <span>{settings.size}px</span>
      </ControlGroup>

      <ControlGroup>
        <Label>Rotation (degrees)</Label>
        <Slider
          type="range"
          min="0"
          max="360"
          value={settings.rotate}
          onChange={(e) => handleChange('rotate', parseInt(e.target.value))}
        />
        <span>{settings.rotate}°</span>
      </ControlGroup>

      <SectionTitle>Container Style</SectionTitle>
      <ControlGroup>
        <Label>Container Border Width (px)</Label>
        <Slider
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={settings.containerBorderWidth}
          onChange={(e) => handleChange('containerBorderWidth', parseFloat(e.target.value))}
        />
        <span>{settings.containerBorderWidth}px</span>
      </ControlGroup>

      <ControlGroup>
        <Label>Container Border Color</Label>
        <ColorInput
          type="color"
          value={settings.containerBorderColor}
          onChange={(e) => handleChange('containerBorderColor', e.target.value)}
        />
      </ControlGroup>

      <ControlGroup>
        <Label>Background Color</Label>
        <ColorInput
          type="color"
          value={settings.backgroundColor}
          onChange={(e) => handleChange('backgroundColor', e.target.value)}
        />
      </ControlGroup>

      <SectionTitle>Icon Style</SectionTitle>
      <ControlGroup>
        <Label>Icon Border Width (px)</Label>
        <Slider
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={settings.iconBorderWidth}
          onChange={(e) => handleChange('iconBorderWidth', parseFloat(e.target.value))}
        />
        <span>{settings.iconBorderWidth}px</span>
      </ControlGroup>

      <ControlGroup>
        <Label>Icon Border Color</Label>
        <ColorInput
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
          onChange={(e) => handleChange('fillOpacity', parseFloat(e.target.value))}
        />
        <span>{settings.fillOpacity}</span>
      </ControlGroup>
    </ControlsContainer>
  );
}

export default StyleControls; 