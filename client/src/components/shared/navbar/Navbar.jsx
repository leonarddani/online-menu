// src/components/Navbar.jsx
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import bird from '../../../assets/img/bird.png';
import NavbarButton from '../navbar/NavbarButton';

const Navbar = () => {
  const mainLinks = [
    { path: "/", label: "Home" },
    { path: "/table", label: "Table" },
  ];

 

  return (
    <nav className="bg-green-900 text-black px-6 py-4">
      <div className="flex flex-col gap-4">
        {/* Logo + Teksti */}
        <div className="flex items-center gap-3">
          <Link to="/">
            <img src={bird} alt="logo" className="h-10 w-13" />
          </Link>
          <h1 className="font-serif text-2xl bg-gradient-to-r from-yellow-700 to-yellow-400 bg-clip-text text-transparent">
            MOXXA CAFFE
          </h1>
        </div>

        {/* Linket */}
        <div className="flex justify-between w-full items-center">
          {/* Main links (left side) */}
          <ul className="flex gap-6">
            {mainLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    isActive
                      ? "text-yellow-600 font-semibold"
                      : "text-gray-300 font-normal hover:text-white"
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

        </div>
        <NavbarButton />
      </div>
    </nav>
  );
};

export default Navbar;
