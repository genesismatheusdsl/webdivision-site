import Link from "next/link";

const navItems = [
  { label: "Produtos", href: "#produtos" },
  { label: "Serviços", href: "#sobre" },
  { label: "Método FLOW", href: "#metodo-flow" },
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#cta" },
];

export default function Header() {
  return (
    <header className="topbar-blur">
      <div className="container-site flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="brand-badge">WD</div>

          <div className="leading-tight">
            <div className="text-sm font-semibold text-white/65">Web Division</div>
            <div className="text-base font-bold text-white">Sistemas & crescimento</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex">
          <a href="#cta" className="btn-primary">
            Solicitar orçamento
          </a>
        </div>
      </div>
    </header>
  );
}