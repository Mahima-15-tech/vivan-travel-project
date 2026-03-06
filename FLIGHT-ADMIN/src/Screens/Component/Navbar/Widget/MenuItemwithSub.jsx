import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MenuItemwithSub = ({ name, link, icon = null, submenu = [] }) => {
  const [isSubMenuVisible, setIsSubMenuVisible] = useState(false);
  const location = useLocation();

  const toggleSubMenu = () => {
    setIsSubMenuVisible(!isSubMenuVisible);
  };

  const isSubMenuActive = submenu.some(item => location.pathname === item.link);

  useEffect(() => {
    if (isSubMenuActive) {
      setIsSubMenuVisible(true);
    }
  }, [isSubMenuActive]);

  return (
    <li className={`navbar-vertical-aside-has-menu`}>
      <a 
        className="js-navbar-vertical-aside-menu-link nav-link nav-link-toggle" 
        href="#!" // Use "#" instead of "javascript:void(0);" for accessibility
        title={name}
        onClick={toggleSubMenu}
      >
        <i className={icon || "tio-home-vs-1-outlined nav-icon"}></i>
        <span className="navbar-vertical-aside-mini-mode-hidden-elements text-truncate">
          {name}
        </span>
      </a>
      <ul 
        className="js-navbar-vertical-aside-submenu nav nav-sub" 
        style={{ display: isSubMenuVisible ? 'block' : 'none' }}
      >
        {submenu.map((item, index) => (
          <li className={`nav-item${location.pathname === item.link ? ' active' : ''}`} key={index}>
            <a 
              className="nav-link" 
              href={item.link} 
              title={item.name}
            >
              <span className="tio-circle nav-indicator-icon"></span>
              <span className="text-truncate">
                {item.name}             
              </span>
            </a>
          </li>
        ))}
      </ul>
    </li>
  );
};

export default MenuItemwithSub;
