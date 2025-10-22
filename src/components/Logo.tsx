export const Logo = () => {
  return (
    <div className="flex items-center h-20">
      <img
        src="/belizze-logo-full.png"
        alt="Clínica Belizze"
        className="h-full w-auto select-none max-w-[240px]"
        style={{ filter: 'brightness(0.9)' }}
        draggable={false}
      />
    </div>
  );
};
