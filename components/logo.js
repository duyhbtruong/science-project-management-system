export const AppLogo = ({ fontSize }) => {
  return (
    <>
      <h1 className={`${fontSize} font-normal`}>Sci</h1>
      <h1
        className={`${fontSize} bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent`}
      >
        Pro
      </h1>
    </>
  );
};
