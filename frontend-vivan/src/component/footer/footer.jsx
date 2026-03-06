import React from "react";
import { Link, NavLink } from "react-router-dom";
import "../footer/footer.css";
import logo from "../../assets/images/logo.png";
import instagram from "../../assets/images/instagram.png";
import facebook from "../../assets/images/facebook.png";
import linkedin from "../../assets/images/linkedin.png";
import twitter from "../../assets/images/twitter.png";
import telephone from "../../assets/images/telephone.png";
import mail from "../../assets/images/mail.png";
import location from "../../assets/images/location-bk.png";

const Footer = ({ data }) => {
  return (
    <footer className="bg-white p-40">
      <div className="container">
        <div className="row">
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 mb-lg-0 mb-32">
            <Link to="/" className="flogo">
              <img src={logo} alt="Vivan Logo" className="mb-16" />
            </Link>
            <p className="dark-gray mb-16">
              Your trusted travel partner: Vivan Travels provides seamless
              Flight, Visas, Ok to boards, Package and travel services, ensuring
              unforgettable journeys.
            </p>
            {/* <h6 className="lightest-black mb-8">Subscribe to our special offers</h6>
                        <form method="post" action="/subscribe">
                            <input type="email" className="form-control" placeholder="Email address" name="email" required />
                            <button type="submit" className="subscribe">Subscribe</button>
                        </form> */}
          </div>

          <div className="col-xl-2 col-lg-2 col-md-6 col-6 mb-lg-0 mb-32">
            <h4 className="light-black mb-24">Useful Links</h4>
            <ul className="unstyled">
              {/* <li className="mb-12"><Link to="/" className="light-black">Home</Link></li>
                            <li className="mb-12"><Link to="/about-us" className="light-black">About</Link></li>
                            <li className="mb-12"><Link to="/Contact-us" className="light-black">Contact Us</Link></li>
                            <li className="mb-12"><Link to="/privacy-policy" className="light-black">Privacy Policy</Link></li> */}
              <li className="mb-12">
                <NavLink exact to="/" activeClassName="active">
                  Home
                </NavLink>
              </li>
              <li className="mb-12">
                <NavLink to="/flight-listing" activeClassName="active">
                  Flight
                </NavLink>
              </li>
              <li className="mb-12">
                <NavLink to="/about-us" activeClassName="active">
                  About
                </NavLink>
              </li>
              <li className="mb-12">
                <NavLink to="/Contact-us" activeClassName="active">
                  Contact
                </NavLink>
              </li>
              <li className="mb-12">
                <NavLink to="/privacy-policy" activeClassName="active">
                  Privacy Policy
                </NavLink>
              </li>
              <li className="mb-12">
                <NavLink to="/terms-and-condition" activeClassName="active">
                  Terms And Condition
                </NavLink>
              </li>
              <li className="mb-12">
                <NavLink to="/refund-policy" activeClassName="active">
                  Refund Policy
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
            <h4 className="light-black mb-16">Contact Us</h4>
            <ul className="unstyled">
              <li className="mb-8">
                <img src={location} alt="Location Icon" />
                &nbsp;&nbsp;{data.address || ""}
              </li>
              <li className="mb-8 h4 color-primary">
                <a href={`tel:${data.support_no}`}>
                  {" "}
                  <img src={telephone} alt="Phone Icon" />
                  &nbsp;&nbsp;{data.support_no}
                </a>
              </li>
              <li className="mb-24">
                <a href={"mailto:" + data.support_email}>
                  <img src={mail} alt="Email Icon" />
                  &nbsp;&nbsp;{data.support_email}
                </a>
              </li>
            </ul>
            <div className="social-link mb-32">
              <h6 className="light-black mb-8">Follow Us!</h6>
              <ul className="unstyled">
                <li>
                  <a href="#" className="active">
                    <img src={instagram} alt="Instagram" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img src={facebook} alt="Facebook" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img src={linkedin} alt="LinkedIn" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img src={twitter} alt="Twitter" />
                  </a>
                </li>
              </ul>
            </div>
            {/* <p className="light-black">
                ©{new Date().getFullYear()} Vivan Travels All Rights Reserved.
              </p> */}
          </div>
        </div>

        <p className="light-black">
          ©{new Date().getFullYear()} Vivan Travels All Rights Reserved.
          <a
            href="https://soumyaitsolution.com/"
            target="_blank"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            {" "}
            Designed & Developed by Soumya IT Solution
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
