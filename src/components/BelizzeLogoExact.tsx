export const BelizzeLogoExact = () => {
  // Cor dourada da marca Belizze
  const goldColor = "#D4B67B";
  
  return (
    <div className="flex items-center">
      <svg width="240" height="50" viewBox="0 0 240 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g fill={goldColor}>
          {/* Círculo com B */}
          <circle cx="20" cy="25" r="19.5" stroke={goldColor} strokeWidth="1" fill="none" />
          <path d="M14 12C14 12 18 12 20 12C23 12 26 15 26 18C26 21 23 24 20 24C23 24 26 27 26 30C26 33 23 36 20 36C18 36 14 36 14 36V12Z" fill={goldColor} />
          
          {/* BELISSE texto */}
          <path d="M50 12H56C59 12 62 15 62 18C62 21 59 24 56 24C59 24 62 27 62 30C62 33 59 36 56 36H50V12Z" fill={goldColor} />
          <path d="M70 12H85V16H75V20H83V24H75V28H85V32H70V12Z" fill={goldColor} />
          <path d="M90 12H95V28H105V32H90V12Z" fill={goldColor} />
          <path d="M110 12H115V32H110V12Z" fill={goldColor} />
          <path d="M125 12H140V16H130L140 28V32H125V28H135L125 16V12Z" fill={goldColor} />
          <path d="M150 12H165V16H155L165 28V32H150V28H160L150 16V12Z" fill={goldColor} />
          <path d="M175 12H190V16H180V20H188V24H180V28H190V32H175V12Z" fill={goldColor} />
        </g>
      </svg>
    </div>
  );
};
