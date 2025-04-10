import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { toPng } from 'html-to-image'; // Import the toPng function

const MainContainer = styled.div`
  display: flex;
  gap: 30px;
  height: 100dvh; /* Use full viewport height */
  padding: 20px;
  padding-top: 70px; /* Increased top padding to clear absolute nav */
  box-sizing: border-box; /* Include padding in height calculation */
  
  /* Dotted background */
  background-color: #f8f8f8;
  background-image: radial-gradient(#cccccc 1px, transparent 1px);
  background-size: 15px 15px;

  @media (max-width: 768px) {
    flex-direction: column;
    height: calc(100dvh - 100px);
    padding: 15px;
    padding-top: 60px; /* Adjust top padding for mobile if needed */
    padding-bottom: 70px; /* Space for bottom tabs */
  }
`;

const LeftPanel = styled.div`
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: white; /* Keep white background for clarity */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
  height: 100%; /* Make panel fill available height */
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 100%;
    order: 2; /* Move settings below image on mobile */
    height: 50vh; /* Fixed height on mobile */
    max-height: 50vh;
    margin-bottom: 60px; /* Add space for the bottom tabs */
  }
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Removed background styles - Now transparent */
  border-radius: 10px;
  overflow: hidden; 
  /* Removed padding - handled by MainContainer and PreviewContainer */
  position: relative; 
  height: 100%; /* Make panel fill available height */

  @media (max-width: 768px) {
    order: 1; /* Move image preview to top on mobile */
    min-height: 300px;
    max-height: 40vh; /* Limit height on mobile */
    width: 100%;
    margin-bottom: 20px; /* Add space between image and settings */
  }
`;

const UploadArea = styled.div`
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.isDragging ? '#f0f7ff' : '#f8f9fa'};
  margin-bottom: 10px; /* Add some space below upload */

  &:hover {
    border-color: #2196f3;
    background: #eaf4ff;
  }
`;

const UploadText = styled.p`
  margin: 0;
  color: #666;
  font-size: 14px;
`;

const PreviewContainer = styled.div`
  /* Size itself based on aspect ratio */
  width: auto; 
  height: auto;
  max-width: 100%; 
  max-height: 100%; 
  aspect-ratio: ${props => props.aspectRatio || '1 / 1'}; 
  
  /* Apply background */
  background: ${props => props.gradient};
  
  /* Padding is applied here, background shows through */
  padding: ${props => props.padding}px;
  
  /* Center the image within the padding */
  display: flex; 
  align-items: center;
  justify-content: center;
  overflow: visible; /* Allow image shadow to show */
  transition: background 0.3s ease, padding 0.3s ease;
  
  @media (max-width: 768px) {
    max-height: calc(40vh - 20px); /* Limit height on mobile */
  }
`;

const PreviewImage = styled.img`
  display: block;
  /* Remove fixed width/height */
  /* width: 100%; <-- REMOVED */
  /* height: 100%; <-- REMOVED */
  
  /* Constrain image size to fit within the container's content box */
  max-width: 100%; 
  max-height: 100%; 
  
  /* Keep object-fit just in case, though max-width/height usually handles it */
  object-fit: contain; 
  
  /* Controlled border-radius */
  border-radius: ${props => props.borderRadius}px;
  
  /* Controlled shadow */
  box-shadow: ${props => 
    props.shadowIntensity > 0 
      ? `0 ${props.shadowIntensity}px ${props.shadowIntensity * 2}px rgba(0, 0, 0, ${Math.min(0.5, props.shadowIntensity / 40)})` 
      : 'none'};
      
  transition: border-radius 0.3s ease, box-shadow 0.3s ease;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1; /* Take up available space */
  overflow-y: auto; /* Allow scrolling for overflow content */
  
  @media (max-width: 768px) {
    max-height: calc(100% - 20px); /* Account for any padding */
  }
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #555;
  font-size: 13px;
  font-weight: 500;
`;

const GradientGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 10px;
  padding-right: 5px;

  @media (min-width: 768px) {
    max-height: 400px;
    overflow-y: auto;
  }

`;

const GradientPreviewBox = styled.div`
  height: 60px;
  border-radius: 6px;
  cursor: pointer;
  background: ${props => props.value};
  background-size: cover;
  background-position: center;
  border: 2px solid ${props => props.isSelected ? '#2196f3' : '#eee'};
  transition: border-color 0.2s ease;
  position: relative;

  &:hover {
    border-color: ${props => props.isSelected ? '#2196f3' : '#ccc'};
  }

  &::after {
    content: '✔';
    display: ${props => props.isSelected ? 'block' : 'none'};
    position: absolute;
    top: 2px;
    right: 4px;
    color: white;
    font-size: 12px;
    background-color: #2196f3;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    box-shadow: 0 0 3px rgba(0,0,0,0.2);
  }
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Slider = styled.input`
  width: 100%;
  cursor: pointer;
  accent-color: #2196f3;
`;

const SliderValue = styled.span`
  font-size: 13px;
  color: #555;
  min-width: 30px;
  text-align: right;
`;

const PlaceholderText = styled.div`
  color: #999;
  font-size: 16px;
`;

// Add export button styling
const ExportButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 18px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-top: 15px;
  width: 100%;

  &:hover {
    background-color: #1976d2;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.98);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

// Add mobile tab container styling
const MobileTabContainer = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    width: 100%;
    border-top: 1px solid #ddd;
    position: fixed;
    bottom: 0;
    left: 0;
    background: white;
    z-index: 100;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }
`;

const MobileTab = styled.button`
  flex: 1;
  padding: 12px;
  background: ${props => props.active ? '#f0f0f0' : 'white'};
  border: none;
  border-top: 2px solid ${props => props.active ? '#2196f3' : 'transparent'};
  color: ${props => props.active ? '#333' : '#666'};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f0f0f0;
  }
`;

// Section containers for mobile tabs
const GradientSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto; /* Allow scrolling within each section */
  height: 100%;
  
  @media (max-width: 768px) {
    display: ${props => props.activeTab === 'gradients' ? 'flex' : 'none'};
    height: calc(100% - 140px);
  }
`;

const SettingsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto; /* Allow scrolling within each section */
  
  @media (max-width: 768px) {
    display: ${props => props.activeTab === 'settings' ? 'flex' : 'none'};
    height: calc(100% - 140px);
  }
