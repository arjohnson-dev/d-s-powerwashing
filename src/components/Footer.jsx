function Footer() {
  const socialItems = [
    { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61590824333548" },
    { label: "Instagram", href: "#" },
  ];

  return (
    <footer className="site-footer">
      <div className="footer-top shell">
        <div className="footer-links" aria-label="Social links">
          {socialItems.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>

        <a className="footer-phone" href="tel:+15745006800">
          (574) 500-6800
        </a>
      </div>

      <div className="footer-bottom shell">
        <p className="footer-copyright">
          Copyright {new Date().getFullYear()} D&apos;s Powerwashing
        </p>
        <a className="footer-credit" href="https://arjohnson.dev">
          developed by arjohnson.dev
        </a>
      </div>
    </footer>
  );
}

export default Footer;
