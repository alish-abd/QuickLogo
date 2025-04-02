import { useState } from 'react'
import styled from 'styled-components'
import IconPicker from './components/IconPicker'
import StyleControls from './components/StyleControls'
import LogoPreview from './components/LogoPreview'
import { toPng, toSvg } from 'html-to-image'

const AppContainer = styled.div`
  display: flex;
  height: 100dvh; /* Use dynamic viewport height */
  padding: 20px;
  background-color: #f8f8f8; 
  background-image: radial-gradient(#cccccc 1px, transparent 1px);
  background-size: 15px 15px; 
  overflow: hidden; /* Prevent AppContainer itself from scrolling */
  gap: 20px; /* Add gap between columns */
`

// Renamed and adjusted for the left column
const LeftSidebar = styled.div`
  width: 250px; /* Slightly narrower */
  flex-shrink: 0; 
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto; 
  display: flex;
  flex-direction: column;
`

// Renamed and adjusted for the center column
const CanvasArea = styled.div`
  flex: 1; /* Take remaining horizontal space */
  padding: 20px;
  overflow-y: auto; 
  display: flex; 
  justify-content: center;
  align-items: center;
  background-color: transparent; /* Make canvas area transparent */ 
  border-radius: 10px; /* Added subtle radius */
`

// New right column
const RightSidebar = styled.div`
  width: 300px; 
  flex-shrink: 0; 
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto; 
  display: flex; 
  flex-direction: column;
`

const ExportButtonContainer = styled.div`
  margin-top: auto; /* Push buttons to the bottom */
  padding-top: 20px; /* Add space above buttons */
`;

const ExportButton = styled.button`
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`

function App() {
  const [selectedIcon, setSelectedIcon] = useState(null)
  const [styleSettings, setStyleSettings] = useState({
    size: 400,
    rotate: 0,
    containerBorderWidth: 1.4,
    containerBorderColor: '#cccccc',
    iconBorderWidth: 1.4,
    iconBorderColor: '#000000',
    backgroundColor: '#ff9999',
    fillOpacity: 0,
  })

  const handleExport = async (format) => {
    const element = document.getElementById('logo-preview')
    if (!element) return

    const originalBorder = element.style.border
    const originalBackground = element.style.backgroundColor

    try {
      element.style.border = 'none'
      element.style.backgroundColor = 'transparent'

      let dataUrl
      const exportOptions = {
        backgroundColor: null, 
      }

      if (format === 'png') {
        dataUrl = await toPng(element, {
          ...exportOptions,
          pixelRatio: 2, 
        })
      } else { 
        dataUrl = await toSvg(element, exportOptions)
      }
      
      const link = document.createElement('a')
      link.download = `logo.${format}`
      link.href = dataUrl
      link.click()

    } catch (error) {
      console.error('Export failed:', error)
      alert('Sorry, the logo export failed. Please try again.') 
    } finally {
      element.style.border = originalBorder
      element.style.backgroundColor = originalBackground
    }
  }

  return (
    <AppContainer>
      {/* Left Column */}
      <LeftSidebar>
        <IconPicker onSelectIcon={setSelectedIcon} />
      </LeftSidebar>
      
      {/* Center Column */}
      <CanvasArea>
        <LogoPreview 
          icon={selectedIcon} 
          settings={styleSettings} 
        />
      </CanvasArea>
      
      {/* Right Column */}
      <RightSidebar>
        <StyleControls 
          settings={styleSettings} 
          onSettingsChange={setStyleSettings} 
        />
        <ExportButtonContainer>
          <ExportButton onClick={() => handleExport('png')}>
            Export as PNG
          </ExportButton>
          <ExportButton onClick={() => handleExport('svg')}>
            Export as SVG
          </ExportButton>
        </ExportButtonContainer>
      </RightSidebar>
    </AppContainer>
  )
}

export default App