`;

// Expanded collection of complex mesh gradients
const predefinedGradients = [
  // Original gradients
  { name: 'Sunset', value: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)' },
  { name: 'Ocean', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Forest', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { name: 'Sunrise', value: 'linear-gradient(135deg, #ff512f 0%, #f09819 100%)' },
  { name: 'Twilight', value: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)' },
  
  // Complex mesh gradients
  { name: 'Mesh Blue', value: 'radial-gradient(circle at 50% 50%, #3f87a6, #ebf8e1), radial-gradient(circle at 85% 15%, #f69d3c, rgba(0,0,0,0)) 50%' },
  { name: 'Neon Mesh', value: 'linear-gradient(45deg, #ff00cc, #333399), radial-gradient(circle at 30% 40%, #ff0055, rgba(0,0,0,0)), radial-gradient(circle at 70% 60%, #00feca, rgba(0,0,0,0))' },
  { name: 'Aurora', value: 'linear-gradient(125deg, #00ff57 0%, #0055ff 100%), radial-gradient(circle at 10% 20%, rgba(0, 255, 144, 0.8), rgba(0,0,0,0)), radial-gradient(circle at 90% 80%, rgba(0, 173, 255, 0.8), rgba(0,0,0,0))' },
  { name: 'Candy', value: 'linear-gradient(120deg, #f093fb 0%, #f5576c 100%), radial-gradient(circle at 30% 30%, rgba(255, 255, 126, 0.7), rgba(0,0,0,0)), radial-gradient(circle at 70% 70%, rgba(77, 208, 225, 0.7), rgba(0,0,0,0))' },
  { name: 'Cosmic', value: 'linear-gradient(180deg, #2b5876 0%, #4e4376 100%), radial-gradient(circle at 25% 25%, rgba(255, 170, 0, 0.5), rgba(0,0,0,0)), radial-gradient(circle at 75% 75%, rgba(0, 217, 255, 0.5), rgba(0,0,0,0))' },
  { name: 'Peachy', value: 'linear-gradient(45deg, #ee9ca7 0%, #ffdde1 100%), radial-gradient(circle at 20% 80%, rgba(255, 193, 7, 0.6), rgba(0,0,0,0))' },
  { name: 'Electric', value: 'linear-gradient(20deg, #3d72b4 0%, #525252 100%), radial-gradient(circle at 60% 30%, rgba(105, 240, 174, 0.8), rgba(0,0,0,0)), radial-gradient(circle at 20% 80%, rgba(202, 80, 192, 0.8), rgba(0,0,0,0))' },
  { name: 'Emerald Mesh', value: 'radial-gradient(circle at 50% 50%, #009245, #FCEE21), radial-gradient(circle at 80% 20%, rgba(0, 169, 126, 0.8), rgba(0,0,0,0))' },
  { name: 'Dusk', value: 'linear-gradient(200deg, #3b41c5 0%, #a981bb 49%, #ffc8a9 100%), radial-gradient(circle at 10% 90%, rgba(255, 166, 158, 0.7), rgba(0,0,0,0))' },
  { name: 'Tropical', value: 'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%), radial-gradient(circle at 40% 60%, rgba(253, 200, 48, 0.6), rgba(0,0,0,0))' },
  { name: 'Velvet', value: 'linear-gradient(90deg, #4b6cb7 0%, #182848 100%), radial-gradient(circle at 30% 30%, rgba(222, 98, 98, 0.5), rgba(0,0,0,0))' },
  { name: 'Northern', value: 'linear-gradient(to bottom, #4facfe 0%, #00f2fe 100%), radial-gradient(circle at 70% 20%, rgba(250, 255, 129, 0.7), rgba(0,0,0,0))' },
  
  // New advanced gradients
  { name: 'Mojave', value: 'conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 120deg, #e92a67 240deg, #2a8af6 360deg)' },
  { name: 'Lush', value: 'linear-gradient(135deg, #24ff72 0%, #9a4eff 100%), radial-gradient(circle at 15% 85%, rgba(255, 122, 23, 0.4), transparent 50%)' },
  { name: 'Cherry', value: 'linear-gradient(25deg, #ff758c 0%, #ff7eb3 100%), radial-gradient(circle at 80% 10%, rgba(255, 205, 68, 0.5), transparent 50%)' },
  { name: 'Mystic', value: 'linear-gradient(230deg, #7c3aed 0%, #3f87f5 100%), radial-gradient(circle at 25% 50%, rgba(255, 187, 255, 0.7), transparent 40%)' },
  { name: 'Cyber', value: 'linear-gradient(200deg, #0fffc1 0%, #7e0fff 100%), radial-gradient(circle at 60% 70%, rgba(255, 255, 0, 0.3), transparent 50%)' },
  { name: 'Silk', value: 'linear-gradient(45deg, #ffe8d6 0%, #2a2a72 100%), radial-gradient(circle at 30% 40%, rgba(255, 92, 176, 0.5), transparent 60%)' },
  { name: 'Nebula', value: 'linear-gradient(180deg, #330867 0%, #30cfd0 100%), radial-gradient(circle at 70% 20%, rgba(255, 102, 0, 0.4), transparent 50%)' },
  { name: 'Vapor', value: 'linear-gradient(270deg, #ff6ad5 0%, #a0ffe3 100%), radial-gradient(circle at 60% 30%, rgba(255, 255, 255, 0.6), transparent 70%)' },
  { name: 'Rainbow', value: 'linear-gradient(to right, #ff0000, #ff8000, #ffff00, #00ff00, #00ffff, #0000ff, #8000ff)' },
  { name: 'Blossom', value: 'linear-gradient(320deg, #ff7c6e 0%, #f5317f 45%, #8a1f93 100%), radial-gradient(circle at 50% 25%, rgba(255, 255, 255, 0.4), transparent 50%)' },
  { name: 'Moonlit', value: 'linear-gradient(135deg, #1e2a78 0%, #5E2563 50%, #841F4A 100%), radial-gradient(circle at 70% 80%, rgba(44, 220, 255, 0.3), transparent 50%)' },
  { name: 'Solar', value: 'linear-gradient(45deg, #FFD770 0%, #FF7A00 50%, #FF0069 100%), radial-gradient(circle at 40% 60%, rgba(255, 255, 255, 0.7), transparent 50%)' },
  { name: 'Retro', value: 'linear-gradient(45deg, #FE5F75 0%, #FC9842 100%), radial-gradient(circle at 30% 70%, rgba(249, 206, 183, 0.8), transparent 50%)' },
  { name: 'Frozen', value: 'linear-gradient(to right, #c9d6ff, #e2e2e2), radial-gradient(circle at 60% 50%, rgba(116, 235, 213, 0.6), transparent 60%)' },
  { name: 'Noir', value: 'linear-gradient(135deg, #090909 0%, #454545 100%), radial-gradient(circle at 40% 30%, rgba(128, 128, 128, 0.4), transparent 60%)' },
  { name: 'Rosegold', value: 'linear-gradient(135deg, #f6d5d5 0%, #ffd1b3 50%, #c99c9c 100%), radial-gradient(circle at 70% 30%, rgba(255, 228, 196, 0.8), transparent 50%)' },
  { name: 'Prism', value: 'conic-gradient(from 90deg at 50% 50%, #f0f, #00f, #0ff, #0f0, #ff0, #f00, #f0f)' },
  { name: 'Atlantis', value: 'linear-gradient(135deg, #1c92d2 0%, #f2fcfe 100%), radial-gradient(circle at 30% 40%, rgba(128, 203, 196, 0.7), transparent 50%)' },
  { name: 'Olive', value: 'linear-gradient(135deg, #414d0b 0%, #727a17 50%, #b5ca5a 100%), radial-gradient(circle at 60% 20%, rgba(212, 232, 156, 0.5), transparent 50%)' },
  { name: 'Breeze', value: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%), radial-gradient(circle at 20% 70%, rgba(184, 235, 255, 0.7), transparent 50%)' },
  
  // Special advanced effects
  { name: 'Waves', value: 'repeating-linear-gradient(45deg, #60efff, #5bcaff 3%, #00ff87 6%, #60efff 9%)' },
  { name: 'Diamonds', value: 'repeating-conic-gradient(from 45deg, #f06, #9f6 50deg, #06f 100deg, #f06 360deg)' },
  { name: 'Geometric', value: 'repeating-linear-gradient(30deg, #50E3C2, #50E3C2 15px, #4FACFE 15px, #4FACFE 30px)' },
  { name: 'Plasma', value: 'radial-gradient(circle at 25% 25%, #ff9500, transparent 40%), radial-gradient(circle at 75% 75%, #0051ff, transparent 40%), radial-gradient(circle at 75% 25%, #7b00ff, transparent 40%), radial-gradient(circle at 25% 75%, #ff00c8, transparent 40%)' },
  { name: 'Noise', value: 'linear-gradient(180deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82)' },
  { name: 'Lava', value: 'linear-gradient(0deg, #F07654, #F5DF2E, #F07654), radial-gradient(circle at 40% 40%, #D10303, transparent 60%)' }
];

// Create a replace image button that appears over the image preview
const ReplaceImageButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  transition: all 0.2s ease;

  &:hover {
    background: white;
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  svg {
    width: 20px;
    height: 20px;
    color: #2196f3;
  }

  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    width: 36px;
    height: 36px;
  }
`;

