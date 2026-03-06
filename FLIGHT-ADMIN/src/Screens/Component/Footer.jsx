import React from 'react';
const Footer = () => {
  return (
    <div className="footer">
      <div className="row justify-content-between align-items-center">
        <div className="col-lg-4 mb-3 mb-lg-0">
          <p className="font-size-sm mb-0 title-color text-center text-lg-left">
            ©{" "}
            <span className="d-none d-sm-inline-block">Copyright vivan travels @{new Date().getFullYear()}</span>
          </p>
        </div>
        <div className="col-lg-8">
          <div className="d-flex justify-content-center justify-content-lg-end">
            {/* <ul class="list-inline list-footer-icon justify-content-center justify-content-lg-start mb-0">
              <li class="list-inline-item">
                <a
                  class="list-separator-link"
                  href="https://newgrocery.readytouse.in/admin/business-settings/web-config"
                >
                  <i class="tio-settings"></i>
                  Business Setup
                </a>
              </li>
              <li class="list-inline-item">
                <a
                  class="list-separator-link"
                  href="https://newgrocery.readytouse.in/admin/profile/update/1"
                >
                  <i class="tio-user"></i>
                  Profile
                </a>
              </li>
              <li class="list-inline-item">
                <a
                  class="list-separator-link"
                  href="https://newgrocery.readytouse.in/admin/dashboard"
                >
                  <i class="tio-home-outlined"></i>
                  Home
                </a>
              </li>
            </ul> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;