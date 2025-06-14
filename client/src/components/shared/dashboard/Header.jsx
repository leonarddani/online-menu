const Header = ({ title, subtitle, children }) => {
  return (
    <div className="flex md:flex-row md:items-center items-start md:justify-between py-4">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-700 to-yellow-400 bg-clip-text text-transparent">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-1 bg-gradient-to-r from-yellow-700 to-yellow-400 bg-clip-text text-transparent">
            {subtitle}
          </p>
        )}
      </div>

      <div>
        {children}
      </div>
    </div>
  );
};

export default Header;
