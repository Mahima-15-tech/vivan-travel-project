import React from 'react';
import { useLocation } from 'react-router-dom';

const MenuIItem = ({ name, link, icon = null }) => {
  const location = useLocation();
  const isActive = location.pathname === link;

  return (
    <li className={`navbar-vertical-aside-has-menu ${isActive ? 'active' : ''}`}>
      <a
        className="js-navbar-vertical-aside-menu-link nav-link"
        title={name}
        href={link}
      >
        <i className={icon || "tio-home-vs-1-outlined nav-icon"}></i>
        <span className="text-truncate">
          {name}
        </span>
      </a>
    </li>
  );
};




export default MenuIItem;