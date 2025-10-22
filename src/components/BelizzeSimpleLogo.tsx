import { useSupabaseImage } from "@/hooks/useSupabaseImage";

export const BelizzeSimpleLogo = () => {
  const { imageUrl: logoUrl } = useSupabaseImage('belizze-logo-full.png', '/belizze-logo-full.png');
  
  return (
    <div className="flex items-center drop-shadow-xl">
      <img 
        src={logoUrl} 
        alt="Clínica Belizze" 
        className="h-10 md:h-12 w-auto"
        style={{ filter: 'brightness(1.5) contrast(1.5)' }}
      />
    </div>
  );
};
