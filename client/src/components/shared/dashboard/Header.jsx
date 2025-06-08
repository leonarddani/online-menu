const Header = ({ title, subtitle, children }) => {
  return (
    <div  className="flex md:flex-row md:items-center items-start md:justify-between py-4">
     <div>
      <h1 className="text-primary text-2xl font-bold">{title}</h1>

      {subtitle && (<p className="text-muted-foreground">{subtitle}</p>)}
      </div>
      <div>
        {children}
        
        </div>
    </div>
      
  )
}

export default Header