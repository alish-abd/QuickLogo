import { useState, useEffect } from 'react'
import styled from 'styled-components'
import IconPicker from './components/IconPicker'
import StyleControls from './components/StyleControls'
import LogoPreview from './components/LogoPreview'
import Layout from './components/Layout'
import { toPng, toSvg } from 'html-to-image'

const ExportButtonContainer = styled.div`
  margin-top: auto;
  padding-top: 20px;
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

// Function to get initial settings based on screen width
const getInitialSettings = (isMobile) => ({
  layoutType: 'icon-text',
  size: isMobile ? 80 : 140,
  padding: isMobile ? 12 : 20,
  rotate: 0,
  backgroundColor: '#ff9800',
  containerBorderWidth: 0,
  containerBorderColor: '#000000',
  containerBorderRadius: 20,
  iconBorderWidth: 1.4,
  iconBorderColor: '#000000',
  fillOpacity: 0,
  fillColor: '#000000',
  logoText: 'mockster',
  fontFamily: 'Inter',
  fontSize: isMobile ? 32 : 58,
  fontWeight: '600',
  textColor: '#000000',
  textIconGap: isMobile ? 8 : 12,
})

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 724)
  const [selectedIcon, setSelectedIcon] = useState(null)
  const [selectedIconName, setSelectedIconName] = useState('')
  const [settings, setSettings] = useState(getInitialSettings(isMobile))

  // Update settings when screen size changes
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 724
      if (mobile !== isMobile) {
        setIsMobile(mobile)
        setSettings(prev => ({
          ...prev,
          size: mobile ? 80 : 140,
          padding: mobile ? 12 : 20,
          fontSize: mobile ? 32 : 58,
          textIconGap: mobile ? 8 : 12,
        }))
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMobile])

  const handleIconSelect = (icon, name, isFilled) => {
    if (icon) {
      setSelectedIcon(icon)
      setSelectedIconName(name)
      setSettings(prev => ({
        ...prev,
        iconBorderWidth: isFilled ? 0 : 1.4,
        ...(isFilled ? { fillOpacity: 1 } : {})
      }))
    }
  }

  const handleDownload = async (format) => {
    const element = document.getElementById('logo-preview')
    if (!element) return

    try {
      const dataUrl = format === 'png' 
        ? await toPng(element, { pixelRatio: 3 })
        : await toSvg(element)
      
      const link = document.createElement('a')
      link.download = `logo.${format}`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  return (
    <Layout
      leftSidebar={
        <IconPicker
          selectedIcon={selectedIcon}
          onSelectIcon={handleIconSelect}
        />
      }
      canvas={
        <LogoPreview
          icon={selectedIcon}
          settings={settings}
          iconName={selectedIconName}
        />
      }
      rightSidebar={
        <>
          <StyleControls
            settings={settings}
            onSettingsChange={setSettings}
          />
          <ExportButtonContainer>
            <ExportButton onClick={() => handleDownload('png')}>
              Download PNG
            </ExportButton>
            <ExportButton onClick={() => handleDownload('svg')}>
              Download SVG
            </ExportButton>
          </ExportButtonContainer>
        </>
      }
    />
  )
}

export default App
