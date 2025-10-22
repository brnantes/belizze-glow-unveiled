export const BelizzeLogo = () => {
  // Cor dourada da marca Belizze
  const goldColor = "#D4B67B";
  
  return (
    <div className="flex items-center">
      <svg width="200" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Círculo com B */}
        <circle cx="20" cy="20" r="19" stroke={goldColor} strokeWidth="1" fill="none" />
        <path d="M15 10H21C24 10 26 12 26 15C26 17 24.5 19 22 19C25 19 27 21 27 24C27 27 24.5 30 21 30H15V10Z" stroke={goldColor} strokeWidth="1" fill="none" />
        
        {/* BELISSE texto */}
        <path d="M45 10H51C54 10 56 12 56 15C56 17 54.5 19 52 19C55 19 57 21 57 24C57 27 54.5 30 51 30H45V10Z" stroke={goldColor} strokeWidth="1" fill="none" />
        <path d="M65 10H80V14H70V18H78V22H70V26H80V30H65V10Z" stroke={goldColor} strokeWidth="1" fill="none" />
        <path d="M85 10H90V26H100V30H85V10Z" stroke={goldColor} strokeWidth="1" fill="none" />
        <path d="M105 10H110V30H105V10Z" stroke={goldColor} strokeWidth="1" fill="none" />
        <path d="M115 10H130V14H120L130 26V30H115V26H125L115 14V10Z" stroke={goldColor} strokeWidth="1" fill="none" />
        <path d="M135 10H150V14H140L150 26V30H135V26H145L135 14V10Z" stroke={goldColor} strokeWidth="1" fill="none" />
        <path d="M155 10H170V14H160V18H168V22H160V26H170V30H155V10Z" stroke={goldColor} strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
};
