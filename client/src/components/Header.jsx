const LOGO = (
  <svg className="brand__logo" viewBox="0 0 32 32" aria-hidden="true">
    <path d="M16 3c3.2 4.3 5.4 7.6 5.4 11.8A5.4 5.4 0 0 1 18 19.800V29h-4v-9.200a5.400 5.400 0 0 1-3.400-5C10.600 10.600 12.800 7.300 16 3z" fill="#00ED64" />
  </svg>
)

export default function Header({ tabs, active, onChange }) {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="brand">
          {LOGO}
          <span>Storefront <span className="brand__sub">Console</span></span>
        </div>
        <nav className="tabs" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              className="tab"
              aria-selected={active === t.id}
              onClick={() => onChange(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
