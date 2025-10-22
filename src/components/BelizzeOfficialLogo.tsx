import { useSupabaseImage } from "@/hooks/useSupabaseImage";

export const BelizzeOfficialLogo = () => {
  const { imageUrl: logoUrl } = useSupabaseImage('belizze-logo-full.png', '/belizze-logo-full.png');
  
  return (
    <div className="flex items-center">
      <img 
        src={logoUrl} 
        alt="Clínica Belizze" 
        className="h-24 md:h-28 w-auto"
        style={{ maxWidth: '500px' }}
      />
    </div>
  );
};
