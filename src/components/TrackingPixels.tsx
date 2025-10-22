import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

interface TrackingPixelsProps {
  location?: 'head' | 'body';
}

const TrackingPixels = ({ location = 'head' }: TrackingPixelsProps) => {
  const [pixelCodes, setPixelCodes] = useState<string[]>([]);

  useEffect(() => {
    // Carregar pixels do localStorage
    const loadPixels = () => {
      const pixels: string[] = [];
      
      if (location === 'head') {
        // Carregar Google Analytics
        const googleData = localStorage.getItem('belizze_google_pixel');
        if (googleData) {
          try {
            const data = JSON.parse(googleData);
            if (data.active && data.code) {
              pixels.push(data.code);
            }
          } catch (e) {
            console.error('Erro ao carregar Google Pixel:', e);
          }
        }
        
        // Carregar Facebook Pixel
        const facebookData = localStorage.getItem('belizze_facebook_pixel');
        if (facebookData) {
          try {
            const data = JSON.parse(facebookData);
            if (data.active && data.code) {
              pixels.push(data.code);
            }
          } catch (e) {
            console.error('Erro ao carregar Facebook Pixel:', e);
          }
        }
      }
      
      setPixelCodes(pixels);
    };
    
    loadPixels();
    
    // Adicionar um event listener para atualizar os pixels quando o localStorage mudar
    const handleStorageChange = () => loadPixels();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location]);

  if (pixelCodes.length === 0) {
    return null;
  }

  return (
    <Helmet>
      {pixelCodes.map((code, index) => (
        <script key={`${location}-pixel-${index}`} type="text/javascript" dangerouslySetInnerHTML={{ __html: code }} />
      ))}
    </Helmet>
  );
};

export default TrackingPixels;
