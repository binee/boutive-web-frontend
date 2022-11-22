import React from 'react';
import './Footer.css';
import { FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';

const Footer = () => (
  <div className="Footer">
    <h3> Give us a follow! </h3>
    <div className="Social-follow-links">
        <a href="https://instagram.com/helloboutive" target="_blank"><FaInstagram className="Social-follow-icons"/></a>
        <a href="https://facebook.com/boutive" target="_blank"><FaFacebook className="Social-follow-icons"/></a>
        <a href="https://twitter.com/helloboutive" target="_blank"><FaTwitter className="Social-follow-icons"/></a>
    </div>
  </div>
);



export default Footer;
