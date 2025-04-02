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
  align-items: center;
  justify-content: center;
  overflow: hidden; /* Hide parts of the logo if it exceeds the zone */
  position: relative; /* Added for potential future use */
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  /* Size is controlled by settings */
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  max-width: 100%; /* Ensure container doesn't overflow export zone */
  max-height: 100%;
  background-color: ${props => props.backgroundColor};
  border: ${props => props.containerBorderWidth}px solid ${props => props.containerBorderColor};
  border-radius: 20%;
  transform: rotate(${props => props.rotate}deg);
  transition: all 0.3s ease;
  flex-shrink: 0; /* Prevent shrinking smaller than specified size */
`;

const PlaceholderText = styled.div`
  color: #666;
  font-size: 18px;
  text-align: center;
`;

function LogoPreview({ icon: Icon, settings }) {
  // Calculate the actual size for the LogoContainer, clamped to the ExportZone dimensions
  // Assuming ExportZone is 500x500 based on styles above
  const clampedSize = Math.min(settings.size, 500);
  // Calculate icon size based on the *clamped* container size
  const iconSize = Math.floor(clampedSize * 0.6); 

  return (
    // Use the wrapper div for overall centering and background
    <PreviewWrapper>
      {/* The ExportZone is the element to be downloaded */}
      <ExportZone id="logo-preview">
        {!Icon ? (
          <PlaceholderText>
            Select an icon to start creating your logo
          </PlaceholderText>
        ) : (
          // Pass the clampedSize to the LogoContainer
          <LogoContainer {...settings} size={clampedSize}>
            <Icon
              size={iconSize}
              style={{
                opacity: 1 - settings.fillOpacity,
                stroke: settings.iconBorderColor,
                strokeWidth: settings.iconBorderWidth,
                flexShrink: 0, // Prevent icon from shrinking if container gets small
              }}
            />
          </LogoContainer>
        )}
      </ExportZone>
    </PreviewWrapper>
  );
}

export default LogoPreview; 