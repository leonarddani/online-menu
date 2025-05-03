import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar"

const navLinkStyle = ({ isActive }) =>
  isActive
    ? "w-full  h-full text-yellow-600 font-semibold"
    : "w-full h-full text-black  hover:text-white font-normal transition-colors duration-200"


const NavbarButton = () => {
  return (
    <div className='fixed top-0 left-1/2 transform -translate-x-1/2 bg-green-900 py-4 shadow-md z-[200] w-[300px] flex justify-center'>
      <Menubar className='bg-transparent border-none shadow-none'>
        <MenubarMenu>
          <MenubarTrigger>Menu</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <NavLink to="/menu" className={navLinkStyle}>View Menu</NavLink>
            </MenubarItem>
            <MenubarItem>
              <NavLink to="/contact" className={navLinkStyle}>Contact</NavLink>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Reservation</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <NavLink to="/reserve" className={navLinkStyle}>Table Reservation</NavLink>
            </MenubarItem>
            <MenubarItem>
              <NavLink to="/status" className={navLinkStyle}>Reservation Status</NavLink>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  )
}

export default NavbarButton
