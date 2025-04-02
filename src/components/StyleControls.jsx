import styled from 'styled-components';

const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  overflow-y: auto;
  padding-right: 10px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
`;

const ControlPanel = styled.div`
  border: 1px solid #ddd;
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const PanelTitle = styled.h3`
  color: #333;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
`;

const ControlGroup = styled.div`
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &:last-child {
    margin-bottom: 0;
  }

  &.with-value {
    .slider-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }
`;

const Label = styled.label`
  color: #666;
  font-size: 14px;
  font-weight: 500;
`;

const Select = styled.select`
  width: 100%;
  height: 40px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  font-size: 14px;
  color: #333;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const TextInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #333;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
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

const SliderContainer = styled.div`
  flex: 1;
`;

const Value = styled.span`
  font-size: 14px;
  color: #666;
  min-width: 45px;
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

const fontOptions = [
  { name: 'Inter', weight: '400,500,600,700' },
  { name: 'Montserrat', weight: '400,500,600,700' },
  { name: 'Open Sans', weight: '400,500,600,700' },
  { name: 'Poppins', weight: '400,500,600,700' },
  { name: 'Roboto', weight: '400,500,700' },
  { name: 'Playfair Display', weight: '400,500,600,700' },
];

function StyleControls({ settings, onSettingsChange }) {
  const handleChange = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const renderSliderWithValue = (label, value, unit, props) => (
    <ControlGroup className="with-value">
      <Label>{label}</Label>
      <div className="slider-container">
        <SliderContainer>
          <Slider {...props} />
        </SliderContainer>
        <Value>{value}{unit}</Value>
      </div>
    </ControlGroup>
  );

  return (
    <ControlsWrapper>
      {/* Layout Type Panel */}
      <ControlPanel>
        <PanelTitle>Layout Type</PanelTitle>
        <ControlGroup>
          <Select
            value={settings.layoutType}
            onChange={(e) => handleChange('layoutType', e.target.value)}
          >
            <option value="icon-only">Icon Only</option>
            <option value="icon-text">Icon + Text</option>
          </Select>
        </ControlGroup>
      </ControlPanel>

      {/* Icon Settings Panel */}
      <ControlPanel>
        <PanelTitle>Icon Settings</PanelTitle>
        {renderSliderWithValue('Size', settings.size, 'px', {
          type: "range",
          min: "100",
          max: "500",
          value: settings.size,
          onChange: (e) => handleChange('size', Number(e.target.value))
        })}

        {renderSliderWithValue('Padding', settings.padding, 'px', {
          type: "range",
          min: "0",
          max: "100",
          value: settings.padding,
          onChange: (e) => handleChange('padding', Number(e.target.value))
        })}

        {renderSliderWithValue('Rotation', settings.rotate, '°', {
          type: "range",
          min: "0",
          max: "360",
          value: settings.rotate,
          onChange: (e) => handleChange('rotate', Number(e.target.value))
        })}

        {renderSliderWithValue('Border Width', settings.iconBorderWidth, 'px', {
          type: "range",
          min: "0",
          max: "10",
          step: "0.1",
          value: settings.iconBorderWidth,
          onChange: (e) => handleChange('iconBorderWidth', Number(e.target.value))
        })}

        <ControlGroup>
          <Label>Border Color</Label>
          <ColorPicker
            type="color"
            value={settings.iconBorderColor}
            onChange={(e) => handleChange('iconBorderColor', e.target.value)}
          />
        </ControlGroup>

        {renderSliderWithValue('Fill Opacity', settings.fillOpacity, '', {
          type: "range",
          min: "0",
          max: "1",
          step: "0.1",
          value: settings.fillOpacity,
          onChange: (e) => handleChange('fillOpacity', Number(e.target.value))
        })}
      </ControlPanel>

      {/* Container Settings Panel */}
      <ControlPanel>
        <PanelTitle>Container Settings</PanelTitle>
        <ControlGroup>
          <Label>Background Color</Label>
          <ColorPicker
            type="color"
            value={settings.backgroundColor}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
          />
        </ControlGroup>

        {renderSliderWithValue('Border Width', settings.containerBorderWidth, 'px', {
          type: "range",
          min: "0",
          max: "10",
          step: "0.1",
          value: settings.containerBorderWidth,
          onChange: (e) => handleChange('containerBorderWidth', Number(e.target.value))
        })}

        <ControlGroup>
          <Label>Border Color</Label>
          <ColorPicker
            type="color"
            value={settings.containerBorderColor}
            onChange={(e) => handleChange('containerBorderColor', e.target.value)}
          />
        </ControlGroup>
      </ControlPanel>

      {/* Text Settings Panel - Only shown when text is enabled */}
      {settings.layoutType === 'icon-text' && (
        <ControlPanel>
          <PanelTitle>Text Settings</PanelTitle>
          <ControlGroup>
            <Label>Logo Text</Label>
            <TextInput
              type="text"
              value={settings.logoText}
              onChange={(e) => handleChange('logoText', e.target.value)}
              placeholder="Enter logo text"
            />
          </ControlGroup>

          <ControlGroup>
            <Label>Font Family</Label>
            <Select
              value={settings.fontFamily}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
              style={{ fontFamily: settings.fontFamily }}
            >
              {fontOptions.map(font => (
                <option 
                  key={font.name} 
                  value={font.name}
                  style={{ fontFamily: font.name }}
                >
                  {font.name}
                </option>
              ))}
            </Select>
          </ControlGroup>

          <ControlGroup>
            <Label>Font Weight</Label>
            <Select
              value={settings.fontWeight}
              onChange={(e) => handleChange('fontWeight', e.target.value)}
            >
              <option value="400">Regular (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semi Bold (600)</option>
              <option value="700">Bold (700)</option>
            </Select>
          </ControlGroup>

          {renderSliderWithValue('Font Size', settings.fontSize, 'px', {
            type: "range",
            min: "12",
            max: "72",
            value: settings.fontSize,
            onChange: (e) => handleChange('fontSize', Number(e.target.value))
          })}

          <ControlGroup>
            <Label>Text Color</Label>
            <ColorPicker
              type="color"
              value={settings.textColor}
              onChange={(e) => handleChange('textColor', e.target.value)}
            />
          </ControlGroup>

          {renderSliderWithValue('Text-Icon Gap', settings.textIconGap, 'px', {
            type: "range",
            min: "0",
            max: "50",
            value: settings.textIconGap,
            onChange: (e) => handleChange('textIconGap', Number(e.target.value))
          })}
        </ControlPanel>
      )}
    </ControlsWrapper>
  );
}

export default StyleControls; 