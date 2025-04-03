import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import IconPicker from './components/IconPicker'
import StyleControls from './components/StyleControls'
import LogoPreview from './components/LogoPreview'
import Layout from './components/Layout'
import { toPng, toSvg } from 'html-to-image'
import ReactDOM from 'react-dom/client'

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
  logoText: 'logotext',
  fontFamily: 'Inter',
  fontSize: isMobile ? 28 : 58,
  fontWeight: '600',
  textColor: '#000000',
  textIconGap: isMobile ? 8 : 12,
})

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 724)
  const [selectedIcon, setSelectedIcon] = useState(null)
  const [selectedIconName, setSelectedIconName] = useState('')
  const [settings, setSettings] = useState(getInitialSettings(isMobile))
  const [activeTab, setActiveTab] = useState('icon')
  const [hasSelectedIconBefore, setHasSelectedIconBefore] = useState(false)
  const logoContainerRef = useRef(null)

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
          fontSize: mobile ? 28 : 58,
          textIconGap: mobile ? 8 : 12,
        }))
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMobile])

  const handleIconSelect = (icon, name, isFilled) => {
    if (icon) {
      setSelectedIcon(() => icon)
      setSelectedIconName(name)
      setSettings(prev => ({
        ...prev,
        iconBorderWidth: isFilled ? 0 : 1.4,
        ...(isFilled ? { fillOpacity: 1 } : {})
      }))
      
      // Auto-switch to settings tab after first icon selection (mobile only)
      if (isMobile && !hasSelectedIconBefore) {
        setTimeout(() => {
          setActiveTab('settings')
          setHasSelectedIconBefore(true)
        }, 800) // Short delay to let the user see their selection
      }
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
        <>
          <LogoPreview
            icon={selectedIcon}
            settings={settings}
            iconName={selectedIconName}
            logoContainerRef={logoContainerRef}
          />
          {isMobile && selectedIcon && activeTab === 'icon' && (
            <div style={{
              position: 'absolute',
              bottom: 5,
              right: 10,
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }} onClick={() => setActiveTab('settings')}>
              Customize →
            </div>
          )}
          
          {!isMobile && selectedIcon && (
            <div style={{
              position: 'absolute',
              right: -10,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              animation: 'pulse 2s infinite',
              zIndex: 10,
              background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 30%)',
              padding: '12px 15px 12px 25px',
              borderRadius: '25px 0 0 25px',
              boxShadow: '-2px 2px 10px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(2px)',
              cursor: 'pointer'
            }} onClick={() => setActiveTab('settings')}>
              <div style={{
                color: '#007bff',
                fontWeight: 'bold',
                fontSize: '15px',
                padding: '4px 0',
                textAlign: 'right'
              }}>
                Customize<br/>your logo
              </div>
              <div style={{
                color: '#007bff',
                fontSize: '28px',
                fontWeight: 'bold',
                marginTop: '2px',
                textShadow: '0 1px 3px rgba(0,0,0,0.1)',
                animation: 'arrow-bounce 1s infinite'
              }}>
                →
              </div>
            </div>
          )}
        </>
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
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  )
}

export default App
