export const BackdropFilter: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="backdrop-filter backdrop-blur-[10px]">
      {children}
    </div>
  );
};
