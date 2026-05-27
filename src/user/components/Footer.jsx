const Footer = () => {
  return (
    <footer id="contact" className="footer">
      <div className="container" style={{ padding: 0 }}>
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">TK MOMENTS</span>
            <p className="footer-info">
              International award-winning wedding photography and filmmaking company based in Mumbai, India. Documenting love since 2014.
            </p>
            <div style={{ marginTop: '2rem' }}>
              <a href="#" className="btn btn-solid" style={{ padding: '0.6rem 1.5rem' }}>Let's Talk</a>
            </div>
          </div>
          
          <div className="footer-links-group">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#wedding-stories">Wedding Stories</a></li>
              <li><a href="#wedding-films">Wedding Films</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-links-group">
            <h4>Contact Details</h4>
            <ul className="footer-links">
              <li>Mumbai | Pune | Delhi | Hyderabad</li>
              <li style={{ marginTop: '1rem', color: '#ccc' }}>Email: hello@knotsbyamp.com</li>
              <li style={{ color: '#ccc' }}>Phone: +91 99999 99999</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} TK Moments. All rights reserved.</p>
          <p>Designed with Love</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