function ScreenshotBeautifier() {
  const [image, setImage] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [gradient, setGradient] = useState(predefinedGradients[0].value);
  const [padding, setPadding] = useState(40);
  const [borderRadius, setBorderRadius] = useState(8);
  const [shadowIntensity, setShadowIntensity] = useState(10);
  const [isExporting, setIsExporting] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState('gradients');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);

  // Add resize listener to detect mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleImageLoad = (imgSrc) => {
    const img = new Image();
    img.onload = () => {
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
      setImage(imgSrc);
    };
    img.onerror = () => {
      console.error("Error loading image");
      setImage(null);
      setImageSize({ width: 0, height: 0 });
    }
    img.src = imgSrc;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      const reader = new FileReader();
      reader.onload = (e) => handleImageLoad(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      const reader = new FileReader();
      reader.onload = (e) => handleImageLoad(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const aspectRatio = imageSize.width && imageSize.height 
    ? `${imageSize.width} / ${imageSize.height}` 
    : undefined;

  const handleExport = async () => {
    if (!previewRef.current || !image) return;
    
    setIsExporting(true);
    try {
      const dataUrl = await toPng(previewRef.current, { 
        pixelRatio: 3,
        quality: 0.95,
        style: {
          transform: 'scale(1)',
        }
      });
      
      const link = document.createElement('a');
      link.download = `beautified-screenshot-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error exporting image:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleReplaceClick = () => {
    // Ensure the ref is valid before trying to click it
    if (fileInputRef.current) {
      console.log("Clicking file input");
      fileInputRef.current.click();
    } else {
      console.error("File input reference is not available");
    }
  };

  return (
    <MainContainer>
      {/* Reorder for mobile: RightPanel first, then LeftPanel */}
      <RightPanel>
        {/* File input - always include it at component root level */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".png,.jpg,.jpeg"
          onChange={handleFileSelect}
        />
        
        {image ? (
          <>
            <PreviewContainer
              ref={previewRef}
              style={{ background: gradient }}
              padding={padding}
              aspectRatio={aspectRatio} 
            >
              <PreviewImage
                key={image} 
                src={image}
                borderRadius={borderRadius} 
                shadowIntensity={shadowIntensity} 
                alt="Screenshot preview"
              />
            </PreviewContainer>
            
            {/* Add replace image button overlay with explicit handler */}
            <ReplaceImageButton 
              onClick={handleReplaceClick}
              title="Replace image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M2.5 22v-6h6"/>
                <path d="M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
              </svg>
            </ReplaceImageButton>
          </>
        ) : (
          <PlaceholderText>Upload a screenshot to preview</PlaceholderText>
        )}
      </RightPanel>
      
      <LeftPanel>
        {/* Show upload area only if no image is selected */}
        {!image && (
          <UploadArea
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleReplaceClick}
          >
            <UploadText>
              Drag & drop screenshot or click
              <br />
              <small>(.png, .jpg, .jpeg)</small>
            </UploadText>
          </UploadArea>
        )}

        {image && (
          <ControlsContainer>
            {/* Desktop view */}
            {!isMobile && (
              <>
                <ControlGroup>
                  <Label>Gradient Background</Label>
                  <GradientGrid>
                    {predefinedGradients.map((grad) => (
                      <GradientPreviewBox
                        key={grad.name}
                        value={grad.value}
                        isSelected={gradient === grad.value}
                        onClick={() => setGradient(grad.value)}
                        title={grad.name}
                      />
                    ))}
                  </GradientGrid>
                </ControlGroup>

                <ControlGroup>
                  <Label>Padding</Label>
                  <SliderContainer>
                    <Slider
                      type="range"
                      min="0"
                      max="150" 
                      value={padding}
                      onChange={(e) => setPadding(Number(e.target.value))}
                    />
                    <SliderValue>{padding}px</SliderValue>
                  </SliderContainer>
                </ControlGroup>

                <ControlGroup>
                  <Label>Image Border Radius</Label>
                  <SliderContainer>
                    <Slider
                      type="range"
                      min="0"
                      max="50" 
                      value={borderRadius}
                      onChange={(e) => setBorderRadius(Number(e.target.value))}
                    />
                    <SliderValue>{borderRadius}px</SliderValue>
                  </SliderContainer>
                </ControlGroup>

                <ControlGroup>
                  <Label>Image Shadow Intensity</Label>
                  <SliderContainer>
                    <Slider
                      type="range"
                      min="0"
                      max="40" 
                      value={shadowIntensity}
                      onChange={(e) => setShadowIntensity(Number(e.target.value))}
                    />
                    <SliderValue>{shadowIntensity}</SliderValue>
                  </SliderContainer>
                </ControlGroup>
              </>
            )}

            {/* Mobile tabbed view */}
            {isMobile && (
              <>
                <GradientSection activeTab={activeMobileTab}>
                  <ControlGroup>
                    <Label>Gradient Background</Label>
                    <GradientGrid>
                      {predefinedGradients.map((grad) => (
                        <GradientPreviewBox
                          key={grad.name}
                          value={grad.value}
                          isSelected={gradient === grad.value}
                          onClick={() => setGradient(grad.value)}
                          title={grad.name}
                        />
                      ))}
                    </GradientGrid>
                  </ControlGroup>
                </GradientSection>

                <SettingsSection activeTab={activeMobileTab}>
                  <ControlGroup>
                    <Label>Padding</Label>
                    <SliderContainer>
                      <Slider
                        type="range"
                        min="0"
                        max="150" 
                        value={padding}
                        onChange={(e) => setPadding(Number(e.target.value))}
                      />
                      <SliderValue>{padding}px</SliderValue>
                    </SliderContainer>
                  </ControlGroup>

                  <ControlGroup>
                    <Label>Image Border Radius</Label>
                    <SliderContainer>
                      <Slider
                        type="range"
                        min="0"
                        max="50" 
                        value={borderRadius}
                        onChange={(e) => setBorderRadius(Number(e.target.value))}
                      />
                      <SliderValue>{borderRadius}px</SliderValue>
                    </SliderContainer>
                  </ControlGroup>

                  <ControlGroup>
                    <Label>Image Shadow Intensity</Label>
                    <SliderContainer>
                      <Slider
                        type="range"
                        min="0"
                        max="40" 
                        value={shadowIntensity}
                        onChange={(e) => setShadowIntensity(Number(e.target.value))}
                      />
                      <SliderValue>{shadowIntensity}</SliderValue>
                    </SliderContainer>
                  </ControlGroup>
                </SettingsSection>
              </>
            )}

            {/* Export button - in both views */}
            <ExportButton 
              onClick={handleExport}
              disabled={isExporting}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {isExporting ? 'Exporting...' : 'Export PNG'}
            </ExportButton>
          </ControlsContainer>
        )}
      </LeftPanel>

      {/* Mobile tab navigation - only shown on mobile */}
      {isMobile && image && (
        <MobileTabContainer>
          <MobileTab 
            active={activeMobileTab === 'gradients'} 
            onClick={() => setActiveMobileTab('gradients')}
          >
            Gradients
          </MobileTab>
          <MobileTab 
            active={activeMobileTab === 'settings'} 
            onClick={() => setActiveMobileTab('settings')}
          >
            Settings
          </MobileTab>
        </MobileTabContainer>
      )}
    </MainContainer>
  );
}

export default ScreenshotBeautifier; 