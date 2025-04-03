import styled from 'styled-components';

// Renamed for clarity
const PreviewWrapper = styled.div` 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  /* background-color: #f0f0f0; Removed light grey background */


  @media (max-width: 724px) {
    padding: 10px;
    margin-bottom: 5px;
  }
`;

// This is the new visually distinct export area
const ExportZone = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* Hide parts of the logo if it exceeds the zone */
  position: relative; /* Added for potential future use */
  transition: all 0.3s ease;
`;

// Hidden div for clean export without background/border
const DownloadContainer = styled.div`
  position: absolute;
  opacity: 0;
  pointer-events: none;
  left: -9999px;
  top: 0;
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

  @media (max-width: 724px) {
    top: -30px;
    font-size: 14px;
    padding: 6px 12px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.textIconGap}px;
  transition: all 0.3s ease;
  padding: ${props => props.padding}px;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: ${props => props.backgroundColor};
  border: ${props => props.containerBorderWidth}px solid ${props => props.containerBorderColor};
  border-radius: ${props => props.containerBorderRadius}%;
  flex-shrink: 0;
  padding: ${props => props.padding}px;
  transition: all 0.3s ease;
`;

// Clean version of IconContainer without background and border for download
const CleanIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  flex-shrink: 0;
  padding: ${props => props.padding}px;
  border-radius: ${props => props.containerBorderRadius}%;
  background-color: ${props => props.backgroundColor};
  border: ${props => props.containerBorderWidth}px solid ${props => props.containerBorderColor};
  box-sizing: border-box;
`;

const IconWrapper = styled.div`
  transform: rotate(${props => props.rotate}deg);
  transition: transform 0.3s ease;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoText = styled.div`
  font-family: ${props => props.fontFamily}, sans-serif;
  font-size: ${props => props.fontSize}px;
  font-weight: ${props => props.fontWeight};
  color: ${props => props.textColor};
  white-space: nowrap;
  flex-shrink: 0;
`;

const PlaceholderText = styled.div`
  color: #666;
  font-size: 18px;
  text-align: center;
`;

function LogoPreview({ icon: Icon, settings, iconName, logoContainerRef }) {
  const isTextLayout = settings.layoutType === 'icon-text' && settings.logoText;
  
  // Use the user-defined size directly
  const containerSize = settings.size;
  const iconSize = Math.floor(containerSize - (settings.padding * 2));
  
  // Calculate export zone dimensions
  const padding = 10; // Padding around the entire logo
  const exportWidth = isTextLayout 
    ? containerSize + (settings.textIconGap || 0) + (settings.fontSize * settings.logoText.length * 0.6) + (padding * 2)
    : containerSize + (padding * 2);
  const exportHeight = Math.max(
    containerSize + (padding * 2),
    (settings.fontSize || 0) + (padding * 2)
  );

  // Remove rotate from settings to prevent it from being spread to IconContainer
  const { rotate, ...containerSettings } = settings;

  if (!Icon) {
    return (
      <PreviewWrapper>
        <ExportZone 
          id="logo-preview" 
          width={exportWidth}
          height={exportHeight}
        >
          <PlaceholderText>
            Select an icon to start creating your logo
          </PlaceholderText>
        </ExportZone>
      </PreviewWrapper>
    );
  }

  return (
    <PreviewWrapper>
      {iconName && <IconName>{iconName}</IconName>}
      
      {/* The ExportZone is for display preview only */}
      <ExportZone 
        id="logo-preview" 
        width={exportWidth}
        height={exportHeight}
      >
        <LogoContainer 
          textIconGap={settings.textIconGap}
          padding={padding}
        >
          <IconContainer {...containerSettings} size={containerSize}>
            <IconWrapper rotate={rotate}>
              <Icon
                size={iconSize}
                style={{
                  opacity: 1,
                  stroke: settings.iconBorderColor,
                  strokeWidth: settings.iconBorderWidth,
                  fill: settings.fillOpacity > 0 ? settings.fillColor : 'none',
                  flexShrink: 0,
                  width: '100%',
                  height: '100%',
                }}
              />
            </IconWrapper>
          </IconContainer>
          {isTextLayout && (
            <LogoText
              fontFamily={settings.fontFamily}
              fontSize={settings.fontSize}
              fontWeight={settings.fontWeight}
              textColor={settings.textColor}
            >
              {settings.logoText}
            </LogoText>
          )}
        </LogoContainer>
      </ExportZone>
      
      {/* Hidden container for clean download without background/border */}
      <DownloadContainer ref={logoContainerRef}>
        {/* This div is targeted by html-to-image for clean export */}
        {/* Keep styles minimal here, rely on styled components below */}
        <div id="logo-for-download" style={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          gap: `${settings.textIconGap}px`,
          padding: `${padding}px`, // Use the calculated padding for the outer container
          width: `${exportWidth}px`, // Set explicit dimensions
          height: `${exportHeight}px`,
          // NO background, border, or shadow here - handled by export options
        }}>
          <CleanIconContainer 
            size={containerSize} 
            padding={settings.padding} // Inner padding for the icon container
            containerBorderRadius={settings.containerBorderRadius}
            // Add background color here for the container shape
            backgroundColor={settings.backgroundColor}
            // Add container border here
            containerBorderWidth={settings.containerBorderWidth}
            containerBorderColor={settings.containerBorderColor}
          >
            <IconWrapper rotate={rotate}>
              <Icon
                size={iconSize}
                style={{
                  // Essential icon styles
                  stroke: settings.iconBorderColor,
                  strokeWidth: settings.iconBorderWidth,
                  fill: settings.fillOpacity > 0 ? settings.fillColor : 'none',
                  // Ensure icon fills its wrapper
                  width: '100%', 
                  height: '100%'
                }}
              />
            </IconWrapper>
          </CleanIconContainer>
          {isTextLayout && (
            <LogoText
              fontFamily={settings.fontFamily}
              fontSize={settings.fontSize}
              fontWeight={settings.fontWeight}
              textColor={settings.textColor}
            >
              {settings.logoText}
            </LogoText>
          )}
        </div>
      </DownloadContainer>
    </PreviewWrapper>
  );
}

export default LogoPreview; 