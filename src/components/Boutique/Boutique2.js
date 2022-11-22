import React from 'react';
import './Boutique2.css';

const Boutique = () => (
  <div className="Boutique">

    <div className="Boutique-hero-image"></div>

    <div className="Flexer-center">

      <div className="Boutique-logo"></div>

      <div className="Boutique-info">

        <div className="Flexer-center">
          <h1>Ivy & Lime</h1>
          <button>Follow</button>
        </div>

        <div className="Boutique-description">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat..</p>
        </div>

        <div className="Boutique-locations">
          <p>Lehi, UT - Portland, OR - Huntington Beach, CA</p>
        </div>

      </div>
    </div>

  </div>
);



export default Boutique;
