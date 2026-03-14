import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";

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

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="brand-badge">WD</div>

          <div className="leading-tight">
            <div className="text-sm font-semibold text-white/65">
              Web Division
            </div>
            <div className="text-base font-bold text-white">
              Sistemas & crescimento
            </div>
          </div>
        </Link>

        {/* Navegação */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        {/* Social + CTA */}
        <div className="flex items-center gap-4">

          {/* Instagram */}
          <a
            href="https://www.instagram.com/webdivison_?igsh=ZDhud3JlMGZlczk="
            target="_blank"
            className="social-icon"
          >
            <Instagram size={20} />
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/5562994693465"
            target="_blank"
            className="social-icon"
          >
            <MessageCircle size={20} />
          </a>

          {/* Botão */}
          <div className="hidden md:flex">
            <a href="#cta" className="btn-primary">
              Solicitar orçamento
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}