import styled from 'styled-components';

// Renamed for clarity
const PreviewWrapper = styled.div` 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  /* background-color: #f0f0f0; Removed light grey background */
  padding: 20px;
`;

// This is the new visually distinct export area
const ExportZone = styled.div`
  width: 500px; /* Fixed size for export area */
  height: 500px;
  background-color: white;
  border: 2px dashed #aaa; /* Dashed border to indicate export zone */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* Hide parts of the logo if it exceeds the zone */
  position: relative; /* Added for potential future use */
`;

const IconName = styled.div`
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  max-width: 100%;
  max-height: 100%;
  background-color: ${props => props.backgroundColor};
  border: ${props => props.containerBorderWidth}px solid ${props => props.containerBorderColor};
  border-radius: 20%;
  transform: rotate(${props => props.rotate}deg);
  transition: all 0.3s ease;
  flex-shrink: 0;
  padding: ${props => props.padding}px;
`;

const PlaceholderText = styled.div`
  color: #666;
  font-size: 18px;
  text-align: center;
`;

function LogoPreview({ icon: Icon, settings, iconName }) {
  const clampedSize = Math.min(settings.size, 500);
  // Calculate icon size to fill the container better, accounting for padding
  const iconSize = Math.floor(clampedSize - (settings.padding * 2));

  return (
    // Use the wrapper div for overall centering and background
    <PreviewWrapper>
      {iconName && <IconName>{iconName}</IconName>}
      {/* The ExportZone is the element to be downloaded */}
      <ExportZone id="logo-preview">
        {!Icon ? (
          <PlaceholderText>
            Select an icon to start creating your logo
          </PlaceholderText>
        ) : (
          <LogoContainer {...settings} size={clampedSize}>
            <Icon
              size={iconSize}
              style={{
                opacity: 1 - settings.fillOpacity,
                stroke: settings.iconBorderColor,
                strokeWidth: settings.iconBorderWidth,
                flexShrink: 0,
                width: '100%',
                height: '100%',
              }}
            />
          </LogoContainer>
        )}
      </ExportZone>
    </PreviewWrapper>
  );
}

export default LogoPreview; 