import React from 'react';

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        <header className="about-header">
          <h1>About</h1>
        </header>

        <div className="about-content">
          <section className="artist-section">
            <div className="artist-info">
              <h2>Atom Sergal</h2>
              <p className="artist-bio">
                Atom Sergal is a digital artist exploring themes of identity,
                belonging, and the human relationship with space. Through
                minimalist compositions and thoughtful use of color and form,
                Atom creates works that invite contemplation and reflection.
              </p>
              <p>
                Based in the digital realm, Atom's work bridges the gap between
                traditional artistic expression and contemporary digital
                mediums, creating pieces that resonate with viewers across
                different backgrounds and experiences.
              </p>
            </div>
          </section>

          <section className="project-section">
            <h2>Beyond Home</h2>
            <div className="project-details">
              <p>
                "Beyond Home" is a conceptual art project that examines our
                fundamental need for belonging and the complex relationship we
                have with the spaces we call home.
              </p>
              <p>
                Through a series of carefully crafted digital artworks, the
                project explores themes of displacement, identity formation, and
                the search for meaning in an increasingly interconnected world.
              </p>
              <p>
                Each piece in the collection serves as a meditation on place,
                memory, and the human condition, inviting viewers to reflect on
                their own experiences of home and belonging.
              </p>
            </div>
          </section>

          <section className="contact-section">
            <h2>Contact</h2>
            <div className="contact-info">
              <p>
                For inquiries about "Beyond Home" or collaboration
                opportunities:
              </p>
              <div className="contact-details">
                <p>Email: atom@beyondhome.com</p>
                <p>Project: Beyond Home</p>
                <p>Year: 2024</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
