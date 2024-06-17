export const AppLogo = ({ fontSize }) => {
  return (
    <div className="flex">
      <h1 className={`${fontSize} font-normal`}>Sci</h1>
      <h1
        className={`${fontSize} font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent`}
      >
        Pro
      </h1>
    </div>
  );
};
