export const BelizzeEmbeddedLogo = () => {
  // Cor dourada da marca Belizze
  const goldColor = "#D4B67B";
  
  return (
    <div className="flex items-center">
      <svg width="320" height="50" viewBox="0 0 320 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Círculo com B */}
        <circle cx="20" cy="25" r="19" stroke={goldColor} strokeWidth="1" fill="none" />
        <path d="M12 15H18C21 15 23 17 23 20C23 22 21 24 19 24C21 24 23 26 23 28C23 31 21 33 18 33H12V15Z" fill={goldColor} />
        <path d="M8 20L12 16L16 20L12 24L8 20Z" fill={goldColor} />
        
        {/* BELIZZE texto */}
        <path d="M40 15H46C49 15 51 17 51 20C51 22 49 24 47 24C49 24 51 26 51 28C51 31 49 33 46 33H40V15Z" fill={goldColor} />
        <path d="M55 15H70V19H60V22H68V26H60V29H70V33H55V15Z" fill={goldColor} />
        <path d="M75 15H80V29H90V33H75V15Z" fill={goldColor} />
        <path d="M95 15H100V33H95V15Z" fill={goldColor} />
        <circle cx="97.5" cy="10" r="2" fill={goldColor} />
        <path d="M105 15H120V19H110L120 29V33H105V29H115L105 19V15Z" fill={goldColor} />
        <path d="M125 15H140V19H130L140 29V33H125V29H135L125 19V15Z" fill={goldColor} />
        <path d="M145 15H160V19H150V22H158V26H150V29H160V33H145V15Z" fill={goldColor} />
        <path d="M165 15H180V19H170V22H178V26H170V29H180V33H165V15Z" fill={goldColor} />
        <path d="M185 15H200V19H190V22H198V26H190V29H200V33H185V15Z" fill={goldColor} />
      </svg>
    </div>
  );
};
