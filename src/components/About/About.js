import React from 'react';
import './About.css';

const About = () => (
  <div className="About">
    <div className="About-wrapper">
      <h1>Discover Your Next Favorite Boutique</h1>
      <p>Boutive partners closley with small, indpendent boutique stores to help you find and discover new places to shop.</p>
      <br/>
      <p>When you order on Boutive, your order goes directly to the boutique, who then fulfills and ships to you.</p>
      <br/>
      <p>We're new, and not perfect, but we're trying hard to get better. We're quickly adding new features and improving the experience.
      Have a feature idea or feedback we should consider? Let us know here, or by reaching out at hello@boutive.com.</p>


      <div>
        <link href="//cdn-images.mailchimp.com/embedcode/horizontal-slim-10_7.css" rel="stylesheet" type="text/css"/>
        <div id="mc_embed_signup">
        <form action="https://boutive.us17.list-manage.com/subscribe/post?u=4be4f1e26720a0932f322fc9c&amp;id=553eea75d8" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
          <div id="mc_embed_signup_scroll">
        	  <input type="email" defaultValue="" name="EMAIL" className="email" id="mce-EMAIL" placeholder="email address" required/>
            {/*real people should not fill this in and expect good things - do not remove this or risk form bot signups */}
            <div style={{position: "absolute", left: "-5000px"}} aria-hidden="true"><input type="text" name="b_4be4f1e26720a0932f322fc9c_553eea75d8" tabIndex="-1" defaultValue=""/></div>
            <div className="clear"><input type="submit" defaultValue="Subscribe" name="subscribe" id="mc-embedded-subscribe" className="button"/></div>
          </div>
        </form>
        </div>
      </div>

    </div>
  </div>
);



export default About;
