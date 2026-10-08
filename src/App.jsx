const { useEffect, useMemo, useState } = React;

const navItems = [
  { id: "services", label: "Services" },
  { id: "pricing", label: "Pricing" },
  { id: "process", label: "Process" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" }
];

function Brand() {
  return (
    <a href="#top" className="flex items-center gap-space-sm" aria-label="LUMEXA home">
      <img alt="LUMEXA Brand Icon" className="h-8 w-auto object-contain" src="assets/lumexa-icon.png" />
      <img alt="LUMEXA" className="h-5 w-auto object-contain lumexa-wordmark" src="assets/lumexa-wordmark-cropped.png" />
    </a>
  );
}

function NavLink({ item, activeId, mobile = false, onClick }) {
  const isActive = activeId === item.id;
  const className = mobile
    ? `block rounded-xl px-4 py-3 font-label-md text-label-md hover:bg-surface-container hover:text-primary ${
        isActive ? "nav-link-active" : "text-on-surface-variant"
      }`
    : `font-label-md text-label-md hover:text-primary transition-colors duration-200 ${
        isActive ? "nav-link-active" : "text-on-surface-variant"
      }`;

  return (
    <a
      aria-current={isActive ? "page" : undefined}
      className={className}
      data-path={item.id}
      href={`#${item.id}`}
      onClick={onClick}
    >
      {item.label}
    </a>
  );
}

function Header({ activeId }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-xl border-b border-surface-container-high/60 shadow-[0_4px_24px_-4px_rgba(10,3,16,0.6)]">
        <div className="h-20 max-w-[1240px] mx-auto px-margin md:px-margin-md lg:px-margin-lg flex items-center justify-between gap-space-md">
          <Brand />
          <nav className="hidden lg:flex items-center gap-space-lg">
            {navItems.map((item) => (
              <NavLink key={item.id} item={item} activeId={activeId} onClick={closeMenu} />
            ))}
          </nav>
          <div className="flex items-center gap-space-md">
            <a
              className="hidden sm:inline-flex items-center justify-center font-label-md text-label-md px-space-md py-space-xs rounded-xl bg-primary-container text-on-primary-container font-semibold transition-all duration-300 hover:bg-primary hover:text-on-primary hover:shadow-[0_0_20px_rgba(225,110,104,0.35)]"
              data-path="contact"
              href="#contact"
              onClick={closeMenu}
            >
              Get a Quote
            </a>
            <button
              className="lg:hidden w-10 h-10 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface flex items-center justify-center transition-all hover:border-primary"
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
              data-menu-button
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="material-symbols-outlined text-[22px]">{menuOpen ? "close" : "menu"}</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>
      <nav
        className="lg:hidden rounded-2xl border border-surface-container-high bg-surface-container-lowest/95 shadow-2xl backdrop-blur-xl p-2"
        data-mobile-menu
        hidden={!menuOpen}
      >
        {navItems.map((item) => (
          <NavLink key={item.id} item={item} activeId={activeId} mobile onClick={closeMenu} />
        ))}
      </nav>
    </>
  );
}

function PageContent() {
  useEffect(() => {
    window.toggleFaq = (id) => {
      const el = document.getElementById(id);
      const icon = document.getElementById(id.replace("faq-", "faq-icon-"));
      if (!el) return;

      const nextOpen = el.classList.contains("hidden");
      el.classList.toggle("hidden", !nextOpen);
      if (icon) icon.style.transform = nextOpen ? "rotate(180deg)" : "rotate(0deg)";
    };

    return () => {
      delete window.toggleFaq;
    };
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: window.pageContent }} />;
}

function App() {
  const [activeId, setActiveId] = useState("services");
  const sectionIds = useMemo(() => navItems.map((item) => item.id), []);

  useEffect(() => {
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [sectionIds]);

  return (
    <>
      <Header activeId={activeId} />
      <PageContent />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
